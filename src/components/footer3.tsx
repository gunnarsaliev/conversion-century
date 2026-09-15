import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Logo, LogoImage } from "@/components/shadcnblocks/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cta28 } from "@/components/cta28";
import { SeoCta } from "./cta-seo";

const sections = [
  {
    title: "Services",
    links: [
      {
        name: "Ongoing SEO Management",
        href: "/website/services/ongoing-seo-management",
      },
      {
        name: "AI Search Optimization",
        href: "/website/services/ai-search-optimization",
      },
      { name: "SEO Audit", href: "/website/services/seo-audit" },
      { name: "International SEO", href: "/website/services" },
      { name: "Local SEO", href: "/website/services/local-seo" },
      { name: "Technical SEO", href: "/website/services/technical-seo" },
    ],
  },
  {
    title: "Industries",
    links: [
      { name: "B2B", href: "#" },
      { name: "Ecommerce", href: "#" },
      { name: "Professional Services", href: "#" },
      { name: "Financial Sector", href: "#" },
      { name: "Real Estate", href: "#" },
      { name: "Healthcare", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Our Story", href: "#" },
      { name: "Career", href: "#" },
      { name: "Team", href: "#" },
    ],
  },
];

interface Footer3Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
}
const Footer3 = ({
  logo = {
    url: "https://shadcnblocks.com",
    src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg",
    alt: "Conversion Century",
    title: "Conversion Century",
  },
  className,
}: Footer3Props) => {
  return (
    <section className={cn("py-32", className)}>
     <SeoCta />
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <footer>
          <Logo url={logo.url}>
            <LogoImage
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-10"
            />
          </Logo>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      {link.href.startsWith("/") ? (
                        <Link href={link.href}>{link.name}</Link>
                      ) : (
                        <a href={link.href}>{link.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="sm:col-span-2 lg:col-span-1">
              <ul className="mb-10 flex items-center gap-2 text-muted-foreground">
                <li className="font-medium">
                  <a
                    href="https://www.facebook.com/people/Conversion-Century-Ltd/100086510380518/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaFacebookF className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a
                    href="https://www.instagram.com/conversioncentury/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaInstagram className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a
                    href="https://www.linkedin.com/company/conversion-century/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaLinkedin className="size-6" />
                    </span>
                  </a>
                </li>
              </ul>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Subscribe to our newsletter</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-input/30"
                  />
                  <Button type="submit">Subscribe</Button>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  By submitting, you agree to our
                  <Link
                    href="/legal/privacy-policy"
                    className="ml-1 text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col flex-wrap justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Conversion Century. All rights reserved.</span>
            <ul className="flex gap-4">
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/terms-and-conditions">
                  Terms and Conditions
                </Link>
              </li>
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/cookie-policy">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer3 };
