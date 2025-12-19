"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../../services/api';
import { Lawyer } from '../../../../types';
import { useToast } from '../../../../context/ToastContext';
import { User, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function NewAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lawyerId = searchParams.get('lawyerId');
  const { showToast } = useToast();

  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // Time Slots
  const timeSlots = [
      "09:00", "10:00", "11:00", "12:00", 
      "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    const init = async () => {
        const token = sessionStorage.getItem('userToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.id) {
                    const profile = await api.getClient(decoded.id);
                    setCurrentUser(profile);
                }
            } catch(e) { console.error(e); }
        }

        if (lawyerId) {
            try {
                const data = await api.getLawyer(lawyerId);
                setLawyer(data);
            } catch (err) {
                console.error("Failed to fetch lawyer");
            }
        }
        setLoading(false);
    };
    init();
  }, [lawyerId]);

  useEffect(() => {
      if (lawyerId && selectedDate) {
          fetchAvailability();
      }
  }, [lawyerId, selectedDate]);

  const fetchAvailability = async () => {
      if (!lawyerId || !selectedDate) return;
      setAvailabilityLoading(true);
      try {
          const appointments = await api.getLawyerAppointments(lawyerId);
          const dateStr = selectedDate.toISOString().split('T')[0];
          
          const taken = appointments
              .filter(app => app.date === dateStr && app.status !== 'cancelled')
              .map(app => app.time);
          setBookedSlots(taken);
      } catch (error) {
          console.error("Failed to fetch availability", error);
      } finally {
          setAvailabilityLoading(false);
      }
  };

  const handleSubmit = async () => {
      if (!lawyer || !currentUser || !selectedDate || !selectedTime) {
          showToast("Please fill all fields", "error");
          return;
      }

      try {
          await api.createAppointment({
              clientName: currentUser.name, 
              lawyerName: lawyer.name,
              lawyerId: lawyer.id,
              clientId: currentUser.id,
              date: selectedDate.toISOString().split('T')[0],
              time: selectedTime,
              type: 'Consultation',
              status: 'pending',
              notes: notes
          });
          showToast("Appointment request sent!", "success");
          router.push('/user/dashboard');
      } catch (error: any) {
          showToast(error.message || "Booking failed", "error");
      }
  };

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  today.setHours(0,0,0,0);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.getDate() === d2.getDate() && 
             d1.getMonth() === d2.getMonth() && 
             d1.getFullYear() === d2.getFullYear();
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>;
  if (!lawyer) return <div className="p-8 text-center text-red-500">Lawyer not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Profile
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Calendar */}
          <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" /> 
                          Select Date
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Choose a date for your consultation</p>
                  </div>
                  
                  <div className="p-6">
                      {/* Calendar Navigation */}
                      <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-gray-800">
                              {monthNames[month]} {year}
                          </h3>
                          <div className="flex space-x-2">
                              <button 
                                  onClick={prevMonth}
                                  disabled={month === today.getMonth() && year === today.getFullYear()}
                                  className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                              </button>
                              <button 
                                  onClick={nextMonth}
                                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                  <ChevronRight className="w-5 h-5 text-gray-600" />
                              </button>
                          </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-1">
                                  {day}
                              </div>
                          ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: firstDay }).map((_, i) => (
                              <div key={`empty-${i}`} />
                          ))}
                          
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const date = new Date(year, month, day);
                              const isPast = date < today;
                              const isSelected = selectedDate && isSameDay(date, selectedDate);
                              const isToday = isSameDay(date, today);

                              return (
                                  <button
                                      key={day}
                                      disabled={isPast}
                                      onClick={() => {
                                          setSelectedDate(date);
                                          setSelectedTime('');
                                      }}
                                      className={`
                                          h-12 rounded-xl flex items-center justify-center font-medium transition-all duration-200 relative
                                          ${isSelected 
                                              ? 'bg-blue-600 text-white shadow-md transform scale-105 z-10' 
                                              : isPast 
                                                  ? 'text-gray-300 cursor-not-allowed' 
                                                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                          }
                                          ${isToday && !isSelected ? 'border border-blue-200 bg-blue-50/30' : ''}
                                      `}
                                  >
                                      {day}
                                      {isToday && !isSelected && (
                                           <span className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></span>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              </div>

              {/* Booking Summary Card (Mobile mostly, or bottom filler) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg">
                          {lawyer.name.charAt(0)}
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 font-medium">Booking with</p>
                          <h3 className="font-bold text-gray-900">{lawyer.name}</h3>
                          <p className="text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                              {lawyer.specialization[0]}
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* RIGHT COLUMN: Time & Confirmation */}
          <div className="flex-1 lg:max-w-md">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                       <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-blue-600" /> 
                          Available Slots
                       </h2>
                       <p className="text-sm text-gray-500 mt-1">
                           {selectedDate 
                               ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                               : 'Select a date to view times'
                           }
                       </p>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                      {!selectedDate ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                              <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
                              <p>Please select a date from the calendar</p>
                          </div>
                      ) : availabilityLoading ? (
                           <div className="flex-1 flex items-center justify-center py-12">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                           </div>
                      ) : (
                          <div className="grid grid-cols-3 gap-3">
                              {timeSlots.map(time => {
                                  const isBooked = bookedSlots.includes(time);
                                  const isSelected = selectedTime === time;
                                  return (
                                      <button
                                          key={time}
                                          disabled={isBooked}
                                          onClick={() => setSelectedTime(time)}
                                          className={`
                                              py-3 px-2 rounded-xl text-sm font-semibold transition-all border
                                              ${isBooked 
                                                  ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed' 
                                                  : isSelected
                                                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100'
                                                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm'
                                              }
                                          `}
                                      >
                                          {time}
                                      </button>
                                  );
                              })}
                          </div>
                      )}
                      
                      <div className="mt-8 border-t border-gray-100 pt-6">
                           <label className="block text-sm font-bold text-gray-700 mb-3">
                              Additional Notes
                          </label>
                          <textarea
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow"
                              placeholder="Briefly describe your case..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                      <button
                          onClick={handleSubmit}
                          disabled={!selectedTime || !selectedDate}
                          className={`
                              w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all
                              ${!selectedTime || !selectedDate 
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                              }
                          `}
                      >
                          <CheckCircle className="w-5 h-5 mr-2" /> 
                          Confirm Appointment
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
