import { MarketingShell } from "@/components/marketing";

export const metadata = { title: "Contact" };

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl font-bold">Talk to us</h1>
        <p className="mt-6 text-ink/70">
          {email ? <>Email <a className="underline" href={`mailto:${email}`}>{email}</a> and we will reply within one business day.</> : "Support contact details will appear here once configured (NEXT_PUBLIC_SUPPORT_EMAIL)."}
        </p>
      </section>
    </MarketingShell>
  );
}
