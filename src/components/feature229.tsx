import {
  CheckIcon,
  HeadphonesIcon,
  PuzzleIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

/** A plain string, or a bold lead-in followed by text. */
export type Feature229Item = string | { label: string; text: string };

export interface Feature229Group {
  title: string;
  icon?: LucideIcon;
  features: Feature229Item[];
}

interface Feature229Props {
  heading?: string;
  description?: string;
  groups?: Feature229Group[];
  /** Prefix each group title with "1.", "2.", … */
  numbered?: boolean;
  /** Groups per row from tablet up; 3 by default. */
  columns?: 1 | 3;
  className?: string;
}

const defaultGroups: Feature229Group[] = [
  {
    title: "Security",
    icon: ShieldCheckIcon,
    features: [
      "Two-factor authentication",
      "End-to-end encryption",
      "Regular security audits",
      "Role-based access control",
      "Data backup & recovery",
    ],
  },
  {
    title: "Integration & APIs",
    icon: PuzzleIcon,
    features: [
      "REST API access",
      "Webhook support",
      "Third-party integrations",
      "Custom API endpoints",
      "Developer documentation",
    ],
  },
  {
    title: "Support & Resources",
    icon: HeadphonesIcon,
    features: [
      "Priority email support",
      "Video tutorials library",
      "Knowledge base access",
      "Community forums",
      "Regular webinars",
    ],
  },
];

const Feature229 = ({
  heading,
  description,
  groups = defaultGroups,
  numbered = false,
  columns = 3,
  className,
}: Feature229Props) => {
  return (
    <section className={cn(className)}>
      {(heading || description) && (
        <div className="flex max-w-3xl flex-col gap-3">
          {heading && (
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div
        className={cn(
          "mt-16 grid gap-16 md:mt-20",
          columns === 3 && "md:grid-cols-3 md:gap-6",
        )}
      >
        {groups.map((group, idx) => (
          <div key={group.title}>
            {group.icon && (
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <group.icon className="size-5" />
              </span>
            )}
            <h3 className="my-6 font-semibold">
              {numbered && `${idx + 1}. `}
              {group.title}
            </h3>
            <ul className="space-y-4">
              {group.features.map((feature) => (
                <li
                  key={typeof feature === "string" ? feature : feature.label}
                  className="flex items-start gap-2 text-left"
                >
                  <CheckIcon className="mt-1 size-4 shrink-0" />
                  {typeof feature === "string" ? (
                    feature
                  ) : (
                    <span>
                      <strong className="font-semibold">{feature.label}:</strong>{" "}
                      <span className="text-muted-foreground">{feature.text}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Feature229 };
