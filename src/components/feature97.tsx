import { BarChart, Heart, Monitor, TrendingUp } from "lucide-react";
import { cn } from "cn";

interface Feature97Item {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface Feature97Props {
  heading?: string;
  description?: string;
  features: Feature97Item[];
  className?: string;
}

const defaultProps: Feature97Props = {
  features: [
    {
      icon: <Heart className="mx-auto h-auto w-7" />,
      title: "Health Overview",
      description:
        "Discover key health insights tailored to your lifestyle, delivered in a clear and actionable format.",
    },
    {
      icon: <BarChart className="mx-auto h-auto w-7" />,
      title: "Personalized Insights",
      description:
        "Gain tailored health insights based on your unique data, helping you make informed decisions.",
    },
    {
      icon: <TrendingUp className="mx-auto h-auto w-7" />,
      title: "Comprehensive Analytics",
      description:
        "Deep dive into your health data with comprehensive analytics designed to offer actionable outcomes.",
    },
    {
      icon: <Monitor className="mx-auto h-auto w-7" />,
      title: "Continuous Monitoring",
      description:
        "Stay updated on your health with continuous monitoring that tracks progress in real-time.",
    },
  ],
};

type Props = Partial<Feature97Props>;

const Feature97 = (props: Props) => {
  const { heading, description, features, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn(className)}>
      {(heading || description) && (
        <div className="mx-auto mt-20 max-w-3xl text-center">
          {heading && (
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="mx-auto mt-20 grid max-w-5xl gap-20 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="text-center">
            {feature.icon}
            <h3 className="mt-4 mb-2 text-xl font-semibold">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export { Feature97 };
