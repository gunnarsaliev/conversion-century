---
title: Indexation & Canonical Directives Audit Recommendations
slug: indexation
nextjs:
  metadata:
    title: Indexation & Canonical Directives Audit Recommendations
    description: Technical recommendations for meta robot directives, canonical URLs, crawl control for search results, tag/author pages, category filter indexation, and brand landing pages.
---

Below is the structured technical overview for meta indexation rules, self-referencing canonical tags, parameter handling, and search/filter indexing strategy extracted from the audit.

---

## Meta index, follow

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
By default, all pages open for reading and indexation should have a Meta index/noindex: index, follow meta tag.
{% /recommendation %}

---

## Self-referencing canonical

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The site's pages are missing self-referencing rel=canonical elements. It is recommended that, by default, every page that is open for reading and indexation have a self-referencing rel=canonical element. Example:

https://thepacklion.com/cbd-cbd-cosmetics-packaging-cbd-cleanser/c
rel = canonical to https://thepacklion.com/cbd-cbd-cosmetics-packaging-cbd-cleanser/c
{% /recommendation %}

---

## Search results

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
All search results pages should be closed for reading and indexation. For example:

https://batteryland.com/bg/browse/?s=n5010

There should be a Meta index/noindex: noindex, nofollow meta tag.
{% /recommendation %}

---

## Unnecessarily indexed pages

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Unnecessary pages open for indexation. Example:

https://guns.bg/en/productreviews/12792
https://guns.bg/en/productreviews/12793
https://guns.bg/en/productreviews/12794

It is recommended that you set noindex, nofollow on these pages. In addition, this type of page should be removed from the sitemap.xml files, if present there.
{% /recommendation %}

---

## /embed/, /tag/ and /author/ pages

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
/embed/, /tag/ and /author/ page types are open for indexation or have an issue with the index / noindex directive. Only the following should remain: Meta index/noindex: noindex, follow
{% /recommendation %}

---

## Filter non-indexation

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
By default, all Color, Size filters should:

1. Keep a rel=canonical to the main page without the filter. Example:
   https://thepacklion.com/tea-and-coffee-coffee-packaging-coffee-capsules/c?filter=attr.color;in;%22white%22
   rel = canonical to https://thepacklion.com/tea-and-coffee-coffee-packaging-coffee-capsules/c

2. Have a Meta index/noindex: noindex, follow meta tag.

3. Not be referenced in XML sitemaps.
   {% /recommendation %}

---

## Filter indexation

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Key category filters should be exposed as subcategories open for indexation. For example:
caliber, manufacturer

These filters should be unique subcategories with unique titles, URLs (without parameters), meta descriptions, and heading structure. They should be open for indexation.

Needs to be implemented for:
https://guns.bg/bojno-orzhie and its subcategories - caliber, manufacturers
https://guns.bg/lovno-orzhie and its subcategories - caliber, manufacturers
https://guns.bg/vzdushno-orzhie and its subcategories - caliber, manufacturers
{% /recommendation %}

---

## Vendor/brand indexation

**Category:** Indexation | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The "?vendors=" filter should be a unique page open for indexation (index, follow). For example:

URL: https://aromarelaxbg.com/category/slance?vendors=zoya-goes-pretty
Title: "| Aroma Relax" is replaced with "- brand [brand]"
Meta Description: Same as the main page, but at the end of the first sentence before the period, "- brand [brand]" is added.

rel = canonical: https://aromarelaxbg.com/category/slance?vendors=zoya-goes-pretty - self-referencing
Heading 1: Subcategory name + "- brand [brand]"

When more than one filter is selected (manufacturer with something else), the address is already closed for indexation (noindex, follow).
Example: https://befit.bg/zdrave/lekarstva/nastinka-grip - see how "Filter by problem" works. Fully unique pages with metadata, addresses, canonical, etc. This means the client can rank for them.
{% /recommendation %}

---

## HTML Example

Here's an example of proper HTML implementation for indexation and canonical directives:

```html
<!DOCTYPE html>
<html lang="bg">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Meta indexation directives -->
    <meta name="robots" content="index, follow" />

    <!-- Self-referencing canonical -->
    <link rel="canonical" href="https://example.com/current-page" />

    <!-- Open Graph and other meta tags -->
    <meta property="og:title" content="Page Title - Brand Name" />
    <meta property="og:description" content="Page description" />
    <meta property="og:url" content="https://example.com/current-page" />

    <title>Page Title - Brand Name</title>
  </head>
  <body>
    <!-- Page content -->
  </body>
</html>
```

---
