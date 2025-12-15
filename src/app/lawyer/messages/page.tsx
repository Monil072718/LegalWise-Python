'use client';

import { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

export default function LawyerMessages() {
  const [selectedChat, setSelectedChat] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");

  const chats = [
    { id: "1", name: "Alice Johnson", lastMessage: "Thank you for the update.", time: "10:30 AM", unread: 0, online: true },
    { id: "2", name: "Robert Smith", lastMessage: "When is the next hearing?", time: "Yesterday", unread: 2, online: false },
    { id: "3", name: "Sarah Williams", lastMessage: "I uploaded the documents.", time: "Jan 12", unread: 0, online: false },
  ];

  const messages = [
    { id: 1, sender: "me", text: "Hi Alice, I've reviewed your case documents.", time: "10:00 AM" },
    { id: 2, sender: "Alice Johnson", text: "Great! Do we need to meet?", time: "10:05 AM" },
    { id: 3, sender: "me", text: "Yes, a brief call would be good. How about tomorrow?", time: "10:15 AM" },
    { id: 4, sender: "Alice Johnson", text: "Thank you for the update.", time: "10:30 AM" },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-50 overflow-hidden">
      {/* Sidebar List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat === chat.id ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {chat.name.charAt(0)}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                    <p className={`text-sm truncate max-w-[150px] ${chat.unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{chat.time}</p>
                  {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full mt-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-gray-50`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <button className="md:hidden" onClick={() => setSelectedChat(null)}>
                   {/* Back Icon */}
                   &larr;
                 </button>
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    A
                 </div>
                 <div>
                   <h2 className="font-bold text-gray-900">Alice Johnson</h2>
                   <p className="text-xs text-green-600 flex items-center gap-1">
                     <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                   </p>
                 </div>
               </div>
               <div className="flex items-center gap-3 text-gray-500">
                 <button className="p-2 hover:bg-gray-100 rounded-full"><Phone className="w-5 h-5" /></button>
                 <button className="p-2 hover:bg-gray-100 rounded-full"><Video className="w-5 h-5" /></button>
                 <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'me' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
