import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const lawyerApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
lawyerApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('lawyerToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Auth API types
interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  register: async (data: any) => {
    const response = await lawyerApi.post('/auth/lawyer/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await lawyerApi.post<LoginResponse>('/auth/lawyer/login', data);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('lawyerToken');
    window.location.href = '/lawyer/login';
  }
};
