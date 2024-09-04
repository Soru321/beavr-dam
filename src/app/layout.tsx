import type { Metadata } from "next";
import './globals.css';

import { Inter } from 'next/font/google';

import SessionProvider from '@/providers/session-provider';
import ToastProvider from '@/providers/toast-provider';
import TrpcProvider from '@/providers/trpc-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beavr Dam",
  description: "Protecting Doorsteps One Flood at a Time!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <TrpcProvider>
            <ToastProvider />
            {children}
          </TrpcProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
