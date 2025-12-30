"use client";

import { useState } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AIChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
      {role: 'bot', content: "Hello! I'm your AI Legal Assistant. I can clarify legal terms, guide you to the right specialist, or answer general questions. How can I assist you today?"}
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

    // Simulated AI Logic with Legal Domain Restriction
    setTimeout(() => {
        const lowerInput = userMessage.toLowerCase();
        const legalKeywords = [
            "law", "legal", "court", "judge", "attorney", "lawyer", 
            "crime", "civil", "rights", "contract", "agreement", "sue", 
            "divorce", "custody", "property", "tenant", "landlord", 
            "eviction", "arrest", "police", "justice", "statute", 
            "regulation", "compliance", "fraud", "negligence", "injury", 
            "damages", "will", "trust", "estate", "patent", "copyright", 
            "trademark", "help", "advice", "case"
        ];

        const isLegalRelated = legalKeywords.some(keyword => lowerInput.includes(keyword));

        let botResponse = "";

        if (isLegalRelated) {
             botResponse = "I understand you're asking about a legal matter regarding '" + userMessage + "'. While I can provide general legal information, specific situations require professional counsel. I recommend using our 'Find Lawyer' page to connect with an expert in this field.";
        } else {
             botResponse = "I apologize, but I am programmed to assist only with legal and law-related inquiries. I cannot provide information on non-legal topics. Please ask a question related to law, rights, or legal procedures.";
        }

        setMessages(prev => [...prev, {
            role: 'bot', 
            content: botResponse
        }]);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <PublicHeader />
      <main className="flex-1 flex flex-col pt-20">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            
            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center gap-4 z-10 shadow-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-gray-900">Legal<span className="text-blue-600">AI</span> Assistant</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Online • Ready to help</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex items-end gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                                    msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-white text-blue-600 border border-gray-100'
                                }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`p-5 rounded-2xl shadow-sm leading-relaxed ${
                                    msg.role === 'user' 
                                        ? 'bg-gray-900 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    <p className="text-sm md:text-base">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="flex items-end gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 border border-gray-100 shadow-sm">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a legal question..."
                            className="w-full pl-6 pr-14 py-4 bg-gray-50 border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-gray-400 mt-3 font-medium uppercase tracking-wider">
                        AI output is for informational purposes only. Consult a lawyer for legal advice.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
