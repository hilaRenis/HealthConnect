import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import adminService from '../services/adminService';
import {useAuth} from '../context/AuthContext';
import {Button, FormControl, InputLabel, MenuItem, Paper, Select, Typography} from '@mui/material';

const PatientEditPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useAuth();
    const [patient, setPatient] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const fetchPatientAndDoctors = async () => {
            try {
                const [patientRes, doctorsRes] = await Promise.all([
                    adminService.getPatientById(id, user.token),
                    adminService.getDoctors({limit: 1000}, user.token),
                ]);

                setPatient(patientRes.data || null);
                setDoctors(doctorsRes.data.data || []);
                setSelectedDoctor(patientRes.data?.doctorId || '');
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchPatientAndDoctors();
    }, [id, user.token]);

    useEffect(() => {
        if (patient) {
            setSelectedDoctor(patient.doctorId || '');
        }
    }, [patient]);

    const onSubmit = async (data) => {
        try {
            // Prepare payload: if password left blank during edit, don't send it.
            const payload = {...data};
            if (!payload.password) delete payload.password;

            // If your API supports a single update endpoint that also accepts doctorId:
            // await adminService.updatePatient(id, payload, user.token);

            // If assigning a doctor is a SEPARATE endpoint in your API,
            // you can still keep the same form UI. Do two calls:
            // 1) Update core fields
            // await adminService.updatePatient(id, payload, user.token);
            // 2) Assign doctor (only if changed / provided)
            // if (typeof payload.doctorId !== 'undefined') {
            //   await adminService.assignDoctor(id, payload.doctorId, user.token);
            // }

            alert('Patient update functionality not yet implemented.');
            navigate('/patients');
        } catch (error) {
            console.error('Failed to update patient', error);
            alert('Failed to update patient.');
        }
    };

    const handleAssignDoctor = async () => {
        try {
            setAssigning(true);
            const {data} = await adminService.assignDoctor(id, selectedDoctor || null, user.token);
            if (data?.patient) {
                setPatient(data.patient);
            }
            alert('Doctor assignment updated successfully.');
        } catch (error) {
            console.error('Failed to assign doctor', error);
            alert('Failed to assign doctor.');
        } finally {
            setAssigning(false);
        }
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div>
            <PatientForm
                onSubmit={onSubmit}
                defaultValues={patient}
                isEdit
                doctors={doctors}
            />
            <Paper style={{padding: 16, marginTop: 16}}>
                <Typography variant="h6" gutterBottom>
                    Assign Doctor
                </Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="assign-doctor-label">Doctor</InputLabel>
                    <Select
                        labelId="assign-doctor-label"
                        label="Doctor"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>No Doctor Assigned</em>
                        </MenuItem>
                        {doctors.map((doc) => (
                            <MenuItem key={doc.id} value={doc.id}>
                                {doc.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssignDoctor}
                    disabled={assigning}
                >
                    {assigning ? 'Saving...' : 'Save Assignment'}
                </Button>
            </Paper>
        </div>
    );
};

export default PatientEditPage;
