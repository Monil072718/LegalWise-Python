'use client';

import { Bell, Calendar, FileText, User } from 'lucide-react';

export default function LawyerNotifications() {
  const notifications = [
    { id: 1, type: "hearing", text: "Upcoming Hearing: Estate Dispute in 2 hours", time: "2 hours ago", read: false },
    { id: 2, type: "request", text: "New Appointment Request from John Doe", time: "4 hours ago", read: false },
    { id: 3, type: "document", text: "Document 'Will_v1.pdf' was approved", time: "Yesterday", read: true },
    { id: 4, type: "system", text: "System maintenance scheduled for Sunday", time: "2 days ago", read: true },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'hearing': return <Calendar className="w-5 h-5 text-red-500" />;
      case 'request': return <User className="w-5 h-5 text-blue-500" />;
      case 'document': return <FileText className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
             <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 flex-shrink-0">
               {getIcon(notif.type)}
             </div>
             <div className="flex-1">
               <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                 {notif.text}
               </p>
               <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
             </div>
             {!notif.read && (
               <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
