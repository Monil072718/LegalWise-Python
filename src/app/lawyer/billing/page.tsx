'use client';

import { useState } from 'react';
import { Download, Clock, X, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LawyerBilling() {
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: '',
    description: 'Legal Services'
  });

  const invoices = [
    { id: "INV-2024-001", client: "Alice Johnson", amount: "$450.00", date: "Jan 15, 2024", status: "Paid" },
    { id: "INV-2024-002", client: "Robert Smith", amount: "$1,200.00", date: "Jan 10, 2024", status: "Pending" },
  ];

  const generatePDF = (data: { id: string, client: string, amount: string, description: string, date: string, status: string }) => {
     const doc = new jsPDF();

    // Header logic
    doc.setFontSize(22);
    doc.setTextColor(41, 98, 255); // Blue color
    doc.text('LegalWise Invoice', 15, 20);

    // Invoice Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #: ${data.id}`, 15, 30);
    doc.text(`Date: ${data.date}`, 15, 35);

    // Bill To
    doc.text('Bill To:', 15, 45);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(data.client, 15, 52);

    // Table
    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Amount']],
      body: [
        [data.description, data.amount]
      ],
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;

    // Total
    doc.setFontSize(12);
    doc.text(`Total Due: ${data.amount}`, 140, finalY + 10);
    
    if (data.status === 'Paid') {
        doc.setFontSize(20);
        doc.setTextColor(0, 128, 0); // Green
        doc.text('PAID', 150, finalY + 25);
    } else {
        doc.setFontSize(20);
        doc.setTextColor(255, 165, 0); // Orange
        doc.text('PENDING', 140, finalY + 25);
    }

    doc.save(`${data.id}.pdf`);
  };

  const handleDownloadExisting = (invoice: typeof invoices[0]) => {
    if (invoice.status !== 'Paid') {
      alert('Invoice can only be generated for "Paid" transactions.');
      return;
    }
    generatePDF({
        ...invoice,
        description: 'Legal Consultation / Services'
    });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate ID and Date
      const id = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
      const date = new Date().toLocaleDateString();
      
      generatePDF({
          id,
          client: newInvoice.client,
          amount: `$${newInvoice.amount}`, // Adding currency symbol for display consistency
          description: newInvoice.description,
          date,
          status: 'Pending' // Default for manual creation? Or let them choose? Assuming Pending/New.
          // User asked "if status is paid then only it will generate invoice" for the row button.
          // For NEW invoice, it's likely a bill to be sent, so it might not be paid yet. 
          // But I'll leave status as 'Pending' or just hide status watermark if new.
          // Let's assume manual generation is for Sending an invoice, so status is NOT paid usually.
          // But wait, user said "if status is paid then only it will generate invoice".
          // If this top button is for creating a NEW invoice to SEND to a client, it shouldn't be Paid yet.
          // I will generate it without the PAID watermark if it's new/pending.
      });
      setShowModal(false);
      setNewInvoice({ client: '', amount: '', description: 'Legal Services' });
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredInvoices = invoices.filter(inv => {
      const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      {/* Stats Cards ... (Keep existing code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-sm font-medium text-gray-600">Total Revenue (Month)</p>
           <p className="text-3xl font-bold text-gray-900 mt-2">$8,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-sm font-medium text-gray-600">Pending Payments</p>
           <p className="text-3xl font-bold text-yellow-600 mt-2">$1,200.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-sm font-medium text-gray-600">Billable Hours</p>
           <div className="flex items-center gap-2 mt-2">
             <Clock className="w-6 h-6 text-blue-600" />
             <p className="text-3xl font-bold text-gray-900">124 hrs</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                 <input 
                     type="text" 
                     placeholder="Search invoices..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 />
             </div>
             <div className="relative">
                <button 
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`px-4 py-2 border rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors ${statusFilter !== 'All' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700'}`}
                >
                    {statusFilter === 'All' ? 'Filter' : statusFilter}
                </button>
                {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-fade-in-up">
                        {['All', 'Paid', 'Pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status);
                                    setShowFilterDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                <td className="px-6 py-4">{inv.client}</td>
                <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                <td className="px-6 py-4 font-medium">{inv.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDownloadExisting(inv)}
                    className="text-gray-400 hover:text-blue-600"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in-up border border-gray-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">New Invoice</h3>
                        <p className="text-sm text-gray-500">Create and generate a PDF invoice</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleCreateInvoice} className="flex flex-col md:flex-row h-full max-h-[80vh]">
                    {/* Left Side: Input Form */}
                    <div className="w-full md:w-1/3 p-6 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Invoice Details</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Client Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                    placeholder="Enter client name"
                                    value={newInvoice.client}
                                    onChange={(e) => setNewInvoice({...newInvoice, client: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Amount ($)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                    placeholder="0.00"
                                    value={newInvoice.amount}
                                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                                    placeholder="Enter service details..."
                                    value={newInvoice.description}
                                    onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                             <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>

                     {/* Right Side: Live Preview */}
                    <div className="w-full md:w-2/3 p-8 bg-white overflow-y-auto">
                        <div className="border border-gray-200 shadow-sm p-8 min-h-[500px] flex flex-col relative">
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                <span className="text-9xl font-bold uppercase rotate-45 transform">DRAFT</span>
                            </div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
                                    <p className="text-sm text-gray-500 mt-1">#{`INV-${new Date().getFullYear()}-XXXX`}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-gray-900">LegalWise Inc.</div>
                                    <div className="text-sm text-gray-500 mt-1">123 Legal Avenue</div>
                                    <div className="text-sm text-gray-500">New York, NY 10001</div>
                                </div>
                            </div>

                            {/* Bill To */}
                            <div className="mb-12">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</div>
                                <div className="text-lg font-medium text-gray-900 break-words">
                                    {newInvoice.client || <span className="text-gray-300 italic">Client Name...</span>}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</div>
                            </div>

                            {/* Line Items */}
                            <div className="flex-1">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100">
                                            <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-3/4">Description</th>
                                            <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        <tr>
                                            <td className="py-4 text-sm text-gray-800 align-top whitespace-pre-wrap">
                                                {newInvoice.description || <span className="text-gray-300 italic">Service description...</span>}
                                            </td>
                                            <td className="py-4 text-right text-sm font-medium text-gray-900 align-top">
                                                {newInvoice.amount ? `$${parseFloat(newInvoice.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}` : '$0.00'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer / Total */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="flex justify-end items-center">
                                    <span className="text-sm font-medium text-gray-500 mr-8 uppercase tracking-wider">Total Due</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                         {newInvoice.amount ? `$${parseFloat(newInvoice.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}` : '$0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
