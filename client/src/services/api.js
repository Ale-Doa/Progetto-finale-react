import axios from 'axios';

// Non specificare l'URL completo del backend
const apiClient = axios.create({
  baseURL: '', // Lascia vuoto o usa '/'
});

export const register = async (userData) => {
  return await apiClient.post('/auth/register', userData); 
};

export const login = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
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