---
title: 404 Pages & Error Handling Recommendations
slug: 404s
nextjs:
  metadata:
    title: 404 Pages & Error Handling Recommendations
    description: Technical recommendations and action items for custom 404 pages, missing pages, broken links, soft 404 errors, and server response issues.
---

Below is the structured technical overview for 404 error page configurations, broken external/internal links, soft 404 issues, and server response handling extracted from the audit.

---

## Custom 404 Page

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
There is no custom 404 page on /bg/. The site must have a custom 404 page in both languages. See resources.

It is recommended that the site be able to return a 404 page for problematic situations instead of performing automatic redirects.
{% /recommendation %}

#### Useful Links

- [https://optinmonster.com/best-404-page-examples/](https://optinmonster.com/best-404-page-examples/)

---

## 404 Errors

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Pages on the site returning a 404 error. They should either be redirected with a 301 to the nearest category, or the page itself should be edited.
{% /recommendation %}

---

## No 404 Returned

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
When the address of an already loaded page is edited, the site does not return a 404 page, but loads the same page with the new address. For example:

Initial load: https://ekvator.bg/hotel-pochivka/paradise-bay-resort-4/556/979
Then manually editing the address: https://ekvator.bg/hotel-pochivka/paradisetest-bay-resort-4/556/979

The page loads again with the incorrect address without returning a 404. This is incorrect practice.
{% /recommendation %}

---

## External 404s

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Pages on the site have links to external references that return 404 errors. It is recommended to update the content of these pages to link to pages with a 200 status code.
{% /recommendation %}

---

## Soft 404

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
There are empty pages that need to be corrected. These pages return a 200 status code, but upon opening them we find they are empty, and Google indexes them as Soft 404. They should either be redirected or have content added to them.
{% /recommendation %}

---

## No Response

**Category:** 404s | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Pages and resources with No Response - mostly subdomains of gombashop.com. It is recommended to remove the links to them and redirect them with a 301.
{% /recommendation %}

---
