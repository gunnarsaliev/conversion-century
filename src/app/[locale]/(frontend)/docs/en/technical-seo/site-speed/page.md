---
title: Site Speed & Performance Audit Recommendations
slug: site-speed
nextjs:
  metadata:
    title: Site Speed & Performance Audit Recommendations
    description: Technical recommendations for site speed optimization, reducing unused JavaScript, server response time, and render-blocking resources.
---

Below is the structured technical overview for page speed enhancements, DOM optimization, and performance testing tool links extracted from the audit.

---

## Speed test

**Category:** Site speed | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Site loading speed. The site's current loading speed isn't bad, but if possible, addressing the following items would push the site into the green:

- Reduce unused JavaScript where possible
- Reduce initial server response time
- Avoid an excessively large DOM size
- Minimize main-thread work
- Eliminate render-blocking resources as much as possible
  {% /recommendation %}

#### Useful Links & Testing Tools

- [PageSpeed Insights Report](https://pagespeed.web.dev/report?url=https%3A%2F%2Fwww.dzi.bg%2Fbusiness-clients&form_factor=mobile)
- [GTmetrix Tool](https://gtmetrix.com/)
- [Pingdom Tools](https://tools.pingdom.com/)

---
