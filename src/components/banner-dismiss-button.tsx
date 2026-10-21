"use client";

import { BannerClose } from "@/components/kibo-ui/banner";
import { dismissBanner } from "@/lib/banner-dismissal-actions";

// ---------------------------------------------------------------------------
// Banner dismiss button
// ---------------------------------------------------------------------------
//
// Close button for BannerStandard. With a `dismissKey` the dismissal is also
// saved for the signed-in user (see lib/banner-dismissal); without one it
// only hides the banner until the next page load.

export function BannerDismissButton({
  dismissKey,
  className,
}: {
  dismissKey?: string;
  className?: string;
}) {
  return (
    <BannerClose
      aria-label="Dismiss"
      className={className}
      onClick={() => {
        if (dismissKey) dismissBanner(dismissKey).catch(console.error);
      }}
    />
  );
}
