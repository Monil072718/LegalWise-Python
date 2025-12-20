'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Appointment } from '@/types';

export default function LawyerAppointments() {
  const [activeTab, setActiveTab] = useState('requests');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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
      console.error('Failed to load appointments', error);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'declined') => {
    try {
      const appt = appointments.find((a) => a.id === id);
      if (!appt) return;

      const updatedData = { ...appt, status };
      await api.updateAppointment(id, updatedData);

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );

      showToast(`Appointment ${status}`, 'success');
    } catch (error: any) {
      console.error('Failed to update status', error);
      showToast('Failed to update status', 'error');
    }
  };

  const requests = appointments.filter((a) => a.status?.toLowerCase() === 'pending');
  const events = appointments.filter((a) => a.status?.toLowerCase() === 'approved');

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || req.type?.includes(filterType);
    return matchesSearch && matchesType;
  });

  const filteredEvents = events.filter((evt) => {
    return evt.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          setIsAvailable(lawyer.availability === 'online');
        }
      }
    } catch (e) {
      console.error('Failed to check availability', e);
    }
  };

  const handleToggleAvailability = async () => {
    if (!currentLawyerId) return;

    const newStatus = !isAvailable;
    const statusString: 'online' | 'offline' = newStatus ? 'online' : 'offline';

    try {
      await api.updateLawyer(currentLawyerId, { availability: statusString });
      setIsAvailable(newStatus);
      showToast(`Status updated to ${statusString}`, 'success');
    } catch (error) {
      console.error('Failed to update availability', error);
      showToast('Failed to update availability', 'error');
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'requests'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-white shadow-sm text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Calendar ({events.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-hidden">
          {/* Search/Filter */}
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
              <div className="w-48">
                <CustomSelect
                  value={filterType}
                  onChange={setFilterType}
                  options={[
                    { label: 'All Types', value: 'All' },
                    { label: 'Consultation', value: 'Consultation' },
                    { label: 'Review', value: 'Review' },
                    { label: 'Hearing', value: 'Hearing' },
                  ]}
                  variant="default"
                />
              </div>
            )}
          </div>

          {activeTab === 'calendar' ? (
            <div className="flex-1 overflow-y-auto space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
              {filteredEvents.length === 0 && (
                <p className="text-gray-500 text-sm">No approved appointments.</p>
              )}
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg mb-3"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{evt.clientName}</h3>
                    <p className="text-sm text-blue-800">
                      {evt.type} • {evt.time}
                    </p>
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
                <div
                  key={req.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
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

                      <button
                        onClick={() => setSelectedAppointment(req)}
                        className="text-xs text-blue-600 font-medium mt-2 hover:underline"
                      >
                        View Case Details
                      </button>
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

        {/* Sidebar */}
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

          <div
            className={`bg-gradient-to-br ${
              isAvailable ? 'from-blue-600 to-indigo-700' : 'from-gray-600 to-gray-700'
            } rounded-xl shadow-lg p-6 text-white transition-all duration-300`}
          >
            <h2 className="text-lg font-bold mb-2">Availability Status</h2>
            <p className="text-blue-100 text-sm mb-4">
              {isAvailable
                ? 'You are currently visible to clients.'
                : 'You are currently hidden from clients.'}
            </p>
            <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`}
                />
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

      {/* ✅ FIXED Modal (no TS null error) */}
      {(() => {
        if (!selectedAppointment) return null;
        const appt = selectedAppointment;

        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{appt.clientName}</h3>
                  <p className="text-sm text-gray-500">{appt.type}</p>
                </div>

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
                    {appt.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    {appt.time}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Case Details</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {appt.notes || 'No details provided.'}
                  </p>
                </div>

                {appt.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleStatusUpdate(appt.id, 'approved');
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> Accept Request
                    </button>

                    <button
                      onClick={() => {
                        handleStatusUpdate(appt.id, 'declined');
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
