export type PlanId = "trial" | "starter" | "growth" | "scale";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number | null;
  priceAnnualPerMonth: number | null;
  seats: number;
  aiRepliesPerMonth: number;
  features: string[];
}

// Placeholder pricing: confirm before launch.
export const PLANS: Record<PlanId, Plan> = {
  trial: { id: "trial", name: "Free trial", priceMonthly: null, priceAnnualPerMonth: null, seats: 2, aiRepliesPerMonth: 50, features: ["14 days", "No card required"] },
  starter: { id: "starter", name: "Starter", priceMonthly: 29, priceAnnualPerMonth: 24, seats: 2, aiRepliesPerMonth: 200, features: ["Shared inbox", "Hero Agent", "Public help center", "Chat page"] },
  growth: { id: "growth", name: "Growth", priceMonthly: 89, priceAnnualPerMonth: 74, seats: 6, aiRepliesPerMonth: 1500, features: ["Everything in Starter", "Draft replies for agents", "Reports", "Priority support"] },
  scale: { id: "scale", name: "Scale", priceMonthly: 199, priceAnnualPerMonth: 165, seats: 20, aiRepliesPerMonth: 6000, features: ["Everything in Growth", "20 seats", "6,000 AI replies", "Onboarding call"] },
};

export const PAID_PLANS: PlanId[] = ["starter", "growth", "scale"];

export function paymentLink(plan: PlanId, annual: boolean): string | null {
  // NEXT_PUBLIC vars must be referenced statically to be inlined.
  const links: Record<string, string | undefined> = {
    starter_monthly: process.env.NEXT_PUBLIC_PAYMENT_LINK_STARTER_MONTHLY,
    starter_annual: process.env.NEXT_PUBLIC_PAYMENT_LINK_STARTER_ANNUAL,
    growth_monthly: process.env.NEXT_PUBLIC_PAYMENT_LINK_GROWTH_MONTHLY,
    growth_annual: process.env.NEXT_PUBLIC_PAYMENT_LINK_GROWTH_ANNUAL,
    scale_monthly: process.env.NEXT_PUBLIC_PAYMENT_LINK_SCALE_MONTHLY,
    scale_annual: process.env.NEXT_PUBLIC_PAYMENT_LINK_SCALE_ANNUAL,
  };
  return links[`${plan}_${annual ? "annual" : "monthly"}`] || null;
}

export function isActive(org: { subscription_status: string; trial_ends_at: string }): boolean {
  if (org.subscription_status === "active") return true;
  if (org.subscription_status === "trialing") return new Date(org.trial_ends_at).getTime() > Date.now();
  return false;
}
