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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
                    />
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] pointer-events-auto"
                        >
                            {/* Fixed Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10 shrink-0">
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

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
                           <style jsx global>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 8px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: transparent;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background-color: #cbd5e1;
                                    border-radius: 20px;
                                    border: 3px solid transparent;
                                    background-clip: content-box;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background-color: #94a3b8;
                                }
                            `}</style>

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                        <p className="text-gray-400 font-medium animate-pulse">Loading profile...</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                                        <div className="relative group">
                                            <div className="w-28 h-28 rounded-full bg-gray-50 ring-4 ring-white shadow-xl overflow-hidden flex items-center justify-center">
                                                {formData.avatar ? (
                                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-10 h-10 text-gray-300" />
                                                )}
                                                
                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                                                </div>
                                            </div>
                                            
                                            <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all shadow-lg shadow-blue-500/30">
                                                <Camera className="w-4 h-4" />
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                        <div className="text-center sm:text-left space-y-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                        formData.role === 'lawyer' ? 'bg-indigo-100 text-indigo-700' : 
                                                        formData.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {formData.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                                Upload a professional photo to build trust.
                                                <br /><span className="text-xs text-gray-400">Supported: JPG, PNG • Max 5MB</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form Fields - Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" /> Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-500" /> Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                disabled
                                                value={formData.email}
                                                className="w-full px-4 py-3 bg-gray-100/50 border-0 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-blue-500" /> Phone Number
                                            </label>
                                            <input 
                                                type="tel" 
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Building className="w-4 h-4 text-blue-500" /> Organization
                                            </label>
                                            <input 
                                                type="text" 
                                                value={formData.company}
                                                onChange={e => setFormData({...formData, company: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                                                placeholder="Company Name (Optional)"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-blue-500" /> Address
                                            </label>
                                            <textarea 
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium resize-none"
                                                placeholder="Full street address..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons - Sticky Bottom (conceptually, though keeping in flow for now due to form submit) */}
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
