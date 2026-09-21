"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";
import React, { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
interface Avatar {
  image: string;
  avatarClassName: string;
  cursorClassName: string;
  className?: string;
  delay?: number;
}

const BookADemo2Avatar = ({
  image,
  avatarClassName,
  cursorClassName,
  className,
  delay,
}: Avatar) => {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        animate={{
          x: [0, 10, 10, 0, 0],
          y: [0, 0, -10, -10, 0],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          delay: delay ?? 0,
        }}
        className={cn(
          "relative size-10 rounded-full border-2 p-[1px]",
          avatarClassName,
        )}
      >
        <MousePointer2
          className={cn(
            "absolute right-full bottom-full shrink-0 translate-x-2/5 translate-y-2/5 !delay-0",
            cursorClassName,
          )}
          size={18}
        />
        <img
          src={image}
          alt="avatar"
          className="size-full rounded-full object-cover"
        />
      </motion.div>
    </div>
  );
};

interface Description {
  text: string;
  hyperlink: string;
  url: string;
}

interface Header {
  heading: string;
  description: Description;
  avatars: Avatar[];
}

const BookADemo2Header = ({ heading, description, avatars }: Header) => {
  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center gap-4 text-center">
      <h3 className="text-4xl font-semibold sm:text-5xl md:text-6xl">
        {heading}
      </h3>

      <p className="font-medium text-muted-foreground sm:text-lg md:text-xl">
        <span>{description.text.split(description.hyperlink)[0]}</span>
        <span className="text-foreground">
          <a href={description.url} className="underline">
            {description.hyperlink}
          </a>
        </span>
        <span>{description.text.split(description.hyperlink)[1]}</span>
      </p>

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <BookADemo2Avatar
          className="absolute bottom-full left-full"
          {...avatars[0]}
        />
        <BookADemo2Avatar
          className="absolute top-full right-full"
          delay={1}
          {...avatars[1]}
        />
      </div>
    </div>
  );
};

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

const FormGroup = ({ children, className }: FormGroupProps) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

const BookADemo2ContactForm = () => {
  return (
    <div className="border-b p-8 lg:border-r lg:border-b-0">
      <form className="grid grid-cols-2 gap-x-3 gap-y-6">
        <FormGroup className="col-span-2 sm:col-span-1">
          <Label>First Name</Label>
          <Input type="text" placeholder="Jane" />
        </FormGroup>
        <FormGroup className="col-span-2 sm:col-span-1">
          <Label>Last Name</Label>
          <Input type="text" placeholder="Doe" />
        </FormGroup>
        <FormGroup className="col-span-2">
          <Label>Email</Label>
          <Input type="email" placeholder="jane@yourcompany.com" />
        </FormGroup>
        <FormGroup className="col-span-2 sm:col-span-1">
          <Label>Website URL</Label>
          <Input type="url" placeholder="https://yourcompany.com" />
        </FormGroup>
        <FormGroup className="col-span-2 sm:col-span-1">
          <Label>Monthly ad/marketing budget</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1k">Under $1,000</SelectItem>
              <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
              <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
              <SelectItem value="25k-plus">$25,000+</SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>
        <FormGroup className="col-span-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Tell us about your SEO goals — rankings, organic traffic, keywords you want to target, or any challenges you're facing"
            className="min-h-32"
          />
        </FormGroup>
        <Button type="submit" className="col-span-2" size="lg">
          Book My Consultation <ArrowRight />
        </Button>
      </form>
    </div>
  );
};

interface Author {
  name: string;
  designation: string;
  profilePicture: string;
}

interface Quote {
  fullQuote: string;
  highlightedWords: string[];
}

interface Testimonial {
  companyLogo: string;
  quote: Quote;
  author: Author;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const BookADemo2Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="relative flex h-full p-8">
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() =>
            setActiveTestimonial(
              (activeTestimonial + testimonials.length - 1) %
                testimonials.length,
            )
          }
        >
          <ArrowLeft />
        </Button>
        <Button
          size="sm"
          onClick={() =>
            setActiveTestimonial((activeTestimonial + 1) % testimonials.length)
          }
        >
          <ArrowRight />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {testimonials.map((testimonial, index) => {
          if (index !== activeTestimonial) return null;

          return (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              key={`testimonial-${index}`}
              className="flex h-full flex-col justify-between gap-12"
            >
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.companyLogo}
                  alt={`${testimonial.author.name} company logo`}
                  className="h-16 w-auto object-contain md:h-16 dark:invert"
                />
              </div>

              <div className="space-y-6">
                <blockquote className="leading-snug text-muted-foreground sm:text-lg lg:max-w-md">
                  &quot;
                  {testimonial.quote.fullQuote
                    .split(" ")
                    .map((word, wordIndex) => {
                      const isHighlighted =
                        testimonial.quote.highlightedWords.some((highlighted) =>
                          word
                            .toLowerCase()
                            .includes(highlighted.toLowerCase()),
                        );
                      return (
                        <span
                          key={wordIndex}
                          className={
                            isHighlighted ? "font-medium text-foreground" : ""
                          }
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  &quot;
                </blockquote>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.author.profilePicture}
                    alt={testimonial.author.name}
                    className="size-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {testimonial.author.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.author.designation}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface BookADemo2Props {
  className?: string;
  header?: Header;
  testimonials?: Testimonial[];
}

const BookADemo2 = ({
  header = {
    heading: "Schedule a demo",
    description: {
      text: "Book a demo to explore our development platform and discover how it can accelerate your team's productivity. If you have technical questions, feel free to reach out to our team.",
      hyperlink: "reach out to our team",
      url: "https://shadcnblocks.com",
    },
    avatars: [
      {
        image:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/christian-buehner-DItYlc26zVI-unsplash 1.jpg",
        avatarClassName: "border-orange-500",
        cursorClassName: "text-orange-500 fill-orange-500",
      },
      {
        image:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/nima-motaghian-nejad-_omdf_EgRUo-unsplash.jpg",
        avatarClassName: "border-blue-500",
        cursorClassName: "text-blue-500 fill-blue-500",
      },
    ],
  },
  testimonials = [
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      quote: {
        fullQuote:
          "This platform has revolutionized our development workflow. The productivity gains have been incredible.",
        highlightedWords: [
          "revolutionized",
          "productivity",
          "gains",
          "incredible",
        ],
      },
      author: {
        name: "Alex Chen",
        designation: "Lead Developer",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/alexander-hipp-iEEBWgY_6lA-unsplash.jpg",
      },
    },
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      quote: {
        fullQuote:
          "The integration was seamless and our team was up and running in minutes. Game changer for our startup.",
        highlightedWords: ["seamless", "minutes", "Game", "changer"],
      },
      author: {
        name: "Marcus Rodriguez",
        designation: "CTO",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/christian-buehner-DItYlc26zVI-unsplash 1.jpg",
      },
    },
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
      quote: {
        fullQuote:
          "We've reduced our development time by 40% since implementing this solution. Highly recommend it.",
        highlightedWords: ["reduced", "40%", "Highly", "recommend"],
      },
      author: {
        name: "Emily Watson",
        designation: "Engineering Manager",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/good-faces-xmSWVeGEnJw-unsplash.jpg",
      },
    },
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
      quote: {
        fullQuote:
          "The developer experience is outstanding. Our team adoption was instant and the learning curve was minimal.",
        highlightedWords: ["outstanding", "instant", "minimal"],
      },
      author: {
        name: "David Kim",
        designation: "Senior Developer",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg",
      },
    },
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
      quote: {
        fullQuote:
          "We've seen a 60% improvement in our deployment frequency since switching to this platform. Absolutely game-changing.",
        highlightedWords: ["60%", "improvement", "game-changing"],
      },
      author: {
        name: "Lisa Thompson",
        designation: "DevOps Engineer",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/michael-dam-mEZ3PoFGs_k-unsplash.jpg",
      },
    },
    {
      companyLogo:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
      quote: {
        fullQuote:
          "The collaboration features have transformed how our remote team works together. It's like having the whole team in one room.",
        highlightedWords: ["transformed", "collaboration", "together"],
      },
      author: {
        name: "James Wilson",
        designation: "Product Manager",
        profilePicture:
          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/nima-motaghian-nejad-_omdf_EgRUo-unsplash.jpg",
      },
    },
  ],
  className,
}: BookADemo2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center gap-12 lg:gap-24">
          <BookADemo2Header {...header} />
          <div className="grid max-w-6xl grid-cols-1 rounded-lg border lg:grid-cols-2">
            <BookADemo2ContactForm />
            <BookADemo2Testimonials testimonials={testimonials} />
          </div>
        </div>
      </div>
    </section>
  );
};

export { BookADemo2 };
