import { Lawyer, Client, Case, Appointment, Book, Article, Payment, Category } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || response.statusText;
    } catch (e) {
        // failed to parse json, keep statusText
    }
    throw new Error(errorDetail);
  }
  return response.json();
};

export const api = {
  // Helper to get auth headers
  getHeaders: () => {
    const adminToken = typeof window !== 'undefined' ? (sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken')) : null;
    const lawyerToken = typeof window !== 'undefined' ? (sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken')) : null;
    
    let token = null;
    if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/lawyer')) {
            token = lawyerToken;
        } else if (path.startsWith('/admin')) {
            token = adminToken;
        } else {
             // Fallback or explicit public routes
             token = adminToken || lawyerToken;
        }
    } else {
        token = adminToken || lawyerToken;
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // General keys
  get: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`API GET Request: ${url}`);
    const response = await fetch(url, {
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
  deleteCase: (id: string, ) => api.delete<void>(`/cases/${id}`),
  uploadCaseDocument: (id: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      let token = null;
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const adminToken = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
            const lawyerToken = sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken');
            
            if (path.startsWith('/lawyer')) {
                token = lawyerToken;
            } else if (path.startsWith('/admin')) {
                token = adminToken;
            } else {
                token = adminToken || lawyerToken;
            }
        }

      return fetch(`${API_BASE_URL}/cases/${id}/documents`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
      }).then(handleResponse);
  },
  
  // File Upload
  uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return fetch(`${API_BASE_URL}/upload/image`, {
          method: 'POST',
          // No headers needed, browser sets Content-Type to multipart/form-data
          body: formData
      }).then(handleResponse);
  },

  deleteCaseDocument: (caseId: string, docId: string) => api.delete<void>(`/cases/${caseId}/documents/${docId}`),
  getCaseDocumentUrl: (caseId: string, filename: string) => `${API_BASE_URL}/cases/${caseId}/documents/${filename}`,

  // Appointments
  getAppointments: () => api.get<Appointment[]>('/appointments/'),
  createAppointment: (data: Partial<Appointment>) => api.post<Appointment>('/appointments/', data),
  updateAppointment: (id: string, data: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}`, data),
  deleteAppointment: (id: string) => api.delete<void>(`/appointments/${id}`),
  
  // Books
  getBooks: () => api.get<Book[]>('/books/'),
  getBook: (id: string) => api.get<Book>(`/books/${id}`),
  createBook: (data: Partial<Book>) => api.post<Book>('/books/', data),
  updateBook: (id: string, data: Partial<Book>) => api.put<Book>(`/books/${id}`, data),
  deleteBook: (id: string) => api.delete<void>(`/books/${id}`),

  // Articles
  getArticles: () => api.get<Article[]>('/articles/'),
  getArticle: (id: string) => api.get<Article>(`/articles/${id}`),
  createArticle: (data: Partial<Article>) => api.post<Article>('/articles/', data),
  updateArticle: (id: string, data: Partial<Article>) => api.put<Article>(`/articles/${id}`, data),
  deleteArticle: (id: string) => api.delete<void>(`/articles/${id}`),
  scrapeArticle: (url: string) => api.post<{title: string, description: string, image: string}>('/articles/scrape', { url }),

  // Categories
  getCategories: () => api.get<Category[]>('/categories/'),
  createCategory: (data: Partial<Category>) => api.post<Category>('/categories/', data),
  updateCategory: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete<void>(`/categories/${id}`),

  // Financials
  getPayments: () => api.get<Payment[]>('/payments/'),
  createPayment: (data: Partial<Payment>) => api.post<Payment>('/payments/', data),
  
  // Dashboard
  getDashboardStats: () => api.get<any>('/dashboard/stats'), 
};
