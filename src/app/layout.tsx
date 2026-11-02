import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { AgeGateModal } from '@/components/layout/AgeGateModal';

export const metadata: Metadata = {
  title: 'Velora Live — Premium Adult Live Streaming Experience',
  description: 'Experience next-generation adult live streaming on Velora Live. Watch interactive shows, support your favorite verified creators with tokens, and enjoy private 1-on-1 sessions in 1080p60.',
  keywords: ['live streaming', 'adult entertainment', 'interactive broadcasting', 'verified creators', 'velora live'],
  authors: [{ name: 'Velora Live Platform' }],
  openGraph: {
    title: 'Velora Live — Premium Adult Live Streaming',
    description: 'Next-generation interactive adult live broadcasting platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#08080c] text-zinc-100 selection:bg-purple-600 selection:text-white">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <AgeGateModal />
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
