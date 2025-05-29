
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PROMPT_STRATEGIES, PromptStrategy, PromptParameter } from '@/lib/prompt-strategies';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from 'lucide-react'; // For strategy icons if used

type StrategyConfigurations = Record<string, Record<string, string>>;

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
  
  // Moved regexParts initialization before its use
  const regexParts = configurableParams.map(p =>
    p.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
  );

  if (regexParts.length === 0 && !output) {
    return "No example available or no configurable parameters to highlight.";
  }
  if (regexParts.length === 0) {
    return output;
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
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const [allStrategyConfigs] = useLocalStorage<StrategyConfigurations>(
    'promptnin-strategy-configurations',
    {}
  );

  useEffect(() => {
    document.title = 'Prompt Generator - PromptNin';
    const strategyIdFromQuery = searchParams.get('strategy');
    if (strategyIdFromQuery && PROMPT_STRATEGIES.find(s => s.id === strategyIdFromQuery)) {
      setSelectedStrategyId(strategyIdFromQuery);
    } else if (PROMPT_STRATEGIES.length > 0 && !selectedStrategyId) {
      setSelectedStrategyId(PROMPT_STRATEGIES[0].id);
    }
  }, [searchParams, selectedStrategyId]);

  const selectedStrategy = useMemo(() => {
    return PROMPT_STRATEGIES.find(s => s.id === selectedStrategyId) || null;
  }, [selectedStrategyId]);

  useEffect(() => {
    if (selectedStrategy) {
      const savedConfigForStrategy = allStrategyConfigs[selectedStrategy.id] || {};
      const newDefaultValues: Record<string, string> = {};

      selectedStrategy.parameters.forEach(param => {
        if (param.isConfigurable && savedConfigForStrategy[param.name] !== undefined) {
          newDefaultValues[param.name] = savedConfigForStrategy[param.name];
        } else if (param.defaultValue) {
          newDefaultValues[param.name] = param.defaultValue;
        } else {
          newDefaultValues[param.name] = '';
        }
      });
      // Ensure main_input is always initialized
      if (newDefaultValues['main_input'] === undefined) {
        newDefaultValues['main_input'] = selectedStrategy.parameters.find(p => p.name === 'main_input')?.defaultValue || '';
      }
      setInputValues(newDefaultValues);
    } else {
      setInputValues({});
    }
  }, [selectedStrategy, allStrategyConfigs]);

  const handleInputChange = (paramName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleStrategyChange = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
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
      setIsCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The prompt has been copied successfully.",
        duration: 3000,
      });
      setTimeout(() => setIsCopied(false), 2000);
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

  const renderParameterInput = (param: PromptParameter) => {
    const value = inputValues[param.name] || '';
    if (param.name === 'main_input' || !param.isConfigurable) return null; // Only render configurable, non-main_input params here

    return (
      <div key={param.name} className="space-y-1.5 mb-4">
        <Label htmlFor={param.name} className="text-sm font-medium text-foreground">{param.label}</Label>
        {param.type === 'textarea' ? (
          <Textarea
            id={param.name}
            value={value}
            onChange={e => handleInputChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            rows={param.rows || 3}
            className="font-mono text-sm bg-input text-foreground border-border focus:ring-primary focus:border-primary"
          />
        ) : (
          <Input
            id={param.name}
            type="text"
            value={value}
            onChange={e => handleInputChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            className="text-sm bg-input text-foreground border-border focus:ring-primary focus:border-primary"
          />
        )}
      </div>
    );
  };

  const additionalParameters = selectedStrategy?.parameters.filter(p => p.name !== 'main_input' && p.isConfigurable);

  return (
    <main className="px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 lg:py-12 text-foreground">
      <div className="layout-content-container flex flex-col gap-6 lg:gap-8 max-w-[960px] flex-1">
        <div className="flex flex-col gap-2 p-4">
          <h1 className="tracking-tight text-3xl lg:text-4xl font-bold leading-tight">Prompt Generator</h1>
          <p className="text-muted-foreground text-base lg:text-lg">Select from various prompting strategies, input your code or error, and instantly receive a tailored prompt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                {PROMPT_STRATEGIES.map(strategy => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => router.push(`/settings?strategy=${strategy.id}`)}
                        title={`Update default config for ${strategy.name}`}
                      >
                        <span className="material-icons text-base mr-1.5">tune</span>
                        Update Config
                      </Button>
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
                {additionalParameters && additionalParameters.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-lg font-medium leading-tight tracking-[-0.015em] mb-2">Configure Strategy Parameters:</h3>
                    {additionalParameters.map(param => renderParameterInput(param))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4 p-4 bg-card rounded-lg relative">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.015em]">Generated Prompt</h3>
                <Button
                    onClick={handleCopyPrompt}
                    disabled={!generatedPrompt || isCopied}
                    variant="default"
                    size="sm"
                    className="font-semibold absolute top-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground"
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
