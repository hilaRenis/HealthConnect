import React, {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
    Container,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    TextField,
    Stack,
    Box,
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

    const fetchData = useCallback(async () => {
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
    }, [user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const hasPatients = patients.length > 0;
    const hasSchedule = schedule.length > 0;
    const hasPrescriptions = prescriptionRequests.length > 0;

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Doctor Dashboard
            </Typography>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6" gutterBottom>My Patients</Typography>
                {hasPatients ? (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Conditions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{patient.name || '—'}</TableCell>
                                        <TableCell>{patient.email || '—'}</TableCell>
                                        <TableCell>{patient.dob || '—'}</TableCell>
                                        <TableCell>
                                            {Array.isArray(patient.conditions) && patient.conditions.length > 0
                                                ? patient.conditions.join(', ')
                                                : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography color="textSecondary">No patients assigned yet.</Typography>
                )}
            </Paper>
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
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6" gutterBottom>My Schedule</Typography>
                {hasSchedule ? (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Slot</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedule.map((slot) => (
                                    <TableRow key={slot.id}>
                                        <TableCell>{slot.date || '—'}</TableCell>
                                        <TableCell>{slot.slot || '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography color="textSecondary">No availability defined yet.</Typography>
                )}

                <Divider sx={{my: 2}}/>

                <Box component="form" onSubmit={handleSubmit(onAddScheduleSlot)} noValidate>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems="flex-end">
                        <TextField
                            label="Date"
                            type="date"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            {...register('date', {required: 'Date is required'})}
                        />
                        <TextField
                            label="Time"
                            type="time"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            {...register('slot', {required: 'Time slot is required'})}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Add Slot
                        </Button>
                    </Stack>
                </Box>
            </Paper>
            <Paper style={{padding: '16px', marginBottom: '16px'}}>
                <Typography variant="h6" gutterBottom>Prescription Requests</Typography>
                {hasPrescriptions ? (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Medication</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prescriptionRequests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.medication || '—'}</TableCell>
                                        <TableCell>{req.notes || '—'}</TableCell>
                                        <TableCell>{req.status}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handlePrescriptionAction(req.id, 'approve')}
                                                    disabled={req.status === 'approved'}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handlePrescriptionAction(req.id, 'deny')}
                                                    disabled={req.status === 'denied'}
                                                >
                                                    Deny
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography color="textSecondary">No prescription requests pending.</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default DoctorDashboard;
