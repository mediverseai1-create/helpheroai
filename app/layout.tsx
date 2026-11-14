import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HelpHeroAI: AI and human customer support", template: "%s | HelpHeroAI" },
  description: "A shared inbox, knowledge hub and AI agent that resolves customer questions from your own docs and hands off to your team when it should.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
