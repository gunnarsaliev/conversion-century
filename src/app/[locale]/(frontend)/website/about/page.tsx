import { About25 } from "@/components/about25";
import { FounderLetter } from "@/components/founder-letter";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";

export async function generateMetadata() {
  return staticPageMetadata("about");
}

export default function AboutPage() {
  return (
    <>
      <StaticPageJsonLd page="about" />
      <div>
          <About25 />
      </div>
    </>
  );
}