import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import DataTable from '../components/DataTable';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';
import {Button} from '@mui/material';

const PatientListPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const columns = [
        {id: 'name', label: 'Name'},
        {id: 'dob', label: 'Date of Birth'},
        {id: 'doctorName', label: 'Assigned Doctor'},
    ];

    const fetchData = useCallback((params) => {
        return adminService.getPatients(params, user.token);
    }, [user.token]);

    const handleDelete = useCallback(async (row) => {
        if (!window.confirm(`Delete patient "${row.name}"?`)) {
            return false;
        }
        try {
            await adminService.deletePatient(row.id, user.token);
            alert('Patient deleted successfully.');
            return true;
        } catch (error) {
            console.error('Failed to delete patient', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to delete patient.');
            }
            return false;
        }
    }, [user.token]);

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('/patients/new')}>
                Add New Patient
            </Button>
            <DataTable
                fetchData={fetchData}
                columns={columns}
                onEdit={(row) => navigate(`/patients/edit/${row.id}`)}
                onDelete={handleDelete}
                title="Patients"
                searchPlaceholder="Search by name..."
            />
        </div>
    );
};

export default PatientListPage;
