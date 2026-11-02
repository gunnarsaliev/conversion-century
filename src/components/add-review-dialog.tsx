"use client";

import { MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { TestimonialForm, type TestimonialClientOption } from "@/components/testimonial-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// "Add a review" button on the reviews page. Opens the public testimonial
// form, which saves the review as `pending` for an admin to approve.
export function AddReviewDialog({ clients }: { clients: TestimonialClientOption[] }) {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" />}>
        <MessageSquarePlus aria-hidden="true" />
        {t("TestimonialForm.addReview")}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {t("TestimonialForm.page.heading")}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t("TestimonialForm.page.description")}
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm clients={clients} />
      </DialogContent>
    </Dialog>
  );
}
