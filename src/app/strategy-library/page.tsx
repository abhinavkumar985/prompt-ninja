
import { StrategyCard } from '@/components/StrategyCard';
import { PROMPT_STRATEGIES } from '@/lib/prompt-strategies';

export const metadata = {
  title: 'Prompt Strategies - PromptNin',
  description: 'Explore various prompt engineering strategies to enhance the quality of AI-generated code. Each strategy offers a unique approach to structuring your prompts for optimal results.',
};

export default function StrategyLibraryPage() {
  return (
    // Adjusted padding to match the provided HTML main tag
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 sm:py-12">
      <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 text-3xl sm:text-4xl font-bold tracking-tight">Prompt Strategies</h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Explore various prompt engineering strategies to enhance the quality of AI-generated code. Each strategy offers a unique approach to structuring your prompts for
              optimal results.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 p-4">
          {PROMPT_STRATEGIES.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
        {PROMPT_STRATEGIES.length === 0 && (
          <p className="text-center text-muted-foreground col-span-full">No strategies available at the moment. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
