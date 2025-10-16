import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';

const PatientCreatePage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await adminService.getDoctors({limit: 1000}, user.token);
                setDoctors(response.data.data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        };
        fetchDoctors();
    }, [user.token]);

    const onSubmit = async (data) => {
        try {
            await adminService.createPatient(data, user.token);
            alert('Patient created successfully!');
            navigate('/patients');
        } catch (error) {
            console.error('Failed to create patient', error);
            alert('Failed to create patient.');
        }
    };

    return <PatientForm onSubmit={onSubmit} doctors={doctors}/>;
};

export default PatientCreatePage;
