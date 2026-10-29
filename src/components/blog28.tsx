"use client";

import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { CmsImage } from "@/components/cms-image";

interface Post {
  date: string;
  author: string;
  title: string;
  image: string;
  link: string;
  description: string;
  /** Translated category labels. */
  categories?: string[];
}

const posts: Post[] = [
  {
    date: "June 15, 2024",
    author: "Alex Johnson",
    title: "The Future of AI: How Machine Learning is Transforming Industries",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
    description:
      "Explore how artificial intelligence and machine learning technologies are revolutionizing various industries, from healthcare to manufacturing, and learn about the latest innovations shaping our future.",
  },
  {
    date: "June 12, 2024",
    author: "Maya Patel",
    title: "Principles of Minimalist Design: Less is More in Modern UX/UI",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
    description:
      "Discover the principles of minimalist design and how they can help you create more intuitive and user-friendly interfaces.",
  },
  {
    date: "June 10, 2024",
    author: "David Chen",
    title:
      "Remote Work Revolution: How Companies are Adapting to the New Normal",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
    description:
      "Explore the benefits and challenges of remote work and how companies are adapting to the new normal.",
  },
  {
    date: "June 8, 2024",
    author: "Sarah Williams",
    title: "Building Scalable Applications with Microservices Architecture",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
    description:
      "Learn how microservices architecture can help you build scalable and maintainable applications.",
  },
  {
    date: "June 5, 2024",
    author: "James Rodriguez",
    title: "Content Marketing Strategies That Drive Organic Traffic in 2024",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
    description:
      "Discover effective content marketing strategies that can help you drive organic traffic and grow your audience in 2024.",
  },
];

interface Blog28Props {
  heading?: string;
  /** Short intro under the heading, rendered as an h2. */
  description?: string;
  posts?: Post[];
  className?: string;
  /** Rendered above the grid, e.g. a category filter. */
  filters?: React.ReactNode;
  /** Rendered under the grid, e.g. pagination. */
  children?: React.ReactNode;
}

// Plain labels: the whole card is already a link.
const CategoryBadges = ({ categories }: { categories?: string[] }) =>
  categories && categories.length > 0 ? (
    <div className="mb-2.5 flex flex-wrap gap-1.5">
      {categories.map((category) => (
        <Badge key={category} variant="secondary">
          {category}
        </Badge>
      ))}
    </div>
  ) : null;

const Blog28 = ({
  heading: headingProp,
  description,
  posts: postsProp,
  className,
  filters,
  children,
}: Blog28Props) => {
  const t = useTranslations("Blog28");
  const heading = headingProp ?? t("heading");
  const items = postsProp ?? posts;

  if (items.length === 0) {
    return (
      <section className={cn("py-32", className)}>
        <div className="container">
          {heading && (
            <h2
              className={cn(
                "text-center text-4xl font-medium md:text-7xl",
                description ? "mb-4" : "mb-12",
              )}
            >
              {heading}
            </h2>
          )}
          {description && (
            <h2 className="mx-auto mb-12 max-w-3xl text-center text-lg text-muted-foreground">
              {description}
            </h2>
          )}
          {filters && <div className="mb-12">{filters}</div>}
          <p className="text-center text-muted-foreground">
            {t("empty")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        {heading && (
          <h1
            className={cn(
              "text-center text-4xl font-medium md:text-7xl",
              description ? "mb-4" : "mb-12",
            )}
          >
            {heading}
          </h1>
        )}
        {description && (
          <h2 className="mx-auto mb-12 max-w-3xl text-center text-lg text-muted-foreground">
            {description}
          </h2>
        )}
        {filters}

        <div
          className={cn(
            "xs:grid-cols-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
            filters ? "mt-12" : "mt-24",
          )}
        >
          <div className="relative md:row-span-2 lg:col-span-2">
            <Link
              href={items[0].link}
              className="block h-fit rounded-lg bg-card p-3 shadow-md transition-shadow hover:shadow-lg md:top-0"
            >
              <CmsImage
                src={items[0].image}
                alt={items[0].title}
                preload
                sizes="(min-width: 1024px) 50vw, 100vw"
                wrapperClassName="h-48 w-full rounded-lg md:h-80 lg:h-96"
                className="hover:opacity-80"
              />
              <div className="mt-5">
                <CategoryBadges categories={items[0].categories} />
                <div className="mb-2.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <time>{items[0].date}</time>·<span>{items[0].author}</span>
                </div>
                <h3 className="text-lg md:text-3xl lg:text-4xl">
                  {items[0].title}
                </h3>
                <p className="mt-4 text-muted-foreground">
                  {items[0].description}
                </p>
              </div>
            </Link>
          </div>
          {items.slice(1).map((post, idx) => (
            <Link key={idx} href={post.link} className="rounded-lg bg-card p-3 shadow-md transition-shadow hover:shadow-lg">
              <CmsImage
                src={post.image}
                alt={post.title}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                wrapperClassName="h-48 w-full rounded-lg"
                className="hover:opacity-80"
              />
              <div className="mt-5">
                <CategoryBadges categories={post.categories} />
                <div className="mb-2.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <time>{post.date}</time>·<span>{post.author}</span>
                </div>
                <h3 className="text-lg">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
};

export { Blog28 };
export type { Post as Blog28Post };
