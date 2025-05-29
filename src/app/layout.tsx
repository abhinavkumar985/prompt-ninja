
import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";
// import { MainLayoutClientWrapper } from '@/components/MainLayoutClientWrapper'; // No longer needed

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PromptNin - Prompt Like a Pro', // Updated title from mockup
  description: 'Generate superior prompts for AI code assistants, instantly and securely, right in your browser.', // Updated description from mockup
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable} dark`} suppressHydrationWarning={true}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <body className={`gradient-bg font-sans antialiased`} suppressHydrationWarning={true}>
        <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
          <Header /> {/* Header is now always rendered */}
          <div className="layout-container flex h-full grow flex-col">
            {/* Main content padding will be handled by individual page.tsx files or a main wrapper if needed */}
            {children}
          </div>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  );
}
