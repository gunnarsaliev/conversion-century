---
title: XML Sitemap & Breadcrumbs Audit Recommendations
slug: xml-sitemap
nextjs:
  metadata:
    title: XML Sitemap & Breadcrumbs Audit Recommendations
    description: Technical recommendations for XML sitemap structuring, format validation, dynamic generation, indexing filters, and breadcrumb schema implementation.
---

Below is the structured technical overview for XML sitemap configurations, format compliance, dynamic updates, and breadcrumb navigation enhancements extracted from the audit.

---

## XML sitemap in GSC

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
All XML sitemaps must be submitted in Google Search Console.
{% /recommendation %}

---

## Incorrect XML sitemap format

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Incorrect XML sitemap format. Currently https://guns.bg/sitemap.xml is an HTML page and not in the proper XML format (Incorrect http header content-type: "text/html; charset=utf-8" (expected: "application/xml")). For this reason, Google Search Console rejects it. It is recommended that you build a sitemap index and separate sitemaps that meet the XML requirements described above.

For testing, you can use this: https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=http%3A%2F%2Fguns.bg%2Fsitemap.xml&submit=Validate+Sitemap
{% /recommendation %}

#### Useful Links

- [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap)
- [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#sitemapformat](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#sitemapformat)

---

## Format

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
There is currently one XML sitemap. It is recommended that you create 3 separate XML sitemaps.
https://www.dzi.bg/sitemap.xml - all pages
https://www.dzi.bg/image-sitemap.xml - all images
https://www.dzi.bg/news-sitemap.xml - all news and articles

All XML sitemaps must contain only resources that return a 200 status code. The individual sitemaps must be discoverable at the addresses listed above. Individual sitemaps in the index must be limited to 50 MB in size and 50,000 URLs each.

You need to combine all the sitemaps into the index you currently have: /sitemap-index.xml.
{% /recommendation %}

#### Useful Links

- [https://support.google.com/webmasters/answer/183668?hl=en](https://support.google.com/webmasters/answer/183668?hl=en)

---

## Generation

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
XML sitemaps must be generated dynamically once a day, regardless of the number of requests made to them.
{% /recommendation %}

---

## 404s in sitemap

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
URLs with a 404 status code that are included in the sitemap. These must be removed. The sitemap should only contain resources with a 200 status code that are indexable.
{% /recommendation %}

---

## Closed to indexing

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Pages closed to indexing that are included in the XML sitemaps. It is recommended that you remove or fix them. XML sitemaps should only include URLs that return a 200 status code.
{% /recommendation %}

---

## Referenced in more than one

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
URLs that are referenced in more than one XML sitemap. It is recommended that you remove the duplicate references and keep them only in the correct sitemap.
{% /recommendation %}

---

## Referenced in none

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
URLs that are not referenced in any XML sitemap, but that return a 200 status code and are indexable. It is recommended that you add them to the correct sitemap.
{% /recommendation %}

---

## Last mod

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Add a `<lastmod>` value to each page across the XML sitemaps, with the date and time of the page's last modification.
An example is given on the right.
{% /recommendation %}

#### Useful Links

- [<url>](url)
- [<loc>https://www.dzi.bg/individual-clients/individual-property</loc>](<loc>https://www.dzi.bg/individual-clients/individual-property</loc>)
- [<lastmod>2022-05-01T17:31:11+03:00</lastmod> //](<lastmod>2022-05-01T17:31:11+03:00</lastmod> //)
- [This is the exact syntax that must be followed; only the time zone depends on the server's configuration](This is the exact syntax that must be followed; only the time zone depends on the server's configuration)

---

## Breadcrumbs

**Category:** Breadcrumbs | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The site is missing breadcrumbs.

Breadcrumbs are important because they improve the site's internal architecture and interlinking. It is recommended that you add descriptive breadcrumbs across the entire site, globally.

It is recommended that some of the target keywords be used in them. It is also recommended that they be marked up with Schema markup.
{% /recommendation %}

---
