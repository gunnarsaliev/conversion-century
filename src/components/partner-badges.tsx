import { useTranslations } from "next-intl";
import { cn } from "cn";

// Agency partner seals. Alt text lives in the `PartnerBadges` messages.
const badges = [
  {
    key: "ahrefs",
    src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/ahrefs-agency-partner.png",
  },
  {
    key: "semrush",
    src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/semruch-agency-partner.png",
  },
] as const;

interface PartnerBadgesProps {
  /** Tailwind size classes for each seal, e.g. "size-24". */
  badgeClassName?: string;
  className?: string;
}

export function PartnerBadges({
  badgeClassName = "size-24",
  className,
}: PartnerBadgesProps) {
  const t = useTranslations("PartnerBadges");

  return (
    <ul className={cn("flex items-center gap-4", className)}>
      {badges.map((badge) => (
        <li key={badge.key}>
          <img
            src={badge.src}
            alt={t(badge.key)}
            loading="lazy"
            className={cn("object-contain", badgeClassName)}
          />
        </li>
      ))}
    </ul>
  );
}
