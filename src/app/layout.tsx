import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";

// GeistSans and GeistMono are objects, not functions to be called.
// Their .variable properties provide the CSS variable names.

export const metadata: Metadata = {
  title: 'PromptNin - AI Prompt Generation Tool',
  description: 'PromptNin helps developers generate high-quality prompts for AI code assistants using structured techniques. Paste your code and configure strategies to get the perfect prompt.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
