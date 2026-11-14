"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { supabaseBrowser } from "@/lib/supabase/client";

type Mode = "login" | "signup" | "forgot" | "reset";
const Email = z.string().email("Enter a valid email address.");
const Pass = z.string().min(8, "Password must be at least 8 characters.");

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (mode !== "reset") {
      const r = Email.safeParse(email);
      if (!r.success) return setErr(r.error.issues[0].message);
    }
    if (mode !== "forgot") {
      const r = Pass.safeParse(password);
      if (!r.success && mode !== "login") return setErr(r.error.issues[0].message);
      if (mode === "login" && !password) return setErr("Enter your password.");
    }
    setBusy(true);
    const sb = supabaseBrowser();
    const origin = window.location.origin;
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) return setErr("Incorrect email or password.");
        router.push(next && next.startsWith("/app") ? next : "/app");
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback` } });
        if (error) return setErr(error.message);
        if (data.session) { router.push("/app"); router.refresh(); }
        else setInfo("Check your inbox to confirm your email, then sign in.");
      } else if (mode === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (error) return setErr(error.message);
        setInfo("If that email has an account, a reset link is on its way.");
      } else {
        const { error } = await sb.auth.updateUser({ password });
        if (error) return setErr(error.message);
        router.push("/app");
      }
    } finally {
      setBusy(false);
    }
  }

  const title = { login: "Sign in", signup: "Start your free trial", forgot: "Reset your password", reset: "Choose a new password" }[mode];
  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-bold">{title}</h1>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {mode !== "reset" && (
          <div>
            <label className="label" htmlFor="email">Work email</label>
            <input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        {mode !== "forgot" && (
          <div>
            <label className="label" htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label>
            <input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        {info && <p role="status" className="text-sm text-green-800">{info}</p>}
        <button className="btn-accent w-full" disabled={busy}>{busy ? "Please wait…" : title}</button>
      </form>
      <div className="mt-5 space-y-1 text-sm text-ink/70">
        {mode === "login" && (<><p><Link className="underline" href="/forgot-password">Forgot password?</Link></p><p>New here? <Link className="underline" href="/signup">Start a free trial</Link></p></>)}
        {mode === "signup" && <p>Already have an account? <Link className="underline" href="/login">Sign in</Link></p>}
        {mode === "forgot" && <p><Link className="underline" href="/login">Back to sign in</Link></p>}
      </div>
    </div>
  );
}
