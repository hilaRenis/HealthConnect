import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import adminService from '../services/adminService';
import doctorService from '../services/doctorService';
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

const AppointmentCreatePage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const isDoctor = user.role === 'doctor';

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isDoctor) {
                    const patientsRes = await doctorService.getMyPatients(user.token, {limit: 1000});
                    const normalisedPatients = (patientsRes.data?.data || []).map((p) => ({
                        id: p.id,
                        userId: p.userId || p.userid,
                        name: p.name || p.email || p.id,
                    }));
                    setPatients(normalisedPatients);
                    setDoctors([{id: user.sub, name: user.name || user.email || user.sub}]);
                } else {
                    const patientsRes = await adminService.getPatients({limit: 1000}, user.token);
                    const doctorsRes = await adminService.getDoctors({limit: 1000}, user.token);
                    const normalisedPatients = (patientsRes.data?.data || []).map((p) => ({
                        id: p.id,
                        userId: p.userId || p.userid,
                        name: p.name || p.user_name || p.displayName || p.email || p.id,
                    }));
                    const normalisedDoctors = (doctorsRes.data?.data || []).map((d) => ({
                        id: d.id,
                        name: d.name || d.user_name || d.email || d.id,
                    }));
                    setPatients(normalisedPatients);
                    setDoctors(normalisedDoctors);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchData();
    }, [user.token, user.role, user.sub, user.name, isDoctor]);

    const onSubmit = async (data) => {
        try {
            const {startTime, patientId, doctorId, ...rest} = data;
            if (!startTime) {
                alert('Start time is required.');
                return;
            }
            if (!patientId) {
                alert('Patient is required.');
                return;
            }
            const resolvedDoctorId = isDoctor ? user.sub : doctorId;
            if (!resolvedDoctorId) {
                alert('Doctor is required.');
                return;
            }
            const startDate = startTime instanceof Date ? startTime : new Date(startTime);
            const endTime = new Date(startDate.getTime() + 30 * 60000);
            const patientProfileId = patients.find((p) => {
                if (!patientId) return false;
                if (p.id === patientId) return true;
                if (p.userId && p.userId === patientId) return true;
                return String(p.id).toLowerCase() === String(patientId).toLowerCase()
                    || (p.userId && String(p.userId).toLowerCase() === String(patientId).toLowerCase());
            })?.id || patientId;
            await adminService.createAppointment({
                ...rest,
                patientId: patientProfileId,
                doctorId: resolvedDoctorId,
                startTime: startDate,
                endTime,
                date: formatLocalDate(startDate),
                slot: formatLocalTime(startDate),
            }, user.token);
            alert('Appointment created successfully!');
            navigate('/appointments');
        } catch (error) {
            console.error('Failed to create appointment', error);
            if (error.response && error.response.status === 409) {
                alert(error.response.data.error);
            } else {
                alert('Failed to create appointment.');
            }
        }
    };

    return (
        <AppointmentForm
            onSubmit={onSubmit}
            patients={patients}
            doctors={doctors}
            hideDoctorSelect={isDoctor}
            title="Create Appointment"
            submitLabel="Create Appointment"
        />
    );
};

export default AppointmentCreatePage;
