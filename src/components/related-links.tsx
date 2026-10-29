import { Link } from "@/i18n/navigation";
import { CmsImage } from "@/components/cms-image";
import type { RelatedItem } from "@/lib/cms/related";

interface RelatedLinksProps {
  heading: string;
  items: RelatedItem[];
  className?: string;
}

// "Check other …" cards at the end of an industry, service or solution
// page: square image, title and up to three lines of description.
export function RelatedLinks({ heading, items, className }: RelatedLinksProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{heading}</h2>
      <ul className="grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group block">
              <CmsImage
                src={item.image}
                alt={item.title}
                sizes="(min-width: 640px) 320px, 100vw"
                wrapperClassName="aspect-square w-full rounded-lg bg-muted"
                className="transition-transform group-hover:scale-105"
              />
              <h3 className="mt-3 font-semibold group-hover:text-primary">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
