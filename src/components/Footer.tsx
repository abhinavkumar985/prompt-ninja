
import Link from 'next/link';
import { GITHUB_REPO_URL } from './Header';

const footerNavItems = [
  { href: '/playground', label: 'Playground' },
  { href: '/contribution-guide', label: 'Contribute' },
  { href: GITHUB_REPO_URL, label: 'GitHub', target: '_blank' },
  { href: 'https://x.com/abhinav985', label: 'X (Twitter)', target: '_blank' }, // Placeholder for Twitter, you can update this URL
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-solid border-border bg-background px-6 py-10 text-center sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {footerNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground-darker">
          &copy; {currentYear} PromptNin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
