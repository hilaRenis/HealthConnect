import axios from 'axios';

const API_URL = '/api/patients';

const getMyProfile = (token) => {
    return axios.get(`${API_URL}/profiles/me`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const createProfile = (profileData, token) => {
    return axios.post(`${API_URL}/profiles`, profileData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const getMyPrescriptionRequests = (token) => {
    return axios.get(`${API_URL}/prescriptions/requests/mine`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const requestPrescription = (requestData, token) => {
    return axios.post(`${API_URL}/prescriptions/requests`, requestData, {
        headers: {Authorization: `Bearer ${token}`},
    });
};

const patientService = {
    getMyProfile,
    createProfile,
    getMyPrescriptionRequests,
    requestPrescription,
};

export default patientService;
