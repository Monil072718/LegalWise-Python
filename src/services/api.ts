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
  // General keys
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Lawyers
  getLawyers: () => api.get<Lawyer[]>('/lawyers/'),
  getLawyer: (id: string) => api.get<Lawyer>(`/lawyers/${id}`),
  createLawyer: (data: Partial<Lawyer>) => api.post<Lawyer>('/lawyers/', data),
  updateLawyer: (id: string, data: Partial<Lawyer>) => api.put<Lawyer>(`/lawyers/${id}`, data),
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
