"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Appointment } from '../../../types';
import { jwtDecode } from 'jwt-decode';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function UserAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
             const token = sessionStorage.getItem('userToken');
             if (!token) return;
             try {
                 const decoded: any = jwtDecode(token);
                 if (decoded.id) {
                     const data = await api.getClientAppointments(decoded.id);
                     setAppointments(data);
                 }
             } catch (e) {
                 console.error("Failed to fetch appointments", e);
             } finally {
                 setLoading(false);
             }
        };
        fetchAppointments();
    }, []);

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status.toLowerCase()) {
            case 'confirmed': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'cancelled': return <XCircle className="w-4 h-4 mr-1" />;
            default: return <AlertCircle className="w-4 h-4 mr-1" />;
        }
    };

    if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-500">Track the status of your legal consultations</p>
                </div>
                <Link href="/user/lawyers" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Book New
                </Link>
            </div>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No appointments yet</h3>
                    <p className="text-gray-500 mb-6">Book a consultation with one of our expert lawyers.</p>
                    <Link href="/user/lawyers" className="text-blue-600 font-medium hover:underline">
                        Find a Lawyer &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-shadow hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{apt.lawyerName}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-1">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {apt.date}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {apt.time}
                                        </span>
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                            Virtual / Office
                                        </span>
                                    </div>
                                    {apt.notes && (
                                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded max-w-xl">
                                            <span className="font-medium">Note:</span> {apt.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center ${getStatusColor(apt.status)}`}>
                                    {getStatusIcon(apt.status)}
                                    <span className="capitalize">{apt.status}</span>
                                </div>
                                {/* Actions could go here, e.g. Cancel */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
