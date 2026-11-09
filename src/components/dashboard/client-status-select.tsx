"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { setClientStatus } from "@/app/[locale]/(frontend)/dashboard/clients/actions";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CLIENT_STATUSES,
  clientSection,
  clientStatusBadgeClassName,
  isClientStatus,
} from "@/lib/client-status";
import { cn } from "cn";

// ---------------------------------------------------------------------------
// Client status dropdown
// ---------------------------------------------------------------------------
//
// The coloured status badge doubles as a menu trigger for changing the
// record's status in one click.

type ClientStatusSelectProps = {
  clientId: string | number;
  status: string;
  // On a detail page, a status that belongs to another dashboard section
  // (e.g. lead → active) would 404 the current URL, so go to the record's
  // new home instead of refreshing.
  navigateOnSectionChange?: boolean;
  className?: string;
};

const ClientStatusSelect = ({
  clientId,
  status,
  navigateOnSectionChange = false,
  className,
}: ClientStatusSelectProps) => {
  const t = useTranslations("Clients");
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [optimisticStatus, setOptimisticStatus] = React.useOptimistic(status);

  const onValueChange = (value: unknown) => {
    if (typeof value !== "string" || !isClientStatus(value) || value === optimisticStatus) {
      return;
    }

    startTransition(async () => {
      setOptimisticStatus(value);
      const result = await setClientStatus(clientId, value);

      if (!result.success) {
        window.alert(result.error);
        return;
      }

      const nextSection = clientSection(result.status);
      if (navigateOnSectionChange && nextSection !== clientSection(status)) {
        router.replace(`/dashboard/${nextSection}/${clientId}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("status.change")}
        disabled={isPending}
        className={cn(
          "inline-flex rounded-4xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-70",
          className,
        )}
      >
        <Badge className={cn("cursor-pointer gap-1", clientStatusBadgeClassName(optimisticStatus))}>
          {t(`status.${optimisticStatus}`)}
          <ChevronDown className="size-3" aria-hidden="true" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={optimisticStatus} onValueChange={onValueChange}>
          {CLIENT_STATUSES.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {t(`status.${value}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ClientStatusSelect };
