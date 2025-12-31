"use client";

import { useCart } from '../../../context/CartContext';
import PublicHeader from '../../../components/public/PublicHeader';
import PublicFooter from '../../../components/public/PublicFooter';
import { Trash2, ArrowRight, ShoppingBag, Lock, CreditCard, Wallet, Banknote, User, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // User Details
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Address Details
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');

  const { showToast } = useToast();

  const handleCheckout = async () => {
    const token = sessionStorage.getItem('userToken');
    if (!token) {
        router.push('/user/login?redirect=/user/cart');
        return;
    }

    if (!fullName.trim() || !phoneNumber.trim()) {
        showToast("Please enter your contact details", "error");
        return;
    }

    if (!addressLine1.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
        showToast("Please enter a complete shipping address", "error");
        return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVC || !cardName)) {
         showToast("Please enter valid card details", "error");
         return;
    }

    // Construct full address string for backend
    const shippingAddress = `${addressLine1}, ${city}, ${state} ${zipCode}`;

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
            paymentMethod,
            fullName,
            phoneNumber
        });
        clearCart();
        router.push('/user/orders');
    } catch (error) {
        console.error("Checkout failed", error);
        showToast("Checkout failed. Please try again.", "error"); 
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
                    {/* Left Column: Items + Checkout Form */}
                    <div className="lg:col-span-2">
                        {/* Cart Items */}
                        <div className="space-y-4">
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

                            {/* Checkout Details Form (Left Column) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
                            
                            {/* Step 1: Contact Information */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-md">1</span>
                                    Contact Information
                                </h2>
                                <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="+1 (555) 000-0000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Delivery Details */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-md">2</span>
                                    Delivery Details
                                </h2>
                                <div className="ml-11 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="123 Main St, Apt 4B"
                                                value={addressLine1}
                                                onChange={(e) => setAddressLine1(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="New York"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="NY"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all"
                                                placeholder="10001"
                                                value={zipCode}
                                                onChange={(e) => setZipCode(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Payment */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                     <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-md">3</span>
                                    Payment Method
                                </h2>
                                <div className="ml-11">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            paymentMethod === 'card' 
                                            ? 'border-black bg-gray-50 shadow-md' 
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-900 text-sm">Credit Card</span>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    paymentMethod === 'card' ? 'border-black' : 'border-gray-300'
                                                }`}>
                                                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                </div>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-gray-400 mt-1" />
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="card" 
                                                checked={paymentMethod === 'card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only" 
                                            />
                                        </label>

                                        <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            paymentMethod === 'paypal' 
                                            ? 'border-black bg-gray-50 shadow-md' 
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-900 text-sm">PayPal</span>
                                                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    paymentMethod === 'paypal' ? 'border-black' : 'border-gray-300'
                                                }`}>
                                                    {paymentMethod === 'paypal' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                </div>
                                            </div>
                                            <Wallet className="w-6 h-6 text-gray-400 mt-1" />
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="paypal" 
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only" 
                                            />
                                        </label>

                                        <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            paymentMethod === 'cod' 
                                            ? 'border-black bg-gray-50 shadow-md' 
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                                        }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-900 text-sm whitespace-nowrap">Cash on Delivery</span>
                                                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'
                                                }`}>
                                                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-black" />}
                                                </div>
                                            </div>
                                            <Banknote className="w-6 h-6 text-gray-400 mt-1" />
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="cod" 
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="sr-only" 
                                            />
                                        </label>
                                    </div>

                                    {/* Card Details Form (Conditional) */}
                                    {paymentMethod === 'card' && (
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                            placeholder="0000 0000 0000 0000"
                                                            value={cardNumber}
                                                            onChange={(e) => setCardNumber(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                            placeholder="MM/YY"
                                                            value={cardExpiry}
                                                            onChange={(e) => setCardExpiry(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVC</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                                placeholder="123"
                                                                value={cardCVC}
                                                                onChange={(e) => setCardCVC(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cardholder Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                                        placeholder="Name on card"
                                                        value={cardName}
                                                        onChange={(e) => setCardName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary (Right Column - Sticky) */}    
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                        <h3 className="font-bold text-lg mb-6 text-gray-900 border-b pb-4">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (0%)</span>
                                <span className="font-medium text-gray-900">$0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-sm">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                             <div className="flex justify-between items-end">
                                <span className="font-bold text-lg text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">${totalAmount.toFixed(2)}</span>
                                    <p className="text-xs text-gray-400 font-medium">USD</p>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] duration-200"
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <>Pay Now <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                        
                        <div className="mt-6 pt-4 border-t border-gray-50">
                             <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                                <Lock className="w-3.5 h-3.5" /> 
                                <span>Secure Encrypted Payment</span>
                            </p>
                        </div>
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
