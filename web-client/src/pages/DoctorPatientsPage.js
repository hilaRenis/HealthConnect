import React, {useCallback} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {Button} from '@mui/material';
import DataTable from '../components/DataTable';
import doctorService from '../services/doctorService';
import {useAuth} from '../context/AuthContext';

const DoctorPatientsPage = () => {
    const {user} = useAuth();
    const navigate = useNavigate();


    const columns = [
        {id: 'name', label: 'Name'},
        {id: 'email', label: 'Email'},
        {id: 'dob', label: 'Date of Birth'},
    ];

    const fetchData = useCallback(async (params) => {
        const response = await doctorService.getMyPatients(user.token, params);
        const rows = response.data?.data || [];
        const total = response.data?.total ?? rows.length;
        return {
            data: {
                data: rows,
                total,
            },
        };
    }, [user.token]);

    const handleView = useCallback((row) => {
        navigate(`/my-patients/${row.id}`);
    }, [navigate]);

    if (user?.role !== 'doctor') {
        return <Navigate to="/dashboard" replace/>;
    }

    return (
        <div>
            <Button variant="contained" sx={{mb: 2}} onClick={() => navigate('/my-patients/new')}>
                Register Patient
            </Button>
            <DataTable
                fetchData={fetchData}
                columns={columns}
                onEdit={handleView}
                title="My Patients"
                searchPlaceholder="Search patients"
            />
        </div>
    );
};

export default DoctorPatientsPage;
