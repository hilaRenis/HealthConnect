import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import DoctorListPage from './pages/DoctorListPage';
import DoctorCreatePage from './pages/DoctorCreatePage';
import DoctorEditPage from './pages/DoctorEditPage';
import PatientListPage from './pages/PatientListPage';
import PatientCreatePage from './pages/PatientCreatePage';
import PatientEditPage from './pages/PatientEditPage';
import AppointmentListPage from './pages/AppointmentListPage';
import AppointmentCreatePage from './pages/AppointmentCreatePage';
import AppointmentEditPage from './pages/AppointmentEditPage';
import PrescriptionListPage from './pages/PrescriptionListPage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorPatientDetailPage from './pages/DoctorPatientDetailPage';
import DoctorPatientCreatePage from './pages/DoctorPatientCreatePage';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({children}) => {
    const {user, logout, initializing} = useAuth();

    if (initializing) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login"/>;
    }

    try {
        const decodedToken = jwtDecode(user.token);
        if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            return <Navigate to="/login"/>;
        }
    } catch (err) {
        console.error('Invalid token', err);
        logout();
        return <Navigate to="/login"/>;
    }

    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/doctors"
                        element={
                            <PrivateRoute>
                                <DoctorListPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/doctors/new"
                        element={
                            <PrivateRoute>
                                <DoctorCreatePage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/doctors/edit/:id"
                        element={
                            <PrivateRoute>
                                <DoctorEditPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/patients"
                        element={
                            <PrivateRoute>
                                <PatientListPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/patients/new"
                        element={
                            <PrivateRoute>
                                <PatientCreatePage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/patients/edit/:id"
                        element={
                            <PrivateRoute>
                                <PatientEditPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/appointments"
                        element={
                            <PrivateRoute>
                                <AppointmentListPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-patients"
                        element={
                            <PrivateRoute>
                                <DoctorPatientsPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-patients/new"
                        element={
                            <PrivateRoute>
                                <DoctorPatientCreatePage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-patients/:id"
                        element={
                            <PrivateRoute>
                                <DoctorPatientDetailPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/appointments/new"
                        element={
                            <PrivateRoute>
                                <AppointmentCreatePage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/appointments/edit/:id"
                        element={
                            <PrivateRoute>
                                <AppointmentEditPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/prescriptions"
                        element={
                            <PrivateRoute>
                                <PrescriptionListPage/>
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
