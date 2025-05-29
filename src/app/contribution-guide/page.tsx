import Link from 'next/link';
import { GITHUB_REPO_URL } from '@/components/Header'; // Import the GitHub URL

export const metadata = {
  title: 'Contribute to PromptNin - PromptNin',
  description: 'Join us in making PromptNin the best tool for crafting AI prompts. Your expertise can help thousands of developers.',
};

export default function ContributionGuidePage() {
  return (
    // Removed outer main and div, assuming layout provides container and padding
    <div className="flex flex-col max-w-4xl mx-auto flex-1 gap-8 py-10 lg:py-16">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground mb-4">Contribute to PromptNin</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join us in making PromptNin the best tool for crafting AI prompts. Your expertise can help thousands of developers.
        </p>
      </header>

      <section className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-foreground text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-6 flex items-center gap-3">
          <span className="material-icons text-3xl text-primary">stars</span>
          Why Contribute?
        </h2>
        <p className="text-muted-foreground text-base font-normal leading-relaxed mb-4">
          Contributing to PromptNin offers a unique opportunity to shape a tool that directly impacts the developer community. By sharing your knowledge, you can:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4 mb-4">
          <li><strong>Improve Prompt Quality:</strong> Help refine and expand our library of prompt strategies, making AI assistants more effective for everyone.</li>
          <li><strong>Support Fellow Developers:</strong> Your insights can simplify complex prompting tasks, saving time and effort for others.</li>
          <li><strong>Enhance Tool Usability:</strong> Contribute to making PromptNin more intuitive, powerful, and user-friendly.</li>
          <li><strong>Gain Recognition:</strong> Be acknowledged for your valuable input and become part of a growing open-source community.</li>
        </ul>
      </section>

      <section className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-foreground text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-6 flex items-center gap-3">
          <span className="material-icons text-3xl text-primary">code</span>
          How to Contribute
        </h2>
        <p className="text-muted-foreground text-base font-normal leading-relaxed mb-6">
          We welcome contributions in various forms. Whether you&apos;re adding new strategies, improving examples, or providing crucial feedback, your input is valuable. Here’s how you can get started:
        </p>
        <div className="space-y-4 mb-6">
          <div className="bg-background/50 p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground/90 mb-1">Explore the GitHub Repository</h3>
            <p className="text-muted-foreground text-sm">
              Our <Link className="text-accent hover:underline font-medium" href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">GitHub repository</Link> is the central hub for all contributions. You&apos;ll find detailed guidelines, current issues, and project discussions there.
            </p>
          </div>
          <div className="bg-background/50 p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground/90 mb-1">Contribution Areas</h3>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 pl-4">
              <li>Adding new prompt strategies or patterns.</li>
              <li>Improving or diversifying existing examples.</li>
              <li>Reporting bugs or suggesting enhancements.</li>
              <li>Improving documentation.</li>
              <li>Submitting feedback on user experience.</li>
            </ul>
          </div>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 min-w-[84px] max-w-[480px] cursor-pointer overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold leading-normal tracking-[0.015em] transition-colors"
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg fill="currentColor" height="24" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span>Go to GitHub Repository</span>
        </Link>
      </section>

      <section className="bg-card p-6 sm:p-8 rounded-xl shadow-xl">
        <h2 className="text-foreground text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] mb-6 flex items-center gap-3">
          <span className="material-icons text-3xl text-primary">favorite_border</span>
          Acknowledgements
        </h2>
        <p className="text-muted-foreground text-base font-normal leading-relaxed mb-4">
          PromptNin is built upon the inspiration and groundwork laid by pioneers in the field. We extend our sincere gratitude to:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4 mb-4">
          <li><strong>Addy Osmani:</strong> For his influential work and insights that inspired this project.</li>
          <li><strong>Our Valued Contributors:</strong> To everyone who has dedicated their time and expertise to improve PromptNin. Your efforts are deeply appreciated.</li>
        </ul>
      </section>

      <section className="bg-green-800/30 border border-green-500 p-6 rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="material-icons text-3xl text-green-400">verified_user</span>
          <h3 className="text-xl font-semibold text-green-300">Privacy by Design</h3>
        </div>
        <p className="text-green-200 text-base font-normal leading-relaxed">
          Your privacy is paramount. <strong>No data leaves your browser.</strong> PromptNin runs fully in-browser, ensuring your prompts and information remain confidential.
        </p>
      </section>
    </div>
  );
}
