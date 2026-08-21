"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import officeImage from "@/images/office.jpg";

interface Signup10Props {
  className?: string;
}

const Signup10 = ({ className }: Signup10Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/getting-started");
        return;
      }

      let message = "Something went wrong, please try again.";
      try {
        const data = await res.json();
        const err = data?.errors?.[0];
        const nestedMessage = err?.data?.errors?.[0]?.message;
        if (nestedMessage ?? err?.message) {
          message = nestedMessage ?? err.message;
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
    <section className={cn("w-full bg-background", className)}>
      <div className="flex min-h-screen flex-col items-center justify-between gap-20 py-16 lg:flex-row lg:gap-0 lg:py-0">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 px-6 lg:w-1/2 lg:px-0">
          <div className="flex h-14 w-14 items-center justify-center">
            <img
              className="h-14 w-12"
              alt="Logo"
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
            />
          </div>

          <h1 className="mb-8 w-full text-center text-3xl font-medium tracking-tighter text-foreground md:text-4xl">
            Log in to your account
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
              autoComplete="current-password"
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
                {submitting ? "Logging in…" : "Log in"}
              </span>
            </Button>
          </form>

          <p className="mb-20 w-full text-center text-sm tracking-tight text-foreground/40">
            <span>By proceeding, you accept the shadcnblocks.com</span>{" "}
            <span className="cursor-pointer underline">Terms</span>
            <span> and </span>
            <span className="cursor-pointer underline">Privacy Policy</span>
          </p>
        </div>
        <div className="relative hidden h-screen w-full bg-muted lg:block lg:w-1/2">
          <Image
            src={officeImage}
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export { Signup10 };
