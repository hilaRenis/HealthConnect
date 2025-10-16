import axios from 'axios';

const API_URL = '/api/appointments';

const withAuth = (token) => ({
    headers: {Authorization: `Bearer ${token}`},
});

const getMyAppointments = (token) => axios.get(`${API_URL}/mine`, withAuth(token));

const getAllAppointments = (token) => axios.get(API_URL, withAuth(token));

const getAppointment = (id, token) => axios.get(`${API_URL}/${id}`, withAuth(token));

const requestAppointment = (appointmentData, token) => axios.post(API_URL, appointmentData, withAuth(token));

const approveAppointment = (id, token) => axios.post(`${API_URL}/${id}/approve`, null, withAuth(token));

const denyAppointment = (id, token) => axios.post(`${API_URL}/${id}/deny`, null, withAuth(token));

const cancelAppointment = (id, token) => axios.post(`${API_URL}/${id}/cancel`, null, withAuth(token));

const appointmentService = {
    getMyAppointments,
    getAllAppointments,
    getAppointment,
    requestAppointment,
    approveAppointment,
    denyAppointment,
    cancelAppointment,
};

export default appointmentService;
