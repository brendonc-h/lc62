import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'La Casita',
  description: 'Authentic Mexican Restaurant - Order Online',
  icons: {
    icon: '/lacasitalogo.jpg',
    shortcut: '/lacasitalogo.jpg',
    apple: '/lacasitalogo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script 
          type="text/javascript" 
          src="https://sandbox.web.squarecdn.com/v1/square.js"
          async
        ></script>
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
