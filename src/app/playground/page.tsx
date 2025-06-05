
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PROMPT_STRATEGIES, PromptStrategy } from '@/lib/prompt-strategies';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import type { LucideIcon } from 'lucide-react'; // No longer needed here

type StrategyConfigurations = Record<string, Record<string, string>>;

type StrategyUsageData = {
  [strategyId: string]: {
    count: number;
    lastUsed: number; // timestamp
  };
};

// Helper function to generate highlighted example prompt for tooltips
function generateHighlightedExamplePrompt(strategy: PromptStrategy): React.ReactNode {
  let output = strategy.example.output;
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  const configurableParams = strategy.parameters
    .filter(p => p.isConfigurable && strategy.example.inputs[p.name])
    .map(p => ({
      name: p.name,
      value: strategy.example.inputs[p.name],
    }))
    .sort((a, b) => b.value.length - a.value.length); // Longer matches first
  
  const regexParts = configurableParams.map(p =>
    p.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
  );

  if (regexParts.length === 0 && !output) {
    return "No example available or no configurable parameters to highlight.";
  }
  
  if (regexParts.length === 0 && output) {
    return output;
  }
  if (regexParts.length === 0) {
      return "No example available or no configurable parameters to highlight.";
  }

  const regex = new RegExp(`(${regexParts.join('|')})`, 'g');
  let match;

  while ((match = regex.exec(output)) !== null) {
    const matchedValue = match[0];
    const startIndex = match.index;

    if (startIndex > currentIndex) {
      parts.push(output.substring(currentIndex, startIndex));
    }
    parts.push(<strong key={`${startIndex}-${matchedValue}`} className="text-accent font-semibold bg-accent/10 p-0.5 rounded-sm">{matchedValue}</strong>);
    currentIndex = regex.lastIndex;
  }

  if (currentIndex < output.length) {
    parts.push(output.substring(currentIndex));
  }

  return parts.length > 0 ? <>{parts}</> : output;
}


export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [allStrategyConfigs] = useLocalStorage<StrategyConfigurations>(
    'promptnin-strategy-configurations',
    {}
  );

  const [strategyUsage, setStrategyUsage] = useLocalStorage<StrategyUsageData>(
    'promptnin-strategy-usage',
    {}
  );

  // Initialize with default order for SSR and initial client render
  const [sortedStrategies, setSortedStrategies] = useState<PromptStrategy[]>([...PROMPT_STRATEGIES]);

  // Initialize selectedStrategyId based on query or first of default PROMPT_STRATEGIES
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(() => {
    const strategyIdFromQuery = searchParams.get('strategy');
    if (strategyIdFromQuery && PROMPT_STRATEGIES.find(s => s.id === strategyIdFromQuery)) {
      return strategyIdFromQuery;
    }
    return PROMPT_STRATEGIES.length > 0 ? PROMPT_STRATEGIES[0].id : null;
  });

  // Client-side effect to sort strategies and update selection if necessary
  useEffect(() => {
    const clientSorted = [...PROMPT_STRATEGIES].sort((a, b) => {
      const usageA = strategyUsage[a.id];
      const usageB = strategyUsage[b.id];
      const lastUsedA = usageA?.lastUsed || 0;
      const lastUsedB = usageB?.lastUsed || 0;

      if (lastUsedA !== lastUsedB) {
        return lastUsedB - lastUsedA; // Sort by most recent first
      }
      return PROMPT_STRATEGIES.indexOf(a) - PROMPT_STRATEGIES.indexOf(b); // Fallback to original order
    });
    setSortedStrategies(clientSorted);

    // If no strategy was from query params, update selected ID to the first of the newly sorted list.
    const strategyIdFromQuery = searchParams.get('strategy');
    if (!strategyIdFromQuery && clientSorted.length > 0) {
      // Only update if the current selected one is not in the new sorted list or if it's different
      if (selectedStrategyId !== clientSorted[0].id) {
         setSelectedStrategyId(clientSorted[0].id);
      }
    } else if (strategyIdFromQuery && clientSorted.find(s => s.id === strategyIdFromQuery)) {
      // If query param exists and is valid in the sorted list, ensure it's selected
      if (selectedStrategyId !== strategyIdFromQuery) {
        setSelectedStrategyId(strategyIdFromQuery);
      }
    } else if (clientSorted.length > 0 && !clientSorted.find(s => s.id === selectedStrategyId)) {
      // If current selected ID is no longer valid (e.g. after sorting and no query param), pick the first.
      setSelectedStrategyId(clientSorted[0].id);
    } else if (clientSorted.length === 0) {
      setSelectedStrategyId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyUsage, searchParams]); // Rerun when usage data or searchParams change


  const selectedStrategy = useMemo(() => {
    return PROMPT_STRATEGIES.find(s => s.id === selectedStrategyId) || null;
  }, [selectedStrategyId]);

  const [inputValues, setInputValues] = useState<Record<string, string>>({ main_input: '' });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  useEffect(() => {
    document.title = 'Prompt Generator - PromptNin';
  }, []);

  useEffect(() => {
    if (selectedStrategy) {
      const savedConfigForStrategy = allStrategyConfigs[selectedStrategy.id] || {};
      const initialParamValues: Record<string, string> = {};

      selectedStrategy.parameters.forEach(param => {
        if (param.name === 'main_input') {
          initialParamValues[param.name] = inputValues[param.name] || savedConfigForStrategy[param.name] || param.defaultValue || '';
        } else if (param.isConfigurable && savedConfigForStrategy[param.name] !== undefined) {
          initialParamValues[param.name] = savedConfigForStrategy[param.name];
        } else if (param.defaultValue) {
          initialParamValues[param.name] = param.defaultValue;
        } else {
          initialParamValues[param.name] = '';
        }
      });
      setInputValues(initialParamValues);
    } else {
      setInputValues({ main_input: inputValues.main_input || '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStrategy, allStrategyConfigs]);


  const handleInputChange = (paramName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    router.push(`/playground?strategy=${strategyId}`, { scroll: false });

    setStrategyUsage(prevUsage => {
      const currentStrategyUsage = prevUsage[strategyId] || { count: 0, lastUsed: 0 };
      return {
        ...prevUsage,
        [strategyId]: {
          count: currentStrategyUsage.count + 1,
          lastUsed: Date.now(),
        },
      };
    });
  };

  const generatePromptCallback = useCallback(() => {
    if (!selectedStrategy) {
      setGeneratedPrompt('');
      return;
    }
    let prompt = selectedStrategy.template;
    selectedStrategy.parameters.forEach(param => {
      const regex = new RegExp(`\\$\\{${param.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`, 'g');
      prompt = prompt.replace(regex, inputValues[param.name] || '');
    });
    setGeneratedPrompt(prompt);
  }, [selectedStrategy, inputValues]);

  useEffect(() => {
    generatePromptCallback();
  }, [inputValues, generatePromptCallback]);


  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt has been copied successfully.",
        duration: 3000,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the prompt to clipboard.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <main className="px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 lg:py-12 text-foreground">
      <div className="layout-content-container flex flex-col gap-6 lg:gap-8 max-w-[960px] flex-1">
        <div className="flex flex-col gap-2 p-4">
          <h1 className="tracking-tight text-3xl lg:text-4xl font-bold leading-tight">Prompt Generator</h1>
          <p className="text-muted-foreground text-base lg:text-lg">Select from various prompting strategies, input your code or error, and instantly receive a tailored prompt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column */}
          <section className="flex flex-col gap-4 p-4">
            <h3 className="text-xl font-semibold leading-tight tracking-[-0.015em]">Input your code or error</h3>
            <Textarea
              value={inputValues['main_input'] || ''}
              onChange={e => handleInputChange('main_input', e.target.value)}
              className="w-full bg-input border-border rounded-lg p-4 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Paste your code snippet, error message, or question here..."
              rows={selectedStrategy?.parameters.find(p=>p.name === 'main_input')?.rows || 8}
            />

            <h3 className="text-xl font-semibold leading-tight tracking-[-0.015em] pt-4">Select a technique</h3>
            <TooltipProvider delayDuration={300}>
              <div className="flex flex-wrap gap-3">
                {sortedStrategies.map(strategy => (
                  <Tooltip key={strategy.id}>
                    <TooltipTrigger asChild>
                      <label
                        className={`text-sm font-medium leading-normal flex items-center justify-center rounded-lg border px-4 py-2.5 relative cursor-pointer transition-all hover:border-primary/50
                          ${selectedStrategyId === strategy.id ? 'border-2 border-primary bg-primary/10' : 'border-border text-foreground bg-card hover:bg-secondary'}`}
                      >
                        {strategy.name}
                        <input
                          type="radio"
                          name="prompting_technique"
                          value={strategy.id}
                          checked={selectedStrategyId === strategy.id}
                          onChange={() => handleStrategyChange(strategy.id)}
                          className="sr-only"
                        />
                      </label>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground border-border shadow-lg max-w-md p-3">
                      <p className="text-sm font-semibold mb-1">Example for {strategy.name}:</p>
                      <div className="whitespace-pre-wrap text-xs opacity-90 mb-3">
                        {generateHighlightedExamplePrompt(strategy)}
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                          onClick={() => router.push(`/settings?strategy=${strategy.id}`)}
                          title={`Update default config for ${strategy.name}`}
                        >
                          <span className="material-icons text-base mr-1.5">tune</span>
                          Update Config
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

            {selectedStrategy && (
              <div className="pt-4">
                <Alert variant="default" className="shadow-lg bg-card border-border text-card-foreground mt-4">
                  {(selectedStrategy.icon) && <selectedStrategy.icon className="h-5 w-5 text-primary" />}
                  <AlertTitle className="font-semibold text-card-foreground">{selectedStrategy.name}</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    {selectedStrategy.description}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </section>

          {/* Right Column */}
          <section className="flex flex-col gap-4 p-4 bg-card rounded-lg relative">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.015em]">Generated Prompt</h3>
                <Button
                    onClick={handleCopyPrompt}
                    disabled={!generatedPrompt}
                    variant="default"
                    size="sm"
                    className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <span className="material-icons text-base mr-1.5">content_copy</span>
                    Copy
                </Button>
            </div>
            <div className="bg-background border-border rounded-lg p-4 min-h-[200px] text-muted-foreground text-sm whitespace-pre-wrap overflow-auto flex-grow">
              {generatedPrompt || "Your generated prompt will appear here..."}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
