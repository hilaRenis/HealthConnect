import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import AppointmentForm from '../components/AppointmentForm';
import adminService from '../services/adminService';
import appointmentService from '../services/appointmentService';
import {useAuth} from '../context/AuthContext';

const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatLocalTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const AppointmentEditPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [defaultValues, setDefaultValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const startDateFromAppointment = (appt) => {
        if (!appt) return null;
        if (appt.date && appt.slot) {
            return new Date(`${appt.date}T${appt.slot}`);
        }
        if (appt.startTime) {
            return new Date(appt.startTime);
        }
        return null;
    };

    const loadAdminData = async () => {
        const [patientsRes, doctorsRes, appointmentRes] = await Promise.all([
            adminService.getPatients({limit: 1000}, user.token),
            adminService.getDoctors({limit: 1000}, user.token),
            adminService.getAppointment(id, user.token),
        ]);

        const patientsData = (patientsRes.data?.data || []).map((p) => ({
            id: p.id,
            userId: p.userId || p.userid,
            name: p.name || p.user_name || p.displayName || p.email || p.id,
        }));
        const doctorsData = (doctorsRes.data?.data || []).map((d) => ({
            id: d.id,
            name: d.name || d.user_name || d.email || d.id,
        }));
        const appt = appointmentRes.data;

        setPatients(patientsData);
        setDoctors(doctorsData);
        setAppointment(appt);

        const patientProfileId = appt.patientProfileId
            || patientsData.find((p) => {
                if (!p.userId || !appt.patientUserId) return false;
                return String(p.userId).toLowerCase() === String(appt.patientUserId).toLowerCase();
            })?.id
            || null;

        const startTime = startDateFromAppointment(appt);

        setDefaultValues({
            patientId: patientProfileId,
            doctorId: appt.doctorUserId,
            startTime: startTime || null,
        });
    };

    const loadDoctorData = async () => {
        const {data: appt} = await appointmentService.getAppointment(id, user.token);
        setAppointment(appt);

        const patientsData = [{
            id: appt.patientProfileId || appt.patientUserId,
            name: appt.patientName || appt.patientEmail || appt.patientUserId,
            userId: appt.patientUserId,
        }];
        const doctorsData = [{id: appt.doctorUserId, name: appt.doctorName || appt.doctorEmail || appt.doctorUserId}];
        setPatients(patientsData);
        setDoctors(doctorsData);

        const startTime = startDateFromAppointment(appt);
        setDefaultValues({
            patientId: appt.patientProfileId || appt.patientUserId,
            doctorId: appt.doctorUserId,
            startTime: startTime || null,
        });
    };

    const refresh = async (showSpinner = true) => {
        try {
            if (showSpinner) setLoading(true);
            if (isAdmin) {
                await loadAdminData();
            } else {
                await loadDoctorData();
            }
        } catch (error) {
            console.error('Failed to load appointment', error);
            alert('Failed to load appointment details.');
            navigate('/appointments');
        } finally {
            if (showSpinner) setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user.token, user?.role]);

    const onSubmit = async (formValues) => {
        try {
            const {startTime, patientId, doctorId} = formValues;
            if (!startTime) {
                alert('Start time is required.');
                return;
            }
            if (!patientId) {
                alert('Patient is required.');
                return;
            }
            if (!doctorId) {
                alert('Doctor is required.');
                return;
            }

            const startDate = startTime instanceof Date ? startTime : new Date(startTime);
            if (Number.isNaN(startDate.getTime())) {
                alert('Invalid start time.');
                return;
            }
            const endDate = new Date(startDate.getTime() + 30 * 60000);

            const patientProfileId = patients.find((p) => p.id === patientId || p.userId === patientId)?.id || patientId;

            await adminService.updateAppointment(
                id,
                {
                    patientId: patientProfileId,
                    doctorId,
                    startTime: startDate,
                    endTime: endDate,
                    date: formatLocalDate(startDate),
                    slot: formatLocalTime(startDate),
                },
                user.token
            );
            await refresh();
            alert('Appointment updated successfully!');
        } catch (error) {
            console.error('Failed to update appointment', error);
            if (error.response && error.response.status === 409) {
                alert(error.response.data.error);
            } else if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to update appointment.');
            }
        }
    };

    const statusActions = useMemo(() => ([
        {key: 'approved', label: 'Approve'},
        {key: 'denied', label: 'Deny'},
        {key: 'cancelled', label: 'Cancel'},
    ]), []);

    const handleStatusChange = async (newStatus) => {
        if (!appointment) return;
        setActionLoading(true);
        try {
            if (isDoctor) {
                if (newStatus === 'approved') {
                    await appointmentService.approveAppointment(id, user.token);
                } else if (newStatus === 'denied') {
                    await appointmentService.denyAppointment(id, user.token);
                } else if (newStatus === 'cancelled') {
                    await appointmentService.cancelAppointment(id, user.token);
                }
            } else if (isAdmin) {
                const startDate = startDateFromAppointment(appointment);
                const endDate = appointment.endTime ? new Date(appointment.endTime) : (startDate ? new Date(startDate.getTime() + 30 * 60000) : null);
                const patientProfileIdForStatus = appointment.patientProfileId
                    || patients.find((p) => {
                        if (!appointment.patientUserId) return false;
                        if (p.id === appointment.patientUserId) return true;
                        if (p.userId && p.userId === appointment.patientUserId) return true;
                        return String(p.id).toLowerCase() === String(appointment.patientUserId).toLowerCase()
                            || (p.userId && String(p.userId).toLowerCase() === String(appointment.patientUserId).toLowerCase());
                    })?.id
                    || appointment.patientUserId;

                await adminService.updateAppointment(
                    id,
                    {
                        patientId: patientProfileIdForStatus,
                        doctorId: appointment.doctorUserId,
                        startTime: startDate || new Date(),
                        endTime: endDate || startDate,
                        date: appointment.date || formatLocalDate(startDate || new Date()),
                        slot: appointment.slot || formatLocalTime(startDate || new Date()),
                        status: newStatus,
                    },
                    user.token
                );
            }
            await refresh(false);
            alert(`Appointment ${newStatus}.`);
        } catch (error) {
            console.error('Failed to update status', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to update appointment status.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return null;
    }

    const currentStart = startDateFromAppointment(appointment);
    const formattedStart = currentStart ? currentStart.toLocaleString() : 'N/A';

    return (
        <Stack spacing={3}>
            {isAdmin && (
                <AppointmentForm
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    patients={patients}
                    doctors={doctors}
                    title="Update Appointment"
                    submitLabel="Update Appointment"
                />
            )}

            {!isAdmin && appointment && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Appointment Details</Typography>
                        <Typography>Patient: {appointment.patientName || appointment.patientUserId}</Typography>
                        <Typography>Doctor: {appointment.doctorName || appointment.doctorUserId}</Typography>
                        <Typography>Scheduled Start: {formattedStart}</Typography>
                        <Typography>Status: {appointment.status}</Typography>
                    </CardContent>
                </Card>
            )}

            {(isAdmin || isDoctor) && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Actions</Typography>
                        <Stack direction="row" spacing={2}>
                            {statusActions.map(({key, label}) => (
                                <Button
                                    key={key}
                                    variant="contained"
                                    color={key === 'denied' ? 'warning' : key === 'cancelled' ? 'error' : 'primary'}
                                    disabled={actionLoading || appointment?.status === key}
                                    onClick={() => handleStatusChange(key)}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
};

export default AppointmentEditPage;
