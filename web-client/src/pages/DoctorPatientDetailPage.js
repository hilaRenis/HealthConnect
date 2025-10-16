import React, {useEffect, useState} from 'react';
import {Navigate, useParams} from 'react-router-dom';
import {CircularProgress, List, ListItem, ListItemText, Paper, Typography} from '@mui/material';
import doctorService from '../services/doctorService';
import {useAuth} from '../context/AuthContext';

const DoctorPatientDetailPage = () => {
    const {id} = useParams();
    const {user} = useAuth();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await doctorService.getPatientById(id, user.token);
                setPatient(response.data);
            } catch (err) {
                console.error('Failed to load patient', err);
                setError('Patient not found or not assigned to you.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, user.token]);

    if (user?.role !== 'doctor') {
        return <Navigate to="/dashboard" replace/>;
    }

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!patient) {
        return null;
    }

    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h5" gutterBottom>
                {patient.name}
            </Typography>
            <List>
                <ListItem>
                    <ListItemText primary="Email" secondary={patient.email || '—'}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Date of Birth" secondary={patient.dob || '—'}/>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Conditions"
                        secondary={patient.conditions && patient.conditions.length > 0 ? patient.conditions.join(', ') : '—'}
                    />
                </ListItem>
            </List>
        </Paper>
    );
};

export default DoctorPatientDetailPage;
