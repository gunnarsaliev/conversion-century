import {
  ArrowRight,
  FlaskConical,
  Handshake,
  MessagesSquare,
  Search,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/lib/team-members";

// Content of the About page (copy from "About US.md").

const story = [
  {
    year: "2016",
    title: "A Dedicated SEO Agency Takes Shape",
    content:
      "Conversion Century was founded in February 2016 by Nick Gerdzhikov in Bulgaria. From the beginning, the agency focused specifically on SEO, bringing research, website optimisation, content and link building together around clients’ business goals.",
  },
  {
    year: "2017",
    title: "Our First Steps Into the United States",
    content:
      "We began working with clients in the US, expanding our experience beyond Bulgaria. These projects introduced new competitive environments and helped shape our approach to working across markets.",
  },
  {
    year: "2018",
    title: "Larger Clients and Local Partnerships",
    content:
      "Our Bulgarian portfolio grew to include larger, established businesses. We also built relationships with local agencies, contributing specialist SEO expertise to broader marketing and website projects.",
  },
  {
    year: "2019",
    title: "Supporting European Expansion",
    content:
      "We entered more European markets alongside Bulgarian brands looking to grow internationally. Understanding local search demand and adapting websites for different audiences became an increasingly important part of our work.",
  },
  {
    year: "2020",
    title: "A Growing Business and a New Team Member",
    content:
      "The agency continued to grow, developing its client relationships and delivery processes. Maria Sivkova joined as an intern, beginning a journey that would take her from learning the agency’s methods to leading its next chapter.",
  },
  {
    year: "2021",
    title: "Our First Sofia Office",
    content:
      "We opened our first physical office in Sofia, creating a shared space for collaboration and learning. Alongside our international work, we invested in documenting processes and turning practical experience into knowledge the whole team could use.",
  },
  {
    year: "2022",
    title: "New Ownership, Continued Ambition",
    content:
      "When Nick moved to the United States, Maria acquired Conversion Century and became its new owner.\n\nWe continued strengthening our international presence, developing our internal methods and building our partnership with MUZE. This brought our SEO expertise closer to complementary creative, marketing and influencer capabilities.",
  },
  {
    year: "2023",
    title: "Bringing Our Expertise Together",
    content:
      "We continued refining how research, technical SEO, content and authority building work together. Our focus was on clearer priorities, stronger coordination and long-term relationships with clients and agency partners.",
  },
  {
    year: "2024",
    title: "Investing in Tools and International Education",
    content:
      "We became official partners of Ahrefs and Semrush and expanded international SEO training across the team. Continued education helped us build a shared foundation while giving specialists room to deepen their individual expertise.",
  },
  {
    year: "2025",
    title: "A More Specialised Team",
    content:
      "Our team reached 10 people, with a clearer structure across SEO specialists, content managers, copywriters and technical SEO specialists. This strengthened both specialist ownership and collaboration across client projects.",
  },
  {
    year: "2026",
    title: "Our Strongest Year Yet",
    content:
      "Our tenth year has been our strongest so far, with a growing client portfolio and a clear direction for the future.\n\nWe are developing our approach to AI search visibility, testing new tools and adapting our methods as discovery changes. Alongside that work, we continue investing in the technical foundations, content quality and commercial understanding that support lasting organic performance.",
  },
];

// ISO 3166 codes for the flag images.
const countries = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "de", name: "Germany" },
  { code: "ro", name: "Romania" },
  { code: "gr", name: "Greece" },
  { code: "hu", name: "Hungary" },
  { code: "fr", name: "France" },
  { code: "es", name: "Spain" },
  { code: "pt", name: "Portugal" },
];

const principles = [
  {
    icon: Search,
    title: "Understand Before Recommending",
    content:
      "We investigate your business, audience and website before deciding what needs to change. Recommendations should reflect your situation, resources and opportunities.",
  },
  {
    icon: ShieldCheck,
    title: "Take Ownership",
    content:
      "We follow through on our responsibilities, raise issues early and stay involved as recommendations move into implementation. We care about what happens after a task is delivered.",
  },
  {
    icon: MessagesSquare,
    title: "Communicate Clearly",
    content:
      "You should understand what we are doing, why it matters and how we will evaluate progress. We share findings openly, explain limitations and have honest conversations about priorities.",
  },
  {
    icon: Sprout,
    title: "Build for the Long Term",
    content:
      "We use white-hat SEO methods and focus on useful content, accessible websites and relevant authority. Our work should strengthen your business presence over time.",
  },
  {
    icon: FlaskConical,
    title: "Keep Learning and Testing",
    content:
      "Search changes, and our methods need to develop with it. We invest in education, share knowledge and evaluate new tools critically before making them part of our work.",
  },
  {
    icon: Handshake,
    title: "Work as Partners",
    content:
      "We value the knowledge your team brings. Some of our client relationships span more than seven years, built through collaboration, consistency and a shared commitment to progress.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold tracking-wide text-primary uppercase">{children}</p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
      {children}
    </h2>
  );
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

export function AboutHero() {
  return (
    <section className="container mx-auto py-16 lg:py-24">
      <div className="max-w-4xl">
        <Eyebrow>About Conversion Century</Eyebrow>
        <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-[-1px] text-balance sm:text-5xl lg:text-6xl">
          A Focused Team. A Shared Commitment to Your Growth.
        </h1>
        <div className="mt-8 max-w-3xl space-y-4 text-lg text-muted-foreground">
          <p>
            Conversion Century is a boutique SEO agency based in Sofia, Bulgaria, working with
            businesses across Europe and the United States.
          </p>
          <p>
            Since 2016, we have combined technical expertise, professional content and strategic
            thinking to help businesses strengthen their organic presence. Today, that work spans
            search engines and AI-powered discovery, with the same focus: connecting your business
            with people who need what you offer.
          </p>
        </div>
        <Button
          className="mt-10 h-12 rounded-full px-6 text-[15px]"
          render={<Link href="/team" />}
          nativeButton={false}
        >
          Meet the team
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function AboutStory() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:py-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>Since 2016</Eyebrow>
          <div className="mt-3">
            <SectionHeading>Our Story</SectionHeading>
          </div>
        </div>
        <ol className="relative space-y-10 border-l border-border pl-8">
          {story.map((item) => (
            <li key={item.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[37px] size-[9px] rounded-full bg-primary ring-4 ring-background"
              />
              <p className="text-sm font-semibold text-primary">{item.year}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{item.title}</h3>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-muted-foreground">
                <Paragraphs text={item.content} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutPeople({ members }: { members: TeamMember[] }) {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Our team</Eyebrow>
            <div className="mt-3">
              <SectionHeading>The People Behind the Work</SectionHeading>
            </div>
            <p className="mt-6 text-lg text-muted-foreground">
              Our team brings together SEO specialists, technical specialists, content managers
              and professional copywriters.
            </p>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:pt-10">
            <p>
              We work closely across disciplines because a website’s performance depends on how
              its parts connect. Search research informs content. Technical decisions affect
              discovery. Clear product and service information helps visitors evaluate an offer
              and take action.
            </p>
            <p>
              Clients have direct access to the people responsible for their work, including the
              owner and senior content expertise. Within the team, we share findings, review
              important decisions and support each other’s development.
            </p>
          </div>
        </div>

        {members.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {members.map((member) => (
              <li key={member.id}>
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold">{member.name}</p>
                {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function AboutMarkets() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto py-16 text-center lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Where we work</Eyebrow>
          <div className="mt-3">
            <SectionHeading>Based in Sofia. Working Across Borders.</SectionHeading>
          </div>
          <p className="mt-6 text-lg text-muted-foreground">
            We support Bulgarian businesses expanding internationally and international companies
            building their presence in Bulgaria and other European markets.
          </p>
          <p className="mt-8 text-sm font-medium text-foreground/80">Our experience spans</p>
        </div>
        <ul className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
          {countries.map((country) => (
            <li
              key={country.code}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1.5 pr-4 pl-2 text-sm"
            >
              <img
                src={`https://api.iconify.design/flag/${country.code}-4x3.svg`}
                alt=""
                width={20}
                height={15}
                className="h-[15px] w-5 rounded-[3px] object-cover ring-1 ring-border"
              />
              {country.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutCollaboration() {
  return (
    <section className="border-t border-border">
      <div className="container mx-auto grid gap-8 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>How we work</Eyebrow>
          <div className="mt-3">
            <SectionHeading>Close Collaboration. Shared Ambition.</SectionHeading>
          </div>
          <p className="mt-6 text-xl font-medium text-balance">
            We believe good work starts with knowing the business behind the website.
          </p>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:pt-10">
          <p>
            Your customers, commercial priorities and ambitions shape our approach. We take time to
            understand what you are building, where you want to go and what could stand in the
            way. That understanding guides the research, recommendations and everyday decisions we
            make on your behalf.
          </p>
          <p>
            Our team is deliberately small, with experienced specialists working closely together.
            This gives us room for direct communication, shared responsibility and meaningful
            involvement in each client’s story.
          </p>
          <p>
            We bring energy, curiosity and a strong commitment to improving our craft. You work
            with people who care about the details, take ownership of their work and want to see
            your business move forward.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutMission() {
  return (
    <section className="container mx-auto py-8 lg:py-12">
      <div className="rounded-3xl bg-muted/60 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
        <Eyebrow>Our Mission</Eyebrow>
        <p className="mt-4 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance lg:text-4xl">
          To help businesses build a lasting, commercially valuable presence wherever their
          customers search.
        </p>
        <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2 md:gap-12">
          <p>
            We make complex search challenges easier to understand and act on. Through research,
            technical improvements, useful content and relevant authority, we help clients turn
            their expertise, products and services into opportunities for growth.
          </p>
          <p>
            Success means attracting the right people and helping them take a meaningful next step
            — an enquiry, a consultation, an application or a purchase.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AboutPrinciples() {
  return (
    <section className="container mx-auto py-16 lg:py-24">
      <div className="max-w-3xl">
        <Eyebrow>Our values</Eyebrow>
        <div className="mt-3">
          <SectionHeading>The Principles Behind Our Work</SectionHeading>
        </div>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map(({ icon: Icon, title, content }) => (
          <li key={title} className="rounded-2xl border border-border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
