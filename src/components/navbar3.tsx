"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
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
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "cn";

import { getPathname, Link } from "@/i18n/navigation";
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
// Menu text lives in the `Navbar` messages: `<group>.items.<key>` (and
// `.description` for services, shown in the mobile menu).
const platformFeatures = [
  { key: "ongoingSeoManagement", href: "/services/ongoing-seo-management", icon: TrendingUp },
  { key: "aiSearchOptimization", href: "/services/ai-search-optimization", icon: Bot },
  { key: "seoAudit", href: "/services/seo-audit", icon: FileSearch },
  { key: "internationalSeo", href: "/services/international-seo", icon: Globe2 },
  { key: "localSeo", href: "/services/local-seo", icon: MapPin },
  { key: "technicalSeo", href: "/services/technical-seo", icon: Wrench },
  { key: "contentStrategy", href: "/services/content-strategy-and-copywriting", icon: PenTool },
  { key: "linkBuilding", href: "/services/link-building-and-digital-pr", icon: Link2 },
  { key: "organicSearchTraining", href: "/services/organic-search-training", icon: GraduationCap },
] as const;

const solutions = [
  { key: "growOrganicRevenue", href: "/solutions/grow-organic-revenue", icon: TrendingUp },
  { key: "enterNewMarkets", href: "/solutions/enter-new-markets", icon: Compass },
  { key: "recoverLostTraffic", href: "/solutions/recover-lost-traffic", icon: TrendingDown },
  { key: "migrateWithoutLosingSeo", href: "/solutions/migrate-without-losing-seo", icon: Map },
  { key: "improveVisibilityInAi", href: "/solutions/improve-visibility-in-ai", icon: Bot },
  { key: "outsourcedSeoDepartment", href: "/solutions/build-an-outsourced-seo-department", icon: Users },
  { key: "reduceAdDependence", href: "/solutions/reduce-dependence-on-ads", icon: Rocket },
  { key: "launchSeoReadyWebsite", href: "/solutions/launch-an-seo-ready-website", icon: Search },
] as const;

const industries = [
  { key: "b2b", href: "/industries/b2b", icon: Handshake },
  { key: "ecommerce", href: "/industries/ecommerce", icon: ShoppingCart },
  { key: "professionalServices", href: "/industries/professional-services", icon: Briefcase },
  { key: "financialSector", href: "/industries/financial-sector", icon: Landmark },
  { key: "realEstate", href: "/industries/real-estate", icon: Building2 },
  { key: "healthcare", href: "/industries/healthcare", icon: HeartPulse },
] as const;

const documentationLinks = [
  { key: "clients", href: "/clients", icon: Users },
  { key: "caseStudies", href: "/case-studies", icon: ClipboardList },
  { key: "reviews", href: "/reviews", icon: MessageSquareQuote },
] as const;

const aboutLinks = [
  { key: "ourStory", href: "/about", icon: FileText },
  { key: "career", href: "/open-positions", icon: CalendarClock },
] as const;

const resourceLinks = [
  { key: "blog", href: "/blog", icon: Newspaper },
  { key: "checklists", href: "/docs/getting-started", icon: ListChecks },
  { key: "eventsAndMedia", href: "/events-and-media", icon: Calendar },
] as const;

const defaultBlogPosts = [
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

interface NavbarBlogPost {
  title: string;
  href: string;
  image: string;
  alt: string;
}

interface Navbar3Props {
  blogPosts?: NavbarBlogPost[];
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

const Navbar3 = ({ blogPosts: blogPostsProp, className }: Navbar3Props) => {
  const blogPosts = blogPostsProp ?? defaultBlogPosts;
  const t = useTranslations("Navbar");
  const locale = useLocale();
  // NavigationMenuLink and the mobile menu render plain <a>s, so add the
  // locale prefix (e.g. /bg) that next-intl's <Link> would.
  const localize = (href: string) =>
    href.startsWith("/") ? getPathname({ href, locale }) : href;
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
  // Desktop dropdown last opened. Only updated on open, so a closing sheet
  // keeps its alignment instead of jumping while it animates out.
  const [activeMenu, setActiveMenu] = useState<unknown>(null);

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
        <NavigationMenu
          // Insights is the rightmost item, so its wide sheet opens to the left.
          align={activeMenu === "insights" ? "end" : "start"}
          onValueChange={(value) => {
            if (value != null) setActiveMenu(value);
          }}
          className="min-w-full items-start [&>div:last-child]:left-1/2 [&>div:last-child]:-translate-x-1/2">
          <div className="relative z-110 flex w-full items-center justify-between gap-12">
            {/* Logo */}
            <div>
              <Logo url="/">
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
                <NavigationMenuTrigger>{t("services.label")}</NavigationMenuTrigger>
                {/* Same compact layout as Solutions: icon + title rows. */}
                <NavigationMenuContent className="min-w-[500px] p-5">
                  <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                    {t("services.label")}
                  </div>
                  <div className="mb-4 text-sm font-normal text-muted-foreground">
                    {t("services.intro")}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {platformFeatures.map((feature, index) => (
                      <NavigationMenuLink
                        key={feature.key}
                        href={localize(feature.href)}
                        className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <feature.icon className="size-3.5 text-foreground" />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {t(`services.items.${feature.key}`)}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <NavigationMenuLink
                    href={localize("/services")}
                    className="mt-3 flex w-fit flex-row items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                  >
                    {t("services.viewAll")}
                    <ArrowRight className="size-3.5" />
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("solutions.label")}</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] p-5">
                  <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                    {t("solutions.label")}
                  </div>
                  <div className="mb-4 text-sm font-normal text-muted-foreground">
                    {t("solutions.intro")}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {solutions.map((solution, index) => (
                      <NavigationMenuLink
                        key={index}
                        href={localize(solution.href)}
                        className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <solution.icon className="size-3.5 text-foreground" />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {t(`solutions.items.${solution.key}`)}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <NavigationMenuLink
                    href={localize("/solutions")}
                    className="mt-3 flex w-fit flex-row items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                  >
                    {t("solutions.viewAll")}
                    <ArrowRight className="size-3.5" />
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("industries.label")}</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] p-5">
                  <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                    {t("industries.label")}
                  </div>
                  <div className="mb-4 text-sm font-normal text-muted-foreground">
                    {t("industries.intro")}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {industries.map((industry, index) => (
                      <NavigationMenuLink
                        key={index}
                        href={localize(industry.href)}
                        className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                          <industry.icon className="size-3.5 text-foreground" />
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {t(`industries.items.${industry.key}`)}
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <NavigationMenuLink
                    href={localize("/industries")}
                    className="mt-3 flex w-fit flex-row items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                  >
                    {t("industries.viewAll")}
                    <ArrowRight className="size-3.5" />
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("proof.label")}</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div>
                    <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      {t("proof.label")}
                    </div>
                    <div className="mb-4 text-sm font-normal text-muted-foreground">
                      {t("proof.intro")}
                    </div>
                    <div className="space-y-1">
                      {documentationLinks.map((documentationLink, index) => (
                        <NavigationMenuLink
                          key={index}
                          href={localize(documentationLink.href)}
                          className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                            <documentationLink.icon className="size-3.5 text-foreground" />
                          </span>
                          <div className="text-sm font-medium text-foreground">
                            {t(`proof.items.${documentationLink.key}`)}
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("about.label")}</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div>
                    <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                      {t("about.label")}
                    </div>
                    <div className="mb-4 text-sm font-normal text-muted-foreground">
                      {t("about.intro")}
                    </div>
                    <div className="space-y-1">
                      {aboutLinks.map((aboutLink, index) => (
                        <NavigationMenuLink
                          key={index}
                          href={localize(aboutLink.href)}
                          className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                            <aboutLink.icon className="size-3.5 text-foreground" />
                          </span>
                          <div className="text-sm font-medium text-foreground">
                            {t(`about.items.${aboutLink.key}`)}
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="insights">
                <NavigationMenuTrigger>{t("insights.label")}</NavigationMenuTrigger>
                <NavigationMenuContent className="w-max p-5">
                  <div className="flex gap-5">
                    {/* Fixed column widths let the intros wrap to ~2 lines instead of
                        stretching the sheet to fit them on one. */}
                    <div className="w-96 shrink-0">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        {t("blog.label")}
                      </div>
                      <div className="mb-3 text-sm font-normal text-muted-foreground">
                        {t("blog.intro")}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {blogPosts.map((post, index) => (
                          <a
                            key={index}
                            href={localize(post.href)}
                            className="flex h-full flex-col overflow-clip rounded-lg border border-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                          >
                            <div className="aspect-video w-full overflow-hidden border-b border-muted">
                              <img
                                src={post.image}
                                alt={post.alt}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="p-3">
                              <div className="line-clamp-2 text-sm font-medium text-foreground">
                                {post.title}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="w-56 shrink-0">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-foreground uppercase">
                        {t("insights.label")}
                      </div>
                      <div className="mb-3 text-sm font-normal text-muted-foreground">
                        {t("insights.intro")}
                      </div>
                      <div className="space-y-1">
                        {resourceLinks.map((resourceLink, index) => (
                          <NavigationMenuLink
                            key={index}
                            href={localize(resourceLink.href)}
                            className="group flex flex-row items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/30 focus:bg-muted/30 focus:text-accent-foreground dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5 transition-colors group-hover:bg-muted/80 dark:group-hover:bg-muted/70">
                              <resourceLink.icon className="size-3.5 text-foreground" />
                            </span>
                            <div className="text-sm font-medium text-foreground">
                              {t(`insights.items.${resourceLink.key}`)}
                            </div>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <div className="hidden items-center lg:flex">
              <Link href="/book-a-consultation">
                <Button variant="default" size="lg" className="px-6 py-6 cursor-pointer bg-yellow-300 hover:bg-yellow-200">
                  {t("cta")}
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label={t("mainMenu")}
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
                      {t("back")}
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
                                "services",
                                "solutions",
                                "industries",
                                "proof",
                                "about",
                                "insights",
                              ] as const
                            ).map((key) => (
                              <button
                                key={key}
                                type="button"
                                className="flex w-full items-center border-b border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                                onClick={() => openSubmenu(key)}
                              >
                                <span className="flex-1">{t(`${key}.label`)}</span>
                                <span className="shrink-0">
                                  <ChevronRight className="size-4" />
                                </span>
                              </button>
                            ))}
                          </div>
                          <div className="mx-8 mt-auto flex flex-col gap-4 py-12">
                            <Link href="/book-a-consultation">
                              <Button className="relative w-full" size="lg">
                                {t("cta")}
                              </Button>
                            </Link>
                          </div>
                        </>
                      )}

                      {submenu === "services" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            {t("services.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("services.intro")}
                          </div>
                          <div className="border-t border-border pb-16">
                            {platformFeatures.map((feature, index) => (
                              <a
                                key={index}
                                href={localize(feature.href)}
                                className="group flex w-full items-start gap-x-4 border-b border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <feature.icon className="size-6" />
                                </div>
                                <div>
                                  <div className="mb-1.5 text-base">
                                    {t(`services.items.${feature.key}`)}
                                  </div>
                                  <div className="text-sm font-normal text-muted-foreground">
                                    {t(`services.descriptions.${feature.key}`)}
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
                            {t("solutions.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("solutions.intro")}
                          </div>
                          <div>
                            {solutions.map((solution, index) => (
                              <a
                                key={index}
                                href={localize(solution.href)}
                                className="group flex w-full items-start gap-x-4 border-t border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <solution.icon className="size-6" />
                                </div>
                                <div className="text-base">
                                  {t(`solutions.items.${solution.key}`)}
                                </div>
                              </a>
                            ))}
                            <Link
                              href="/solutions"
                              className="flex w-full items-center gap-x-2 border-t border-border px-8 py-7 text-base font-medium transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                            >
                              {t("solutions.viewAll")}
                              <ArrowRight className="size-4" />
                            </Link>
                          </div>
                        </>
                      )}

                      {submenu === "industries" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            {t("industries.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("industries.intro")}
                          </div>
                          <div>
                            {industries.map((industry, index) => (
                              <a
                                key={index}
                                href={localize(industry.href)}
                                className="group flex w-full items-start gap-x-4 border-t border-border px-8 py-7 text-left transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                              >
                                <div className="shrink-0">
                                  <industry.icon className="size-6" />
                                </div>
                                <div className="text-base">
                                  {t(`industries.items.${industry.key}`)}
                                </div>
                              </a>
                            ))}
                            <Link
                              href="/industries"
                              className="flex w-full items-center gap-x-2 border-t border-border px-8 py-7 text-base font-medium transition-colors hover:bg-muted/30 dark:hover:bg-muted/25"
                            >
                              {t("industries.viewAll")}
                              <ArrowRight className="size-4" />
                            </Link>
                          </div>
                        </>
                      )}

                      {submenu === "proof" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            {t("proof.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("proof.intro")}
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {documentationLinks.map(
                              (documentationLink, index) => (
                                <NavigationMenuLink
                                  key={index}
                                  href={localize(documentationLink.href)}
                                  className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                                >
                                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                    <documentationLink.icon className="size-3.5 text-foreground" />
                                  </span>
                                  <div className="text-sm font-medium">
                                    {t(`proof.items.${documentationLink.key}`)}
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
                            {t("about.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("about.intro")}
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {aboutLinks.map((aboutLink, index) => (
                              <NavigationMenuLink
                                key={index}
                                href={localize(aboutLink.href)}
                                className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                              >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                  <aboutLink.icon className="size-3.5 text-foreground" />
                                </span>
                                <div className="text-sm font-medium">
                                  {t(`about.items.${aboutLink.key}`)}
                                </div>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </>
                      )}

                      {submenu === "insights" && (
                        <>
                          <div className="px-8 pt-8 pb-3.5 text-xs font-semibold tracking-wide text-foreground uppercase">
                            {t("blog.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("blog.intro")}
                          </div>
                          <div className="space-y-4 px-8 pb-8">
                            {blogPosts.map((post, index) => (
                              <a
                                key={index}
                                href={localize(post.href)}
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
                            {t("insights.label")}
                          </div>
                          <div className="mb-4 px-8 text-sm font-normal text-muted-foreground">
                            {t("insights.intro")}
                          </div>
                          <div className="space-y-1 px-8 pb-16">
                            {resourceLinks.map((resourceLink, index) => (
                              <NavigationMenuLink
                                key={index}
                                href={localize(resourceLink.href)}
                                className="group flex flex-row items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/30 focus:bg-muted/30 dark:hover:bg-muted/25 dark:focus:bg-muted/25"
                              >
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted p-1.5">
                                  <resourceLink.icon className="size-3.5 text-foreground" />
                                </span>
                                <div className="text-sm font-medium">
                                  {t(`insights.items.${resourceLink.key}`)}
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
