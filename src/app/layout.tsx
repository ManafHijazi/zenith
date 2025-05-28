import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Zenith',
  description: 'Zenith Services',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${raleway.variable} antialiased`}>
        <div className='w-full flex justify-center overflow-hidden'>{children}</div>
      </body>
    </html>
  );
}
