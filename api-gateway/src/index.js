const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

const map = {
    '/api/patients': process.env.PATIENT_URL,
    '/api/doctors': process.env.DOCTOR_URL,
    '/api/appointments': process.env.APPT_URL,
    '/api/pharmacies': process.env.PHARMACY_URL,
    '/api/admin': process.env.ADMIN_URL,
    '/api/auth': process.env.AUTH_URL
};

function isPublic(req) {
    return req.method === 'POST' && req.path === '/api/auth/login';
}

function authGuard(req, res, next) {
    if (isPublic(req)) return next();
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({error: 'No token'});
    try {
        req.user = jwt.verify(auth.slice(7), JWT_SECRET);
        req.headers['x-user'] = JSON.stringify(req.user);
        next();
    } catch (e) {
        return res.status(401).json({error: 'Invalid token'});
    }
}

app.get('/health', (req, res) => res.json({gateway: true, ok: true}));
app.use(authGuard);

// Optional coarse role guard example
app.use((req, res, next) => {
    if (req.path.startsWith('/api/doctors') && req.user?.role !== 'doctor') return res.status(403).json({error: 'Forbidden'});
    next();
});

for (const [prefix, target] of Object.entries(map)) {
    if (!target) continue;
    let pathRewrite = {[`^${prefix}`]: ''};
    if (prefix === '/api/auth') {
        pathRewrite = (path, req) => req.originalUrl.replace(/^\/api\/auth/, '/auth');
    }
    app.use(prefix, createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        onProxyReq(proxyReq, req) {
            // forward decoded user payload to downstream services
            if (req.user) {
                proxyReq.setHeader('x-user', JSON.stringify(req.user));
            }
        }
    }));
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`api-gateway on ${PORT}`));
