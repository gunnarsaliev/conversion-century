"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Signup10Props {
  className?: string;
  mode?: "signup" | "login";
}

const COPY = {
  signup: {
    heading: "Create your free account",
    submitLabel: "Continue",
    submittingLabel: "Creating account…",
    endpoint: "/api/users",
    footerPrompt: "Already a user?",
    footerLinkLabel: "Log in",
    footerLinkHref: "/login",
  },
  login: {
    heading: "Log in to your account",
    submitLabel: "Log in",
    submittingLabel: "Logging in…",
    endpoint: "/api/users/login",
    footerPrompt: "New here?",
    footerLinkLabel: "Sign up",
    footerLinkHref: "/signup",
  },
} as const;

const Signup10 = ({ className, mode = "signup" }: Signup10Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = COPY[mode];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(copy.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
        return;
      }

      let message = "Something went wrong, please try again.";
      try {
        const data = await res.json();
        if (data?.errors?.[0]?.message) {
          message = data.errors[0].message;
        }
      } catch {
        // response had no JSON body; keep generic message
      }
      setError(message);
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={cn("bg-background", className)}>
      <div className="container flex min-h-screen flex-col items-center justify-between gap-20 py-16 lg:flex-row lg:px-0 lg:py-0">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center">
            <img
              className="h-14 w-12"
              alt="Logo"
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
            />
          </div>

          <h1 className="mb-8 w-full text-center text-3xl font-medium tracking-tighter text-foreground md:text-4xl">
            {copy.heading}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-lg flex-col gap-6"
          >
            <Input
              className="h-14 rounded-full border-none bg-muted px-5 py-4 font-medium"
              placeholder="Enter Your Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              className="h-14 rounded-full border-none bg-muted px-5 py-4 font-medium"
              placeholder="Enter Your Password"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error && (
              <p className="w-full text-center text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="h-14 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <span className="font-medium tracking-tight">
                {submitting ? copy.submittingLabel : copy.submitLabel}
              </span>
            </Button>
          </form>

          <p className="mb-8 w-full text-center text-sm tracking-tight text-foreground/40">
            <span>By proceeding, you accept the shadcnblocks.com</span>{" "}
            <span className="cursor-pointer underline">Terms</span>
            <span> and </span>
            <span className="cursor-pointer underline">Privacy Policy</span>
          </p>

          <p className="mb-20 w-full text-center text-sm font-medium tracking-tight">
            {copy.footerPrompt}{" "}
            <Link href={copy.footerLinkHref} className="underline">
              {copy.footerLinkLabel}
            </Link>
          </p>
        </div>
        <div className="hidden h-screen w-full bg-muted lg:block">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-7-tall.svg"
            className="size-full object-cover"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export { Signup10 };
