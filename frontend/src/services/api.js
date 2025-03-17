import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://progetto-finale-react.onrender.com/api'
  : 'http://localhost:5001/api';  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUserMembership = async (userId, membershipData) => {
  const response = await api.put(`/users/${userId}`, membershipData);
  return response.data;
};

// Booking API calls
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const deleteBooking = async (bookingId) => {
  try {
    console.log('API call to delete booking with ID:', bookingId);
    
    if (!bookingId) {
      throw new Error('Invalid booking ID: ' + bookingId);
    }
    
    const sanitizedId = bookingId.toString().trim();
    
    const response = await api.delete(`/bookings/${sanitizedId}`);
    console.log('Delete booking response:', response);
    return response.data;
  } catch (error) {
    console.error('API error when deleting booking:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
};

export const getBookingsByDate = async (date) => {
  const response = await api.get(`/bookings/date/${date}`);
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await api.get('/announcements');
  return response.data;
};

export const getAllAnnouncements = async () => {
  const response = await api.get('/announcements/all');
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(`/announcements/${id}`, announcementData);
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

export const deleteUserAccount = async () => {
  const response = await api.delete('/users/profile');
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get('/bookings/all');
  return response.data;
};

export const cleanupPastBookings = async () => {
  const response = await api.delete('/bookings/cleanup');
  return response.data;
};