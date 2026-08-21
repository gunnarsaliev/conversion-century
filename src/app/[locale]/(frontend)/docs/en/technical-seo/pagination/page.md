---
title: Pagination Audit Recommendations
slug: pagination
nextjs:
  metadata:
    title: Pagination Audit Recommendations
    description: Technical recommendations for pagination setup, unique meta titles/descriptions, rel="next" and rel="prev" tags, and self-referential canonical links.
---

Below is the structured technical overview for pagination setup and sequence metadata management extracted from the audit.

---

## Pagination

**Category:** Pagination | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
The site is missing properly configured pagination. Example:
https://www.dzi.bg/news
https://www.dzi.bg/news/index/page:2

Although Google no longer treats pagination as a ranking signal, other search engines like Bing still use it. For this reason, it is recommended that you follow these rules when listing pages in a series:

1. Each page in the series must have a unique title and meta description. These elements can be the same as the first page in the series with an added "page #" fragment. Use the following data, which we have already provided:

Meta title: News, events, and customer notices: Page 2 | DZI
Meta description: Read more about the latest news and industry trends, find information about the events we have participated in, as well as customer notices here. Page 2.

2. Each page in the series must be marked with rel="next" and rel="prev" elements, as described here: https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html

3. Each page in the series must have a self-referential rel=canonical meta tag. This means each page should be treated as unique by default.

4. Each page in the series must be open for indexing with an index/noindex meta tag. This way, every page will be open for indexing.
   {% /recommendation %}

#### Useful Links

- [https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html](https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html)

---
