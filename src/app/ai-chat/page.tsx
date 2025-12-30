"use client";

import { useState } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { Send, Bot, User } from 'lucide-react';

export default function AIChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
      {role: 'bot', content: "Hello! I'm your LegalWise AI Assistant. I can help answer general legal questions or guide you to the right lawyer. How can I help you today?"}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, {role: 'user', content: userMessage}]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
        setMessages(prev => [...prev, {
            role: 'bot', 
            content: "Thank you for your question. While I can provide general information, for specific legal advice regarding your situation, I recommend consulting with one of our qualified lawyers. You can browse our directory in the 'Find Lawyers' section."
        }]);
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      <main className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-2">LegalWise AI Assistant</h1>
            <p className="text-blue-100">Get instant answers to common legal questions</p>
            </div>
        </div>

        <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                    {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                </div>
                                <div className={`p-4 rounded-xl ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div className="bg-gray-100 p-4 rounded-xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <form onSubmit={handleSend} className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your legal question here..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Send
                        </button>
                    </form>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        AI can make mistakes. Please verify important information with a qualified lawyer.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
