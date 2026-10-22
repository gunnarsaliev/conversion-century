"use client";

import { Cake, PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";

import { BannerStandard } from "@/components/banner-standard-1";
import type { Celebration } from "@/lib/celebrations";

// ---------------------------------------------------------------------------
// Celebration banners
// ---------------------------------------------------------------------------
//
// Birthday and work anniversary banners for the dashboard overview, one per
// celebration (see getTeamCelebrations in lib/celebrations). The signed-in
// user is congratulated directly; everyone else's are announced, birthdays
// with a link to the team chat.
// A closed banner stays closed for that user until the celebration comes
// round again (the dashboard page drops their dismissed ids, see
// lib/banner-dismissal).

// Team chat space in Google Chat, where birthday wishes go.
const BIRTHDAY_CHAT_URL = "https://mail.google.com/mail/u/0/#chat/space/AAQAISbOhos";

export function CelebrationBanner({ celebration }: { celebration: Celebration }) {
  const t = useTranslations("Celebrations");
  const { id, kind, name, isCurrentUser, years = 0 } = celebration;

  if (kind === "birthday") {
    return (
      <BannerStandard
        icon={Cake}
        tone="pink"
        dismissKey={id}
        action={isCurrentUser ? undefined : { label: t("makeItSpecial"), href: BIRTHDAY_CHAT_URL }}
      >
        {isCurrentUser
          ? t("birthdaySelf", { name })
          : t("birthdayOther", { name })}
      </BannerStandard>
    );
  }

  return (
    <BannerStandard icon={PartyPopper} tone="amber" dismissKey={id}>
      {isCurrentUser
        ? t("anniversarySelf", { name, years })
        : t("anniversaryOther", { name, years })}
    </BannerStandard>
  );
}
