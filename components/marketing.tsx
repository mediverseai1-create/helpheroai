import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-lg font-bold ${light ? "text-paper" : "text-ink"}`}>
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-hero text-sm text-white">H</span>
      HelpHeroAI
    </Link>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav aria-label="Main" className="hidden gap-7 text-sm font-medium md:flex">
          <Link href="/#product">Product</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-3 py-2 text-sm font-medium">Sign in</Link>
          <Link href="/signup" className="btn-primary">Start free trial</Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-3 max-w-sm text-sm text-paper/60">Customer support where the AI answers from your docs, and your team takes over the moment it should.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Product</p>
          <Link className="block text-paper/60" href="/#product">Features</Link>
          <Link className="block text-paper/60" href="/pricing">Pricing</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link className="block text-paper/60" href="/about">About</Link>
          <Link className="block text-paper/60" href="/contact">Contact</Link>
        </div>
      </div>
      <p className="border-t border-paper/10 py-5 text-center text-xs text-paper/50">© {new Date().getFullYear()} HelpHeroAI. All rights reserved.</p>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
