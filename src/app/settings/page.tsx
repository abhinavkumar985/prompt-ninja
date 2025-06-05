
"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { PROMPT_STRATEGIES, PromptStrategy, PromptParameter } from '@/lib/prompt-strategies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Save, SlidersHorizontal, Settings2, RotateCcw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

type StrategyConfigurations = Record<string, Record<string, string>>;

type StrategyUsageData = {
  [strategyId: string]: {
    count: number;
    lastUsed: number; // timestamp
  };
};

function SettingsPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [allStrategyConfigs, setAllStrategyConfigs] = useLocalStorage<StrategyConfigurations>(
    'promptnin-strategy-configurations',
    {}
  );

  const [strategyUsage] = useLocalStorage<StrategyUsageData>( // No setStrategyUsage needed here, only reading
    'promptnin-strategy-usage',
    {}
  );

  // Initialize with default order. Client-side effect will sort it.
  const [sortedStrategies, setSortedStrategies] = useState<PromptStrategy[]>([...PROMPT_STRATEGIES]);

  // Initialize selectedStrategyId. Client-side effect will refine it.
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(() => {
    const strategyIdFromQuery = searchParams.get('strategy');
    if (strategyIdFromQuery && PROMPT_STRATEGIES.find(s => s.id === strategyIdFromQuery)) {
      return strategyIdFromQuery;
    }
    return PROMPT_STRATEGIES.length > 0 ? PROMPT_STRATEGIES[0].id : null;
  });

  // Effect for initial sorting and selection refinement on client-side
  useEffect(() => {
    const clientSorted = [...PROMPT_STRATEGIES].sort((a, b) => {
      const usageA = strategyUsage[a.id];
      const usageB = strategyUsage[b.id];
      const lastUsedA = usageA?.lastUsed || 0;
      const lastUsedB = usageB?.lastUsed || 0;

      if (lastUsedA !== lastUsedB) {
        return lastUsedB - lastUsedA;
      }
      return PROMPT_STRATEGIES.indexOf(a) - PROMPT_STRATEGIES.indexOf(b);
    });
    setSortedStrategies(clientSorted);

    const strategyIdFromQuery = searchParams.get('strategy');
    let newSelectedId = selectedStrategyId;

    if (strategyIdFromQuery && clientSorted.find(s => s.id === strategyIdFromQuery)) {
      newSelectedId = strategyIdFromQuery;
    } else if (clientSorted.length > 0) {
      if (!newSelectedId || !clientSorted.find(s => s.id === newSelectedId)) {
        newSelectedId = clientSorted[0].id;
      }
    } else {
      newSelectedId = null;
    }

    if (newSelectedId !== selectedStrategyId) {
      setSelectedStrategyId(newSelectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: runs only once on client mount


  const [currentFormValues, setCurrentFormValues] = useState<Record<string, string>>({});

  const selectedStrategy = useMemo(() => {
    // Find in the original PROMPT_STRATEGIES list to ensure stability if sortedStrategies is not yet updated
    return PROMPT_STRATEGIES.find(s => s.id === selectedStrategyId) || null;
  }, [selectedStrategyId]);

  useEffect(() => {
    if (selectedStrategy) {
      const savedConfigForStrategy = allStrategyConfigs[selectedStrategy.id] || {};
      const initialValues: Record<string, string> = {};
      selectedStrategy.parameters.forEach(param => {
        if (param.isConfigurable) {
          initialValues[param.name] = savedConfigForStrategy[param.name] ?? param.defaultValue ?? '';
        }
      });
      setCurrentFormValues(initialValues);
    } else {
      setCurrentFormValues({});
    }
  }, [selectedStrategy, allStrategyConfigs]);

  useEffect(() => {
    document.title = 'Strategy Defaults - PromptNin';
  }, []);

  const handleStrategySelection = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
    // Note: Unlike Playground, we don't update usage stats here as it's primarily for configuration.
    // Also, not changing URL query params on selection within the settings page itself.
  };

  const handleInputChange = (paramName: string, value: string) => {
    setCurrentFormValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleSaveConfiguration = () => {
    if (!selectedStrategy) return;

    const configToSave: Record<string, string> = {};
    selectedStrategy.parameters.forEach(param => {
      if (param.isConfigurable && currentFormValues[param.name] !== undefined) {
        configToSave[param.name] = currentFormValues[param.name];
      }
    });

    setAllStrategyConfigs(prev => ({
      ...prev,
      [selectedStrategy.id]: configToSave,
    }));
    toast({
      title: 'Configuration Saved',
      description: `Default inputs for "${selectedStrategy.name}" have been updated.`,
      duration: 3000,
    });
  };

  const handleResetToDefaults = () => {
    if (!selectedStrategy) return;
    const defaultValues: Record<string, string> = {};
    const configToSaveForReset: Record<string, string> = {};

    selectedStrategy.parameters.forEach(param => {
      if (param.isConfigurable) {
        const val = param.defaultValue ?? '';
        defaultValues[param.name] = val;
        configToSaveForReset[param.name] = val;
      }
    });
    setCurrentFormValues(defaultValues);

    setAllStrategyConfigs(prev => ({
      ...prev,
      [selectedStrategy.id]: configToSaveForReset,
    }));
    toast({
      title: 'Configuration Reset',
      description: `Default inputs for "${selectedStrategy.name}" have been reset to strategy defaults.`,
      duration: 3000,
    });
  };

  const renderParameterInput = (param: PromptParameter) => {
    const value = currentFormValues[param.name] ?? '';
    switch (param.type) {
      case 'textarea':
        return <Textarea id={param.name} value={value} onChange={e => handleInputChange(param.name, e.target.value)} placeholder={param.placeholder} rows={param.rows || 3} className="font-mono text-sm bg-input text-foreground" />;
      case 'select':
        return (
          <Select value={value} onValueChange={val => handleInputChange(param.name, val)}>
            <SelectTrigger id={param.name} className="text-sm bg-input text-foreground">
              <SelectValue placeholder={param.placeholder || `Select ${param.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground border-border">
              {param.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'text':
      default:
        return <Input id={param.name} type="text" value={value} onChange={e => handleInputChange(param.name, e.target.value)} placeholder={param.placeholder} className="text-sm bg-input text-foreground" />;
    }
  };

  const configurableParameters = selectedStrategy?.parameters.filter(p => p.isConfigurable) || [];

  return (
    <main className="px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 lg:py-12">
      <div className="layout-content-container flex flex-col gap-8 max-w-6xl w-full">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
            <SlidersHorizontal className="h-8 w-8 text-primary" /> Strategy Default Inputs
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure default input values for your prompt strategies. These defaults will pre-fill the fields in the Playground.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <Card className="md:col-span-1 shadow-xl bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground"><Settings2 className="h-5 w-5 text-primary" /> Select Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-26rem)] pr-3">
                <div className="space-y-2">
                  {sortedStrategies.map(strategy => (
                    <Button
                      key={strategy.id}
                      variant="ghost"
                      onClick={() => handleStrategySelection(strategy.id)} // Use new handler
                      className={cn(
                        "w-full justify-start text-left h-auto py-2 px-3 text-card-foreground hover:bg-secondary/80 hover:text-accent",
                        selectedStrategyId === strategy.id ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""
                      )}
                    >
                      {strategy.icon && <strategy.icon className="mr-2 h-4 w-4" />}
                      {strategy.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-xl bg-card border-border">
            {selectedStrategy ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    {selectedStrategy.icon && <selectedStrategy.icon className="h-6 w-6 text-primary" />}
                    {selectedStrategy.name}
                  </CardTitle>
                  <CardDescription className="pt-1 text-muted-foreground">{selectedStrategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-card-foreground">Default Inputs Configuration</h3>
                    {configurableParameters.length > 0 ? (
                      configurableParameters.map(param => (
                        <div key={param.name} className="space-y-1.5 mb-4">
                          <Label htmlFor={param.name} className="text-sm font-medium text-card-foreground">{param.label}</Label>
                          {renderParameterInput(param)}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">This strategy has no parameters that can be pre-configured with default values.</p>
                    )}
                  </div>

                  {configurableParameters.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mt-4">
                      <Button onClick={handleSaveConfiguration} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Save className="mr-2 h-4 w-4" /> Save Configuration
                      </Button>
                      <Button onClick={handleResetToDefaults} variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset to Strategy Defaults
                      </Button>
                    </div>
                  )}

                  {selectedStrategy.example && (
                    <div className="pt-6 mt-6 border-t border-border">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-card-foreground">
                        <Info className="h-5 w-5 text-primary" /> Example Usage
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">An example of how this strategy can be used.</p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1 text-card-foreground">Example Inputs:</h4>
                          <pre className="p-3 bg-input/50 rounded-md text-xs font-mono overflow-x-auto text-muted-foreground border border-border">
                            {JSON.stringify(selectedStrategy.example.inputs, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1 text-card-foreground">Example Output Prompt:</h4>
                          <pre className="p-3 bg-input/50 rounded-md text-xs font-mono overflow-x-auto text-muted-foreground border border-border">
                            {selectedStrategy.example.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardHeader>
                <CardTitle className="text-card-foreground">No Strategy Selected</CardTitle>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Please select a strategy from the left panel to configure its default inputs and view its details.</p>
                </CardContent>
              </CardHeader>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function SettingPageWrapper() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <SettingsPage />
      </Suspense>
    </>
  );
}