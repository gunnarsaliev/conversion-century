import {
  BarChart3,
  Handshake,
  Medal,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
// A point from the CMS; `icon` is a key of ICONS.
interface Feature104Point {
  title: string;
  description?: string | null;
  icon?: string | null;
}

interface Feature104Props {
  className?: string;
  badge?: string;
  heading?: string;
  subheading?: string;
  image?: { src: string; alt: string };
  // Replaces the default points. The first half is shown left of the image,
  // the rest right of it.
  points?: Feature104Point[];
}

// The icons a point can use, by the name stored in the CMS.
const ICONS = { Users, UserCheck, BarChart3, ShieldCheck, Sparkles, Handshake };

// Default copy lives in the `Feature104` messages (`points.<key>`).
const DEFAULT_POINTS = [
  { key: "directAccess", icon: "Users" },
  { key: "honestAdvice", icon: "UserCheck" },
  { key: "measurement", icon: "BarChart3" },
  { key: "lastingImprovements", icon: "ShieldCheck" },
  { key: "learning", icon: "Sparkles" },
  { key: "collaboration", icon: "Handshake" },
] as const;

const DEFAULT_IMAGE = {
  src: "https://media.cc-hub.online/Mint-toned%20workspace%20with%20branded%20mascots.png",
  alt: "",
};

const PointCards = ({ points }: { points: Feature104Point[] }) => (
  <div className="flex flex-col gap-2.5">
    {points.map(({ title, description, icon }) => {
      const Icon = ICONS[icon as keyof typeof ICONS];
      return (
        <div key={title} className="gap flex flex-col gap-3 rounded-lg border p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-12 items-center justify-center rounded-md bg-muted">
              {Icon && <Icon className="h-auto w-6" />}
            </span>
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
      );
    })}
  </div>
);

const Feature104 = (props: Feature104Props) => {
  const t = useTranslations("Feature104");
  const {
    className,
    badge = t("badge"),
    heading = t("heading"),
    subheading = t("subheading"),
    image = DEFAULT_IMAGE,
  } = props;
  const points: Feature104Point[] =
    props.points && props.points.length > 0
      ? props.points
      : DEFAULT_POINTS.map(({ key, icon }) => ({
          icon,
          title: t(`points.${key}.title`),
          description: t(`points.${key}.description`),
        }));
  const half = Math.ceil(points.length / 2);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm"
          >
            <Medal className="h-auto w-4" />
            {badge}
          </Badge>
          <h2 className="text-center text-3xl font-semibold lg:text-4xl">
            {heading}
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg">
            {subheading}
          </p>
        </div>
        <div className="gap mt-14 grid gap-2.5 lg:grid-cols-3">
          <PointCards points={points.slice(0, half)} />

          {/* Desktop only. next/image lazy-loads, so mobile (display: none)
              never downloads it; the original is resized per breakpoint. */}
          <div className="relative hidden overflow-hidden rounded-lg lg:block">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1280px) 400px, 33vw"
              className="object-cover"
            />
          </div>
          <PointCards points={points.slice(half)} />
        </div>
      </div>
    </section>
  );
};

export { Feature104 };
