---
title: Getting started
nextjs:
  metadata:
    title: Getting started
    description: Comprehensive technical SEO audit recommendations and implementation guidelines for website optimization.
---

Below is the comprehensive overview of technical SEO audit recommendations, organized by category and priority level for systematic implementation.

{% quick-links %}

{% quick-link title="General Requirements" icon="installation" href="/docs/technical-seo/general" description="Core technical SEO requirements including Yoast SEO, HTML5, and basic setup." /%}

{% quick-link title="Navigation & Architecture" icon="presets" href="/docs/technical-seo/navigation" description="Site structure optimization, navigation elements, and internal linking strategy." /%}

{% quick-link title="Schema Markup" icon="plugins" href="/docs/technical-seo/schema-markup" description="Structured data implementation for rich results and search visibility." /%}

{% quick-link title="Site Speed" icon="theming" href="/docs/technical-seo/site-speed" description="Performance optimization tools and techniques for faster loading times." /%}

{% /quick-links %}

---

## General Technical Requirements

**Category:** General | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

Core technical requirements for SEO optimization:

- Install the Yoast SEO plugin (free version)
- Add Opengraph meta tags
- Use semantic HTML5 elements (head, nav, article, section, main)
- Make sure all text is visible without JavaScript
- Avoid iframes for important content
- Serve the same content to all user agents and devices
- Use a proper heading structure (H1, H2, H3) on every page
- Remove JS from navigation elements

#### Useful Links

- [Opengraph Testing Tool](https://freecodetools.org/ogp/)
- [Opengraph.xyz](https://www.opengraph.xyz/)

---

## Legal & Compliance

**Category:** General | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

GDPR and legal requirements:

- Add cookie consent
- Terms and Conditions in both languages
- Privacy Policy in both languages
- Consent checkboxes on contact forms
- reCaptcha on all contact forms
- Personal data consent on all forms

---

## Navigation & Architecture

**Category:** Navigation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

Navigation and architecture optimization:

- All content reachable within 4 clicks from the homepage
- Full legal name, address, and phone number in the footer
- Click-to-call links for all phone numbers
- Keep the copyright year in the footer up to date
- Up to 6 items in the header menu
- Mirrored architecture with links to main categories in the footer
- Remove broken social network links (Google+)

---

## Meta Optimization

**Category:** Meta titles and descriptions | **Team:** SEO team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

Meta data optimization:

- Fix duplicate meta titles/descriptions
- Add missing meta titles/descriptions
- Correct meta titles/descriptions that are too short or too long
- Apply the content mapping recommendations
- Dynamically generate titles for product pages via Yoast SEO

---

## Schema Markup

**Category:** Schema markup | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

Add structured data:

- **Organization**: on the homepage
- **Website**: sitewide
- **BreadcrumbList**: sitewide
- **Product** and **SingleFamilyResidence**: on all listings
- **Article**: on blog posts
- **Local Business**: on location pages
- **Video**: on all videos

#### Useful Links & Tools

**Generation tools:**

- [Schema Markup Generator](https://technicalseo.com/tools/schema-markup-generator/)
- [JSON-LD Playground](https://jsonld.com/)
- [Schema.org Documentation](https://schema.org/Property)

**For testing:**

- [Rich Results Testing Tool](https://search.google.com/structured-data/testing-tool/u/0/)

---

## Site Speed & Performance

**Category:** Site speed | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

Page load speed optimization:

- Reduce unused JavaScript
- Reduce initial server response time
- Avoid an excessively large DOM size
- Minimize main-thread work
- Eliminate render-blocking resources

#### Useful Links & Testing Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix Tool](https://gtmetrix.com/)
- [Pingdom Tools](https://tools.pingdom.com/)

---

## Additional Categories

Additional technical SEO areas for optimization:

- **301s and 302s**: Proper redirects for changed URLs
- **404s**: Handling of missing pages
- **500s**: Server error optimization
- **Breadcrumbs**: Navigation trails for a better UX
- **Duplicate pages**: Resolving duplicate content
- **Force HTTPS**: SSL certificate and HTTPS redirection
- **Google Analytics & GSC**: Analytics setup and configuration
- **H1 optimization**: Heading tag optimization
- **Images**: Image optimization (alt text, size, format)
- **Indexation**: Controlling page indexing
- **Internal linking**: Internal linking between pages
- **Keywords**: Keyword research and optimization
- **Localized content**: Localized content for different regions
- **Page content**: Page content optimization
- **Pagination**: Proper pagination for catalogs
- **Robots.txt**: Robots.txt file configuration
- **URL structure**: URL structure optimization
- **XML Sitemap**: Creating and maintaining the XML sitemap
