import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Github } from "lucide-react";

export const metadata = {
  title: 'Contribution Guide - PromptCraft AI',
  description: 'Learn how to contribute to the PromptCraft AI strategy library.',
};

export default function ContributionGuidePage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Contribution Guide</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Help us grow PromptCraft AI! Learn how to contribute new prompt strategies and improve existing ones.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6 text-primary"/> Overview</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert text-foreground">
          <p>
            We welcome contributions to our prompt strategy library. By sharing your expertise, you help make PromptCraft AI a more powerful tool for everyone. This guide outlines the process for proposing and submitting new strategies.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">What Makes a Good Strategy?</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="font-medium">Usefulness:</strong> Solves a common problem or enables a new way of interacting with AI for coding tasks.</li>
            <li><strong className="font-medium">Clarity:</strong> Easy to understand and use, with clear parameter descriptions.</li>
            <li><strong className="font-medium">Customizability:</strong> Offers meaningful parameters that allow users to tailor the prompt.</li>
            <li><strong className="font-medium">Well-Defined:</strong> Has a clear template structure and provides a good example.</li>
            <li><strong className="font-medium">Originality:</strong> While variations are welcome, truly novel approaches are highly valued.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">How to Contribute</h2>
          <p>
            Currently, contributions are managed via GitHub. Here's a general process:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Fork the Repository:</strong> (Link to be provided when available)
              Start by forking the official PromptCraft AI GitHub repository.
            </li>
            <li>
              <strong>Define Your Strategy:</strong>
              Create a new strategy object following the `PromptStrategy` interface in `src/lib/prompt-strategies.ts`.
              Make sure to include:
              <ul className="list-disc pl-5 space-y-1 my-2">
                <li>`id`: A unique, kebab-case identifier.</li>
                <li>`name`: A human-readable name.</li>
                <li>`description`: A concise explanation of what the strategy does.</li>
                <li>`template`: The prompt template string with `${"placeholder"}` variables.</li>
                <li>`parameters`: An array of `PromptParameter` objects.</li>
                <li>`example`: An object with sample `inputs` and the resulting `output` prompt.</li>
                <li>`icon` (optional): A Lucide icon component.</li>
                <li>`category` (optional): A relevant category.</li>
              </ul>
            </li>
            <li>
              <strong>Test Your Strategy:</strong>
              Add your strategy to the `PROMPT_STRATEGIES` array and test it thoroughly in the local playground.
            </li>
            <li>
              <strong>Submit a Pull Request:</strong>
              Once you're happy with your strategy, commit your changes and open a Pull Request against the main branch of the PromptCraft AI repository.
              In your PR description, please explain your strategy, its use cases, and why you think it's a valuable addition.
            </li>
            <li>
              <strong>Review Process:</strong>
              The PromptCraft AI maintainers will review your submission. We may provide feedback or request changes.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mt-6 mb-3">Code of Conduct</h2>
          <p>
            All contributors are expected to adhere to our Code of Conduct (to be published). We aim to foster an open and welcoming environment.
          </p>

          <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <h3 className="text-xl font-semibold text-accent-foreground flex items-center gap-2"><Github className="h-5 w-5"/> Future Contribution Methods</h3>
            <p className="text-accent-foreground/80 mt-2">
              We are exploring more direct ways for users to submit strategies through the UI in the future. Stay tuned!
            </p>
          </div>

          <p className="mt-6">
            Thank you for considering contributing to PromptCraft AI!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
