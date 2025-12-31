'use client';
import { useState } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';

export default function BookInventory() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    Book Inventory
                </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" />
                    Add New Book
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search books..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="p-8 text-center text-gray-500">
                    <p>Book management functionality coming soon...</p>
                </div>
            </div>
        </div>
    );
}
