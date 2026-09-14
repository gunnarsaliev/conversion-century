"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart,
  Bitcoin,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Factory,
  Film,
  Fingerprint,
  GraduationCap,
  HeartPulse,
  Leaf,
  Lock,
  Menu,
  ShoppingBag,
  Truck,
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
    title: "Cloud Infrastructure",
    description: "Scalable cloud solutions built for modern businesses.",
    href: "#",
    icon: Cloud,
  },
  {
    title: "Security & Compliance",
    description: "Enterprise-grade security with automated compliance.",
    href: "#",
    icon: Lock,
  },
  {
    title: "Identity Management",
    description: "Advanced authentication and access control systems.",
    href: "#",
    icon: Fingerprint,
  },
  {
    title: "Data Platform",
    description:
      "Unified storage, pipelines, and analytics for your workloads.",
    href: "#",
    icon: Database,
  },
];

const solutions = [
  {
    title: "Banking",
    href: "#",
    icon: Building2,
  },
  {
    title: "Healthcare",
    href: "#",
    icon: HeartPulse,
  },
  {
    title: "Technology",
    href: "#",
    icon: Cpu,
  },
  {
    title: "Education",
    href: "#",
    icon: GraduationCap,
  },
  {
    title: "Agriculture",
    href: "#",
    icon: Leaf,
  },
  {
    title: "BaaS",
    href: "#",
    icon: Building,
  },
  {
    title: "Entertainment",
    href: "#",
    icon: Film,
  },
  {
    title: "SaaS",
    href: "#",
    icon: BarChart,
  },
  {
    title: "Crypto",
    href: "#",
    icon: Bitcoin,
  },
  {
    title: "Manufacturing",
    href: "#",
    icon: Factory,
  },
  {
    title: "Retail",
    href: "#",
    icon: ShoppingBag,
  },
  {
    title: "Logistics",
    href: "#",
    icon: Truck,
  },
];

const documentationLinks = [
  {
    title: "API Reference",
    href: "#",
  },
  {
    title: "SDK Documentation",
    href: "#",
  },
  {
    title: "Integration Guides",
    href: "#",
  },
  {
    title: "Code Examples",
    href: "#",
  },
];

const resourceLinks = [
  {
    title: "Documentation",
    href: "#",
  },
  {
    title: "Help Center",
    href: "#",
  },
  {
    title: "Community",
    href: "#",
  },
  {
    title: "Status",
    href: "#",
  },
];

const blogPosts = [
  {
    title: "Designing dashboards teams actually use",
    href: "#",
    image: "/image-set/modern/photos5/simone-hutsch-2BwaAhZtNYA-unsplash.jpg",
    alt: "Architectural interior with natural light",
  },
  {
    title: "Why workflow automation starts with clarity",
    href: "#",
    image: "/image-set/modern/photos5/simone-hutsch-5oYbG-sEImY-unsplash.jpg",
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
    "platform" | "solutions" | "developers" | "resources" | null
  >(null);
  const [menuDirection, setMenuDirection] = useState(0);

  const openSubmenu = (
    nextSubmenu: "platform" | "solutions" | "developers" | "resources",
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
        "sticky top-0 z-100 w-full self-start bg-background py-4",
        className,
      )}
    >
      <div className="container">
        <NavigationMenu className="min-w-full items-start [&>div:last-child]:left-1/2 [&>div:last-child]:-translate-x-1/2">
          <div className="relative z-110 flex w-full items-center justify-between gap-12 bg-background">
            {/* Logo */}
            <div>
              <Logo url="https://shadcnblocks.com">
                <LogoImageDesktop
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.svg"
                  className="h-7 dark:invert"
                  alt="Shadcn UI Navbar"
                />
                <LogoImageMobile
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg"
                  className="h-7 dark:invert"
                  alt="Shadcn UI Navbar"
                />
              </Logo>
            </div>

            <NavigationMenuList className="hidden lg:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                <NavigationMenuContent className="box-border min-w-[900px] p-0!">
                  <div className="box-border flex justify-between gap-5 px-5 py-4">
                    <a
                      href="#"
                      className="block w-1/3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                    >
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        Platform Overview
                      </div>
                      <div className="mb-4 text-sm font-normal text-muted-foreground">
                        Discover how our platform transforms your workflow.
                      </div>
                      <div className="overflow-clip rounded-md border border-muted">
                        <img
                          src="/image-set/modern/saas-details/saas-detail-5-4x3.png"
                          alt="Placeholder image"
                          className="aspect-video object-cover object-top-left"
                        />
                      </div>
                    </a>
                    <div className="max-w-[760px] min-w-0 flex-1">
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
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[900px] p-5">
                  <div className="flex justify-between gap-5">
                    <div className="w-1/2 max-w-[510px]">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        Industries
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
                    </div>
                    <a
                      href="#"
                      className="group block flex-1 self-start rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                    >
                      <div className="flex w-full min-w-0 flex-col overflow-clip rounded-lg border border-muted">
                        <div className="relative w-full overflow-clip rounded-t-lg pb-[56.25%]">
                          <img
                            src="/image-set/modern/photos4/photo1.png"
                            alt="Placeholder image"
                            className="absolute inset-0 size-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col p-4 xl:p-5">
                          <div className="mb-2 text-lg font-semibold text-foreground">
                            Featured Industry
                          </div>
                          <div className="text-sm font-normal text-muted-foreground">
                            Learn how our platform helped empower the energy
                            industry.
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div>
                    <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      Documentation
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
                            <ArrowUpRight className="size-3.5 text-foreground" />
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
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
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
                        Resources
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
                              <ArrowUpRight className="size-3.5 text-foreground" />
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

            <div className="hidden items-center gap-2 lg:flex">
              <Button variant="ghost">Login</Button>
              <Button variant="default">Sign Up</Button>
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
                                ["platform", "Platform"],
                                ["solutions", "Solutions"],
                                ["developers", "Developers"],
                                ["resources", "Resources"],
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
                            <Button
                              variant="outline"
                              className="relative"
                              size="lg"
                            >
                              Login
                            </Button>
                            <Button className="relative" size="lg">
                              Start now
                            </Button>
                          </div>
                        </>
                      )}

                      {submenu === "platform" && (
                        <>
                          <a href="#" className="block px-8 py-8">
                            <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                              Platform Overview
                            </div>
                            <div className="mb-4 text-sm font-normal text-muted-foreground">
                              Discover how our platform transforms your
                              workflow.
                            </div>
                            <div className="overflow-clip rounded-md border border-border">
                              <img
                                src="/image-set/modern/saas-details/saas-detail-5-4x3.png"
                                alt="Platform overview"
                                className="aspect-video w-full object-cover object-top-left"
                              />
                            </div>
                          </a>
                          <div className="px-8 py-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Features
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
                            Industries
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
                          <a
                            href="#"
                            className="block space-y-4 px-8 pt-8 pb-16"
                          >
                            <div className="overflow-clip rounded-lg border border-border">
                              <img
                                src="/image-set/modern/photos4/photo1.png"
                                alt="Featured industry"
                                className="aspect-video w-full object-cover object-center"
                              />
                            </div>
                            <div>
                              <div className="mb-1.5 text-base font-semibold">
                                Featured Industry
                              </div>
                              <div className="text-sm font-normal text-muted-foreground">
                                Learn how our platform helped empower the energy
                                industry.
                              </div>
                            </div>
                          </a>
                        </>
                      )}

                      {submenu === "developers" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            Documentation
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
                                    <ArrowUpRight className="size-3.5 text-foreground" />
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

                      {submenu === "resources" && (
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
                            Resources
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
                                  <ArrowUpRight className="size-3.5 text-foreground" />
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
