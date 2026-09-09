"use client";

import * as React from "react";

import { setChecklistProgressDone } from "@/app/[locale]/(frontend)/dashboard/clients/actions";
import { Checkbox } from "@/components/ui/checkbox";

// ---------------------------------------------------------------------------
// Checklist item checkbox
// ---------------------------------------------------------------------------
//
// Toggles a checklist progress entry between "done" and "pending". Applies
// the change optimistically, then reverts if the server action fails. On
// success the page is revalidated and the parent remounts this component
// (keyed by id + status) so it picks up the new Done / Not Done grouping.

type ChecklistItemCheckboxProps = {
  progressId: string | number;
  clientId: string | number;
  done: boolean;
  label: string;
};

const ChecklistItemCheckbox = ({
  progressId,
  clientId,
  done,
  label,
}: ChecklistItemCheckboxProps) => {
  const [checked, setChecked] = React.useState(done);
  const [isPending, setIsPending] = React.useState(false);

  const handleCheckedChange = async (next: boolean) => {
    setChecked(next);
    setIsPending(true);

    const result = await setChecklistProgressDone(progressId, clientId, next);

    setIsPending(false);

    if (!result.success) {
      setChecked(!next);
    }
  };

  return (
    <Checkbox
      checked={checked}
      disabled={isPending}
      onCheckedChange={handleCheckedChange}
      aria-label={`Mark "${label}" as ${checked ? "not done" : "done"}`}
    />
  );
};

export { ChecklistItemCheckbox };
