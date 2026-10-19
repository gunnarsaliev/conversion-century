import { cn } from "cn";

export interface FaqItem {
  question: string;
  answer: string;
}

/** A titled set of questions, e.g. one technical group of an offer. */
export interface FaqGroup {
  title?: string;
  items: FaqItem[];
}

interface Faq2Props {
  /** Pass `null` to render without a heading (e.g. when the page has one). */
  heading?: string | null;
  description?: string;
  /** A flat list of questions; ignored when `groups` is given. */
  items?: FaqItem[];
  /** Questions split under group titles. */
  groups?: FaqGroup[];
  /** Numbers the group titles ("1. …"). */
  numbered?: boolean;
  className?: string;
}

const defaultItems: FaqItem[] = [
  {
    question: "What is a FAQ?",
    answer:
      "A FAQ is a list of frequently asked questions and answers on a particular topic.",
  },
  {
    question: "What is the purpose of a FAQ?",
    answer:
      "The purpose of a FAQ is to provide answers to common questions and help users find the information they need quickly and easily.",
  },
  {
    question: "How do I create a FAQ?",
    answer:
      "To create a FAQ, you need to compile a list of common questions and answers on a particular topic and organize them in a clear and easy-to-navigate format.",
  },
  {
    question: "What are the benefits of a FAQ?",
    answer:
      "The benefits of a FAQ include providing quick and easy access to information, reducing the number of support requests, and improving the overall user experience.",
  },
  {
    question: "How should I organize my FAQ?",
    answer:
      "You should organize your FAQ in a logical manner, grouping related questions together and ordering them from most basic to more advanced topics.",
  },
  {
    question: "How long should FAQ answers be?",
    answer:
      "FAQ answers should be concise and to the point, typically a few sentences or a short paragraph is sufficient for most questions.",
  },
  {
    question: "Should I include links in my FAQ?",
    answer:
      "Yes, including links to more detailed information or related resources can be very helpful for users who want to learn more about a particular topic.",
  },
];

function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.question} className="border-b pb-2">
          <h3 className="mb-1 font-semibold">{item.question}</h3>
          <p className="text-muted-foreground">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

const Faq2 = ({
  heading = "Frequently asked questions",
  description,
  items = defaultItems,
  groups,
  numbered = false,
  className,
}: Faq2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container max-w-3xl">
        {heading && (
          <h2 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">{heading}</h2>
        )}
        {description && <p className="mb-8 text-muted-foreground">{description}</p>}
        {groups ? (
          <div className="space-y-10">
            {groups.map((group, i) => (
              <div key={group.title ?? i}>
                {group.title && (
                  <h3 className="mb-3 text-lg font-semibold">
                    {numbered && `${i + 1}. `}
                    {group.title}
                  </h3>
                )}
                <FaqList items={group.items} />
              </div>
            ))}
          </div>
        ) : (
          <FaqList items={items} />
        )}
      </div>
    </section>
  );
};

export { Faq2 };
