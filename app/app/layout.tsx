import Link from "next/link";
import { requireContext } from "@/lib/session";
import { signOut } from "./actions";
import { Logo } from "@/components/marketing";
import { PLANS, isActive } from "@/lib/plans";

const links = [
  ["/app", "Dashboard"], ["/app/inbox", "Inbox"], ["/app/knowledge", "Knowledge Hub"], ["/app/agent", "Hero Agent"],
  ["/app/reports", "Reports"], ["/app/billing", "Billing"], ["/app/settings", "Settings"],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { org, user } = await requireContext();
  const active = isActive(org);
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <Logo />
        <p className="mt-4 truncate text-sm font-semibold">{org.name}</p>
        <p className="text-xs text-ink/60">{PLANS[org.plan].name}</p>
        <nav aria-label="App" className="mt-4 flex gap-1 overflow-x-auto md:flex-col">
          {links.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-sand">{l}</Link>)}
        </nav>
        <form action={signOut} className="mt-4"><p className="truncate text-xs text-ink/60">{user.email}</p><button className="mt-1 text-sm underline">Sign out</button></form>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        {!active && (
          <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
            Your trial or subscription is not active, so the AI agent is paused and new chats go straight to your team. <Link className="underline" href="/app/billing">Choose a plan</Link>.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
