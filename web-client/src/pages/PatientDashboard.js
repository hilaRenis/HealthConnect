import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Container, List, ListItem, ListItemText, Paper, TextField, Typography} from '@mui/material';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';
import {useAuth} from '../context/AuthContext';

const PatientDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [prescriptionRequests, setPrescriptionRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const {register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile} = useForm();
    const {
        register: registerPrescription,
        handleSubmit: handleSubmitPrescription,
        reset: resetPrescription
    } = useForm();
    const {register: registerAppointment, handleSubmit: handleSubmitAppointment, reset: resetAppointment} = useForm();
    const {user} = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const profileRes = await patientService.getMyProfile(user.token);
            setProfile(profileRes.data);
            const prescriptionsRes = await patientService.getMyPrescriptionRequests(user.token);
            setPrescriptionRequests(prescriptionsRes.data);
            const appointmentsRes = await appointmentService.getMyAppointments(user.token);
            setAppointments(appointmentsRes.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setProfile(null);
            } else {
                console.error('Failed to fetch patient data', error);
            }
        }
    }, [user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onCreateProfile = async (data) => {
        try {
            await patientService.createProfile(data, user.token);
            alert('Profile created successfully!');
            resetProfile();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to create profile', error);
            alert('Failed to create profile.');
        }
    };

    const onRequestPrescription = async (data) => {
        try {
            await patientService.requestPrescription(data, user.token);
            alert('Prescription requested successfully!');
            resetPrescription();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to request prescription', error);
            alert('Failed to request prescription.');
        }
    };

    const onRequestAppointment = async (data) => {
        try {
            await appointmentService.requestAppointment(data, user.token);
            alert('Appointment requested successfully!');
            resetAppointment();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to request appointment', error);
            alert('Failed to request appointment.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Patient Dashboard
            </Typography>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6">My Profile</Typography>
                {profile ? (
                    <div>
                        <Typography>Name: {profile.name}</Typography>
                        <Typography>Date of Birth: {profile.dob}</Typography>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitProfile(onCreateProfile)}>
                        <TextField label="Name" {...registerProfile('name', {required: true})} />
                        <TextField label="Date of Birth" {...registerProfile('dob', {required: true})} />
                        <Button type="submit">Create Profile</Button>
                    </form>
                )}
            </Paper>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6">My Prescription Requests</Typography>
                <List>
                    {prescriptionRequests.map((r) => (
                        <ListItem key={r.id}>
                            <ListItemText primary={r.medication} secondary={`Status: ${r.status}`}/>
                        </ListItem>
                    ))}
                </List>
                <form onSubmit={handleSubmitPrescription(onRequestPrescription)}>
                    <TextField label="Medication" {...registerPrescription('medication', {required: true})} />
                    <TextField label="Notes" {...registerPrescription('notes')} />
                    <Button type="submit">Request Prescription</Button>
                </form>
            </Paper>
            <Paper style={{padding: '16px'}}>
                <Typography variant="h6">My Appointments</Typography>
                <List>
                    {appointments.map((a) => (
                        <ListItem key={a.id}>
                            <ListItemText primary={`${a.date} at ${a.slot}`} secondary={`Status: ${a.status}`}/>
                        </ListItem>
                    ))}
                </List>
                <form onSubmit={handleSubmitAppointment(onRequestAppointment)}>
                    <TextField label="Doctor ID" {...registerAppointment('doctorUserId', {required: true})} />
                    <TextField label="Date" {...registerAppointment('date', {required: true})} />
                    <TextField label="Slot" {...registerAppointment('slot', {required: true})} />
                    <Button type="submit">Request Appointment</Button>
                </form>
            </Paper>
        </Container>
    );
};

export default PatientDashboard;
