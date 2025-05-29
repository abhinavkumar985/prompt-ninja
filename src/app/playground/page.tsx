"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PROMPT_STRATEGIES, PromptStrategy, PromptParameter } from '@/lib/prompt-strategies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CopyButton } from '@/components/CopyButton';
import { Wand2, Info, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  useEffect(() => {
    const strategyIdFromQuery = searchParams.get('strategy');
    if (strategyIdFromQuery && PROMPT_STRATEGIES.find(s => s.id === strategyIdFromQuery)) {
      setSelectedStrategyId(strategyIdFromQuery);
    } else if (PROMPT_STRATEGIES.length > 0) {
      setSelectedStrategyId(PROMPT_STRATEGIES[0].id);
    }
  }, [searchParams]);

  const selectedStrategy = useMemo(() => {
    return PROMPT_STRATEGIES.find(s => s.id === selectedStrategyId) || null;
  }, [selectedStrategyId]);

  useEffect(()_ => {
    if (selectedStrategy) {
      const defaultValues: Record<string, string> = {};
      selectedStrategy.parameters.forEach(param => {
        if (param.defaultValue) {
          defaultValues[param.name] = param.defaultValue;
        } else {
           defaultValues[param.name] = '';
        }
      });
      setInputValues(defaultValues);
      setGeneratedPrompt(''); // Reset prompt when strategy changes
    }
  }, [selectedStrategy]);

  const handleInputChange = (paramName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [paramName]: value }));
  };

  const handleGeneratePrompt = () => {
    if (!selectedStrategy) return;
    let prompt = selectedStrategy.template;
    selectedStrategy.parameters.forEach(param => {
      const regex = new RegExp(`\\$\\{${param.name}\\}`, 'g');
      prompt = prompt.replace(regex, inputValues[param.name] || '');
    });
    setGeneratedPrompt(prompt);
  };

  const renderParameterInput = (param: PromptParameter) => {
    const value = inputValues[param.name] || '';
    switch (param.type) {
      case 'textarea':
        return <Textarea id={param.name} value={value} onChange={e => handleInputChange(param.name, e.target.value)} placeholder={param.placeholder} rows={param.rows || 3} className="font-mono text-sm"/>;
      case 'select':
        return (
          <Select value={value} onValueChange={val => handleInputChange(param.name, val)}>
            <SelectTrigger id={param.name}>
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

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Prompt Playground</h1>
        <p className="mt-3 max-w-xl mx-auto text-lg text-muted-foreground">
          Interactively generate AI prompts using predefined strategies. Experiment and craft the perfect input for your AI assistant.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wand2 className="h-6 w-6 text-primary" /> Configure Strategy</CardTitle>
            <CardDescription>Select a strategy and fill in the parameters to generate your prompt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="strategy-select" className="text-sm font-medium">Prompt Strategy</Label>
              <Select value={selectedStrategyId || ''} onValueChange={id => setSelectedStrategyId(id)}>
                <SelectTrigger id="strategy-select">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {PROMPT_STRATEGIES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStrategy && selectedStrategy.parameters.map(param => (
              <div key={param.name} className="space-y-1.5">
                <Label htmlFor={param.name} className="text-sm font-medium">{param.label}</Label>
                {renderParameterInput(param)}
              </div>
            ))}
            
            <Button onClick={handleGeneratePrompt} disabled={!selectedStrategy} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Wand2 className="mr-2 h-4 w-4" /> Generate Prompt
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          {selectedStrategy && (
            <Alert variant="default" className="shadow">
              <Info className="h-5 w-5" />
              <AlertTitle className="font-semibold">{selectedStrategy.name}</AlertTitle>
              <AlertDescription>
                {selectedStrategy.description}
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Generated Prompt</CardTitle>
                <CopyButton textToCopy={generatedPrompt} />
              </div>
              <CardDescription>This is the AI prompt generated based on your selections. Copy and use it with your preferred AI tool.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                value={generatedPrompt}
                placeholder="Your generated prompt will appear here..."
                className="min-h-[200px] lg:min-h-[300px] font-mono text-sm bg-muted/30 border-dashed"
                aria-label="Generated Prompt"
              />
            </CardContent>
          </Card>
        </div>
      </div>
       {selectedStrategy?.example && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Example Usage</CardTitle>
            <CardDescription>An example of how this strategy can be used.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Example Inputs:</h4>
              <pre className="p-3 bg-muted rounded-md text-xs font-mono overflow-x-auto">
                {JSON.stringify(selectedStrategy.example.inputs, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Example Output Prompt:</h4>
              <pre className="p-3 bg-muted rounded-md text-xs font-mono overflow-x-auto">
                {selectedStrategy.example.output}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
