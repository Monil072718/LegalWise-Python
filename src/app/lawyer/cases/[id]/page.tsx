'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Upload, 
  File, 
  Calendar,
  X
} from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export default function CaseDetails() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    client: '', // Using this as client name for display/edit for now
    status: 'Open',
    stage: 'Initial',
    priority: 'Medium',
    nextHearing: '',
    description: ''
  });

  const [documents, setDocuments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isNew && id) {
      const fetchCase = async () => {
        try {
          const data = await api.getCase(id);
          setFormData({
            title: data.title,
            client: data.clientId, 
            status: data.status,
            stage: data.stage,
            priority: data.priority,
            nextHearing: data.nextHearing || '',
            description: data.description || ''
          });
          setDocuments(data.documents || []);
        } catch (err: any) {
          setError(err.message || 'Failed to load case');
          showToast(err.message || 'Failed to load case', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchCase();
    }
  }, [id, isNew]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isNew && !formData.title) {
        showToast("Please enter a Case Title before uploading files.", "error");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    setSaving(true);
    try {
      let targetId = id;
      
      if (isNew) {
         // Auto-create case if new
         const newCase = await api.createCase({
            ...formData,
            clientId: formData.client || 'client-1',
            lawyerId: 'lawyer-1',
            status: formData.status as any,
            priority: formData.priority as any,
            createdAt: new Date().toISOString().split('T')[0]
         });
         targetId = newCase.id;
      }

      const updatedCase = await api.uploadCaseDocument(targetId, file);
      setDocuments(updatedCase.documents);
      showToast('Document uploaded successfully', 'success');
      
      if (isNew) {
          router.replace(`/lawyer/cases/${targetId}`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Failed to upload: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
        await api.deleteCaseDocument(id, docId);
        setDocuments(prev => prev.filter(d => d.id !== docId));
        showToast('Document deleted successfully', 'success');
    } catch (err: any) {
        console.error(err);
        showToast('Failed to delete document', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isNew) {
         // Auto-create case if new
         const token = sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken');
         let currentLawyerId = 'lawyer-1'; // Fallback
         if (token) {
             try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.id) currentLawyerId = payload.id;
             } catch (e) {
                 console.error("Error parsing token", e);
             }
         }

         const newCase = await api.createCase({
            ...formData,
            clientId: formData.client || 'client-1',
            lawyerId: currentLawyerId,
            status: formData.status as any,
            priority: formData.priority as any,
            createdAt: new Date().toISOString().split('T')[0]
         });
         showToast('New case created successfully', 'success');
         router.push(`/lawyer/cases/${newCase.id}`);
      } else {
        // Update logic
        await api.updateCase(id, {
          title: formData.title,
          status: formData.status as any,
          stage: formData.stage,
          priority: formData.priority as any,
          nextHearing: formData.nextHearing,
          description: formData.description
        });
        showToast('Case updated successfully', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save changes');
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading case details...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Link href="/lawyer/cases" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'New Case' : `Case ${formData.title}`}
            </h1>
        </div>
        <div className="flex gap-2">
            {!isNew && (
            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
            </button>
            )}
            <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Form */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Case Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Hearing Date</label>
                <div className="relative">
                    <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                    type="date"
                    value={formData.nextHearing}
                    onChange={(e) => setFormData({...formData, nextHearing: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <CustomSelect
                    value={formData.status}
                    onChange={(val) => setFormData({...formData, status: val})}
                    options={[
                      { label: 'Open', value: 'Open' },
                      { label: 'In Progress', value: 'In Progress' },
                      { label: 'Review', value: 'Review' },
                      { label: 'Won', value: 'Won' },
                      { label: 'Lost', value: 'Lost' },
                      { label: 'Closed', value: 'Closed' }
                    ]}
                    variant="default"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stage</label>
                <CustomSelect
                    value={formData.stage}
                    onChange={(val) => setFormData({...formData, stage: val})}
                    options={[
                      { label: 'Initial', value: 'Initial' },
                      { label: 'Discovery', value: 'Discovery' },
                      { label: 'Pre-Trial', value: 'Pre-Trial' },
                      { label: 'Trial', value: 'Trial' },
                      { label: 'Settlement', value: 'Settlement' }
                    ]}
                    variant="default"
                />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <CustomSelect
                    value={formData.priority}
                    onChange={(val) => setFormData({...formData, priority: val})}
                    options={[
                      { label: 'High', value: 'High' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'Low', value: 'Low' }
                    ]}
                    variant="default"
                />
                </div>
                
                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description & Notes</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
            </div>
            </div>
        </div>

        {/* Sidebar: Documents & Timeline */}
        <div className="space-y-6">
            {/* Document Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Case Files</h2>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Upload Document"
                >
                    <Upload className="w-4 h-4" />
                </button>
            </div>
            
            <div className="space-y-3">
                {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                    <a href={api.getCaseDocumentUrl(id, doc.name)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden flex-1 hover:text-blue-600">
                    <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size} • {doc.uploadedAt || doc.uploaded}</p>
                    </div>
                    </a>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                    </button>
                </div>
                ))}
              {documents.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No documents uploaded
                </div>
              )}
            </div>
          </div>

          {/* Timeline Placeholder - can be expanded later */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Timeline</h2>
             <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-900 font-medium">Case Updated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-300 rounded-full"></div>
                  <p className="text-sm text-gray-900 font-medium">Document Uploaded</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
