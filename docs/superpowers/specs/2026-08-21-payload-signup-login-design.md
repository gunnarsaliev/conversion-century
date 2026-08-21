# Payload Signup / Login via Signup10

## Context

The app has Payload CMS installed and configured (`payload.config.ts`), but `collections: []` is empty — there's no auth backend yet. `src/components/signup10.tsx` is a static shadcn-style UI block (email input, "Sign up with Google" button, "Continue" button, "Log in" text link) with no wiring to any backend and no password field.

The goal: real, working email + password signup and login against Payload, using `signup10.tsx` as the shared form component for both flows.

## Scope

- Add a `Users` auth collection to Payload.
- Extend `Signup10` with a password field and a `mode` prop so it serves both signup and login.
- Add `/signup` and `/login` pages under `src/app/(frontend)`.
- Wire the form to Payload's REST auth endpoints.
- Remove the non-functional "Sign up with Google" button (Google OAuth is out of scope).

Out of scope: Google OAuth, password reset, email verification, a post-login dashboard/account area, roles/permissions beyond Payload's defaults.

## Design

### 1. Payload `Users` collection

New file `src/collections/Users.ts`:

```ts
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

Registered in `payload.config.ts`:

```ts
import { Users } from './src/collections/Users'
// ...
collections: [Users],
```

`auth: true` gives Payload's built-in email + hashed-password storage and the REST endpoints `POST /api/users` (create/register), `POST /api/users/login`, `POST /api/users/logout`, `GET /api/users/me` for free — no custom auth logic needed.

### 2. `Signup10` component changes

`src/components/signup10.tsx`:

- Add `mode?: 'signup' | 'login'` prop, default `'signup'`.
- Add a `Password` `<Input type="password">` between the email input and the submit button.
- Remove the "Sign up with Google" button and its `or` `<Separator>` row entirely (dead UI, out of scope).
- Convert to a controlled client form:
  - `useState` for `email`, `password`, `error`, `submitting`.
  - `onSubmit` (form submit, not just button click) prevents default, sets `submitting`, clears `error`.
  - Mode-driven copy:
    - `signup`: heading "Create your free account", submit button "Continue", footer "Already a user? **Log in**" (link to `/login`).
    - `login`: heading "Log in to your account", submit button "Log in", footer "New here? **Sign up**" (link to `/signup`).
  - Submit handler:
    - `signup` → `fetch('/api/users', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password }) })`
    - `login` → `fetch('/api/users/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password }) })`
    - Both include `credentials: 'include'` so Payload's auth cookie is set.
    - On `res.ok` → `router.push('/')` (using `next/navigation`'s `useRouter`).
    - On failure → parse `{ errors: [{ message }] }` from the JSON body and show the first `message` in an inline error area above the submit button; fall back to a generic "Something went wrong, please try again." if parsing fails or the response has no body.
  - Submit button shows a disabled/loading state while `submitting` is true.

### 3. Routes

- `src/app/(frontend)/signup/page.tsx` — renders `<Signup10 mode="signup" />`
- `src/app/(frontend)/login/page.tsx` — renders `<Signup10 mode="login" />`

Both are simple server components that just render the client `Signup10`.

### 4. Error handling

- Duplicate email on signup, wrong password on login, weak password, missing fields — all surfaced via Payload's `errors[0].message` inline under the form.
- Unexpected/network errors — generic fallback message, logged to console for debugging.

### 5. Testing

No existing test framework in this repo. Verification will be manual:
1. `pnpm dev`, confirm `/signup` and `/login` render.
2. Sign up a new user — confirm redirect to `/`, confirm user row exists (via `/admin` or DB).
3. Log out (clear cookie / hit `/api/users/logout`), log in with the same credentials — confirm redirect to `/`.
4. Attempt signup with an already-used email — confirm inline error.
5. Attempt login with wrong password — confirm inline error.

## Open questions / risks

- None outstanding — all major decisions (auth method, form reuse, redirect target, routes) were confirmed with the user during brainstorming.
