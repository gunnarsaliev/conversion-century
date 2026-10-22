import { Handshake } from "lucide-react";
import React from "react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const person1 = {
  name: "Jack Walsh",
  firstName: "Jack",
  lastName: "Walsh",
  initials: "JW",
  email: "jack.walsh@example.com",
  username: "jackwalsh",
  role: "Product Designer",
  company: "Cartwright",
  location: "Brisbane, Australia",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar1.webp",
};
const person2 = {
  name: "Ilze Pērkone",
  firstName: "Ilze",
  lastName: "Pērkone",
  initials: "MK",
  email: "iperkone@example.com",
  username: "iperkone",
  role: "Brand Director",
  company: "Kivit",
  location: "Rīga, Latvia",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar2.webp",
};
const person3 = {
  name: "Vernon Desilets",
  firstName: "Vernon",
  lastName: "Desilets",
  initials: "VD",
  email: "vernod@example.com",
  username: "vernod",
  role: "Creative Director",
  company: "Soho Logix",
  location: "Paris, France",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar3.webp",
};
const person4 = {
  name: "Lín Wàngshū",
  firstName: "Lín",
  lastName: "Wangshu",
  initials: "LW",
  email: "linwang4@example.com",
  username: "liwang",
  role: "Graphic Designer",
  company: "Tenxcloud",
  location: "Shanghai, China",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar4.webp",
};
const person5 = {
  name: "Rajesh Bhatt",
  firstName: "Rajesh",
  lastName: "Bhatt",
  initials: "RB",
  email: "rajesh.bhatt@example.com",
  username: "rajeshbhatt",
  role: "UX Researcher",
  company: "Mindtree",
  location: "Mumbai, India",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar5.webp",
};
const person6 = {
  name: "Jessica Cannon",
  firstName: "Jessica",
  lastName: "Cannon",
  initials: "JC",
  email: "jessica.cannon@example.com",
  username: "jessicacannon",
  role: "Data Analyst",
  company: "Fidelity Investments",
  location: "Boston, USA",
  avatar: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar6.webp",
};

const testimonials = [
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/astro-wordmark.svg",
      alt: "Zerostatic logo",
      width: 96.75,
      height: 36,
    },
    quote:
      "Our team at Zerostatic relies heavily on automation, and this app takes it to another level. It&apos;s like having a virtual assistant built right into my workflow.",
    author: {
      name: person1.name,
      role: "Product Designer, Zerostatic",
      image: person1.avatar,
    },
  },
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/figma-wordmark.svg",
      alt: "Notion logo",
      width: 90.75,
      height: 36,
    },
    quote:
      "I especially love the seamless calendar integrations and advanced task management features keep everyone aligned and organized.",
    author: {
      name: person2.name,
      role: "Product Manager, Notion",
      image: person2.avatar,
    },
  },
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/sketch-wordmark.svg",
      alt: "Slack logo",
      width: 100.75,
      height: 36,
    },
    quote:
      "We needed a productivity app that could grow with our team&apos;s evolving needs, this has been the perfect fit. The automation tools have saved us hours.",
    author: {
      name: person3.name,
      role: "Operations Lead, Slack",
      image: person3.avatar,
    },
  },
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/tailwind-wordmark.svg",
      alt: "GitHub logo",
      width: 110.75,
      height: 36,
    },
    quote:
      "This platform has been invaluable for managing projects across distributed teams. Its integration with our existing tools makes setup easy.",
    author: {
      name: person4.name,
      role: "Engineering Manager, GitHub",
      image: person4.avatar,
    },
  },
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/vercel-wordmark.svg",
      alt: "Figma logo",
      width: 96.75,
      height: 36,
    },
    quote:
      "As a designer, I appreciate how intuitive and visually appealing this app is. It simplifies task management without sacrificing powerful features.",
    author: {
      name: person5.name,
      role: "Design Lead, Figma",
      image: person5.avatar,
    },
  },
  {
    logo: {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/block/logos/supabase-wordmark.svg",
      alt: "Loom logo",
      width: 96.75,
      height: 36,
    },
    quote:
      "The smart reminders and automated scheduling keep our team focused and on track. We&apos;ve also found the collaborative features to be very helpful.",
    author: {
      name: person6.name,
      role: "Content Strategist, Loom",
      image: person6.avatar,
    },
  },
];

interface Testimonial21Props {
  className?: string;
}

const Testimonial21 = ({ className }: Testimonial21Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Handshake className="size-4" />
            <span>lovin' it</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            What industry experts are saying
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            Trusted by Professionals from Leading Tech Companies
          </p>
        </div>
      </div>

      <div className="container mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="flex flex-col gap-6 rounded-md bg-background p-6 shadow-sm"
          >
            <img
              src={testimonial.logo.src}
              alt={testimonial.logo.alt}
              width={testimonial.logo.width}
              height={testimonial.logo.height}
              className="object-contain dark:invert"
            />

            <blockquote className="text-muted-foreground-subtle text-lg font-normal italic">{`“${testimonial.quote}”`}</blockquote>

            <div className="mt-auto flex items-center gap-4">
              <img
                src={testimonial.author.image}
                alt={`${testimonial.author.name}'s profile picture`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-lg tracking-[-0.36px]">
                  {testimonial.author.name}
                </p>
                <p className="text-muted-foreground">
                  {testimonial.author.role}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export { Testimonial21 };
