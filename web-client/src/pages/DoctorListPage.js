import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import DataTable from '../components/DataTable';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';
import {Button} from '@mui/material';

const DoctorListPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const columns = [
        {id: 'name', label: 'Name'},
        {id: 'email', label: 'Email'},
    ];

    const fetchData = useCallback((params) => {
        return adminService.getDoctors(params, user.token);
    }, [user.token]);

    const handleDelete = useCallback(async (row) => {
        if (!window.confirm(`Delete doctor "${row.name}"?`)) {
            return false;
        }
        try {
            await adminService.deleteDoctor(row.id, user.token);
            alert('Doctor deleted successfully.');
            return true;
        } catch (error) {
            console.error('Failed to delete doctor', error);
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to delete doctor.');
            }
            return false;
        }
    }, [user.token]);

    return (
        <div>
            <Button variant="contained" onClick={() => navigate('/doctors/new')}>
                Add New Doctor
            </Button>
            <DataTable
                fetchData={fetchData}
                columns={columns}
                onEdit={(row) => navigate(`/doctors/edit/${row.id}`)}
                onDelete={handleDelete}
                title="Doctors"
                searchPlaceholder="Search by name..."
            />
        </div>
    );
};

export default DoctorListPage;
