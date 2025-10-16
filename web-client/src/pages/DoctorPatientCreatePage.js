import React from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import doctorService from '../services/doctorService';
import {useAuth} from '../context/AuthContext';

const DoctorPatientCreatePage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    if (user?.role !== 'doctor') {
        return <Navigate to="/dashboard" replace/>;
    }

    const onSubmit = async (data) => {
        try {
            await doctorService.createPatient(data, user.token);
            alert('Patient registered successfully!');
            navigate('/my-patients');
        } catch (error) {
            console.error('Failed to register patient', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to register patient.');
            }
        }
    };

    return <PatientForm onSubmit={onSubmit}/>;
};

export default DoctorPatientCreatePage;
