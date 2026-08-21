---
title: Robots.txt & Indexing Recommendations
slug: "robots.txt"
nextjs:
  metadata:
    title: Robots.txt & Indexing Recommendations
    description: Technical recommendations and action items for robots.txt configuration, sitemap submission, and search indexing rules.
---

Below is the structured technical overview for `robots.txt` configuration, search engine indexing controls, and sitemap directives extracted from the website audit.

{% youtube id="https://www.youtube.com/watch?v=RyJYGpVyl0o" title="Robots.txt explained" /%}

---

## Format

**Category:** Robots.txt | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Edit the robots.txt file.

It is recommended that you edit the robots.txt file at /robots.txt so that the Disallow directive blocks the site's admin area, as well as any pages you don't want indexed. After the edit, it should look like this:

```txt
 User-Agent: *
 Allow: /wp-content/uploads/
 Disallow: /wp-content/plugins/
 Disallow: /wp-admin/
```

```txt
 Sitemap: https://cwforton.com/sitemap_index.xml
```

{% /recommendation %}

---

## Old sitemap

**Category:** Robots.txt | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Only the old sitemap of the site is submitted in robots.txt. A new XML sitemap needs to be created/edited and submitted.
{% /recommendation %}

---

## Search engine

**Category:** Robots.txt | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Site search results in Google's index. In addition to using a NOINDEX meta tag, it is recommended that you block indexing of the site's search results (/search) in robots.txt. Example:

```txt
 Disallow: /search
```

{% /recommendation %}

---

## Excessive directives

**Category:** Robots.txt | **Team:** Dev team | **Type:** Technical

**Priority:** Medium | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Excessive directives in robots.txt. The file currently blocks an overly broad number of site directories. It is recommended that you keep only a block on /admin, and for all other pages such as /cart, /checkout, /compareproducts, /customer/, /order, /wishlist, apply an index/noindex meta tag set to: noindex, nofollow.
{% /recommendation %}

---
