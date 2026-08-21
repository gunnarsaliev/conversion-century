---
title: Force HTTPS & Security Audit Recommendations
slug: force-https
nextjs:
  metadata:
    title: Force HTTPS & Security Audit Recommendations
    description: Technical recommendations for enforcing SSL/HTTPS protocol across all pages, resolving HTTP resources, and eliminating mixed content.
---

Below is the structured technical overview for SSL implementation, HTTP to HTTPS redirection rules, and mixed content resolution extracted from the audit.

---

## Force HTTPS

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The site is missing SSL. It is recommended that after the new site launches, you add SSL, as well as force HTTPS - all pages and resources on the site should load only through https://.
{% /recommendation %}

---

## HTTP

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
There are pages that load under http. They need to be switched to https, and then a redirect from the old to the new address should be put in place.
{% /recommendation %}

---

## Mixed Content

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
On these pages there are resources that load under http, which creates mixed content. All resources on the site must load under https. The links in column C should either be changed or redirected.
{% /recommendation %}

---
