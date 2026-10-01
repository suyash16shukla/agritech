import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const weatherAPI = {
  get: (lat, lon, location) => api.get(`/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(location)}`),
};

export const cropsAPI = {
  getAll: (params = {}) => api.get('/crops', { params }),
  getById: (id) => api.get(`/crops/${id}`),
  recommend: (data) => api.post('/crops/recommend', data),
};

export const schedulesAPI = {
  getByCropName: (cropName) => api.get(`/schedules?cropName=${encodeURIComponent(cropName)}`),
  getByCropId: (cropId) => api.get(`/schedules/crop/${cropId}`),
};

export const schemesAPI = {
  getAll: (params = {}) => api.get('/schemes', { params }),
  getById: (id) => api.get(`/schemes/${id}`),
};

export const soilAPI = {
  getMetrics: () => api.get('/soil/metrics'),
};

export const aiAPI = {
  chat: (message, language, conversationHistory) =>
    api.post('/ai/advisor', { message, language, conversationHistory }),
};

export default api;
