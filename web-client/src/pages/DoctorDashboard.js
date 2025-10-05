import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';
import {useAuth} from '../context/AuthContext';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [prescriptionRequests, setPrescriptionRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const {register, handleSubmit, reset} = useForm();
    const {user} = useAuth();

    const fetchData = async () => {
        try {
            const patientsRes = await doctorService.getMyPatients(user.token);
            setPatients(patientsRes.data?.data || []);
            const scheduleRes = await doctorService.getMySchedule(user.token);
            setSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);
            const prescriptionsRes = await doctorService.getPrescriptionRequests(user.token);
            setPrescriptionRequests(Array.isArray(prescriptionsRes.data) ? prescriptionsRes.data : []);
            const appointmentsRes = await appointmentService.getMyAppointments(user.token);
            setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
        } catch (error) {
            console.error('Failed to fetch doctor data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user.token]);

    const onAddScheduleSlot = async (data) => {
        try {
            await doctorService.addScheduleSlot(data, user.token);
            alert('Schedule slot added successfully!');
            reset();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Failed to add schedule slot', error);
            alert('Failed to add schedule slot.');
        }
    };

    const handlePrescriptionAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await doctorService.approvePrescriptionRequest(id, user.token);
            } else {
                await doctorService.denyPrescriptionRequest(id, user.token);
            }
            alert(`Prescription request ${action}d successfully!`);
            fetchData(); // Refresh data
        } catch (error) {
            console.error(`Failed to ${action} prescription request`, error);
            alert(`Failed to ${action} prescription request.`);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Doctor Dashboard
            </Typography>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6" gutterBottom>My Appointments</Typography>
                {appointments.length === 0 ? (
                    <Typography color="textSecondary">No appointments scheduled.</Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appt) => {
                                    const start = appt.startTime
                                        ? new Date(appt.startTime)
                                        : appt.date && appt.slot
                                            ? new Date(`${appt.date}T${appt.slot}`)
                                            : null;
                                    const startDisplay = start && !Number.isNaN(start.getTime())
                                        ? start.toLocaleString()
                                        : appt.date && appt.slot
                                            ? `${appt.date} ${appt.slot}`
                                            : '—';
                                    return (
                                        <TableRow key={appt.id}>
                                            <TableCell>{appt.patientName || appt.patientUserId || 'Unknown'}</TableCell>
                                            <TableCell>{startDisplay}</TableCell>
                                            <TableCell>{appt.status}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
};

export default DoctorDashboard;
