import axios from 'axios';

const API_URL = '/api/admin';

const getStats = (token) => {
    return axios.get(`${API_URL}/stats`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const registerDoctor = (doctorData, token) => {
    return axios.post(`${API_URL}/doctors`, doctorData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getDoctors = (params, token) => {
    return axios.get(`${API_URL}/doctors`, {
        headers: {Authorization: `Bearer ${token}`},
        params,
    });
};

const updateDoctor = (doctorId, doctorData, token) => {
    return axios.put(`${API_URL}/doctors/${doctorId}`, doctorData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const deleteDoctor = (doctorId, token) => {
    return axios.delete(`${API_URL}/doctors/${doctorId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getPatients = (params, token) => {
    return axios.get(`${API_URL}/patients`, {
        headers: {Authorization: `Bearer ${token}`},
        params,
    });
};

const getPatientById = (patientId, token) => {
    return axios.get(`${API_URL}/patients/${patientId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const assignDoctor = (patientId, doctorId, token) => {
    return axios.post(`${API_URL}/patients/${patientId}/assign-doctor`, {doctorId}, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const createAppointment = (appointmentData, token) => {
    return axios.post(`${API_URL}/appointments`, appointmentData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getAppointment = (appointmentId, token) => {
    return axios.get(`${API_URL}/appointments/${appointmentId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const updateAppointment = (appointmentId, appointmentData, token) => {
    return axios.put(`${API_URL}/appointments/${appointmentId}`, appointmentData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const deleteAppointment = (appointmentId, token) => {
    return axios.delete(`${API_URL}/appointments/${appointmentId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const deletePatient = (patientId, token) => {
    return axios.delete(`${API_URL}/patients/${patientId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const createPatient = (patientData, token) => {
    return axios.post(`${API_URL}/patients`, patientData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getUserById = (userId, token) => {
    return axios.get(`${API_URL}/users/${userId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const adminService = {
    getStats,
    registerDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor,
    getPatients,
    getPatientById,
    assignDoctor,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    deletePatient,
    createPatient,
    getUserById,
};

export default adminService;
