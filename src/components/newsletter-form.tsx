"use client";

import { SubmitEvent, useState, useTransition } from "react";

import { subscribeToNewsletter } from "@/app/[locale]/(frontend)/newsletter/actions";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewsletterForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <p className="max-w-sm text-sm text-muted-foreground" role="status">
        Thanks for subscribing! You&apos;ll receive our next newsletter in your
        inbox.
      </p>
    );
  }

  return (
    <form
      className="grid w-full max-w-sm items-center gap-1.5"
      onSubmit={handleSubmit}
    >
      <Label htmlFor="newsletter-email">Subscribe to our newsletter</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          className="bg-input/30"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <label className="mt-1 flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-3.5 shrink-0 accent-primary"
        />
        <span>
          I agree to receive marketing emails from Conversion Century and can
          unsubscribe at any time. See our
          <Link
            href="/legal/privacy-policy"
            className="ml-1 text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export { NewsletterForm };
