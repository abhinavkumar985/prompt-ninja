
import { StrategyCard } from '@/components/StrategyCard';
import { PROMPT_STRATEGIES } from '@/lib/prompt-strategies';

export const metadata = {
  title: 'Strategy Library - PromptNin',
  description: 'Explore various prompt engineering strategies to enhance the quality of AI-generated code. Each strategy offers a unique approach to structuring your prompts for optimal results.',
};

export default function StrategyLibraryPage() {
  return (
    <main className="flex-1 px-6 py-10 sm:px-16 md:px-24 lg:px-40 text-foreground">
      <div className="layout-content-container mx-auto flex max-w-5xl flex-col items-center">
        <div className="w-full text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">
              Prompt Strategy Library
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore various prompt engineering strategies to enhance the quality of AI-generated code. Each strategy offers a unique approach to structuring your prompts for
              optimal results.
            </p>
        </div>
        {PROMPT_STRATEGIES.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {PROMPT_STRATEGIES.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground col-span-full">No strategies available at the moment. Check back soon!</p>
        )}
      </div>
    </main>
  );
}
