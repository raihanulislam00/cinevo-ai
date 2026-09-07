"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLogin, useRegister } from "@/hooks/use-data";
import { apiError } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Tell us your name"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(
      mode === "login" ? loginSchema : registerSchema,
    ) as unknown as Resolver<RegisterValues>,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  async function submit(values: RegisterValues) {
    try {
      if (mode === "login") {
        await login.mutateAsync(values);
        router.push("/dashboard");
      } else {
        const result = await register.mutateAsync(values);
        toast.success(`Welcome, ${result.name}. You can sign in now.`);
        router.push("/login");
      }
    } catch (error) {
      toast.error(apiError(error));
    }
  }
  const pending = login.isPending || register.isPending;
  return (
    <div className="min-h-screen bg-[#f7f8f5] px-6 py-8">
      <Link href="/" className="display text-xl font-bold text-[#173b39]">
        <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#ee7967]" />
        cinevo<span className="text-[#0d8478]">.</span>
      </Link>
      <main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-md items-center justify-center">
        <div className="w-full rounded-4xl border border-[#e4e8e3] bg-white p-8 shadow-xl shadow-[#173b39]/5 sm:p-10">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1f3eb] text-[#0d8478]">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold uppercase tracking-[.15em] text-[#ee7967]">
            {mode === "login" ? "Welcome back" : "New creative space"}
          </p>
          <h1 className="display mt-2 text-4xl font-bold text-[#173b39]">
            {mode === "login"
              ? "Return to your studio."
              : "Make room for ideas."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#7a8782]">
            {mode === "login"
              ? "Pick up where your next story left off."
              : "Create an account and turn your first spark into a video."}
          </p>
          <form onSubmit={form.handleSubmit(submit)} className="mt-8 space-y-5">
            {mode === "register" && (
              <Field label="Name" error={form.formState.errors.name?.message}>
                <input
                  {...form.register("name")}
                  placeholder="Alex Morgan"
                  className="input"
                />
              </Field>
            )}
            <Field label="Email" error={form.formState.errors.email?.message}>
              <input
                type="email"
                {...form.register("email")}
                placeholder="you@example.com"
                className="input"
              />
            </Field>
            <Field
              label="Password"
              error={form.formState.errors.password?.message}
            >
              <input
                type="password"
                {...form.register("password")}
                placeholder="At least 8 characters"
                className="input"
              />
            </Field>
            {mode === "register" && (
              <Field
                label="Confirm password"
                error={form.formState.errors.confirmPassword?.message}
              >
                <input
                  type="password"
                  {...form.register("confirmPassword")}
                  placeholder="Repeat your password"
                  className="input"
                />
              </Field>
            )}
            <button
              disabled={pending}
              className="w-full rounded-xl bg-[#173b39] py-3.5 font-semibold text-white transition hover:bg-[#0d8478] disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-[#7a8782]">
            {mode === "login" ? "New to Cinevo?" : "Already have an account?"}{" "}
            <Link
              className="font-bold text-[#0d8478]"
              href={mode === "login" ? "/register" : "/login"}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-[#344b46]">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs font-normal text-[#d85f51]">
          {error}
        </span>
      )}
    </label>
  );
}
