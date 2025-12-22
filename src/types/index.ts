export interface User {
  id: string;
  name: string;
  email: string;
  role: 'lawyer' | 'client';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  avatar?: string;
}

export interface Lawyer extends User {
  role: 'lawyer';
  specialization: string[];
  experience: number;
  rating: number;
  casesHandled: number;
  availability: 'online' | 'offline' | 'busy';
  verified: boolean;
  documents: Document[];
  phone?: string;
  address?: string;
  bio?: string;
  image?: string;
}

export interface LawyerCreate extends Omit<Lawyer, 'id' | 'rating' | 'casesHandled' | 'documents' | 'createdAt'> {
  password: string;
}

export interface Client extends User {
  role: 'client';
  consultations: number;
  booksDownloaded: number;
  articlesRead: number;
  totalSpent: number;
  phone?: string;
  address?: string;
  company?: string;
  notes?: string;
}

export interface Case {
  id: string;
  title: string;
  clientId: string;
  lawyerId: string;
  status: 'open' | 'in-progress' | 'closed' | 'pending';
  stage: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  nextHearing?: string;
  description?: string;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  clientName: string;
  lawyerName: string;
  date: string;
  time: string;
  type: 'consultation' | 'hearing' | 'meeting';
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Payment {
  id: string;
  clientName: string;
  lawyerName?: string;
  amount: number;
  type: 'consultation' | 'case' | 'book' | 'commission' | 'document';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  platformFee: number;
  itemId?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  downloads: number;
  rating: number;
  publishedAt: string;
  isbn?: string;
  quantity: number;
  cover_image?: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  views: number;
  likes: number;
  publishedAt: string;
  status: 'published' | 'draft' | 'archived';
  content?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  avg_rate: number;
  lawyers_count: number;
  total_hires: number;
  avg_rating: number;
}