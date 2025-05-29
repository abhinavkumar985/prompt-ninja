
import Link from 'next/link';
import { Sparkles, Wrench, FileText, ShieldCheck } from 'lucide-react'; // Using Lucide for consistency

// SVGs from mockup for feature icons, if Lucide is not preferred for exact match
const SparklesIconMockup = () => (
  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09zM18.25 12L15.406 12.813a4.5 4.5 0 01-3.09 3.09L9 18.75l2.846-.813a4.5 4.5 0 013.09-3.09L18.25 12z" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const WrenchIconMockup = () => (
  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 2.25 2.25 6.75l4.5 4.5a3.375 3.375 0 004.672.772z" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const FileTextIconMockup = () => (
  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const ShieldCheckIconMockup = () => (
  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);


export default function HomePage() {
  return (
    <main className="flex-1 px-6 py-10 sm:px-16 md:px-24 lg:px-40 text-foreground">
      <div className="layout-content-container mx-auto flex max-w-5xl flex-col items-center">
        <section className="w-full py-16 text-center md:py-24">
          <div className="hero-gradient-bg flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-xl bg-cover bg-center bg-no-repeat p-6 shadow-2xl sm:min-h-[480px] sm:gap-8 sm:p-10 md:p-16">
            <h1 className="text-4xl font-black leading-tight tracking-tighter text-primary sm:text-5xl md:text-6xl">
              Prompt like a pro. <br className="hidden sm:inline" />No AI, no backend, no data risks.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
              Generate superior prompts for AI code assistants, instantly and securely, right in your browser.
            </p>
            <Link href="/playground" legacyBehavior>
              <a className="mt-4 flex min-w-[160px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-primary-foreground text-base font-bold leading-normal tracking-[0.015em] shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:px-8 sm:text-lg">
                <span className="truncate">Go to Playground</span>
              </a>
            </Link>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <h2 className="mb-8 text-center text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">What is PromptNin?</h2>
          <p className="mb-10 text-center text-lg text-muted-foreground sm:text-xl">
            PromptNin is a browser-based tool to generate better prompts for Copilot, Gemini, and other AI code assistants.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature Card 1 */}
            <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
              <div className="feature-icon mb-4 size-12 text-primary">
                <SparklesIconMockup />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Instant Generation</h3>
              <p className="text-sm text-muted-foreground">Get effective prompts immediately, without waiting for AI processing.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
              <div className="feature-icon mb-4 size-12 text-primary">
                <WrenchIconMockup />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">No AI/Backend</h3>
              <p className="text-sm text-muted-foreground">Operates fully in your browser. No external servers, no AI models involved.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
              <div className="feature-icon mb-4 size-12 text-primary">
                <FileTextIconMockup />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Proven Strategies</h3>
              <p className="text-sm text-muted-foreground">Utilizes a curated library of battle-tested prompting techniques.</p>
            </div>
            {/* Feature Card 4 */}
            <div className="rounded-lg bg-card p-6 shadow-lg transition-shadow hover:shadow-xl">
              <div className="feature-icon mb-4 size-12 text-primary">
                <ShieldCheckIconMockup />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Zero Data Storage</h3>
              <p className="text-sm text-muted-foreground">Your data never leaves your computer, ensuring complete privacy and security.</p>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <h2 className="mb-12 text-center text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="feature-icon mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">1</div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Select Strategy</h3>
              <p className="text-muted-foreground">Choose from a library of proven prompting strategies tailored for various coding tasks.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="feature-icon mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">2</div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Customize Parameters</h3>
              <p className="text-muted-foreground">Adjust inputs and options to fine-tune the prompt for your specific needs.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="feature-icon mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">3</div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Generate &amp; Use</h3>
              <p className="text-muted-foreground">Instantly get your optimized prompt and use it with your favorite AI code assistant.</p>
            </div>
          </div>
          {/* <div className="mt-12 p-6 rounded-lg bg-card shadow-lg">
            <p className="text-muted-foreground text-center text-base leading-relaxed">
              PromptNin operates entirely within your browser, ensuring your data remains private and secure. It uses a library of proven prompting strategies to generate effective prompts instantly, without relying on AI or backend processing. This means no data is stored or transmitted, providing a risk-free environment for prompt creation.
            </p>
          </div> */}
          <section className="bg-green-800/30 border border-green-500 p-6 rounded-xl shadow-lg text-center mt-12 bg-card shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="material-icons text-3xl text-green-400">verified_user</span>
              <h3 className="text-xl font-semibold text-green-300">Privacy by Design</h3>
            </div>
            <p className="text-green-200 text-base font-normal leading-relaxed">
            PromptNin operates entirely within your browser, ensuring your data remains private and secure. It uses a library of proven prompting strategies to generate effective prompts instantly, without relying on AI or backend processing. This means no data is stored or transmitted, providing a risk-free environment for prompt creation.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
