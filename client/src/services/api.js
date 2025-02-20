import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Indirizzo del backend
});

export const login = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

export const getBookings = async (date) => {
  return await apiClient.get('/bookings', { params: { date } });
};

export const createBooking = async (data) => {
  return await apiClient.post('/bookings/prenota', data);
};

export const cancelBooking = async (bookingId) => {
  return await apiClient.post('/bookings/cancella', { id: bookingId });
};

export const getAdminDashboard = async () => {
  return await apiClient.get('/admin/dashboard');
};

export const updateMembership = async (userId, membershipType) => {
  return await apiClient.post('/admin/update-membership', { userId, membershipType });
};