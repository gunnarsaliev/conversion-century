# Payload Signup / Login via Signup10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Real, working email + password signup and login, backed by a new Payload `Users` auth collection, using `src/components/signup10.tsx` as the shared form for both flows.

**Architecture:** Payload's built-in `auth: true` collection provides REST endpoints (`POST /api/users`, `POST /api/users/login`) with cookie-based sessions — no custom auth logic needed. `Signup10` becomes a controlled client component with a `mode` prop that toggles copy/endpoint/redirect-link. Two thin server-component pages (`/signup`, `/login`) render it in each mode.

**Tech Stack:** Payload CMS 3 (`@payloadcms/db-postgres`), Next.js 16 App Router, React 19, shadcn/base-ui `Button`/`Input`/`Separator`.

## Global Constraints

- Auth method: email + password only via Payload's native auth. No Google OAuth (spec: out of scope).
- Redirect target after successful signup or login: `/` (home page).
- Routes: `/signup` and `/login` (not nested under `/auth`).
- Remove the non-functional "Sign up with Google" button and its `or` separator from `signup10.tsx` entirely.
- No test framework exists in this repo — verification is manual (spec section 5), not automated tests.
- Users collection has no fields beyond Payload's built-in `email`/`password` (YAGNI — spec explicitly scopes out roles/verification/reset).

---

### Task 1: Payload `Users` auth collection

**Files:**
- Create: `src/collections/Users.ts`
- Modify: `payload.config.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: Payload REST endpoints `POST /api/users` (create/register), `POST /api/users/login`, `POST /api/users/logout`, `GET /api/users/me`, available once the dev server picks up the new collection. Later tasks (2, 3) call `POST /api/users` and `POST /api/users/login` by URL only — no imports needed.

- [ ] **Step 1: Create the Users collection**

```ts
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
```

- [ ] **Step 2: Register it in payload.config.ts**

Read `payload.config.ts` first, then apply this diff:

```ts
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'

import { Users } from './src/collections/Users'

export default buildConfig({
  editor: lexicalEditor(),

  collections: [Users],

  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,
})
```

- [ ] **Step 3: Start the dev server and let Payload migrate the schema**

Run: `pnpm dev` (or your existing dev command), then visit `http://localhost:3000/admin`.
Expected: Payload boots without errors and prompts you to create the first admin user (this confirms the `users` table was created in Postgres). Stop the dev server after confirming (Ctrl+C) — don't create the admin user yet, Task 4's manual verification will do real signups.

If it errors instead, use systematic-debugging before continuing — do not proceed to Task 2 with a broken collection.

- [ ] **Step 4: Commit**

```bash
git add src/collections/Users.ts payload.config.ts
git commit -m "Add Payload Users auth collection

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Extend `Signup10` with password field, mode prop, and real submit logic

**Files:**
- Modify: `src/components/signup10.tsx` (full rewrite of the component body)

**Interfaces:**
- Consumes: Payload REST endpoints from Task 1 (`POST /api/users`, `POST /api/users/login`), both accepting JSON body `{ email: string, password: string }` and returning `{ errors: [{ message: string }] }` on failure.
- Produces: `Signup10` component with props `{ className?: string; mode?: 'signup' | 'login' }` (default `mode = 'signup'`), default export unchanged (`export { Signup10 }`). Later tasks (3) import `{ Signup10 }` from `@/components/signup10` and pass `mode="signup"` / `mode="login"`.

- [ ] **Step 1: Rewrite the component**

Read `src/components/signup10.tsx` first (needed before editing), then replace its full contents:

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/signup10.tsx
git commit -m "Add password field, mode prop, and real auth submit to Signup10

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: `/signup` and `/login` pages

**Files:**
- Create: `src/app/(frontend)/signup/page.tsx`
- Create: `src/app/(frontend)/login/page.tsx`

**Interfaces:**
- Consumes: `Signup10` component from Task 2 (`import { Signup10 } from '@/components/signup10'`, props `{ mode: 'signup' | 'login' }`).
- Produces: routes `/signup` and `/login` in the running app. Nothing downstream depends on these files.

- [ ] **Step 1: Create the signup page**

```tsx
// src/app/(frontend)/signup/page.tsx
import { Signup10 } from "@/components/signup10";

export default function SignupPage() {
  return <Signup10 mode="signup" />;
}
```

- [ ] **Step 2: Create the login page**

```tsx
// src/app/(frontend)/login/page.tsx
import { Signup10 } from "@/components/signup10";

export default function LoginPage() {
  return <Signup10 mode="login" />;
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/signup/page.tsx" "src/app/(frontend)/login/page.tsx"
git commit -m "Add /signup and /login routes

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Manual end-to-end verification

**Files:** none (verification only — no code changes expected unless a bug is found, in which case fix it in the relevant file from Tasks 1–3 and re-run this task's steps).

**Interfaces:**
- Consumes: the full running app (Tasks 1–3).
- Produces: confirmation the feature works, or a bug report to fix before considering the plan done.

- [ ] **Step 1: Start the dev server**

Run: `pnpm dev`
Expected: starts with no errors, `http://localhost:3000` reachable.

- [ ] **Step 2: Visit /signup and confirm the form renders**

Visit `http://localhost:3000/signup` in a browser.
Expected: heading "Create your free account", email input, password input, "Continue" button, footer "Already a user? Log in" linking to `/login`. No "Sign up with Google" button present.

- [ ] **Step 3: Sign up a new user**

Fill in a new email (e.g. `test-signup@example.com`) and a password (8+ characters — Payload's default minimum), click Continue.
Expected: redirected to `http://localhost:3000/`.

- [ ] **Step 4: Confirm the user was created**

Visit `http://localhost:3000/admin`, log in as the first admin (create one now if Task 1 Step 3 didn't already), navigate to the Users collection.
Expected: `test-signup@example.com` appears in the list.

- [ ] **Step 5: Log in with the new user**

In a private/incognito window (to avoid the existing session cookie), visit `http://localhost:3000/login`, enter `test-signup@example.com` and the same password, click "Log in".
Expected: redirected to `http://localhost:3000/`.

- [ ] **Step 6: Confirm duplicate-email error on signup**

Visit `/signup` again, use the same email `test-signup@example.com` with any password, submit.
Expected: inline error message appears (e.g. "Email is already registered" or similar Payload-provided message), no redirect.

- [ ] **Step 7: Confirm wrong-password error on login**

Visit `/login`, use `test-signup@example.com` with an incorrect password, submit.
Expected: inline error message appears, no redirect.

- [ ] **Step 8: Report results**

State plainly which steps passed and which failed, with actual error text/screenshots-in-words for any failures. If all steps passed, the feature is complete — no commit needed for this task since it's verification-only.

---

## Summary

| Task | Deliverable |
|---|---|
| 1 | `Users` auth collection registered in Payload |
| 2 | `Signup10` supports password + `mode` prop + real submit |
| 3 | `/signup` and `/login` routes |
| 4 | Manual verification of the full flow |
