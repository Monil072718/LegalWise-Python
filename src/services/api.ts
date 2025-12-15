import { Lawyer, Client, Case, Appointment, Book, Article, Payment } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || 'API Error');
  }
  return response.json();
};

export const api = {
  // Helper to get auth headers
  getHeaders: () => {
    const adminToken = typeof window !== 'undefined' ? (sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken')) : null;
    const lawyerToken = typeof window !== 'undefined' ? (sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken')) : null;
    // Simple heuristic: if we are in admin section (or have admin token and no lawyer token?), use admin.
    // Ideally, the caller should specify, but for now let's pick one. 
    // Usually only one should be active per 'view' but since we moved to sessionStorage, we can be more specific.
    // However, keeping it simple: use the one that exists.
    const token = adminToken || lawyerToken;
    
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // General keys
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: api.getHeaders()
    });
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    console.log(`API POST Request: ${endpoint}`, data);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify(data),
      });
      console.log(`API POST Response Status: ${response.status}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`API POST Error:`, error);
      throw error;
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: api.getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: api.getHeaders(),
    });
    return handleResponse(response);
  },

  // Lawyers
  getLawyers: () => api.get<Lawyer[]>('/lawyers/'),
  getLawyer: (id: string) => api.get<Lawyer>(`/lawyers/${id}`),
  createLawyer: async (data: any) => {
    const response = await api.post<Lawyer>('/lawyers/', data);
    return response;
  },
  
  loginAdmin: async (data: any) => {
    const response = await api.post<any>('/auth/admin/login', data);
    return response;
  },
  
  forgotPassword: (email: string) => api.post<{ message: string }>('/auth/forgot-password', { email }),
  verifyOTP: (data: { email: string; otp: string }) => api.post<{ token: string; message: string }>('/auth/verify-otp', data),
  resetPassword: (data: any) => api.post<{ message: string }>('/auth/reset-password', data),

  updateLawyer: async (id: string, data: Partial<Lawyer>) => api.put<Lawyer>(`/lawyers/${id}`, data),
  deleteLawyer: (id: string) => api.delete<void>(`/lawyers/${id}`),

  // Clients
  getClients: () => api.get<Client[]>('/clients/'),
  getClient: (id: string) => api.get<Client>(`/clients/${id}`),
  createClient: (data: Partial<Client>) => api.post<Client>('/clients/', data),
  updateClient: (id: string, data: Partial<Client>) => api.put<Client>(`/clients/${id}`, data),
  deleteClient: (id: string) => api.delete<void>(`/clients/${id}`),
  
  // Cases
  getCases: () => api.get<Case[]>('/cases/'),
  getCase: (id: string) => api.get<Case>(`/cases/${id}`),
  createCase: (data: Partial<Case>) => api.post<Case>('/cases/', data),
  updateCase: (id: string, data: Partial<Case>) => api.put<Case>(`/cases/${id}`, data),
  deleteCase: (id: string) => api.delete<void>(`/cases/${id}`),

  // Appointments
  getAppointments: () => api.get<Appointment[]>('/appointments/'),
  createAppointment: (data: Partial<Appointment>) => api.post<Appointment>('/appointments/', data),
  updateAppointment: (id: string, data: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete<void>(`/appointments/${id}`),
  
  // Books & Articles
  getBooks: () => api.get<Book[]>('/books/'),
  getArticles: () => api.get<Article[]>('/articles/'),

  // Financials
  getPayments: () => api.get<Payment[]>('/payments/'),
  
  // Dashboard
  getDashboardStats: () => api.get<any>('/dashboard/stats'), 
};
