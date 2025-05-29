import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PROMPT_STRATEGIES } from "@/lib/prompt-strategies";
import { ArrowRight, CheckCircle2, Lightbulb, Users, Wand2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      icon: <Wand2 className="h-8 w-8 text-primary" />,
      title: "Versatile Strategies",
      description: "Choose from a growing library of prompt strategies tailored for various coding tasks.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Interactive Playground",
      description: "Experiment with strategies and inputs in real-time to craft the perfect prompt.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description: "Contribute your own strategies and help expand the collective intelligence.",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="text-center pt-10 md:pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Craft Perfect AI Prompts with <span className="text-primary">PromptCraft AI</span>
        </h1>
        <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Elevate your AI-assisted coding with powerful, customizable prompt generation. Say goodbye to generic outputs and hello to precision-engineered AI interactions.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
            <Link href="/playground">
              Go to Playground <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-lg transition-transform hover:scale-105">
            <Link href="/strategy-library">
              Explore Strategies
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full max-w-5xl">
        <Image 
          src="https://placehold.co/1200x600.png" 
          alt="PromptCraft AI Interface Showcase" 
          width={1200} 
          height={600} 
          className="rounded-lg shadow-2xl object-cover"
          data-ai-hint="abstract code"
        />
      </section>

      <section className="w-full max-w-5xl text-center py-10">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Why Choose PromptCraft AI?</h2>
        <p className="mt-3 max-w-xl mx-auto text-md text-muted-foreground">
          Unlock the full potential of AI code assistants with intelligently designed prompts.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-5xl py-10">
        <h2 className="text-3xl font-semibold tracking-tight text-center text-foreground">Featured Prompt Strategies</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMPT_STRATEGIES.slice(0, 3).map((strategy) => (
            <Card key={strategy.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex-row items-center gap-4">
                {strategy.icon && <strategy.icon className="h-8 w-8 text-primary" />}
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm line-clamp-3">{strategy.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="link" asChild className="p-0 text-primary">
                  <Link href={`/playground?strategy=${strategy.id}`}>
                    Try this strategy <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl text-center py-10">
         <Card className="p-6 md:p-10 shadow-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground">
          <h2 className="text-3xl font-semibold">Ready to Supercharge Your AI Coding?</h2>
          <p className="mt-4 text-lg opacity-90">
            Join PromptCraft AI today and experience a new level of efficiency and precision in your development workflow.
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-transform hover:scale-105">
            <Link href="/playground">
              Start Crafting Now <Wand2 className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
