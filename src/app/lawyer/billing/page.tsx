'use client';

import { DollarSign, Download, Clock } from 'lucide-react';

export default function LawyerBilling() {
  const invoices = [
    { id: "INV-2024-001", client: "Alice Johnson", amount: "$450.00", date: "Jan 15, 2024", status: "Paid" },
    { id: "INV-2024-002", client: "Robert Smith", amount: "$1,200.00", date: "Jan 10, 2024", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <button 
          onClick={() => alert("Invoice generation started... (Feature coming soon)")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Generate Invoice
        </button>
      </div>

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
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Invoices</h2>
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
            {invoices.map((inv) => (
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
                  <button className="text-gray-400 hover:text-blue-600"><Download className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
