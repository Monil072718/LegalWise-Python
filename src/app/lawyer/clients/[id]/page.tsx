'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Clock, 
  Download,
  MoreHorizontal
} from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ClientDetails() {
  const params = useParams();
  const id = params.id as string;

  // Mock data
  const client = {
    id: id,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Maple Street, Springfield, IL",
    status: "Active",
    joinDate: "Jan 15, 2024",
    avatar: null
  };

  const cases = [
    { id: "101", title: "Property Dispute vs. State", status: "In Progress", type: "Civil", lastUpdate: "Yesterday" },
    { id: "102", title: "Contract Review - TechCorp", status: "Closed", type: "Corporate", lastUpdate: "Last month" },
  ];

  const documents = [
    { id: "d1", name: "Initial Statement.pdf", type: "PDF", size: "2.4 MB", date: "Jan 16, 2024" },
    { id: "d2", name: "Property Deed.jpg", type: "Image", size: "4.1 MB", date: "Jan 20, 2024" },
    { id: "d3", name: "Settlement Offer.docx", type: "Word", size: "1.2 MB", date: "Feb 05, 2024" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Link href="/lawyer/clients" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Clients
      </Link>

      {/* Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-500">Client ID: #{client.id}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Message
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{client.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Case History</h2>
            <button className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-200">
            {cases.map((c) => (
              <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{c.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{c.type}</span>
                      <span>•</span>
                      <span>Updated {c.lastUpdate}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  c.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
            {cases.length === 0 && (
              <div className="p-6 text-center text-gray-500">No cases found</div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Documents</h2>
            <button className="text-sm text-blue-600 hover:underline">Upload New</button>
          </div>
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
