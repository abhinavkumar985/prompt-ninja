
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings, BookOpen, Wand2, Github, HelpCircle } from 'lucide-react'; // Added HelpCircle
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/playground', label: 'Playground', icon: Wand2 },
  { href: '/contribution-guide', label: 'Contribute', icon: BookOpen, highlight: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const GITHUB_REPO_URL = "https://github.com/FirebaseExtended/promptcraft"; // Keep this exported

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <LogoIcon className="h-8 w-8 text-primary" /> {/* Uses new primary color for logo */}
          <span>PromptNin</span>
        </Link>

        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              let itemClasses;
              // Active state uses primary-foreground on primary background
              if (isActive) {
                itemClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
              } 
              // Highlighted (Contribute) link when not active
              else if (item.highlight) {
                // Uses accent (link color) for text on secondary background for "Contribute"
                itemClasses = 'bg-secondary text-accent hover:bg-secondary/80';
              } 
              // Default links
              else {
                itemClasses = 'text-foreground hover:bg-secondary hover:text-accent';
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

          <Button asChild variant="default" className="ml-3 hidden md:inline-flex bg-secondary hover:bg-secondary/80 text-accent h-auto py-1.5 px-3">
            <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <nav className="grid gap-4 py-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <LogoIcon className="h-7 w-7 text-primary" />
                  <span>PromptNin</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  let mobileItemClasses;
                  if (isActive) {
                    mobileItemClasses = 'bg-primary text-primary-foreground';
                  } else if (item.highlight) {
                    mobileItemClasses = 'bg-secondary text-accent';
                  } else {
                    mobileItemClasses = 'text-foreground hover:bg-secondary hover:text-accent';
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
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary hover:text-accent"
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
