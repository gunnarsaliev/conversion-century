import { cn } from "cn";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface Team39Props {
  heading: string;
  description: string;
  members: TeamMember[];
  className?: string;
}

const defaultProps: Team39Props = {
  heading: "Eight people. One shared codebase.",
  description: "Hover a portrait to see the role.",
  members: [
    {
      name: "Elena Voss",
      role: "CEO",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-1-1x1.jpg",
    },
    {
      name: "Caleb Hart",
      role: "CTO",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-2-1x1.jpg",
    },
    {
      name: "Noor Idris",
      role: "CPO",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-3-1x1.jpg",
    },
    {
      name: "Maya Chen",
      role: "Design Lead",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-4-1x1.jpg",
    },
    {
      name: "Theo Okonkwo",
      role: "Engineering Manager",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-5-1x1.jpg",
    },
    {
      name: "Iris Lang",
      role: "Frontend Engineer",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-6-1x1.jpg",
    },
    {
      name: "Jonah Hale",
      role: "Backend Engineer",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-1-1x1.jpg",
    },
    {
      name: "Priya Sen",
      role: "DevOps Engineer",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/portraits/portrait-action-2-1x1.jpg",
    },
  ],
};

type Props = Partial<Team39Props>;

const Team39 = (props: Props) => {
  const { heading, description, members, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-14">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
            <p className="text-pretty text-muted-foreground">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.name}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end gap-1 bg-linear-to-t from-foreground/50 to-transparent p-4 text-center transition-opacity duration-300 group-hover:opacity-0">
                  <p className="text-sm font-semibold text-background">
                    {member.name}
                  </p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-end gap-1 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-background">
                    {member.name}
                  </p>
                  <p className="text-xs font-medium text-background/80">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Team39 };
