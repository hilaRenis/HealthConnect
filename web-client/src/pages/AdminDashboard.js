import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Container, Paper, TextField, Typography} from '@mui/material';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState({patients: 0, doctors: 0});
    const {register, handleSubmit, reset} = useForm();
    const {user} = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats(user.token);
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, [user.token]);

    const onRegisterDoctor = async (data) => {
        try {
            await adminService.registerDoctor(data, user.token);
            alert('Doctor registered successfully!');
            reset();
            // Refresh stats
            const response = await adminService.getStats(user.token);
            setStats(response.data);
        } catch (error) {
            console.error('Failed to register doctor', error);
            alert('Failed to register doctor.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Dashboard
            </Typography>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6">Platform Statistics</Typography>
                <Typography>Total Patients: {stats.patients}</Typography>
                <Typography>Total Doctors: {stats.doctors}</Typography>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
