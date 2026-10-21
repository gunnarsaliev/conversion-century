import { Cake, PartyPopper } from "lucide-react";

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

const pluralYears = (years: number) => `${years} ${years === 1 ? "year" : "years"}`;

export function CelebrationBanner({ celebration }: { celebration: Celebration }) {
  const { id, kind, name, isCurrentUser, years = 0 } = celebration;

  if (kind === "birthday") {
    return (
      <BannerStandard
        icon={Cake}
        tone="pink"
        dismissKey={id}
        action={isCurrentUser ? undefined : { label: "Make it special", href: BIRTHDAY_CHAT_URL }}
      >
        {isCurrentUser
          ? `Happy birthday, ${name}! 🎉 Wishing you a wonderful day from the whole team.`
          : `It's ${name}'s birthday today 🎂 Don't forget to wish them well!`}
      </BannerStandard>
    );
  }

  return (
    <BannerStandard icon={PartyPopper} tone="amber" dismissKey={id}>
      {isCurrentUser
        ? `Happy work anniversary, ${name}! 🥳 ${pluralYears(years)} with the team today. Thank you for everything you do.`
        : `${name} celebrates ${pluralYears(years)} with the team today 🥳`}
    </BannerStandard>
  );
}
