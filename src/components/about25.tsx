"use client";

import { motion } from "motion/react";
import {
  CircleArrowRight,
  CirclePlus,
  Files,
  Rocket,
  Settings,
} from "lucide-react";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AboutAgencySection {
  title: string;
  content: string;
  label?: string;
}
interface AboutAgencyPerson {
  id?: string;
  name: string;
  role: string;
  avatar?: Image;
  location?: string;
  handle?: string;
}
interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}
interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}
interface Stat {
  value: string;
  label: string;
  description?: string;
}

interface AboutAgencyProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  byline?: string;
  images?: Image[];
  stats?: Stat[];
  sections?: AboutAgencySection[];
  buttons?: Buttons;
  team?: AboutAgencyPerson[];
  className?: string;
}

interface About25Props extends AboutAgencyProps {
  teamLabel?: string;
  teamText?: string;
  brandName?: string;
}
type Props = Partial<About25Props>;

const defaultProps: About25Props = {
  eyebrow: "Who we are",
  heading: "Our Story",
  description: "We are a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age. With years of experience in design and development, we craft beautiful, accessible components that help teams build faster.",
  byline: "Trusted by leading product teams worldwide",
  images: [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-1-16x9.jpg",
      alt: "Studio workshop around a sofa",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-2-16x9.jpg",
      alt: "Conference room with pink chairs",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-3-16x9.jpg",
      alt: "Creative workshop",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-4-16x9.jpg",
      alt: "Studio portrait",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-5-16x9.jpg",
      alt: "Lounge chair and plant",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/about-agency/photo-6-16x9.jpg",
      alt: "Studio shelf still life",
    },
  ],
  stats: [
    {
      value: "21M",
      label: "Global Reach of Users",
      description:
        "Streamline tasks and boost efficiency by up to 80% using our tools.",
    },
    {
      value: "12+",
      label: "Years of Expertise",
      description:
        "Years building products, improving processes, and shaping thoughtful systems.",
    },
    {
      value: "654",
      label: "Projects Completed",
      description:
        "Projects delivered across diverse industries, from food and beverage to fintech.",
    },
    {
      value: "113k+",
      label: "Monthly Active Users",
    },
    {
      value: "461k",
      label: "Registered Accounts",
    },
    {
      value: "98+",
      label: "Daily Users",
    },
  ],
  sections: [
    {
      title: "Our Vision",
      content:
        "For years, the process of building custom software has remained challenging. Today, visual builders exist, but tailored solutions still require technical expertise and a lot of time. This is a problem for businesses and individuals alike.\n\nWhat if you could create custom software without writing a single line of code? What if you could build your own tools.\n\nWith our platform, you can! Our tools let you design layouts and create functionality—all without needing to code.\n\nWe believe that everyone should be able to build their own solutions, regardless of their technical background.",
    },
    {
      title: "Our Creators",
      content:
        "Our company has been building web tools for over a decade, focusing on efficiency and user control in every project. We know that the best solutions are the ones that you can create yourself.\n\nWe initially developed these solutions for our own team, and now everyone can benefit from them too. We are proud to offer a platform that is accessible to all, regardless of technical expertise.\n\nOur team is made up of talented individuals who are passionate about creating tools that empower users to build their own solutions with ease. We are dedicated to helping you achieve your goals.",
    },
    {
      label: "Our mission",
      title: "We make creating software easy.",
      content:
        "We aim to help empower 1,000,000 teams to create their own software. Here is how we plan on doing it.",
    },
    {
      label: "What drives us",
      title:
        "We are a team of creators, thinkers, and builders who believe in crafting experiences that truly connect. Our story is built on passion, innovation, and the drive to bring meaningful ideas to life.",
      content:
        "We start from the purpose, the people it serves, and the simplest path forward. Clarity first, then the work gets better.",
    },
  ],
  buttons: {
  primary: {
  text: "View our work",
  url: "https://www.shadcnblocks.com",
},
  secondary: {
      text: "View open roles",
      url: "https://www.shadcnblocks.com",
    },
},
  team: [
    {
      id: "01",
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar1.jpg",
        alt: "Sarah Chen",
      },
    },
    {
      id: "02",
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar2.jpg",
        alt: "Marcus Rodriguez",
      },
    },
    {
      id: "03",
      name: "Emily Watson",
      role: "Head of Product",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar3.jpg",
        alt: "Emily Watson",
      },
    },
    {
      id: "04",
      name: "David Kim",
      role: "Lead Engineer",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar4.jpg",
        alt: "David Kim",
      },
    },
    {
      id: "05",
      name: "Lisa Thompson",
      role: "Head of Design",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar5.jpg",
        alt: "Lisa Thompson",
      },
    },
    {
      id: "06",
      name: "Alex Johnson",
      role: "Head of Marketing",
      avatar: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar6.jpg",
        alt: "Alex Johnson",
      },
    },
  ],
  teamLabel: "Meet the studio",
  teamText: "of creative partners",
  brandName: "shadcnblocks®",
};

const MAX_TEAM = 4;
const MAX_STATS = 4;
const MAX_IMAGES = 1;

const About25 = (props: Props) => {
  const {
    heading,
    eyebrow,
    description,
    byline,
    images,
    stats,
    team,
    sections,
    buttons,
    teamLabel,
    teamText,
    brandName,
    className,
  } = {
    ...defaultProps,
    ...props,
  };

  const avatars = (team ?? []).slice(0, MAX_TEAM);
  const items = (stats ?? []).slice(0, MAX_STATS);
  const photo = (images ?? []).slice(0, MAX_IMAGES)[0];
  const note = sections?.[3];
  const approach = sections?.[2];

  return (
    <section className={cn("container mb-12 lg:py-24", className)}>
      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-5xl font-bold md:text-9xl"
      >
        {heading}
      </motion.h1>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {eyebrow && (
            <p className="flex items-center gap-2 text-sm font-bold">
              <CirclePlus size={20} />
              {eyebrow}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="col-span-2 text-lg"
        >
          <p className="flex flex-col text-2xl font-medium md:block md:text-3xl">
            {description && (
              <span className="indent-8">{description}&nbsp;</span>
            )}
            {byline && <span className="text-muted-foreground">{byline}</span>}
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center -space-x-3">
              {avatars.map((member, idx) => (
                <Avatar
                  key={member.id ?? idx}
                  className="size-10 rounded-md border-2 border-background"
                >
                  {member.avatar && (
                    <AvatarImage
                      src={member.avatar.src}
                      alt={member.avatar.alt}
                      className="rounded-md"
                    />
                  )}
                  <AvatarFallback>{member.name}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div>
              <p className="text-sm">
                {teamLabel && <span className="font-bold">{teamLabel}</span>}{" "}
                {teamText && (
                  <span className="text-muted-foreground">{teamText}</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-sm text-muted-foreground"
        >
          {note?.content}
        </motion.div>
      </div>

      {photo && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-xl"
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="aspect-video w-full object-cover"
          />
        </motion.div>
      )}

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-[repeat(4,minmax(50px,1fr))]">
        {items.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="lg:flex lg:flex-col"
          >
            <p className="text-3xl font-bold md:text-7xl">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground lg:max-w-1/2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-4 border-t border-border pt-12 md:grid-cols-[repeat(4,minmax(50px,1fr))]">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {brandName && <div className="font-bold">{brandName}</div>}
          {approach?.content && (
            <p className="mt-4 text-sm text-muted-foreground md:max-w-1/2">
              {approach.content}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="col-span-2 flex flex-col gap-6 md:max-w-2xl"
        >
          {approach?.title && (
            <p className="text-2xl font-medium md:text-3xl">{approach.title}</p>
          )}
          {note?.title && (
            <p className="text-sm text-muted-foreground">{note.title}</p>
          )}
          {buttons?.primary && (
            <Button className="w-fit rounded-full px-4 py-2 text-sm font-medium" render={<a href={buttons.primary.url} />} nativeButton={false}><div className="flex items-center gap-x-8">
                                        {buttons.primary.text}
                                        <div className="size-2 rounded-full bg-current" />
                                      </div></Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export { About25 };
