import React from "react";
import { cn } from "cn";

interface Project4aProps {
  className?: string;
}

const Project4a = ({ className }: Project4aProps) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-8">
              {/* Project Info */}
              <div>
                <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Brand Identity Design
                </p>
                <h1 className="mb-4 text-4xl font-bold">Pure Pressed</h1>
                <p className="leading-relaxed text-muted-foreground">
                  Crafting a fresh, authentic brand identity for a premium
                  cold-pressed juice company.
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-6 border-t pt-8">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Creative Director
                  </p>
                  <p className="font-medium">Maya Chen</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Industry
                  </p>
                  <p className="font-medium">Food & Beverage</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Year
                  </p>
                  <p className="font-medium">2024</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="border-t pt-8">
                <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Sections
                </p>
                <div className="space-y-2">
                  <a
                    href="#challenge"
                    className="block text-sm transition-colors hover:text-primary"
                  >
                    The Challenge
                  </a>
                  <a
                    href="#process"
                    className="block text-sm transition-colors hover:text-primary"
                  >
                    Process
                  </a>
                  <a
                    href="#outcome"
                    className="block text-sm transition-colors hover:text-primary"
                  >
                    Outcome
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Image */}
            <div className="mb-16">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pressed-juice/devin-avery-BRVqq2uak4E-unsplash.jpg"
                alt="Fresh cold-pressed juice bottles"
                className="w-full rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                Pure Pressed approached us to create a brand identity that would
                differentiate them in the competitive wellness market. Our
                challenge was to convey authenticity, premium quality, and the
                raw vitality of fresh ingredients through every touchpoint.
              </p>

              <h2 id="challenge">The Challenge</h2>

              <p>
                The cold-pressed juice market is saturated with brands claiming
                to be "natural" and "healthy." Pure Pressed needed to stand out
                by communicating genuine authenticity and premium quality while
                remaining approachable to everyday consumers.
              </p>

              <h3>Market differentiation</h3>
              <p>
                With numerous competitors using similar messaging around health
                and wellness, we needed to find a unique positioning that
                highlighted Pure Pressed's commitment to quality ingredients and
                sustainable practices.
              </p>

              <h3>Premium accessibility</h3>
              <p>
                The brand needed to feel premium enough to justify higher price
                points while remaining accessible and not intimidating to
                health-conscious consumers from all backgrounds.
              </p>

              <div className="not-prose my-16">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pressed-juice/devin-avery-jcHO600npH8-unsplash.jpg"
                  alt="Colorful array of fresh pressed juices"
                  className="w-full rounded-lg"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground italic">
                  The vibrant color palette of Pure Pressed juices became a key
                  brand differentiator, showcasing the natural beauty of fresh
                  ingredients.
                </p>
              </div>

              <h2 id="process">Process</h2>

              <p>
                Our approach began with extensive market research and consumer
                interviews to understand the wellness landscape. We developed a
                brand strategy that positioned Pure Pressed as the intersection
                of premium quality and authentic simplicity.
              </p>

              <h3>Our design methodology</h3>
              <ol>
                <li>Brand strategy & positioning research</li>
                <li>Visual identity exploration & concepts</li>
                <li>Logo design & typography selection</li>
                <li>Color palette & packaging design</li>
                <li>Brand guidelines & rollout strategy</li>
              </ol>

              <h2 id="outcome">Outcome</h2>

              <p>
                The new brand identity successfully positioned Pure Pressed as a
                premium yet approachable wellness brand. The clean, natural
                aesthetic resonated with target consumers, resulting in a 40%
                increase in brand recognition and strong retail partnerships.
              </p>

              <p>
                The packaging design became a key differentiator on shelves,
                with the minimalist approach allowing the vibrant colors of the
                juices to shine through while maintaining a premium feel.
              </p>

              <p>
                Through thoughtful brand development and strategic visual
                storytelling, Pure Pressed now stands as a authentic leader in
                the wellness space, building lasting connections with
                health-conscious consumers.
              </p>

              <div className="not-prose my-16">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/pressed-juice/devin-avery-2tuH5dIqQEc-unsplash.jpg"
                  alt="Pure Pressed brand identity showcase"
                  className="w-full rounded-lg"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground italic">
                  The final brand identity system emphasizes clean, minimal
                  design that allows the product's natural appeal to take center
                  stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Project4a };
