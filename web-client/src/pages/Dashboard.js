import React from 'react';
import {useAuth} from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
    const {user} = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    switch (user.role) {
        case 'admin':
            return <AdminDashboard/>;
        case 'doctor':
            return <DoctorDashboard/>;
        case 'patient':
            return <PatientDashboard/>;
        default:
            return <div>Unknown role</div>;
    }
};

export default Dashboard;
