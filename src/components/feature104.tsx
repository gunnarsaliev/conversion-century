import {
  HandHeart,
  Handshake,
  Medal,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
interface Feature104Props {
  className?: string;
}

// Copy lives in the `Feature104` messages (`points.<key>`).
const LEFT_POINTS = [
  { key: "seniorSpecialists", icon: Users },
  { key: "honestAssessment", icon: UserCheck },
  { key: "invested", icon: HandHeart },
] as const;

const RIGHT_POINTS = [
  { key: "sustainable", icon: ShieldCheck },
  { key: "evolving", icon: Sparkles },
  { key: "collaboration", icon: Handshake },
] as const;

const Feature104 = ({ className }: Feature104Props) => {
  const t = useTranslations("Feature104");

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Badge
            variant="outline"
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm"
          >
            <Medal className="h-auto w-4" />
            {t("badge")}
          </Badge>
          <h2 className="text-center text-3xl font-semibold lg:text-4xl">
            {t("heading")}
          </h2>
          <p className="text-center text-muted-foreground lg:text-lg">
            {t("subheading")}
          </p>
        </div>
        <div className="gap mt-14 grid gap-2.5 lg:grid-cols-3">
          <div className="flex flex-col gap-2.5">
            {LEFT_POINTS.map(({ key, icon: Icon }) => (
              <div key={key} className="gap flex flex-col gap-3 rounded-lg border p-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-auto w-6" />
                  </span>
                  <h3 className="font-medium">{t(`points.${key}.title`)}</h3>
                </div>
                <p className="text-sm text-muted-foreground md:text-base">
                  {t(`points.${key}.description`)}
                </p>
              </div>
            ))}
          </div>

          <img
            src="https://images.unsplash.com/photo-1590098563176-07884b06d7f7"
            alt=""
            className="hidden h-full rounded-lg object-cover lg:block"
          />
          <div className="flex flex-col gap-2.5">
            {RIGHT_POINTS.map(({ key, icon: Icon }) => (
              <div key={key} className="gap flex flex-col gap-3 rounded-lg border p-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-12 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-auto w-6" />
                  </span>
                  <h3 className="font-medium">{t(`points.${key}.title`)}</h3>
                </div>
                <p className="text-sm text-muted-foreground md:text-base">
                  {t(`points.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature104 };
