
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PROMPT_STRATEGIES } from "@/lib/prompt-strategies";
import Link from "next/link";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { ArrowRight, ListChecks, User, ListOrdered, Lock } from "lucide-react";

// Strategies to display on the landing page, matching the image
const displayedStrategiesInfo = [
  {
    id: "few-shot",
    title: "Few-shot",
    description: "Provide examples to guide the AI.",
    icon: ListChecks,
    linkId: "few-shot", // ID used in PROMPT_STRATEGIES for linking
  },
  {
    id: "role-based",
    title: "Role-based",
    description: "Define a specific persona for the AI.",
    icon: User,
    linkId: "role-based", 
  },
  {
    id: "step-by-step",
    title: "Step-by-step",
    description: "Break down complex tasks into smaller steps.",
    icon: ListOrdered,
    linkId: "step-by-step",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <header className="mb-10">
        <Link href="/" className="inline-flex items-center gap-3 text-primary">
          <LogoIcon className="h-12 w-12 sm:h-14 sm:w-14" />
          <span className="text-4xl sm:text-5xl font-bold text-foreground">PromptNin</span>
        </Link>
      </header>

      <p className="max-w-xl mx-auto text-md sm:text-lg text-muted-foreground mb-12">
        PromptNin is a developer tool that helps engineers generate high-quality prompts for
        AI code assistants using structured techniques. It&apos;s a static, client-side app with no
        backend, analytics, or AI calls. All configuration is stored in localStorage and wiped
        when your browser data is cleared.
      </p>

      <section className="mb-12 w-full max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8">
          Supported Prompt Strategies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {displayedStrategiesInfo.map((strategy) => {
            // Find the full strategy from PROMPT_STRATEGIES to make sure icon and link are correct
            // const fullStrategy = PROMPT_STRATEGIES.find(s => s.id === strategy.linkId);
            const IconComponent = strategy.icon; // Use icon from displayedStrategiesInfo

            return (
              <Link key={strategy.id} href={`/playground?strategy=${strategy.linkId}`} passHref>
                <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col items-center py-6 px-4 cursor-pointer">
                  <CardHeader className="p-0 mb-3">
                    <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex flex-col justify-center">
                    <p className="font-semibold text-lg text-foreground mb-1">{strategy.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{strategy.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105 px-8 py-3 text-base">
        <Link href="/playground">
          Go to Playground <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>

      <footer className="mt-16">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Lock className="h-3 w-3" /> We don&apos;t use AI or save your data. Everything runs in your browser.
        </p>
      </footer>
    </div>
  );
}
