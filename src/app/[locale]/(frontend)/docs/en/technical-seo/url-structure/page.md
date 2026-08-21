---
title: URL Structure Audit Recommendations
slug: url-structure
nextjs:
  metadata:
    title: URL Structure Audit Recommendations
    description: Technical recommendations for URL optimization, ASCII encoding, character length limits, and 301 redirect mapping during URL structure changes.
---

Below is the structured technical overview for URL structure guidelines, character set compliance, and migration redirects extracted from the audit.

---

## Non-ASCII

**Category:** URL Structure | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Site URLs containing characters outside the ASCII standard, as well as uppercase letters. It is recommended that you:

1. Correct the URLs. They should use lowercase Latin characters per the ASCII standard, and must not contain spaces.
2. The old URLs are already in Google's index. After the fix, you need to redirect all old URLs with a 301 redirect to their new locations!
   {% /recommendation %}

---

## Long URLs

**Category:** URL Structure | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Long page URLs. It is recommended that you shorten all URLs to 115 characters. Long URLs should be redirected with a 301 redirect to their new, shorter equivalents.
{% /recommendation %}

---

## URL structure change

**Category:** URL Structure | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Changes to the site's URL structure. It is recommended that you:

1. Implement the new URLs proposed in the Content Map.
2. Set up 301 redirects from all old URLs to the new ones.
3. Replace all old URLs with the new ones in internal navigation, the footer, and links, so that a 301 redirect isn't triggered.
   {% /recommendation %}

---
