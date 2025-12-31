"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { User, Mail, Phone, MapPin, Building, Camera, Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';

export default function UserProfile() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        avatar: '',
        role: 'client' // ensure role is preserved
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                showToast('Please login to view profile', 'error');
                router.push('/user/login');
                return;
            }

            try {
                const data = await api.getClient(userId);
                setFormData({
                    id: data.id,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    company: data.company || '',
                    avatar: data.avatar || '',
                    role: data.role || 'client'
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                showToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router, showToast]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            showToast('Uploading image...', 'info');
            const response = await api.uploadImage(file);
            // Assuming response matches backend return which is typically { url: "..." } or similar
            // But api.uploadImage returns handleResponse(response). 
            // backend/routers/common/upload.py returns {"url": ...}
            if (response.url) {
                setFormData(prev => ({ ...prev, avatar: response.url }));
                showToast('Image uploaded successfully', 'success');
            }
        } catch (error) {
            console.error("Image upload failed", error);
            showToast('Failed to upload image', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Only send updatable fields
            const updatePayload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                company: formData.company,
                avatar: formData.avatar
            };
            
            await api.updateClient(formData.id, updatePayload);
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            console.error("Update failed", error);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <PublicHeader />
            
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500 mt-1">Manage your personal information</p>
                        </div>
                        <Link 
                            href="/user/dashboard" 
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                            
                            {/* Avatar Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden ring-4 ring-white shadow-lg">
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                                        <Camera className="w-4 h-4" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                                    <p className="text-sm text-gray-500 max-w-xs">
                                        Upload a professional photo to help lawyers recognize you. JPG, PNG or GIF.
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        disabled
                                        value={formData.email}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                        title="Email cannot be changed"
                                    />
                                    <p className="text-xs text-gray-400">Contact support to change email</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-gray-400" /> Company / Organization
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.company}
                                        onChange={e => setFormData({...formData, company: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> Address
                                    </label>
                                    <textarea 
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="123 Legal Street, Suite 400"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
            
            <PublicFooter />
        </div>
    );
}
