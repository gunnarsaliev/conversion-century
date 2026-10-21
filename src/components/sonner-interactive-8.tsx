"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const title = "Toast Lifecycle Callbacks";

const toasterId = "toast-lifecycle-callbacks";

const Example = () => (
  <>
    <Button
      onClick={() =>
        toast("Event has been created", {
          closeButton: true,
          onAutoClose: () =>
            toast.info("Toast closed automatically", { toasterId }),
          onDismiss: () => toast.info("Toast dismissed", { toasterId }),
          toasterId,
        })
      }
      variant="outline"
    >
      Show Toast
    </Button>
    <Toaster id={toasterId} position="bottom-right" />
  </>
);

export default Example;
