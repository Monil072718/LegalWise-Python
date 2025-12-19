"use client";

import { useState } from 'react';
import { Bell, Send, AlertTriangle, Calendar, FileText, DollarSign, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';

interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'document' | 'payment';
  title: string;
  message: string;
  recipient: string;
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
    recipient: 'john.smith@email.com',
    status: 'sent',
    createdAt: '2024-12-16T10:00:00Z',
    priority: 'high'
  },
  {
    id: '2',
    type: 'document',
    title: 'Document Submission',
    message: 'New document submitted for Case #456 - Medical Records.pdf',
    recipient: 'sarah.johnson@email.com',
    status: 'sent',
    createdAt: '2024-12-16T09:30:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Payment processing failed for consultation with Michael Chen',
    recipient: 'admin@legal.com',
    status: 'pending',
    createdAt: '2024-12-16T08:45:00Z',
    priority: 'high'
  },
  {
    id: '4',
    type: 'alert',
    title: 'Lawyer Inactivity',
    message: 'Emily Rodriguez has been inactive for 48 hours',
    recipient: 'admin@legal.com',
    status: 'sent',
    createdAt: '2024-12-15T16:20:00Z',
    priority: 'medium'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Document Deadline',
    message: 'Case #789 documents due in 24 hours',
    recipient: 'david.brown@email.com',
    status: 'failed',
    createdAt: '2024-12-15T14:15:00Z',
    priority: 'high'
  }
];

export default function NotificationCenter() {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Calendar className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-100 text-blue-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'document': return 'bg-green-100 text-green-600';
      case 'payment': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const handleResendNotification = (id: string) => {
    console.log('Resending notification:', id);
    // Implementation for resending notification
  };

  const handleDeleteNotification = (id: string) => {
    console.log('Deleting notification:', id);
    // Implementation for deleting notification
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Send Notification</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sent Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {notifications.filter(n => n.status === 'sent' && 
                  new Date(n.createdAt).toDateString() === new Date().toDateString()).length}
              </p>
              <p className="text-sm text-blue-600 mt-1">Successfully delivered</p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => n.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Awaiting delivery</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
              <p className="text-sm text-red-600 mt-1">Delivery failed</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((notifications.filter(n => n.status === 'sent').length / notifications.length) * 100)}%
              </p>
              <p className="text-sm text-green-600 mt-1">Delivery success</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Send Hearing Reminders</div>
              <div className="text-sm text-gray-500">Notify about upcoming hearings</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Document Alerts</div>
              <div className="text-sm text-gray-500">Notify about new documents</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Payment Reminders</div>
              <div className="text-sm text-gray-500">Send payment due notices</div>
            </div>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <CustomSelect
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'Reminder', value: 'reminder' },
                { label: 'Alert', value: 'alert' },
                { label: 'Document', value: 'document' },
                { label: 'Payment', value: 'payment' }
              ]}
              variant="default"
            />
          </div>
          
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Sent', value: 'sent' },
              { label: 'Pending', value: 'pending' },
              { label: 'Failed', value: 'failed' }
            ]}
            variant="default"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and track all platform notifications</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Title & Message</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Recipient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Sent At</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                      <span className="text-xs font-medium capitalize">{notification.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-600 max-w-md">{notification.message}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{notification.recipient}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(notification.status)}`}>
                      {notification.status === 'sent' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {notification.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                      {notification.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {notification.status === 'failed' && (
                        <button
                          onClick={() => handleResendNotification(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Resend notification"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete notification"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Send New Notification</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <CustomSelect
                  value="reminder" // Static for now as state not fully wired in original code
                  onChange={() => {}}
                  options={[
                      { label: 'Reminder', value: 'reminder' },
                      { label: 'Alert', value: 'alert' },
                      { label: 'Document', value: 'document' },
                      { label: 'Payment', value: 'payment' }
                  ]}
                  variant="default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Notification title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={3}
                  placeholder="Notification message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                <input
                  type="email"
                  placeholder="recipient@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <CustomSelect
                   value="medium"
                   onChange={() => {}}
                   options={[
                     { label: 'Low', value: 'low' },
                     { label: 'Medium', value: 'medium' },
                     { label: 'High', value: 'high' }
                   ]}
                   variant="default"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}