
import Link from 'next/link';
import Image from 'next/image';
import type { PromptStrategy } from '@/lib/prompt-strategies';
import { Info } from 'lucide-react'; // Using Lucide for Info icon for consistency

// Removed inline SVG for InfoIcon, will use Lucide's Info

export function StrategyCard({ strategy }: PromptStrategyProps) {
  return (
    <Link href={`/playground?strategy=${strategy.id}`} passHref legacyBehavior>
      <a className="strategy-card flex flex-col gap-3 p-4 bg-card text-card-foreground rounded-xl border border-border cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
        <div className="relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden bg-secondary/30"> {/* Darker placeholder bg */}
          <Image
            alt={`${strategy.name} Strategy illustration`}
            src={`https://placehold.co/600x400.png`} 
            data-ai-hint={strategy.imagePlaceholderKeywords || 'abstract code'}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className="info-icon absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all"
            title={strategy.description} // Full description on hover
          >
            <Info size={16} />
          </div>
        </div>
        <div>
          <h3 className="text-card-foreground text-base font-semibold leading-snug group-hover:text-primary transition-colors">
            {strategy.name}
          </h3>
          <p className="text-muted-foreground text-xs font-normal leading-normal mt-1">
            {strategy.shortDescription}
          </p>
        </div>
      </a>
    </Link>
  );
}

interface PromptStrategyProps { // Added interface for props
  strategy: PromptStrategy;
}
