import axios from 'axios';

const BASE_URL = 'http://localhost:8081/users';

const api = axios.create({
  baseURL: BASE_URL
});


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.url.includes('/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {
    const isLoginRequest = error.config?.url?.includes('/login');
    
    if (!isLoginRequest && 
        (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('adminEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAllUsers  = ()         => api.get('');
export const getUserById  = (id)       => api.get(`/${id}`);
export const createUser   = (data)     => api.post('', data);
export const updateUser   = (id, data) => api.put(`/${id}`, data);
export const deleteUser   = (id)       => api.delete(`/${id}`);
export const loginUser    = (data)     => api.post('/login', data);