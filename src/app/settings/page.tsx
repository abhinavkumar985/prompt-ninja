
"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { Save, SlidersHorizontal, Settings2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type StrategyConfigurations = Record<string, Record<string, string>>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [allStrategyConfigs, setAllStrategyConfigs] = useLocalStorage<StrategyConfigurations>(
    'promptnin-strategy-configurations',
    {}
  );

  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(
    PROMPT_STRATEGIES.length > 0 ? PROMPT_STRATEGIES[0].id : null
  );
  const [currentFormValues, setCurrentFormValues] = useState<Record<string, string>>({});

  const selectedStrategy = useMemo(() => {
    return PROMPT_STRATEGIES.find(s => s.id === selectedStrategyId) || null;
  }, [selectedStrategyId]);

  useEffect(() => {
    if (selectedStrategy) {
      const savedConfigForStrategy = allStrategyConfigs[selectedStrategy.id] || {};
      const initialValues: Record<string, string> = {};
      selectedStrategy.parameters.forEach(param => {
        if (param.isConfigurable) { // Only load/initialize for configurable params
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

  const handleInputChange = (paramName: string, value: string) => {
    setCurrentFormValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleSaveConfiguration = () => {
    if (!selectedStrategy) return;

    // Ensure we only save values for parameters that are marked as configurable
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
        configToSaveForReset[param.name] = val; // Also store this reset state
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
    const value = currentFormValues[param.name] ?? ''; // Should always exist due to initialization
    switch (param.type) {
      case 'textarea':
        return <Textarea id={param.name} value={value} onChange={e => handleInputChange(param.name, e.target.value)} placeholder={param.placeholder} rows={param.rows || 3} className="font-mono text-sm"/>;
      case 'select':
        return (
          <Select value={value} onValueChange={val => handleInputChange(param.name, val)}>
            <SelectTrigger id={param.name} className="text-sm">
              <SelectValue placeholder={param.placeholder || `Select ${param.label}`} />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'text':
      default:
        return <Input id={param.name} type="text" value={value} onChange={e => handleInputChange(param.name, e.target.value)} placeholder={param.placeholder} className="text-sm"/>;
    }
  };

  const configurableParameters = selectedStrategy?.parameters.filter(p => p.isConfigurable) || [];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
          <SlidersHorizontal className="h-8 w-8 text-primary" /> Strategy Default Inputs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Configure default input values for your prompt strategies. These defaults will pre-fill the fields in the Playground.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5 text-primary"/> Select Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)] pr-3">
              <div className="space-y-2">
                {PROMPT_STRATEGIES.map(strategy => (
                  <Button
                    key={strategy.id}
                    variant="ghost"
                    onClick={() => setSelectedStrategyId(strategy.id)}
                    className={cn(
                      "w-full justify-start text-left h-auto py-2 px-3",
                      selectedStrategyId === strategy.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
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

        <Card className="md:col-span-2 shadow-lg">
          {selectedStrategy ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedStrategy.icon && <selectedStrategy.icon className="h-6 w-6 text-primary"/>}
                  Configure: {selectedStrategy.name}
                </CardTitle>
                <CardDescription>Set default values for the configurable parameters of this strategy. These will be used in the Playground.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {configurableParameters.length > 0 ? (
                  configurableParameters.map(param => (
                    <div key={param.name} className="space-y-1.5">
                      <Label htmlFor={param.name} className="text-sm font-medium">{param.label}</Label>
                      {renderParameterInput(param)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">This strategy has no parameters that can be pre-configured with default values.</p>
                )}
                
                {configurableParameters.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button onClick={handleSaveConfiguration} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Save className="mr-2 h-4 w-4" /> Save Configuration
                    </Button>
                    <Button onClick={handleResetToDefaults} variant="outline" className="w-full sm:w-auto">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset to Strategy Defaults
                    </Button>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
             <CardHeader> {/* Keep CardHeader for consistent structure even when no strategy selected */}
              <CardTitle>No Strategy Selected</CardTitle>
              <CardContent> {/* Added CardContent for consistent padding */}
                <p className="text-sm text-muted-foreground">Please select a strategy from the left panel to configure its default inputs.</p>
              </CardContent>
            </CardHeader>
          )}
        </Card>
      </div>
    </div>
  );
}
