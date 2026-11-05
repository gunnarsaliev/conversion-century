import { useTranslations } from "next-intl";
import { cn } from "cn";

// Agency partner seals. Alt text lives in the `PartnerBadges` messages.
const badges = [
  {
    key: "ahrefs",
    src: "https://media.cc-hub.online/ahrefs-agency-partner.png",
  },
  {
    key: "semrush",
    src: "https://media.cc-hub.online/semruch-agency-partner.png",
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
