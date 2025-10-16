import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DataTable from '../components/DataTable';
import appointmentService from '../services/appointmentService';
import adminService from '../services/adminService';
import doctorService from '../services/doctorService';
import {useAuth} from '../context/AuthContext';
import {Button} from '@mui/material';

const AppointmentListPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [patientLookup, setPatientLookup] = useState({});
    const [doctorLookup, setDoctorLookup] = useState({});

    const columns = [
        {id: 'patientName', label: 'Patient'},
        {id: 'doctorName', label: 'Doctor'},
        {id: 'date', label: 'Date'},
        {id: 'slot', label: 'Slot'},
        {id: 'status', label: 'Status'},
    ];

    const normaliseName = useCallback((record, fallback) => {
        if (!record) return fallback;
        return record.name || fallback;
    }, []);

    useEffect(() => {
        const loadLookups = async () => {
            if (!user?.token) return;
            try {
                if (user.role === 'admin') {
                    const [patientsRes, doctorsRes] = await Promise.all([
                        adminService.getPatients({limit: 1000}, user.token),
                        adminService.getDoctors({limit: 1000}, user.token),
                    ]);

                    const patientMap = {};
                    (patientsRes.data?.data || []).forEach((p) => {
                        const name = normaliseName(p, p.id);
                        if (p.id) {
                            patientMap[p.id] = name;
                            patientMap[String(p.id).toLowerCase()] = name;
                        }
                        if (p.userid) {
                            patientMap[p.userid] = name;
                            patientMap[String(p.userid).toLowerCase()] = name;
                        }
                    });

                    const doctorMap = {};
                    (doctorsRes.data?.data || []).forEach((d) => {
                        const name = normaliseName(d, d.id);
                        if (d.id) {
                            doctorMap[d.id] = name;
                            doctorMap[String(d.id).toLowerCase()] = name;
                        }
                        if (d.userId) {
                            doctorMap[d.userId] = name;
                            doctorMap[String(d.userId).toLowerCase()] = name;
                        }
                        if (d.email) {
                            doctorMap[d.email] = name;
                            doctorMap[String(d.email).toLowerCase()] = name;
                        }
                    });

                    setPatientLookup(patientMap);
                    setDoctorLookup(doctorMap);
                } else if (user.role === 'doctor') {
                    const patientsRes = await doctorService.getMyPatients(user.token, {limit: 1000});
                    const patientMap = {};
                    (patientsRes.data?.data || []).forEach((p) => {
                        const name = normaliseName(p, p.id);
                        if (p.id) {
                            patientMap[p.id] = name;
                            patientMap[String(p.id).toLowerCase()] = name;
                        }
                        if (p.userId) {
                            patientMap[p.userId] = name;
                            patientMap[String(p.userId).toLowerCase()] = name;
                        }
                    });
                    setPatientLookup(patientMap);
                    setDoctorLookup({[user.sub]: user.name || user.email || user.sub});
                } else {
                    setPatientLookup({});
                    setDoctorLookup({});
                }
            } catch (error) {
                console.error('Failed to preload lookup data', error);
            }
        };

        loadLookups();
    }, [user?.role, user?.token, user?.sub, user?.name, user?.email, normaliseName]);

    const fetchData = useCallback(async () => {
        try {
            let currentPatientLookup = patientLookup;
            let currentDoctorLookup = doctorLookup;

            const lookupIsEmpty = (map) => !map || Object.keys(map).length === 0;

            if (user?.role === 'admin' && (lookupIsEmpty(currentPatientLookup) || lookupIsEmpty(currentDoctorLookup))) {
                const [patientsRes, doctorsRes] = await Promise.all([
                    adminService.getPatients({limit: 1000}, user.token),
                    adminService.getDoctors({limit: 1000}, user.token),
                ]);


                console.log(patientsRes.data)
                const patientMap = {};
                (patientsRes.data?.data || []).forEach((p) => {
                    const name = normaliseName(p, p.id);
                    if (p.id) {
                        patientMap[p.id] = name;
                        patientMap[String(p.id).toLowerCase()] = name;
                    }
                    const pid = p.userId || p.userid;
                    if (pid) {
                        patientMap[pid] = name;
                        patientMap[String(pid).toLowerCase()] = name;
                    }
                    if (p.email) {
                        patientMap[p.email] = name;
                        patientMap[String(p.email).toLowerCase()] = name;
                    }
                });

                const doctorMap = {};
                (doctorsRes.data?.data || []).forEach((d) => {
                    const name = normaliseName(d, d.id);
                    if (d.id) {
                        doctorMap[d.id] = name;
                        doctorMap[String(d.id).toLowerCase()] = name;
                    }
                    const did = d.userId || d.userid;
                    if (did) {
                        doctorMap[did] = name;
                        doctorMap[String(did).toLowerCase()] = name;
                    }
                    if (d.email) {
                        doctorMap[d.email] = name;
                        doctorMap[String(d.email).toLowerCase()] = name;
                    }
                });

                currentPatientLookup = patientMap;
                currentDoctorLookup = doctorMap;
                setPatientLookup(patientMap);
                setDoctorLookup(doctorMap);
            } else if (user?.role === 'doctor' && lookupIsEmpty(currentPatientLookup)) {
                const patientsRes = await doctorService.getMyPatients(user.token, {limit: 1000});
                const patientMap = {};
                (patientsRes.data?.data || []).forEach((p) => {
                    const name = normaliseName(p, p.id);
                    if (p.id) {
                        patientMap[p.id] = name;
                        patientMap[String(p.id).toLowerCase()] = name;
                    }
                    const pid = p.userId || p.userid;
                    if (pid) {
                        patientMap[pid] = name;
                        patientMap[String(pid).toLowerCase()] = name;
                    }
                    if (p.email) {
                        patientMap[p.email] = name;
                        patientMap[String(p.email).toLowerCase()] = name;
                    }
                });
                currentPatientLookup = patientMap;
                setPatientLookup(patientMap);
                if (lookupIsEmpty(currentDoctorLookup)) {
                    const doctorMap = {[user.sub]: user.name || user.email || user.sub};
                    doctorMap[String(user.sub).toLowerCase()] = doctorMap[user.sub];
                    currentDoctorLookup = doctorMap;
                    setDoctorLookup(doctorMap);
                }
            }

            const response = user?.role === 'admin'
                ? await appointmentService.getAllAppointments(user.token)
                : await appointmentService.getMyAppointments(user.token);

            const rows = (response.data || []).map((item) => ({
                ...item,
                patientName: item.patientName
                    || currentPatientLookup[item.patientProfileId]
                    || currentPatientLookup[item.patientUserId]
                    || currentPatientLookup[item.patientUserId?.toLowerCase?.()]
                    || currentPatientLookup[item.patientId]
                    || currentPatientLookup[item.patientId?.toLowerCase?.()]
                    || item.patientUserId
                    || item.patientId
                    || item.patientProfileId,
                doctorName: item.doctorName
                    || currentDoctorLookup[item.doctorUserId]
                    || currentDoctorLookup[item.doctorUserId?.toLowerCase?.()]
                    || currentDoctorLookup[item.doctorId]
                    || currentDoctorLookup[item.doctorId?.toLowerCase?.()]
                    || item.doctorUserId
                    || item.doctorId,
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
    }, [user?.role, user?.token, patientLookup, doctorLookup, user?.sub, user?.name, user?.email, normaliseName]);

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
