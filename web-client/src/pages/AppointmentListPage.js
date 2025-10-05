import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import appointmentService from '../services/appointmentService';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';

const AppointmentListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const columns = [
    { id: 'patientName', label: 'Patient' },
    { id: 'doctorName', label: 'Doctor' },
    { id: 'date', label: 'Date' },
    { id: 'slot', label: 'Slot' },
    { id: 'status', label: 'Status' },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = user?.role === 'admin'
        ? await appointmentService.getAllAppointments(user.token)
        : await appointmentService.getMyAppointments(user.token);

      const rows = (response.data || []).map((item) => ({
        ...item,
        patientName: item.patientName || item.patientUserId,
        doctorName: item.doctorName || item.doctorUserId,
      }));

      return {
        data: {
          data: rows,
          total: rows.length,
        },
      };
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      throw error;
    }
  }, [user?.role, user?.token]);

  const handleDelete = useCallback(async (row) => {
    if (!window.confirm('Delete this appointment?')) {
      return false;
    }
    try {
      await adminService.deleteAppointment(row.id, user.token);
      alert('Appointment deleted successfully.');
      return true;
    } catch (error) {
      console.error('Failed to delete appointment', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to delete appointment.');
      }
      return false;
    }
  }, [user.token]);

  return (
    <div>
      <Button variant="contained" onClick={() => navigate('/appointments/new')}>
        Add New Appointment
      </Button>
      <DataTable
        fetchData={fetchData}
        columns={columns}
        onEdit={(row) => navigate(`/appointments/edit/${row.id}`)}
        onDelete={user?.role === 'admin' ? handleDelete : undefined}
        title="Appointments"
        searchPlaceholder="Search..."
      />
    </div>
  );
};

export default AppointmentListPage;
