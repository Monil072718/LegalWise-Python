"use client";

import { useCart } from '../../../context/CartContext';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { showToast } = useToast();

  const handleCheckout = async () => {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
        // Redirect to login if not authenticated
        router.push('/user/login?redirect=/user/cart');
        return;
    }

    if (!shippingAddress.trim()) {
        showToast("Please enter a shipping address", "error");
        return;
    }

    setIsProcessing(true);
    try {
        await api.createOrder({
            items: items.map(item => ({
                bookId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: totalAmount,
            shippingAddress,
            paymentMethod
        });
        clearCart();
        router.push('/user/orders');
    } catch (error) {
        console.error("Checkout failed", error);
        alert("Checkout failed. Please try again."); // Using alert for simplicity, could use Toast
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <PublicHeader />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-blue-600" /> Shopping Cart
            </h1>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any legal resources yet.</p>
                    <Link href="/books" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                        Browse Books
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                <div className="w-20 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                     {item.cover_image ? (
                                         <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                                     ) : (
                                         <span className="text-xs text-gray-400">No Img</span>
                                     )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{item.author}</p>
                                    <div className="font-bold text-blue-600">${item.price}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded font-bold text-gray-600 shadow-sm"
                                        >-</button>
                                        <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-6 h-6 flex items-center justify-center hover:bg-white rounded font-bold text-gray-600 shadow-sm"
                                        >+</button>
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Checkout Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-28">
                            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    rows={3}
                                    placeholder="Enter your full address..."
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <h3 className="font-bold text-lg mb-4 mt-6">Payment Method</h3>
                            <div className="space-y-2 mb-6">
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="card" 
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="font-medium text-gray-800">Credit / Debit Card</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="paypal" 
                                        checked={paymentMethod === 'paypal'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="font-medium text-gray-800">PayPal</span>
                                </label>
                            </div>

                            <hr className="my-6 border-gray-100" />
                            
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    'Processing...' 
                                ) : (
                                    <>Pay ${totalAmount.toFixed(2)} <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
