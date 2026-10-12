import { cn } from "cn";

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("bg-BG").format(value);

export const formatPrice = (value: number, currency: string) =>
  new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("bg-BG", { dateStyle: "long" }).format(
    new Date(value),
  );

export function OfferSection({
  id,
  eyebrow,
  heading,
  description,
  className,
  children,
}: {
  id: string;
  eyebrow?: string;
  heading: React.ReactNode;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-24 border-t border-border py-16 sm:py-24", className)}
    >
      <div className="mb-10 flex max-w-3xl flex-col gap-3">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
        )}
        <h2
          id={`${id}-heading`}
          className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {heading}
        </h2>
        {description && (
          <p className="text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// Falls back to the name as text while placeholder logos are still empty.
export function LogoOrName({
  name,
  logo,
  className,
}: {
  name: string;
  logo: string;
  className?: string;
}) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className={cn("h-10 w-36 object-contain dark:invert", className)}
      />
    );
  }
  return (
    <span className={cn("text-lg font-semibold tracking-tight", className)}>
      {name}
    </span>
  );
}

export function GroupedLists({
  groups,
}: {
  groups: { title: string; items: string[] }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="mb-4 font-semibold">{group.title}</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {group.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
