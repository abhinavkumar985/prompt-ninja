import Link from 'next/link';
import type { PromptStrategy } from '@/lib/prompt-strategies';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StrategyCardProps {
  strategy: PromptStrategy;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        {strategy.icon && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <strategy.icon className="h-8 w-8 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-xl">{strategy.name}</CardTitle>
          {strategy.category && (
             <p className="text-xs text-muted-foreground mt-1 bg-secondary px-2 py-0.5 rounded-full w-fit">{strategy.category}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm line-clamp-4 leading-relaxed">{strategy.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/playground?strategy=${strategy.id}`}>
            Use Strategy <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
