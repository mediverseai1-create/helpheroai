import { AgentTester } from "@/components/Forms";

export const metadata = { title: "Hero Agent" };

export default function Agent() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold">Hero Agent</h1>
      <p className="mb-6 mt-2 text-sm text-ink/70">Test how the agent answers before customers see it. It uses your Knowledge Hub, and hands off below 60% confidence or when nothing relevant is found. Tests count toward your monthly AI replies.</p>
      <AgentTester />
    </div>
  );
}
