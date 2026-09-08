import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IntegrationItem {
  image: string;
  title: string;
  description: string;
  isConnected?: boolean;
  link: string;
  className?: string;
}

interface IntegrationCardProps {
  integration: IntegrationItem;
}

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  return (
    <a
      href={integration.link}
      className="group flex cursor-pointer flex-col gap-4 rounded-lg border p-4 hover:bg-muted/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <img
          src={integration.image}
          alt={integration.title}
          className={cn("size-10 sm:size-16", integration.className)}
        />
        {integration.isConnected ? (
          <div>
            <Badge className="bg-green-100 text-green-800">Connected</Badge>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100">
            <ArrowRight className="size-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 text-base">
        <p className="font-medium">{integration.title}</p>
        <p className="text-sm text-muted-foreground">
          {integration.description}
        </p>
      </div>
    </a>
  );
};

interface IntegrationListProps {
  integrations: IntegrationItem[];
}

const IntegrationList = ({ integrations }: IntegrationListProps) => {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {integrations.map((integration, i) => {
        return (
          <li key={`integration-${i}-${integration.title}`}>
            <IntegrationCard integration={integration} />
          </li>
        );
      })}
    </ul>
  );
};

interface SettingsIntegrations3Props {
  heading?: string;
  subHeading?: string;
  integrations?: IntegrationItem[];
}

const SettingsIntegrations3 = ({
  heading = "Connect your favorite tools",
  subHeading = "Save time using popular integrations to sync your form submissions.",
  integrations = [
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/slack-icon.svg",
      title: "Slack",
      description: "Send notifications and updates to your team channels.",
      isConnected: true,
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/drive.svg",
      title: "Google Drive",
      description: "Access and sync files from your Google Drive.",
      isConnected: true,
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/notion-icon.svg",
      title: "Notion",
      description: "Sync your workspace pages and databases.",
      isConnected: true,
      link: "https://shadcnblocks.com",
      className: "dark:invert",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/jira.svg",
      title: "Jira",
      description: "Track issues and manage your agile projects.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/asana.svg",
      title: "Asana",
      description: "Manage tasks and collaborate with your team.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/dropbox-icon.svg",
      title: "Dropbox",
      description: "Store and share files securely in the cloud.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-icon.svg",
      title: "Figma",
      description: "Import designs and collaborate on prototypes.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg",
      title: "GitHub",
      description: "Connect repositories and automate workflows.",
      isConnected: true,
      link: "https://shadcnblocks.com",
      className: "dark:invert",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/stripe.svg",
      title: "Stripe",
      description: "Process payments and manage subscriptions.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/confluence.svg",
      title: "Confluence",
      description: "Create and share team documentation.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/monday.svg",
      title: "Monday",
      description: "Organize workflows and track project progress.",
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/excel.svg",
      title: "Excel",
      description: "Import and export spreadsheet data seamlessly.",
      isConnected: true,
      link: "https://shadcnblocks.com",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-icon.svg",
      title: "Vercel",
      description: "Deploy and preview your web applications.",
      isConnected: true,
      link: "https://shadcnblocks.com",
      className: "dark:invert",
    },
    {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/mainline/logos/retool.svg",
      title: "Retool",
      description: "Build custom internal tools and dashboards.",
      link: "https://shadcnblocks.com",
      className: "dark:invert",
    },
  ],
}: SettingsIntegrations3Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-3">
          <p className="text-xl font-semibold tracking-tight sm:text-3xl">
            {heading}
          </p>
          <p className="text-lg font-medium text-muted-foreground">
            {subHeading}
          </p>

          <IntegrationList integrations={integrations} />
        </div>
      </div>
    </section>
  );
};

export { SettingsIntegrations3 };
