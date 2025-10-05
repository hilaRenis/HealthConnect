// src/http.js
const express = require('express');

function createApp({ name, routes, port }) {
  const app = express();
  app.use(express.json());

  // Parse forwarded user from gateway (if present)
  app.use((req, res, next) => {
    const xu = req.headers['x-user'];
    if (xu) {
      try { req.user = JSON.parse(xu); } catch {}
    }
    next();
  });

  // Health check
  app.get('/health', (req, res) => res.json({ service: name, ok: true }));

  // Routes injector
  routes(app);

  // Error handler
  app.use((err, req, res, next) => {
    console.error(`[${name}]`, err && err.stack || err);
    res.status(err.status || 500).json({ error: err.message || 'InternalError' });
  });

  app.listen(port, () => console.log(`${name} listening on ${port}`));
}

module.exports = { createApp };
