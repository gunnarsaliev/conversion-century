import { cn } from "@/lib/utils";

interface Editor {
  name: string;
  role: string;
  bio: string;
  beat: string;
  image: string;
}

interface Team55Props {
  label: string;
  heading: string;
  editors: Editor[];
  className?: string;
}

const defaultProps: Team55Props = {
  label: "Editorial team",
  heading: "The voices behind the work.",
  editors: [
    {
      name: "Elena Voss",
      role: "Editor-in-Chief",
      bio: "Fifteen years covering technology and culture. Previously at two national papers.",
      beat: "Technology & Society",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-1-3x4.jpg",
    },
    {
      name: "Caleb Hart",
      role: "Senior Editor",
      bio: "Data journalism specialist. His interactive investigations have won three press awards.",
      beat: "Investigations",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-2-3x4.jpg",
    },
    {
      name: "Noor Idris",
      role: "Features Editor",
      bio: "Long-form narratives on climate, infrastructure, and the future of cities.",
      beat: "Climate & Cities",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-3-3x4.jpg",
    },
    {
      name: "Maya Chen",
      role: "Science Editor",
      bio: "PhD in biophysics. Translates dense research into language that sticks.",
      beat: "Science",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-4-1x1.jpg",
    },
  ],
};

type Props = Partial<Team55Props>;

const Team55 = (props: Props) => {
  const { label, heading, editors, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("bg-muted/40 py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-16">
          <div className="flex max-w-xl flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {label}
            </p>
            <h2 className="max-w-xl font-serif text-4xl tracking-tight text-balance sm:text-5xl">
              {heading}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {editors.map((editor) => (
              <div
                key={editor.name}
                className="flex overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={editor.image}
                  alt={editor.name}
                  className="min-h-48 w-28 shrink-0 self-stretch object-cover sm:w-36"
                />
                <div className="flex flex-col justify-between gap-4 py-6 pr-6 pl-6">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-serif text-lg leading-tight font-medium tracking-tight sm:text-xl">
                      {editor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {editor.role}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                    {editor.bio}
                  </p>
                  <span className="inline-flex self-start rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {editor.beat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Team55 };
