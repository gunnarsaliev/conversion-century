"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTelegram,
  FaViber,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";

// Share options that work in every browser:
// - "Share…" opens the device's own share sheet (Web Share API). It only
//   shows where navigator.canShare() says the data can be shared, which is
//   mostly mobile browsers, Safari and Edge.
// - Plain links for each network open its share page in a new tab, so they
//   need no JavaScript or SDK and track nothing.
// - "Copy link" uses the Clipboard API, falling back to execCommand where
//   that isn't available (older browsers, non-HTTPS origins).

type Network = {
  key: "linkedin" | "facebook" | "x" | "whatsapp" | "viber" | "telegram" | "email";
  Icon: ComponentType<{ className?: string }>;
  href: (url: string, title: string) => string;
  // App and mail links open in place, the rest in a new tab.
  newTab: boolean;
};

const enc = encodeURIComponent;

const NETWORKS: Network[] = [
  {
    key: "linkedin",
    Icon: FaLinkedinIn,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    newTab: true,
  },
  {
    key: "facebook",
    Icon: FaFacebookF,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    newTab: true,
  },
  {
    key: "x",
    Icon: FaXTwitter,
    href: (url, title) => `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`,
    newTab: true,
  },
  {
    key: "whatsapp",
    Icon: FaWhatsapp,
    href: (url, title) => `https://wa.me/?text=${enc(`${title} ${url}`)}`,
    newTab: true,
  },
  {
    key: "viber",
    Icon: FaViber,
    href: (url, title) => `viber://forward?text=${enc(`${title} ${url}`)}`,
    newTab: false,
  },
  {
    key: "telegram",
    Icon: FaTelegram,
    href: (url, title) => `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
    newTab: true,
  },
  {
    key: "email",
    Icon: Mail,
    href: (url, title) => `mailto:?subject=${enc(title)}&body=${enc(`${title}\n\n${url}`)}`,
    newTab: false,
  },
];

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied: try the fallback below.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

const noopSubscribe = () => () => {};

const itemClass = cn(
  buttonVariants({ variant: "secondary", size: "icon-lg" }),
  "rounded-full text-muted-foreground hover:text-primary",
);

export function ShareButtons({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const t = useTranslations("Share");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // false on the server and during hydration, so both renders match; the
  // real value is read on the client right after.
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () =>
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare({ url, title })),
    () => false,
  );

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    if (!(await copyText(url))) return;
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ url, title });
    } catch (error) {
      // AbortError: the user closed the share sheet. Anything else (blocked
      // by policy, no targets): copy the link instead.
      if (!(error instanceof DOMException && error.name === "AbortError")) await copy();
    }
  };

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {canNativeShare && (
        <li>
          <button
            type="button"
            onClick={nativeShare}
            className={itemClass}
            aria-label={t("native")}
            title={t("native")}
          >
            <Share2 className="size-4" aria-hidden="true" />
          </button>
        </li>
      )}
      {NETWORKS.map(({ key, Icon, href, newTab }) => (
        <li key={key}>
          <a
            href={href(url, title)}
            className={itemClass}
            aria-label={t(key)}
            title={t(key)}
            {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
          >
            <Icon className="size-4" aria-hidden="true" />
          </a>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={copy}
          className={cn(itemClass, copied && "text-primary")}
          aria-label={copied ? t("copied") : t("copy")}
          title={copied ? t("copied") : t("copy")}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Link2 className="size-4" aria-hidden="true" />
          )}
        </button>
        <span role="status" className="sr-only">
          {copied ? t("copied") : ""}
        </span>
      </li>
    </ul>
  );
}
