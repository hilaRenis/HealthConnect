import React from 'react';
import {useNavigate} from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';

const DoctorCreatePage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const onSubmit = async (data) => {
        try {
            await adminService.registerDoctor(data, user.token);
            alert('Doctor created successfully!');
            navigate('/doctors');
        } catch (error) {
            console.error('Failed to create doctor', error);
            alert('Failed to create doctor.');
        }
    };

    return <DoctorForm onSubmit={onSubmit}/>;
};

export default DoctorCreatePage;
