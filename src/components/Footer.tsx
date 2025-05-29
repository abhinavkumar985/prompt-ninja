export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-800 text-slate-400 py-8 px-6 md:px-10 lg:px-16 text-center">
      <p className="text-sm">
        PromptNin is a developer tool for generating high-quality AI prompts.
        <br />
        All configurations are stored locally. No data is sent to any server.
      </p>
      <p className="text-xs mt-2">
        &copy; {currentYear} PromptNin. All rights reserved.
      </p>
    </footer>
  );
}
