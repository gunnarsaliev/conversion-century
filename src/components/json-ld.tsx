import type { Thing, WithContext } from "schema-dts";

type JsonLdData = WithContext<Thing> | { "@context": "https://schema.org"; "@graph": Thing[] };

// Renders structured data for search engines. `<` is escaped so CMS content
// can never close the script tag early.
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
