'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Filter
} from 'lucide-react';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Appointment } from '@/types';

export default function LawyerAppointments() {
  const [activeTab, setActiveTab] = useState('requests');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
      loadAppointments();
  }, []);

  const loadAppointments = async () => {
      setLoading(true);
      try {
          const data = await api.getAppointments();
          setAppointments(data);
      } catch (error: any) {
          console.error("Failed to load appointments", error);
          showToast("Failed to load appointments", "error");
      } finally {
          setLoading(false);
      }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'declined') => {
      try {
          // Note: Backend expects 'status' field update.
          // Check if api.updateAppointment supports this.
          // api.ts: updateAppointment: (id: string, data: Partial<Appointment>) => api.put...
          // backend: update_appointment takes schemas.AppointmentBase used as body? 
          // Wait, backend update implementation:
          // for key, value in appointment.dict().items(): setattr...
          // schemas.AppointmentBase requires all fields? 
          // Let's assume partial update is NOT fully supported by backend schema validation if it expects full Base.
          // But allow's try. If it fails, I might need to fetch-modify-save or update backend schema to optional.
          // Actually, schemas.AppointmentBase all fields are required? 
          // Let's check schemas.py... AppointmentBase has no optionals except notes? 
          // Re-reading schemas.py... yes, clientName, lawyerName, etc are required.
          // This is risky. I should fix the backend schema to Optional for updates OR send full object.
          // To be safe, I will find the object, clone it, change status, and send it back.
          
          const appt = appointments.find(a => a.id === id);
          if (!appt) return;

          const updatedData = { ...appt, status };
          // We need to strip 'id' if passing to update? No, backend ignores ID in body usually or expects body.
          // Api.ts sends body. 
          
          // Actually, let's try sending just the changed field and catch 422 if schema strict.
          // But looking at backend: `appointment: schemas.AppointmentBase`. It is strict Pydantic.
          // Sending only `status` will fail validation.
          // I must send the full object.
          await api.updateAppointment(id, updatedData);
          
          setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
          showToast(`Appointment ${status}`, "success");
      } catch (error: any) {
          console.error("Failed to update status", error);
          showToast("Failed to update status", "error");
      }
  };

  // Filter Logic
  // Requests = status 'pending'
  // Calendar/Events = status 'approved' (?)
  
  const requests = appointments.filter(a => a.status?.toLowerCase() === 'pending');
  const events = appointments.filter(a => a.status?.toLowerCase() === 'approved');

  const filteredRequests = requests.filter(req => {
      const matchesSearch = req.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || req.type?.includes(filterType); 
      return matchesSearch && matchesType;
  });
  
  // For Calendar View - rudimentary
  const filteredEvents = events.filter(evt => {
       return evt.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Availability Logic
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentLawyerId, setCurrentLawyerId] = useState<string | null>(null);

  useEffect(() => {
     checkAvailability();
  }, []);

  const checkAvailability = async () => {
      try {
         const token = sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken');
         if (token) {
             const payload = JSON.parse(atob(token.split('.')[1]));
             if (payload.id) {
                 setCurrentLawyerId(payload.id);
                 const lawyer = await api.getLawyer(payload.id);
                 // Assuming 'Available' string or boolean field. Model has 'availability': str
                 setIsAvailable(lawyer.availability === 'Available');
             }
         }
      } catch (e) {
          console.error("Failed to check availability", e);
      }
  };

  const handleToggleAvailability = async () => {
      if (!currentLawyerId) return;
      
      const newStatus = !isAvailable;
      const statusString = newStatus ? 'Available' : 'Unavailable';
      
      try {
          await api.updateLawyer(currentLawyerId, { availability: statusString });
          setIsAvailable(newStatus);
          showToast(`Status updated to ${statusString}`, "success");
      } catch (error) {
          console.error("Failed to update availability", error);
          showToast("Failed to update availability", "error");
      }
  };

  if (loading) return <div className="p-6">Loading appointments...</div>;

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'requests' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Requests ({requests.length})
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Calendar ({events.length})
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
                     placeholder="Search client name..."
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
                       <option value="Hearing">Hearing</option>
                   </select>
               )}
          </div>

          {activeTab === 'calendar' ? (
            <div className="flex-1 overflow-y-auto space-y-4">
                 <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
                 {filteredEvents.length === 0 && <p className="text-gray-500 text-sm">No approved appointments.</p>}
                 {filteredEvents.map(evt => (
                     <div key={evt.id} className="flex border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg mb-3">
                         <div className="flex-1">
                             <h3 className="font-bold text-gray-900">{evt.clientName}</h3>
                             <p className="text-sm text-blue-800">{evt.type} • {evt.time}</p>
                             <p className="text-xs text-gray-600 mt-1">{evt.notes || 'No notes'}</p>
                         </div>
                         <div className="text-right">
                             <div className="text-sm font-medium text-gray-900">{evt.date}</div>
                         </div>
                     </div>
                 ))}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Requests</h2>
              {filteredRequests.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.clientName}</h3>
                      <p className="text-gray-500 text-sm">{req.type}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" /> {req.date}
                        <Clock className="w-3 h-3 ml-2" /> {req.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={() => handleStatusUpdate(req.id, 'approved')}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button 
                        onClick={() => handleStatusUpdate(req.id, 'declined')}
                        className="flex-1 sm:flex-none px-3 py-1.5 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
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

        {/* Sidebar Info - Static for now but could show summary stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-bold text-gray-900">{requests.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-bold text-gray-900">{events.length}</span>
              </div>
            </div>
          </div>
          
           <div className={`bg-gradient-to-br ${isAvailable ? 'from-blue-600 to-indigo-700' : 'from-gray-600 to-gray-700'} rounded-xl shadow-lg p-6 text-white transition-all duration-300`}>
            <h2 className="text-lg font-bold mb-2">Availability Status</h2>
            <p className="text-blue-100 text-sm mb-4">
                {isAvailable ? "You are currently visible to clients." : "You are currently hidden from clients."}
            </p>
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <button 
                onClick={handleToggleAvailability}
                className="text-xs bg-white text-blue-700 px-2 py-1 rounded font-medium hover:bg-blue-50"
              >
                  Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
