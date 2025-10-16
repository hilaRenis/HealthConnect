import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';

const DoctorEditPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useAuth();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                // In a real app, you'd have an admin endpoint to get a single doctor by ID
                // For now, we'll just fetch all and find the one we need
                const response = await adminService.getDoctors({limit: 1000}, user.token);
                const doc = response.data.data.find(d => d.id === id);
                if (!doc) {
                    alert('Doctor not found.');
                    navigate('/doctors');
                    return;
                }
                setDoctor(doc);
            } catch (error) {
                console.error('Failed to fetch doctor', error);
                alert('Failed to fetch doctor.');
                navigate('/doctors');
            }
        };
        fetchDoctor();
    }, [id, user.token, navigate]);

    const onSubmit = async (data) => {
        try {
            const payload = {name: data.name, email: data.email};
            const trimmedPassword = (data.password || '').trim();
            if (trimmedPassword) {
                payload.password = trimmedPassword;
            }

            await adminService.updateDoctor(id, payload, user.token);
            alert('Doctor updated successfully!');
            navigate('/doctors');
        } catch (error) {
            console.error('Failed to update doctor', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to update doctor.');
            }
        }
    };

    if (!doctor) return <div>Loading...</div>;

    return <DoctorForm onSubmit={onSubmit} defaultValues={{...doctor, password: ''}} isEdit/>;
};

export default DoctorEditPage;
