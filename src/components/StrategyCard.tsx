
import Link from 'next/link';
import Image from 'next/image';
import type { PromptStrategy } from '@/lib/prompt-strategies';

interface StrategyCardProps {
  strategy: PromptStrategy;
}

// Inline SVG for the Info Icon as it's simple and specific to this card design
const InfoIcon = () => (
  <svg fill="currentColor" height="16px" viewBox="0 0 256 256" width="16px" xmlns="http://www.w3.org/2000/svg">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
  </svg>
);

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <Link href={`/playground?strategy=${strategy.id}`} passHref legacyBehavior>
      <a className="strategy-card flex flex-col gap-3 p-4 bg-white rounded-xl border border-slate-200 cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        <div className="relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden bg-slate-100">
          <Image
            alt={`${strategy.name} Strategy illustration`}
            src={`https://placehold.co/600x400.png`} // Using a consistent placeholder
            data-ai-hint={strategy.imagePlaceholderKeywords}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className="info-icon absolute top-2 right-2 p-1.5 bg-slate-800/60 hover:bg-slate-800/80 rounded-full text-white transition-all"
            title={strategy.description} // Full description on hover
          >
            <InfoIcon />
          </div>
        </div>
        <div>
          <h3 className="text-slate-800 text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {strategy.name}
          </h3>
          <p className="text-slate-500 text-xs font-normal leading-normal mt-1">
            {strategy.shortDescription}
          </p>
        </div>
      </a>
    </Link>
  );
}
