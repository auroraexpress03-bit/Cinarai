import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CINARAI',
  description:
    'CINARAI - Critical Numeracy with AR & AI. Platform pembelajaran numerasi berbasis etnomatematika untuk siswa Sekolah Dasar Indonesia.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactNode {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
