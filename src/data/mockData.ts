import { Lawyer, Client, Case, Appointment, Payment, Book, Article } from '../types';

export const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'lawyer',
    status: 'active',
    specialization: ['Criminal Law', 'Family Law'],
    experience: 8,
    rating: 4.8,
    casesHandled: 156,
    availability: 'online',
    verified: true,
    createdAt: '2024-01-15',
    documents: [
      { id: '1', name: 'Bar Certificate.pdf', type: 'PDF', uploadedAt: '2024-01-15', size: '2.5 MB' }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    role: 'lawyer',
    status: 'active',
    specialization: ['Corporate Law', 'IP Law'],
    experience: 12,
    rating: 4.9,
    casesHandled: 203,
    availability: 'busy',
    verified: true,
    createdAt: '2023-11-20',
    documents: []
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    role: 'lawyer',
    status: 'pending',
    specialization: ['Immigration Law'],
    experience: 5,
    rating: 4.6,
    casesHandled: 89,
    availability: 'offline',
    verified: false,
    createdAt: '2024-12-01',
    documents: []
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'client',
    status: 'active',
    consultations: 3,
    booksDownloaded: 2,
    articlesRead: 15,
    totalSpent: 850,
    createdAt: '2024-02-10'
  },
  {
    id: '2',
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    role: 'client',
    status: 'active',
    consultations: 1,
    booksDownloaded: 5,
    articlesRead: 23,
    totalSpent: 320,
    createdAt: '2024-03-05'
  },
  {
    id: '3',
    name: 'David Brown',
    email: 'david.brown@email.com',
    role: 'client',
    status: 'inactive',
    consultations: 0,
    booksDownloaded: 1,
    articlesRead: 7,
    totalSpent: 45,
    createdAt: '2024-01-28'
  }
];

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'Personal Injury Claim',
    clientId: '1',
    lawyerId: '1',
    status: 'in-progress',
    stage: 'Discovery',
    priority: 'high',
    createdAt: '2024-11-15',
    nextHearing: '2024-12-20',
    documents: [
      { id: '1', name: 'Medical Records.pdf', type: 'PDF', uploadedAt: '2024-11-16', size: '5.2 MB' },
      { id: '2', name: 'Incident Report.docx', type: 'DOCX', uploadedAt: '2024-11-17', size: '1.8 MB' }
    ]
  },
  {
    id: '2',
    title: 'Contract Dispute',
    clientId: '2',
    lawyerId: '2',
    status: 'open',
    stage: 'Initial Review',
    priority: 'medium',
    createdAt: '2024-12-01',
    documents: []
  },
  {
    id: '3',
    title: 'Immigration Appeal',
    clientId: '3',
    lawyerId: '3',
    status: 'closed',
    stage: 'Completed',
    priority: 'low',
    createdAt: '2024-10-05',
    documents: []
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    lawyerId: '1',
    clientName: 'John Smith',
    lawyerName: 'Sarah Johnson',
    date: '2024-12-18',
    time: '14:00',
    type: 'consultation',
    status: 'pending',
    notes: 'Initial consultation for personal injury case'
  },
  {
    id: '2',
    clientId: '2',
    lawyerId: '2',
    clientName: 'Lisa Wang',
    lawyerName: 'Michael Chen',
    date: '2024-12-19',
    time: '10:30',
    type: 'hearing',
    status: 'approved'
  },
  {
    id: '3',
    clientId: '3',
    lawyerId: '3',
    clientName: 'David Brown',
    lawyerName: 'Emily Rodriguez',
    date: '2024-12-17',
    time: '16:00',
    type: 'meeting',
    status: 'completed'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    clientName: 'John Smith',
    lawyerName: 'Sarah Johnson',
    amount: 500,
    type: 'consultation',
    status: 'completed',
    date: '2024-12-15',
    platformFee: 50
  },
  {
    id: '2',
    clientName: 'Lisa Wang',
    amount: 25,
    type: 'book',
    status: 'completed',
    date: '2024-12-14',
    platformFee: 2.5
  },
  {
    id: '3',
    clientName: 'David Brown',
    lawyerName: 'Michael Chen',
    amount: 300,
    type: 'case',
    status: 'pending',
    date: '2024-12-16',
    platformFee: 30
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Understanding Criminal Law',
    author: 'Dr. Robert Miller',
    category: 'Criminal Law',
    price: 29.99,
    downloads: 245,
    rating: 4.7,
    quantity: 100,
    publishedAt: '2024-01-10'
  },
  {
    id: '2',
    title: 'Corporate Legal Handbook',
    author: 'Jennifer Adams',
    category: 'Corporate Law',
    price: 39.99,
    downloads: 189,
    rating: 4.5,
    quantity: 50,
    publishedAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Family Law Essentials',
    author: 'Mark Thompson',
    category: 'Family Law',
    price: 24.99,
    downloads: 312,
    rating: 4.8,
    quantity: 75,
    publishedAt: '2024-03-05'
  }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Recent Changes in Immigration Law',
    author: 'Sarah Johnson',
    category: 'Immigration Law',
    views: 1250,
    likes: 89,
    publishedAt: '2024-12-10',
    status: 'published'
  },
  {
    id: '2',
    title: 'Understanding Your Rights in Criminal Cases',
    author: 'Michael Chen',
    category: 'Criminal Law',
    views: 2100,
    likes: 156,
    publishedAt: '2024-12-08',
    status: 'published'
  },
  {
    id: '3',
    title: 'Corporate Merger Guidelines',
    author: 'Emily Rodriguez',
    category: 'Corporate Law',
    views: 890,
    likes: 67,
    publishedAt: '2024-12-05',
    status: 'draft'
  }
];