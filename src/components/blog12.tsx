import { ArrowRight, FileText } from "lucide-react";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface Blog12Post {
  title: string;
  description: string;
  image: string;
  author: string;
  authorAvatar?: string;
  readTime: string;
  link: string;
}

interface Blog12Props {
  className?: string;
  posts?: Blog12Post[];
}

const defaultPosts: Blog12Post[] = [
  {
    image:
      "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080",
    title: "How to build a successful brand and business online in 2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "John Doe",
    authorAvatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    readTime: "10 Min Read",
    link: "#",
  },
  {
    image:
      "https://images.unsplash.com/photo-1653288973812-81d1951b8127?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "The difference between UI and UX and how to design for both",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Jane Doe",
    authorAvatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    readTime: "14 Min Read",
    link: "#",
  },
  {
    image:
      "https://images.unsplash.com/photo-1563952532949-3d1a874ad614?q=80&w=1951&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Optimizing your website for SEO and getting more traffic",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Jane Smith",
    authorAvatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    readTime: "9 Min Read",
    link: "#",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Blog12 = ({ className, posts }: Blog12Props) => {
  const items = posts && posts.length > 0 ? posts : defaultPosts;

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="gap-1 py-1">
            <FileText className="h-full w-4" /> Our Blogs
          </Badge>
          <h1 className="text-4xl font-semibold text-balance">
            Discover the latest trends
          </h1>
          <p className="text-muted-foreground">
            Explore our blog for insightful articles, personal reflections and
            ideas that inspire action on the topics you care about.
          </p>
        </div>
        <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post, index) => (
            <a key={index} className="rounded-xl border" href={post.link}>
              <div className="p-2">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </div>
              <div className="px-3 pt-2 pb-4">
                <h2 className="mb-1 font-medium">{post.title}</h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <Separator className="my-5" />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-full ring-1 ring-input">
                      {post.authorAvatar ? (
                        <AvatarImage src={post.authorAvatar} alt={post.author} />
                      ) : null}
                      <AvatarFallback>{initials(post.author)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <Badge variant="secondary" className="h-fit">
                    {post.readTime}
                  </Badge>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            render={<Link href="/website/blog" />}
            nativeButton={false}
          >
            View All Blogs <ArrowRight className="ml-2 h-full w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Blog12 };
