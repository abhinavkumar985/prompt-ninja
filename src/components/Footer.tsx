export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background px-10 py-6 text-center">
      <p className="text-sm text-muted-foreground">
        PromptNin is a developer tool for generating high-quality AI prompts.
        <br />
        All configurations are stored locally. No data is sent to any server.
      </p>
      <p className="text-xs mt-2 text-muted-foreground/80">
        &copy; {currentYear} PromptNin. All rights reserved. An open-source project by the community, for the community.
      </p>
    </footer>
  );
}
