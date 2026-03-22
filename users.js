import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getMy: () => api.get('/items/my'),
  getById: (id) => api.get(`/items/${id}`),
  create: (formData) => api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

export const requestsAPI = {
  create: (data) => api.post('/requests', data),
  getReceived: () => api.get('/requests/received'),
  getSent: () => api.get('/requests/sent'),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};

export const usersAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
};

export default api;
