export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          An example store. Every price comes from{" "}
          <a href="https://pricerules.app" className="font-medium text-foreground underline-offset-4 hover:underline">
            PriceRules
          </a>
          , resolved on the server with the{" "}
          <a href="https://pricerules.app/docs/sdk" className="font-medium text-foreground underline-offset-4 hover:underline">
            pricerules SDK
          </a>
          .
        </p>
        <nav className="flex gap-5">
          <a href="https://pricerules.app/docs" className="hover:text-foreground">
            Docs
          </a>
          <a href="https://pricerules.app/docs/api-reference" className="hover:text-foreground">
            API reference
          </a>
          <a href="https://github.com/dalisraieb/pricerules-nextjs-example" className="hover:text-foreground">
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
