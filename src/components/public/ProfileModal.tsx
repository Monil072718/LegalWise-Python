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
                                {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Edit Profile</h2>
                                    <p className="text-sm text-gray-500 font-medium">Update your public information</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                               {/* Decorative Banner */}
                               <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 w-full relative overflow-hidden">
                                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                   <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                   <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                               </div>

                               <div className="px-8 pb-8">
                                   <style jsx global>{`
                                        .custom-scrollbar::-webkit-scrollbar {
                                            width: 6px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-track {
                                            background: transparent;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb {
                                            background-color: #cbd5e1;
                                            border-radius: 20px;
                                        }
                                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                            background-color: #94a3b8;
                                        }
                                    `}</style>
        
                                    {loading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-8 -mt-12 relative z-10">
                                            {/* Avatar Section */}
                                            <div className="flex flex-col sm:flex-row items-end sm:items-end gap-6">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-full bg-white p-1 shadow-2xl ring-1 ring-gray-100">
                                                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 relative">
                                                            {formData.avatar ? (
                                                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                                    <User className="w-12 h-12" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                                <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <label className="absolute bottom-1 right-1 p-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-500 hover:scale-110 transition-all shadow-lg shadow-blue-500/30 border-2 border-white">
                                                        <Camera className="w-4 h-4" />
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            onChange={handleImageUpload}
                                                        />
                                                    </label>
                                                </div>
                                                
                                                <div className="pb-2 text-center sm:text-left">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                                                            formData.role === 'lawyer' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
                                                            formData.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        }`}>
                                                            {formData.role} Account
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm font-medium">
                                                        Click the camera icon to update your photo.
                                                    </p>
                                                </div>
                                            </div>
        
                                            {/* Form Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                                {[
                                                    { label: 'Full Name', icon: User, value: formData.name, key: 'name', type: 'text', required: true, placeholder: 'e.g. John Doe' },
                                                    { label: 'Email Address', icon: Mail, value: formData.email, key: 'email', type: 'email', disabled: true, placeholder: '' },
                                                    { label: 'Phone Number', icon: Phone, value: formData.phone, key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                                                    { label: 'Organization', icon: Building, value: formData.company, key: 'company', type: 'text', placeholder: 'Company Name' },
                                                ].map((field) => (
                                                    <div key={field.key} className="space-y-2 group">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                                                            <field.icon className="w-4 h-4" /> {field.label}
                                                        </label>
                                                        <input 
                                                            type={field.type}
                                                            required={field.required}
                                                            disabled={field.disabled}
                                                            value={field.value as string}
                                                            onChange={e => field.disabled ? null : setFormData({...formData, [field.key]: e.target.value})}
                                                            className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300 outline-none font-medium ${
                                                                field.disabled 
                                                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                                                                    : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300'
                                                            }`}
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                ))}
        
                                                <div className="space-y-2 md:col-span-2 group">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
                                                        <MapPin className="w-4 h-4" /> Address
                                                    </label>
                                                    <textarea 
                                                        value={formData.address}
                                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-blue-300 transition-all duration-300 outline-none font-medium resize-none min-h-[100px]"
                                                        placeholder="Enter your full street address..."
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
                        </div>
                    </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
