"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    bookId: string;
    title: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.getOrderHistory();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                // Optionally redirect to login if unauthorized
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <PublicHeader />
                <div className="flex justify-center items-center h-screen pt-20">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <PublicHeader />
            <main className="pt-28 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                        <Package className="w-8 h-8 text-blue-600" /> Order History
                    </h1>

                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                                <p className="text-gray-500">You haven't purchased any items yet.</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                                            <p className="font-mono text-sm font-medium">{order.id}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date</p>
                                                <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                                <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                     order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                 }`}>
                                                     {order.status}
                                                 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 font-bold">
                                                        {item.quantity}x
                                                    </div>
                                                    <span className="font-medium text-gray-900">{item.title}</span>
                                                </div>
                                                <span className="font-bold text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    );
}
