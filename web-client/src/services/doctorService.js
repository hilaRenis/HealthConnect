import axios from 'axios';

const API_URL = '/api/doctors';

const getMyPatients = (token, params = {}) => {
    return axios.get(`${API_URL}/patients`, {
        headers: {Authorization: `Bearer ${token}`},
        params,
    });
};

const getMySchedule = (token) => {
    return axios.get(`${API_URL}/schedule/mine`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const addScheduleSlot = (slotData, token) => {
    return axios.post(`${API_URL}/schedule`, slotData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getPrescriptionRequests = (token) => {
    return axios.get(`${API_URL}/prescriptions/requests`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const approvePrescriptionRequest = (id, token) => {
    return axios.post(`${API_URL}/prescriptions/requests/${id}/approve`, {}, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const denyPrescriptionRequest = (id, token) => {
    return axios.post(`${API_URL}/prescriptions/requests/${id}/deny`, {}, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getPatientById = (id, token) => {
    return axios.get(`${API_URL}/patients/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const doctorService = {
    getMyPatients,
    getMySchedule,
    addScheduleSlot,
    getPrescriptionRequests,
    approvePrescriptionRequest,
    denyPrescriptionRequest,
    getPatientById,
    createPatient: (data, token) => axios.post(`${API_URL}/patients`, data, {
        headers: {Authorization: `Bearer ${token}`},
    }),
};

export default doctorService;
