// src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Navbar } from '../components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'CardioPredict - Cardiovascular Risk Assessment',
  description:
    'AI-powered cardiovascular risk prediction and analysis platform for healthcare professionals',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${poppins.variable} font-sans bg-background text-text-primary antialiased`}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen pt-4 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                {children}
              </main>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
