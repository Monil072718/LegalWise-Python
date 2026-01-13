"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, Building, Camera, Save, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
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
        role: 'client'
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfile = async () => {
            const userId = sessionStorage.getItem('userId');
            
            // Determine Role
            let currentRole = 'client';
            if (sessionStorage.getItem('lawyerToken')) currentRole = 'lawyer';
            if (sessionStorage.getItem('adminToken')) currentRole = 'admin';
            
            if (!userId) {
                console.error("No User ID found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                let data: any = {};
                
                if (currentRole === 'lawyer') {
                     data = await api.getLawyer(userId);
                } else if (currentRole === 'client') {
                     data = await api.getClient(userId);
                } else {
                    // Admin or unknown
                    showToast('Profile editing not available for Admin', 'info');
                    onClose();
                    return;
                }

                setFormData({
                    id: data.id,
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    company: data.company || '',
                    avatar: data.avatar || '',
                    role: currentRole
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                showToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isOpen, showToast, onClose]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            showToast('Uploading image...', 'info');
            const response = await api.uploadImage(file);
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
            const updatePayload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                company: formData.company,
                avatar: formData.avatar
            };
            
            if (formData.role === 'lawyer') {
                await api.updateLawyer(formData.id, updatePayload);
            } else {
                await api.updateClient(formData.id, updatePayload);
            }
            
            // Update session Name if changed
            if (formData.name) {
                sessionStorage.setItem('userName', formData.name);
                // Trigger event to update header
                window.dispatchEvent(new Event('storage'));
            }

            showToast('Profile updated successfully', 'success');
            onClose();
        } catch (error) {
            console.error("Update failed", error);
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-[120]"
                    >
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
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
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
