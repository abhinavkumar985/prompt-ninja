
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings, BookOpen, Wand2, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/playground', label: 'Playground', icon: Wand2 },
  { href: '/contribution-guide', label: 'Contribute', icon: BookOpen, highlight: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// Determine this URL from your project's GitHub repository
const GITHUB_REPO_URL = "https://github.com/FirebaseExtended/promptcraft";


export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <LogoIcon className="h-7 w-7" />
          <span>PromptNin</span>
        </Link>

        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              let itemClasses;
              if (isActive) {
                itemClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
              } else if (item.highlight) {
                itemClasses = 'bg-accent text-accent-foreground hover:bg-accent/80';
              } else {
                itemClasses = 'text-foreground hover:bg-accent hover:text-accent-foreground';
              }
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  asChild
                  className={cn(
                    "text-sm font-medium h-auto py-1.5 px-3",
                    itemClasses
                  )}
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4 md:hidden lg:inline-block" />}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <Button asChild variant="default" className="ml-3 hidden md:inline-flex bg-slate-800 hover:bg-slate-700 text-white h-auto py-1.5 px-3">
            <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-4 py-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <LogoIcon className="h-7 w-7" />
                  <span>PromptNin</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  let mobileItemClasses;
                  if (isActive) {
                    mobileItemClasses = 'bg-primary text-primary-foreground';
                  } else if (item.highlight) {
                    mobileItemClasses = 'bg-accent text-accent-foreground';
                  } else {
                    mobileItemClasses = 'text-foreground hover:bg-accent hover:text-accent-foreground';
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium",
                        mobileItemClasses
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
