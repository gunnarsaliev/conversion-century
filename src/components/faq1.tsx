import { cn } from "cn";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RichText } from "@/components/rich-text";

interface FaqItem {
  id?: string | null;
  question: string;
  answer: SerializedEditorState;
}

interface Faq1Props {
  heading: string;
  items: FaqItem[];
  className?: string;
}

const Faq1 = ({ heading, items, className }: Faq1Props) => {
  if (items.length === 0) return null;

  return (
    <section className={cn("py-32", className)}>
      <h2 className="mb-4 text-2xl font-semibold md:mb-8 md:text-3xl">
        {heading}
      </h2>
      <Accordion>
        {items.map((item, index) => (
          <AccordionItem key={item.id ?? index} value={`item-${index}`}>
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground prose-p:my-2">
              <RichText data={item.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export { Faq1 };
export type { FaqItem };
