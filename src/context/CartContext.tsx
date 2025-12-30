"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';

export interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('legalwise_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('legalwise_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (book: Book) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === book.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...book, quantity: 1 }];
    });
  };

  const removeItem = (bookId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity < 1) {
        removeItem(bookId);
        return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
