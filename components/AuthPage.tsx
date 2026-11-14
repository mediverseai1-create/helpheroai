import { Suspense } from "react";
import { Logo } from "@/components/marketing";
import AuthForm from "@/components/AuthForm";

export default function AuthPage({ mode }: { mode: "login" | "signup" | "forgot" | "reset" }) {
  return (
    <div className="flex min-h-screen flex-col px-5 py-6">
      <Logo />
      <div className="flex flex-1 items-center py-10">
        <Suspense>
          <AuthForm mode={mode} />
        </Suspense>
      </div>
    </div>
  );
}
