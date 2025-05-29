export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} PromptCraft AI. All rights reserved.</p>
        <p className="mt-1">Crafting the Future of AI Prompts.</p>
      </div>
    </footer>
  );
}
