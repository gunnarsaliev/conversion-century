"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  FileSearch,
  FileText,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Landmark,
  Link2,
  ListChecks,
  Map,
  MapPin,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PenTool,
  Rocket,
  Search,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "cn";

import {
  Logo,
  LogoImageDesktop,
  LogoImageMobile,
} from "@/components/shadcnblocks/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
const platformFeatures = [
  {
    title: "Ongoing SEO Management",
    description: "Scalable cloud solutions built for modern businesses.",
    href: "/website/services/ongoing-seo-management",
    icon: TrendingUp,
  },
  {
    title: "AI Search Optimization",
    description: "Enterprise-grade security with automated compliance.",
    href: "/website/services/ai-search-optimization",
    icon: Bot,
  },
  {
    title: "SEO Audit",
    description: "Advanced authentication and access control systems.",
    href: "/website/services/seo-audit",
    icon: FileSearch,
  },
  {
    title: "International SEO",
    description:
      "Unified storage, pipelines, and analytics for your workloads.",
    href: "/website/services",
    icon: Globe2,
  },
  {
    title: "Local SEO",
    description: "Scalable cloud solutions built for modern businesses.",
    href: "/website/services/local-seo",
    icon: MapPin,
  },
  {
    title: "Technical SEO",
    description: "Enterprise-grade security with automated compliance.",
    href: "/website/services/technical-seo",
    icon: Wrench,
  },
  {
    title: "Content Strategy and Copywriting",
    description: "Advanced authentication and access control systems.",
    href: "/website/services/content-strategy-and-copywriting",
    icon: PenTool,
  },
  {
    title: "Link Building and Digital PR",
    description:
      "Unified storage, pipelines, and analytics for your workloads.",
    href: "/website/services/link-building-and-digital-pr",
    icon: Link2,
  },
  {
    title: "Organic Search Training",
    description: "Scalable cloud solutions built for modern businesses.",
    href: "/website/services/organic-search-training",
    icon: GraduationCap,
  },
];

const solutions = [
  {
    title: "Grow Organic Revenue",
    href: "#",
    icon: TrendingUp,
  },
  {
    title: "Enter New Markets",
    href: "#",
    icon: Compass,
  },
  {
    title: "Recover Lost Traffic",
    href: "#",
    icon: TrendingDown,
  },
  {
    title: "Migrate without losing SEO",
    href: "#",
    icon: Map,
  },
  {
    title: "Improve visibility in AI",
    href: "#",
    icon: Bot,
  },
  {
    title: "Build an Outsourced SEO Department",
    href: "#",
    icon: Users,
  },
  {
    title: "Reduce Dependence on Ads",
    href: "#",
    icon: Rocket,
  },
  {
    title: "Launch an SEO-Ready Website",
    href: "#",
    icon: Search,
  },
];

const industries = [
  {
    title: "B2B",
    href: "#",
    icon: Handshake,
  },
  {
    title: "Ecommerce",
    href: "#",
    icon: ShoppingCart,
  },
  {
    title: "Professional Services",
    href: "#",
    icon: Briefcase,
  },
  {
    title: "Financial Sector",
    href: "#",
    icon: Landmark,
  },
  {
    title: "Real Estate",
    href: "#",
    icon: Building2,
  },
  {
    title: "Healthcare",
    href: "#",
    icon: HeartPulse,
  },
];

const documentationLinks = [
  {
    title: "Clients",
    href: "#",
    icon: Users,
  },
  {
    title: "Case Studies",
    href: "#",
    icon: ClipboardList,
  },
  {
    title: "Reviews",
    href: "#",
    icon: MessageSquareQuote,
  },
];

const aboutLinks = [
  {
    title: "Our Story",
    href: "#",
    icon: FileText,
  },
  {
    title: "Career",
    href: "#",
    icon: CalendarClock,
  },
  {
    title: "Team",
    href: "#",
    icon: Users,
  },
];

const resourceLinks = [
  {
    title: "Blog",
    href: "#",
    icon: Newspaper,
  },
  {
    title: "Checklists",
    href: "#",
    icon: ListChecks,
  },
  {
    title: "Events and Media",
    href: "#",
    icon: Calendar,
  },
];

const blogPosts = [
  {
    title: "Designing dashboards teams actually use",
    href: "#",
    image: "https://images.unsplash.com/photo-1534082753658-1dcb40af5719",
    alt: "Architectural interior with natural light",
  },
  {
    title: "Why workflow automation starts with clarity",
    href: "#",
    image: "https://images.unsplash.com/photo-1534082753658-1dcb40af5719",
    alt: "Modern workspace with laptop and notes",
  },
];

interface Navbar3Props {
  className?: string;
}

const mobileMenuTransition = {
  duration: 0.22,
  ease: [0.32, 0.72, 0, 1] as const,
};

const mobilePanelVariants = {
  initial: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? "100%" : "-100%",
  }),
  animate: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? "-100%" : "100%",
  }),
};

const mobileMenuShellClassName =
  "fixed inset-0 top-[72px] z-100 flex flex-col overflow-hidden border-t border-border bg-popover text-popover-foreground lg:hidden";

const mobileMenuPanelClassName =
  "absolute inset-0 flex h-full w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-popover will-change-transform";

const Navbar3 = ({ className }: Navbar3Props) => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<
    | "services"
    | "solutions"
    | "industries"
    | "proof"
    | "about"
    | "insights"
    | null
  >(null);
  const [menuDirection, setMenuDirection] = useState(0);

  const openSubmenu = (
    nextSubmenu:
      | "services"
      | "solutions"
      | "industries"
      | "proof"
      | "about"
      | "insights",
  ) => {
    setMenuDirection(1);
    setSubmenu(nextSubmenu);
  };

  const closeSubmenu = () => {
    setMenuDirection(-1);
    setSubmenu(null);
  };

  const toggleMobileMenu = () => {
    if (open) {
      setMenuDirection(0);
      setOpen(false);
      setSubmenu(null);
      return;
    }

    setMenuDirection(0);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const docEl = document.documentElement;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = docEl.style.overflow;
    body.style.overflow = "hidden";
    docEl.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBodyOverflow;
      docEl.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  return (
    <section
      className={cn(
        "sticky top-0 z-100 w-full self-start bg-white py-4 dark:bg-background",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NavigationMenu className="min-w-full items-start [&>div:last-child]:left-1/2 [&>div:last-child]:-translate-x-1/2">
          <div className="relative z-110 flex w-full items-center justify-between gap-12">
            {/* Logo */}
            <div>
              <Logo url="https://shadcnblocks.com">
                <LogoImageDesktop
                  src="https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg"
                  className="h-7"
                  alt="Conversion Century"
                />
                <LogoImageMobile
                  src="https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg"
                  className="h-7"
                  alt="Conversion Century"
                />
              </Logo>
            </div>

            <NavigationMenuList className="hidden lg:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent className="box-border min-w-[700px] p-5">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-2">
                    {platformFeatures.map((feature, index) => (
                      <NavigationMenuLink
                        key={index}
                        href={feature.href}
                        className="group block rounded-md px-3 py-2.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="mb-1.5 flex size-9 items-center justify-center rounded-md bg-muted p-2 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <feature.icon className="size-[18px] text-foreground" />
                        </div>
                        <div className="mb-1 text-base font-medium text-foreground">
                          {feature.title}
                        </div>
                        <div className="text-sm font-normal text-muted-foreground">
                          {feature.description}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] p-5">
                  <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                    Solutions
                  </div>
                  <div className="mb-4 text-sm font-normal text-muted-foreground">
                    Explore solutions tailored to your industry
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {solutions.map((solution, index) => (
                      <NavigationMenuLink
                        key={index}
                        href={solution.href}
                        className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <solution.icon className="size-3.5 text-foreground" />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {solution.title}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] p-5">
                  <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                    Industries
                  </div>
                  <div className="mb-4 text-sm font-normal text-muted-foreground">
                    Explore solutions tailored to your industry
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {industries.map((industry, index) => (
                      <NavigationMenuLink
                        key={index}
                        href={industry.href}
                        className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <industry.icon className="size-3.5 text-foreground" />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {industry.title}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Proof</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div>
                    <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      Proof
                    </div>
                    <div className="mb-4 text-sm font-normal text-muted-foreground">
                      Call to action for developers
                    </div>
                    <div className="space-y-1">
                      {documentationLinks.map((documentationLink, index) => (
                        <NavigationMenuLink
                          key={index}
                          href={documentationLink.href}
                          className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                            <documentationLink.icon className="size-3.5 text-foreground" />
                          </span>
                          <div className="text-sm font-medium text-foreground">
                            {documentationLink.title}
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div>
                    <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      About
                    </div>
                    <div className="mb-4 text-sm font-normal text-muted-foreground">
                      Call to action for developers
                    </div>
                    <div className="space-y-1">
                      {aboutLinks.map((aboutLink, index) => (
                        <NavigationMenuLink
                          key={index}
                          href={aboutLink.href}
                          className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                            <aboutLink.icon className="size-3.5 text-foreground" />
                          </span>
                          <div className="text-sm font-medium text-foreground">
                            {aboutLink.title}
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Insights</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div className="flex gap-6">
                    <div className="w-[32rem] shrink-0">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        Blog
                      </div>
                      <div className="mb-4 text-sm font-normal text-muted-foreground">
                        Latest insights, tutorials, and industry best practices.
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {blogPosts.map((post, index) => (
                          <a
                            key={index}
                            href={post.href}
                            className="flex h-full flex-col overflow-clip rounded-lg border border-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                          >
                            <div className="aspect-video w-full overflow-hidden border-b border-muted">
                              <img
                                src={post.image}
                                alt={post.alt}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="p-4">
                              <div className="text-base font-medium text-foreground">
                                {post.title}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="w-max shrink-0">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        Insights
                      </div>
                      <div className="mb-4 text-sm font-normal text-muted-foreground">
                        Tools, guides, and references to help you build.
                      </div>
                      <div className="space-y-1">
                        {resourceLinks.map((resourceLink, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={resourceLink.href}
                            className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                              <resourceLink.icon className="size-3.5 text-foreground" />
                            </span>
                            <div className="text-sm font-medium text-foreground">
                              {resourceLink.title}
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <div className="hidden items-center  lg:flex">
              <Button variant="default" size="lg" className="px-6 py-6">
             Book a Consultation
              </Button>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
                onClick={toggleMobileMenu}
              >
                {!open && <Menu className="size-4" />}
                {open && <X className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={mobileMenuShellClassName}
              >
                {submenu && (
                  <div className="relative z-10 shrink-0 border-b border-border bg-popover px-4 py-3">
                    <Button variant="outline" onClick={closeSubmenu}>
                      <ChevronLeft />
                      Back
                    </Button>
                  </div>
                )}
                <div className="relative min-h-0 flex-1">
                  <AnimatePresence
                    mode="sync"
                    custom={menuDirection}
                    initial={false}
                  >
                    <motion.div
                      key={submenu ?? "root"}
                      custom={menuDirection}
                      variants={mobilePanelVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={mobileMenuTransition}
                      className={mobileMenuPanelClassName}
                    >
                      {!submenu && (
                        <>
                          <div>
                            {(
                              [
                                ["services", "Services"],
                                ["solutions", "Solutions"],
                                ["industries", "Industries"],
                                ["proof", "Proof"],
                                ["about", "About"],
                                ["insights", "Insights"],
                              ] as const
                            ).map(([key, label]) => (
                              <button
                                key={key}
                                type="button"
                                className="flex w-full items-center border-b border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                                onClick={() => openSubmenu(key)}
                              >
                                <span className="flex-1">{label}</span>
                                <span className="shrink-0">
                                  <ChevronRight className="size-4" />
                                </span>
                              </button>
                            ))}
                          </div>
                          <div className="mx-8 mt-auto flex flex-col gap-4 py-12">
                            <Button className="relative" size="lg">
                              Contact
                            </Button>
                          </div>
                        </>
                      )}

                      {submenu === "services" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Services
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Discover how our platform transforms your
                            workflow.
                          </div>
                          <div className="border-t border-border pb-16">
                            {platformFeatures.map((feature, index) => (
                              <a
                                key={index}
                                href={feature.href}
                                className="group flex w-full items-start gap-x-4 border-b border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <feature.icon className="size-6" />
                                </div>
                                <div>
                                  <div className="mb-1.5 text-base">
                                    {feature.title}
                                  </div>
                                  <div className="text-sm font-normal text-muted-foreground">
                                    {feature.description}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </>
                      )}

                      {submenu === "solutions" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Solutions
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Explore solutions tailored to your industry
                          </div>
                          <div>
                            {solutions.map((solution, index) => (
                              <a
                                key={index}
                                href={solution.href}
                                className="group flex w-full items-start gap-x-4 border-t border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <solution.icon className="size-6" />
                                </div>
                                <div className="text-base">
                                  {solution.title}
                                </div>
                              </a>
                            ))}
                          </div>
                        </>
                      )}

                      {submenu === "industries" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Industries
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Explore solutions tailored to your industry
                          </div>
                          <div>
                            {industries.map((industry, index) => (
                              <a
                                key={index}
                                href={industry.href}
                                className="group flex w-full items-start gap-x-4 border-t border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <industry.icon className="size-6" />
                                </div>
                                <div className="text-base">
                                  {industry.title}
                                </div>
                              </a>
                            ))}
                          </div>
                        </>
                      )}

                      {submenu === "proof" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Proof
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Call to action for developers
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {documentationLinks.map(
                              (documentationLink, index) => (
                                <NavigationMenuLink
                                  key={index}
                                  href={documentationLink.href}
                                  className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                    <documentationLink.icon className="size-3.5 text-foreground" />
                                  </span>
                                  <div className="text-sm font-medium">
                                    {documentationLink.title}
                                  </div>
                                </NavigationMenuLink>
                              ),
                            )}
                          </div>
                        </>
                      )}

                      {submenu === "about" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            About
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Call to action for developers
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {aboutLinks.map((aboutLink, index) => (
                              <NavigationMenuLink
                                key={index}
                                href={aboutLink.href}
                                className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                              >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                  <aboutLink.icon className="size-3.5 text-foreground" />
                                </span>
                                <div className="text-sm font-medium">
                                  {aboutLink.title}
                                </div>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </>
                      )}

                      {submenu === "insights" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Blog
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Latest insights, tutorials, and industry best
                            practices.
                          </div>
                          <div className="space-y-4 px-8 pb-8">
                            {blogPosts.map((post, index) => (
                              <a
                                key={index}
                                href={post.href}
                                className="block overflow-clip rounded-lg border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                              >
                                <div className="aspect-video w-full overflow-hidden border-b border-border">
                                  <img
                                    src={post.image}
                                    alt={post.alt}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="p-4">
                                  <div className="text-base font-medium text-foreground">
                                    {post.title}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                          <div className="px-8 py-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Insights
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            Tools, guides, and references to help you build.
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {resourceLinks.map((resourceLink, index) => (
                              <NavigationMenuLink
                                key={index}
                                href={resourceLink.href}
                                className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                              >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                  <resourceLink.icon className="size-3.5 text-foreground" />
                                </span>
                                <div className="text-sm font-medium">
                                  {resourceLink.title}
                                </div>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavigationMenu>
      </div>
    </section>
  );
};

export { Navbar3 };
