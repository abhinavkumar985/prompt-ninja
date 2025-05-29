
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/icons/LogoIcon'; // Using the updated LogoIcon
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const GITHUB_REPO_URL = "https://github.com/FirebaseExtended/promptcraft";

const navItems = [
  { href: '/playground', label: 'Playground' },
  { href: '/strategy-library', label: 'Library' },
  { href: '/contribution-guide', label: 'Contribute' },
  { href: '/settings', label: 'Settings' }, // Keeping settings as it's a core app feature
];

const GithubIconSvg = () => ( // SVG from mockup
  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
    <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
  </svg>
);


export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-background/80 px-6 py-4 backdrop-blur-md sm:px-10">
      <Link href="/" className="flex items-center gap-3 text-white">
        <div className="size-6 text-primary"> {/* text-primary for #dce8f3 */}
          <LogoIcon /> {/* Using the same logo as contribution page */}
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-primary">PromptNin</h2>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary font-semibold" : "text-secondary-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          className="flex items-center justify-center rounded-lg h-9 w-9 bg-secondary text-primary hover:bg-secondary/80 transition-colors"
        >
          <GithubIconSvg />
        </Link>

        <div className="relative h-9 w-9">
          <Image
            src="https://placehold.co/36x36.png" // Placeholder avatar
            alt="User avatar"
            layout="fill"
            objectFit="cover"
            data-ai-hint="avatar user"
            className="rounded-full border-2 border-secondary group-hover:border-primary transition-colors"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[250px]">
              <nav className="grid gap-4 py-6">
                <Link href="/" className="flex items-center gap-3 text-primary mb-4 px-3">
                  <div className="size-6">
                    <LogoIcon />
                  </div>
                  <span className="text-lg font-bold">PromptNin</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary font-semibold" : "text-secondary-foreground hover:bg-secondary/80 hover:text-primary"
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary/80 hover:text-primary"
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
