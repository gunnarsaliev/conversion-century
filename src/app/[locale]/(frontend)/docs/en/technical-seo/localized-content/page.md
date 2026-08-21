---
title: Localized Content & Multilingual Audit Recommendations
slug: localized-content
nextjs:
  metadata:
    title: Localized Content & Multilingual Audit Recommendations
    description: Technical recommendations for handling localized content URL structure, hreflang tags, HTML lang attributes, and missing translations.
---

Below is the structured technical overview for multilingual URL routing, hreflang implementation, HTML lang tag corrections, and translation quality extracted from the audit.

---

## Incorrect Localized Content

**Category:** Localized content | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Incorrect URLs for localized content. English content should be accessible under /en/. Currently, on the homepage the language can be switched without this resulting in a change to the URL. We recommend that the English version of the site keep exactly the same URL structure as the Bulgarian version, simply adding /en/ at the front of the address. Product and other English pages that currently have unique URLs should be redirected with a 301 redirect to their new /en/ location.
{% /recommendation %}

---

## Markup

**Category:** Localized content | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Proper markup for localized content is missing. It is recommended to follow Google's guidelines for HTTP Headers and add rel="alternate"; hreflang=" tags on all pages pointing to their equivalents.
{% /recommendation %}

#### Useful Links

- [https://developers.google.com/search/docs/advanced/crawling/localized-versions](https://developers.google.com/search/docs/advanced/crawling/localized-versions)

---

## Lang tag

**Category:** Localized content | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Incorrect lang tag in the HTML. Currently HTML lang="bg" is incorrect, since the site is in English. It should be corrected to HTML lang="en".
{% /recommendation %}

---

## English Translation

**Category:** Localized content | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The site currently also has an English version, but most content has not been translated. This creates duplicate content. It is recommended to remove the English version at this stage. Once the pages are optimized and content is added, the language version will be re-added with fully translated pages.
{% /recommendation %}

---
