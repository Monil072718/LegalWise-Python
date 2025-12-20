"use client";

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, RefreshCw, Download, Filter, Eye, CheckCircle, XCircle, AlertTriangle, Plus } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Payment } from '../../types';
import { api } from '../../services/api';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function BillingPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  
  interface InvoiceFormState {
    clientName: string;
    type: Payment['type'];
    amount: string;
    description: string;
  }

  const [clients, setClients] = useState<any[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormState>({
      clientName: '',
      type: 'consultation',
      amount: '',
      description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, revenueRes, methodsRes, clientsRes] = await Promise.all([
          api.get<Payment[]>('/payments'),
          api.get<any[]>('/analytics/revenue-breakdown'),
          api.get<any[]>('/analytics/payment-methods'),
          api.getClients()
        ]);
        setPayments(paymentsData);
        setRevenueData(revenueRes);
        setPaymentMethodData(methodsRes);
        setClients(clientsRes);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  const filteredPayments = payments.filter(payment => {
    const matchesStatus = selectedFilter === 'all' || payment.status === selectedFilter;
    const matchesType = selectedType === 'all' || payment.type === selectedType;
    return matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'failed': return <XCircle className="w-3 h-3 mr-1" />;
      case 'pending': return <AlertTriangle className="w-3 h-3 mr-1" />;
      case 'refunded': return <RefreshCw className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const platformRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.platformFee, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  const handleProcessRefund = (paymentId: string) => {
    console.log('Processing refund for payment:', paymentId);
    setShowRefundModal(false);
  };

  const handleGenerateInvoice = async () => {
    try {
        const amount = parseFloat(invoiceData.amount);
        if(!amount || !invoiceData.clientName) {
            alert("Please fill all fields");
            return;
        }

        const newPayment: Partial<Payment> = {
            clientName: invoiceData.clientName,
            amount: amount,
            type: invoiceData.type,
            status: 'pending',
            date: new Date().toISOString(),
            platformFee: amount * 0.1 // 10% fee
        };

        const created = await api.createPayment(newPayment);
        setPayments([created, ...payments]);
        setShowInvoiceModal(false);
        setInvoiceData({
            clientName: '',
            type: 'consultation',
            amount: '',
            description: ''
        });
        alert('Invoice generated successfully');

    } catch (error) {
        console.error("Failed to generate invoice", error);
        alert("Failed to generate invoice");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowInvoiceModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% this month
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-blue-600">${platformRevenue.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">10% commission rate</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              <p className="text-sm text-yellow-600 mt-1">Awaiting processing</p>
            </div>
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Payments</p>
              <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
              <p className="text-sm text-red-600 mt-1">Require attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name === 'platform' ? 'Platform Fee' : 'Lawyer Earnings']} />
              <Bar dataKey="platform" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lawyers" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Total Revenue']} />
              <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethodData.map((method, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{method.method}</h4>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">${method.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{method.percentage}% of total payments</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <CustomSelect
              value={selectedFilter}
              onChange={setSelectedFilter}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Completed', value: 'completed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Failed', value: 'failed' },
                { label: 'Refunded', value: 'refunded' }
              ]}
              variant="default"
            />
          </div>
          
          <CustomSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Consultation', value: 'consultation' },
              { label: 'Case', value: 'case' },
              { label: 'Book', value: 'book' },
              { label: 'Commission', value: 'commission' }
            ]}
            variant="default"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500 mt-1">Monitor all platform payments and transactions</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPayments.length} transactions
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Transaction ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Lawyer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Platform Fee</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-gray-600">#{payment.id.padStart(6, '0')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{payment.clientName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {payment.lawyerName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {payment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">${payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-600">${payment.platformFee.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowInvoiceModal(true)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => setShowRefundModal(true)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          title="Process refund"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status === 'failed' && (
                        <button
                          className="p-1 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                          title="Retry payment"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Stripe</h4>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Primary payment processor</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee:</span>
                <span className="text-gray-900">2.9% + $0.30</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">PayPal</h4>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Secondary payment option</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-yellow-600 font-medium">Pending</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee:</span>
                <span className="text-gray-900">3.5% + $0.49</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Bank Transfer</h4>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Direct bank transfers</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee:</span>
                <span className="text-gray-900">$5.00 flat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Generation Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generate Invoice</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <CustomSelect
                  value={invoiceData.clientName}
                  onChange={(val) => setInvoiceData({...invoiceData, clientName: val})}
                  options={clients.map(c => c.name)}
                  variant="default"
                  placeholder="Select Client"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <CustomSelect
                  value={invoiceData.type}
                  onChange={(val) => setInvoiceData({...invoiceData, type: val as Payment['type']})}
                  options={[
                    { label: 'Consultation', value: 'consultation' },
                    { label: 'Case Handling', value: 'case' },
                    { label: 'Document Review', value: 'document' }
                  ]}
                  variant="default"
                  placeholder="Select Type"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={invoiceData.amount}
                  onChange={(e) => setInvoiceData({...invoiceData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Invoice description"
                  value={invoiceData.description}
                  onChange={(e) => setInvoiceData({...invoiceData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Process Refund</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    This action will process a refund and cannot be undone.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <CustomSelect
                   value="Client Request"
                   onChange={() => {}}
                   options={['Client Request', 'Service Issue', 'Billing Error', 'Other']}
                   variant="default"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional notes for refund"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcessRefund('selected')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Process Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
