"use client";

import { useState } from 'react';
import { Bell, AlertTriangle, Calendar, FileText, DollarSign, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'document' | 'payment';
  title: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Hearing Reminder',
    message: 'You have a hearing scheduled for tomorrow at 2 PM for Case #123',
    status: 'sent',
    createdAt: '2024-12-16T10:00:00Z',
    priority: 'high'
  },
  {
    id: '2',
    type: 'document',
    title: 'Document Submission',
    message: 'New document submitted for Case #456 - Medical Records.pdf',
    status: 'sent',
    createdAt: '2024-12-16T09:30:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Payment processing failed for consultation with Michael Chen',
    status: 'pending',
    createdAt: '2024-12-16T08:45:00Z',
    priority: 'high'
  }
];

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications] = useState<Notification[]>(mockNotifications);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Calendar className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
      switch (priority) {
          case 'high': return 'bg-red-50 text-red-600 border-red-100';
          case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
          default: return 'bg-gray-50 text-gray-600 border-gray-100';
      }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
              </div>
          ) : (
              <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${notification.status === 'pending' ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${getPriorityColor(notification.priority)}`}>
                                  {getTypeIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.message}</p>
                                  <div className="flex items-center gap-2">
                                      {notification.status === 'pending' && (
                                          <span className="inline-flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                              <Clock className="w-3 h-3 mr-1" /> Pending
                                          </span>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
        <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={onClose}>
            View All Notifications
        </Link>
      </div>
    </div>
  );
}
