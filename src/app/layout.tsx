
import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster";
import { MainLayoutClientWrapper } from '@/components/MainLayoutClientWrapper';

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
  title: 'PromptNin - AI Prompt Engineering Tool',
  description: 'PromptNin is a developer tool that helps engineers generate high-quality prompts for AI code assistants (like Copilot, Gemini, etc.) using structured techniques. This also allow user to paste their code and get the complete prompt based on configuration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable} dark`} suppressHydrationWarning={true}>
      <head>
        {/* Changed to Material Icons (filled) from Material Icons Outlined */}
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </head>
      <body className={`min-h-screen flex flex-col antialiased font-sans`} suppressHydrationWarning={true}>
        <MainLayoutClientWrapper>
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </MainLayoutClientWrapper>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
