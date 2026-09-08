"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import z from "zod";

import { FormStarRating } from "@/components/shadcnblocks/form-star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type FeedbackOptionsType = {
  label: string;
  id: string;
};

type RatingStarsOption = {
  value: number;
  label: string;
  text?: string;
  options?: FeedbackOptionsType[];
};

interface FeedbackDataType {
  title: string;
  starRatingOptions: RatingStarsOption[];
}

interface FeedbackStarRatingProps {
  options: RatingStarsOption[];
  title?: string;
}

interface FeedbackOptionsProps {
  options?: FeedbackOptionsType[];
}

interface Feedback1Props extends FeedbackDataType {
  className?: string;
}

const FEEDBACK_DATA = {
  title: "Your opinion counts! Help us make our website better.",
  starRatingOptions: [
    {
      value: 1,
      label: "Very Poor",
      text: "Sorry to hear that. Could you tell us what went wrong?",
      options: [
        {
          label: "Website Experience",
          id: "val-1",
        },
        {
          label: "Recent Order",
          id: "2",
        },
        {
          label: "In-store Experience",
          id: "3",
        },
        {
          label: "Customer Experience",
          id: "4",
        },
        {
          label: "Other",
          id: "5",
        },
      ],
    },
    {
      value: 2,
      label: "Poor",
      text: "Sorry to hear that. Could you tell us what went wrong?",
      options: [
        {
          label: "Website Experience",
          id: "val-1",
        },
        {
          label: "Recent Order",
          id: "2",
        },
        {
          label: "In-store Experience",
          id: "3",
        },
        {
          label: "Customer Experience",
          id: "4",
        },
        {
          label: "Other",
          id: "5",
        },
      ],
    },
    {
      value: 3,
      label: "Fair",
      text: "Sorry to hear that. Could you tell us what went wrong?",
      options: [
        {
          label: "Website Experience",
          id: "val-1",
        },
        {
          label: "Recent Order",
          id: "2",
        },
        {
          label: "In-store Experience",
          id: "3",
        },
        {
          label: "Customer Experience",
          id: "4",
        },
        {
          label: "Other",
          id: "5",
        },
      ],
    },
    {
      value: 4,
      label: "Good",
    },
    {
      value: 5,
      label: "Excellent",
      text: "We’re delighted to hear you had a great experience!",
    },
  ],
};
const feedbackFormSchema = z.object({
  rate: z.number(),
  questions: z.string().array().optional(),
  message: z.string().max(400, "Max characters are 400").optional(),
});

type FeedbackFormType = z.infer<typeof feedbackFormSchema>;

const Feedback1 = ({
  className,
  title = FEEDBACK_DATA.title,
  starRatingOptions = FEEDBACK_DATA.starRatingOptions,
}: Feedback1Props) => {
  const methods = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      rate: 0,
      questions: [],
      message: "",
    },
  });

  const rateValue = methods.watch("rate");

  const onSubmit = (data: FeedbackFormType) => console.log(data);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <Sheet defaultOpen>
          <SheetTrigger render={<Button variant="outline" />}>Give Feedback</SheetTrigger>
          <SheetContent showCloseButton={false} aria-describedby={undefined}>
            <SheetHeader className="flex-row items-center justify-between border-b">
              <SheetTitle className="text-lg">Feedback</SheetTitle>
              <SheetClose render={<Button size="icon" variant="secondary" />}><X /></SheetClose>
            </SheetHeader>
            <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-5 pt-5 pb-5">
              <FormProvider {...methods}>
                <form
                  id="form-feedback"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="mx-auto max-w-70 text-center text-lg font-semibold">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-sm:px-3.5">
                      <div className="flex w-full flex-col items-center gap-4">
                        <FeedbackStarRating
                          options={starRatingOptions}
                          title={starRatingOptions[rateValue - 1]?.text}
                        />
                        <div className="space-y-4 self-stretch">
                          <Collapsible open={true}>
                            <CollapsibleContent>
                              <div>
                                <FeedbackOptions
                                  options={
                                    starRatingOptions[rateValue - 1]?.options
                                  }
                                />
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                          <FeedbackTextarea />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </FormProvider>
            </div>
            {rateValue > 0 && (
              <SheetFooter>
                <Button type="submit" form="form-feedback">
                  Send Feedback
                </Button>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

const FeedbackStarRating = ({ options, title }: FeedbackStarRatingProps) => {
  const methods = useFormContext();

  return (
    <Controller
      name="rate"
      control={methods.control}
      render={({ field, fieldState }) => (
        <FieldSet className="items-center">
          <FormStarRating
            name={field.name}
            value={field.value ? String(field.value) : ""}
            onValueChange={(val) => field.onChange(Number(val))}
            options={options.map(({ value, label }) => ({
              value: String(value),
              label,
            }))}
            invalid={fieldState.invalid}
            showLabel
            emptyLabel="(1 = Very poor, 5 = Excellent!)"
          />

          {title && <p>{title}</p>}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};

const FeedbackOptions = ({ options }: FeedbackOptionsProps) => {
  const methods = useFormContext();

  if (!options) return null;

  return (
    <Controller
      name="questions"
      control={methods.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldGroup data-slot="checkbox-group">
            {options.map((option) => (
              <FieldLabel key={option.id}>
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id={`question-checkbox-${option.id}`}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, option.id]
                        : field.value.filter(
                            (value: string) => value !== option.id,
                          );
                      field.onChange(newValue);
                    }}
                  />
                  <FieldContent>
                    <FieldTitle> {option.label}</FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};

const FeedbackTextarea = () => {
  const methods = useFormContext();

  const message = methods.watch("message");

  return (
    <Controller
      name="message"
      control={methods.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="textarea-feedback">Tell us more</FieldLabel>

          <InputGroup>
            <InputGroupTextarea
              {...field}
              id="textarea-feedback"
              aria-invalid={fieldState.invalid}
              placeholder="Enter your message"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="text-xs text-muted-foreground">
                {message.length}/400
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>
            Tell us more about your experience. This will be used to help us
            improve our services.
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export { Feedback1 };
