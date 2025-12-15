'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  MapPin, 
  Video 
} from 'lucide-react';

export default function LawyerAppointments() {
  const [activeTab, setActiveTab] = useState('calendar');
  
  // Mock Requests
  const requests = [
    { id: 1, client: "John Doe", type: "Initial Consultation", date: "Jan 18, 2024", time: "10:00 AM", status: "Pending" },
    { id: 2, client: "Jane Smith", type: "Case Review", date: "Jan 19, 2024", time: "2:00 PM", status: "Pending" },
  ];

  // Mock Calendar Events
  const events = [
    { id: 101, title: "Court Hearing - Estate Case", time: "09:00 AM", type: "hearing", color: "bg-red-100 border-red-200 text-red-800" },
    { id: 102, title: "Client Meeting - Alice", time: "11:30 AM", type: "meeting", color: "bg-blue-100 border-blue-200 text-blue-800" },
    { id: 103, title: "Document Review", time: "03:00 PM", type: "work", color: "bg-gray-100 border-gray-200 text-gray-800" },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredRequests = requests.filter(req => {
      const matchesSearch = req.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || req.type.includes(filterType); // Rough match
      return matchesSearch && matchesType;
  });

  const filteredEvents = events.filter(evt => {
       return evt.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'requests' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Requests ({requests.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-hidden">
            
          {/* Internal Search/Filter Bar */}
          <div className="flex justify-between items-center mb-4 gap-4">
               <div className="relative flex-1">
                 <input 
                     type="text" 
                     placeholder={activeTab === 'calendar' ? "Search events..." : "Search requests..."}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                 />
               </div>
               {activeTab === 'requests' && (
                   <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       <option value="All">All Types</option>
                       <option value="Consultation">Consultation</option>
                       <option value="Review">Review</option>
                   </select>
               )}
          </div>

          {activeTab === 'calendar' ? (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">January 2024</h2>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">&lt;</button>
                  <button className="px-2 hover:bg-gray-100 rounded">Today</button>
                  <button className="p-1 hover:bg-gray-100 rounded">&gt;</button>
                </div>
              </div>
              
              {/* Simple Day View for Demo */}
              <div className="flex-1 overflow-y-auto space-y-4">
                 {Array.from({ length: 9 }).map((_, i) => {
                   const hour = i + 9; // 9 AM start
                   const timeLabel = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                   
                   // Find events for this hour (Filtered)
                   const hourEvents = filteredEvents.filter(e => {
                     const eventHour = parseInt(e.time.split(':')[0]);
                     return eventHour === hour || (eventHour === hour - 12 && e.time.includes('PM')); // Very rough parsing
                   });

                   return (
                     <div key={hour} className="flex border-b border-gray-100 min-h-[80px]">
                       <div className="w-20 text-xs text-gray-500 pt-2 px-2 text-right">{timeLabel}</div>
                       <div className="flex-1 relative pt-2 pb-2 pr-2">
                         {/* Placeholder for events */}
                         {hour === 9 && (
                           <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded text-sm mb-1">
                             <div className="font-semibold text-red-900">Court Hearing - Estate Case</div>
                             <div className="text-red-700 text-xs">Room 304 • Judge Dredd</div>
                           </div>
                         )}
                         {hour === 11 && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded text-sm mb-1">
                             <div className="font-semibold text-blue-900">Consultation - Alice Johnson</div>
                             <div className="text-blue-700 text-xs">Video Call</div>
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Requests</h2>
              {filteredRequests.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.client}</h3>
                      <p className="text-gray-500 text-sm">{req.type}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" /> {req.date}
                        <Clock className="w-3 h-3 ml-2" /> {req.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button className="flex-1 sm:flex-none px-3 py-1.5 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                </div>
              ))}
              {filteredRequests.length === 0 && (
                <div className="text-center text-gray-500 py-12">No pending requests</div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1 bg-red-500 h-full rounded-full self-stretch"></div>
                <div>
                  <p className="font-medium text-gray-900">09:00 AM - 10:30 AM</p>
                  <p className="text-sm text-gray-600">Court Hearing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 bg-blue-500 h-full rounded-full self-stretch"></div>
                <div>
                  <p className="font-medium text-gray-900">11:30 AM - 12:15 PM</p>
                  <p className="text-sm text-gray-600">Client Meeting</p>
                </div>
              </div>
            </div>
          </div>
          
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-bold mb-2">Availability Status</h2>
            <p className="text-blue-100 text-sm mb-4">You are currently visible to clients.</p>
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                Available
              </span>
              <button className="text-xs bg-white text-blue-700 px-2 py-1 rounded font-medium hover:bg-blue-50">Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
