import { StrategyCard } from '@/components/StrategyCard';
import { PROMPT_STRATEGIES } from '@/lib/prompt-strategies';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
// This page will be client-side for filtering, though initial render is static
// For simplicity, we'll keep it server-side and add client-side filtering later if needed.

export const metadata = {
  title: 'Strategy Library - PromptNin',
  description: 'Explore PromptNin\'s comprehensive library of AI prompt strategies.',
};

export default function StrategyLibraryPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Prompt Strategy Library</h1>
        <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
          Discover and utilize a wide range of predefined strategies from PromptNin to generate effective AI prompts.
        </p>
      </section>
      
      {/* Search/Filter placeholder - functionality can be added with client component */}
      {/* <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="search" placeholder="Search strategies..." className="pl-10 w-full max-w-md mx-auto" />
      </div> */}

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {PROMPT_STRATEGIES.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
        {PROMPT_STRATEGIES.length === 0 && (
          <p className="text-center text-muted-foreground">No strategies available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
