import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LegalWise Admin',
  description: 'LegalWise Administration Dashboard',
};

import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
