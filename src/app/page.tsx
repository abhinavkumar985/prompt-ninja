import Link from 'next/link';

// SVG for the header logo on this page, specific dimensions applied via className
const PageLogoIcon = () => (
  <svg className="text-[#0c7ff2]" fill="none" height="48" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path><path d="M19 17v4"></path>
    <path d="M3 5h4"></path><path d="M17 19h4"></path>
  </svg>
);

export default function HomePage() {
  // This content will be rendered within the RootLayout's <main> tag
  // The RootLayout already provides a container with mx-auto.
  // The HTML's "layout-container" and "layout-content-container" are merged here for simplicity
  // while maintaining the visual structure from the HTML.
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Page-specific header section */}
      <header className="w-full py-8 px-4 md:px-8 flex justify-center">
        <div className="flex items-center gap-3">
          <PageLogoIcon />
          <h1 className="gradient-text text-5xl font-bold tracking-tighter">PromptNin</h1>
        </div>
      </header>

      {/* Main content for the landing page */}
      <div className="flex flex-col w-full max-w-3xl py-5 text-center"> {/* Added text-center here for global centering of inner text blocks */}
        <p className="text-slate-700 text-lg font-normal leading-relaxed pb-8 pt-2 px-4">
          PromptNin is a developer tool that helps engineers generate high-quality prompts for AI code assistants using structured techniques. It&apos;s a static, client-side app with no backend, analytics, or AI calls. All configuration is stored in localStorage and wiped when your browser data is cleared.
        </p>

        <section className="px-4 pb-8 pt-6">
          <h2 className="text-slate-800 text-3xl font-semibold leading-tight tracking-tight pb-6">Supported Prompt Strategies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {/* Strategy Card 1: Few-shot */}
            <Link href="/playground?strategy=few-shot" passHref legacyBehavior>
              <a className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 items-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <span className="material-icons-outlined text-4xl text-[#0c7ff2]">list_alt</span>
                <h3 className="text-slate-900 text-xl font-semibold leading-tight">Few-shot</h3>
                <p className="text-slate-600 text-sm text-center">Provide examples to guide the AI.</p>
              </a>
            </Link>

            {/* Strategy Card 2: Role-based */}
            <Link href="/playground?strategy=role-based" passHref legacyBehavior>
              <a className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 items-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <span className="material-icons-outlined text-4xl text-[#0c7ff2]">person_outline</span>
                <h3 className="text-slate-900 text-xl font-semibold leading-tight">Role-based</h3>
                <p className="text-slate-600 text-sm text-center">Define a specific persona for the AI.</p>
              </a>
            </Link>

            {/* Strategy Card 3: Step-by-step */}
            <Link href="/playground?strategy=step-by-step" passHref legacyBehavior>
              <a className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 items-center shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <span className="material-icons-outlined text-4xl text-[#0c7ff2]">checklist</span>
                <h3 className="text-slate-900 text-xl font-semibold leading-tight">Step-by-step</h3>
                <p className="text-slate-600 text-sm text-center">Break down complex tasks into smaller steps.</p>
              </a>
            </Link>
          </div>
        </section>

        <div className="flex px-4 py-8 justify-center">
          <Link href="/playground" passHref legacyBehavior>
            <a className="flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-gradient-to-r from-[#0c7ff2] to-[#3b82f6] text-white text-lg font-semibold leading-normal tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#0c7ff2]/50">
              <span className="truncate">Go to Playground</span>
              <span className="material-icons-outlined ml-2">arrow_forward</span>
            </a>
          </Link>
        </div>

        {/* Page-specific footer section */}
        <footer className="px-4 py-6 mt-auto">
          <p className="text-slate-500 text-sm font-normal leading-normal pb-3 pt-1 px-4 flex items-center justify-center gap-2">
            <span className="material-icons-outlined text-base">lock</span>
            We don&apos;t use AI or save your data. Everything runs in your browser.
          </p>
        </footer>
      </div>
    </div>
  );
}
