import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import adminService from '../services/adminService';
import doctorService from '../services/doctorService';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const isDoctor = user.role === 'doctor';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDoctor) {
          const patientsRes = await doctorService.getMyPatients(user.token, { limit: 1000 });
          setPatients(patientsRes.data?.data || []);
          setDoctors([{ id: user.sub, name: user.name }]);
        } else {
          const patientsRes = await adminService.getPatients({ limit: 1000 }, user.token);
          setPatients(patientsRes.data?.data || []);
          const doctorsRes = await adminService.getDoctors({ limit: 1000 }, user.token);
          setDoctors(doctorsRes.data?.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, [user.token, user.role, user.sub, user.name, isDoctor]);

  const onSubmit = async (data) => {
    try {
      const { startTime, patientId, doctorId, ...rest } = data;
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
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      await adminService.createAppointment({
        ...rest,
        patientId,
        doctorId: resolvedDoctorId,
        startTime,
        endTime,
        date: formatLocalDate(startTime),
        slot: formatLocalTime(startTime),
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
