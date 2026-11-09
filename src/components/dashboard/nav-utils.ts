"use client";

import * as React from "react";

// Dashboard routes navigate client-side; anything else (Payload's /admin)
// is a separate app and gets a full page load.
const isAppRoute = (href: string) => href === "/dashboard" || href.startsWith("/dashboard/");

// "⌘" on Apple devices, "Ctrl" elsewhere. The server (and hydration) render
// ⌘, then the client switches if needed — no mismatch, no effect.
const noopSubscribe = () => () => {};
const useModKey = () =>
  React.useSyncExternalStore(
    noopSubscribe,
    () => (/mac|iphone|ipad/i.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "⌘",
  );

export { isAppRoute, useModKey };
