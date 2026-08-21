---
title: Image Optimization Audit Recommendations
slug: images
nextjs:
  metadata:
    title: Image Optimization Audit Recommendations
    description: Technical recommendations for image alt text attributes, image size compression, lazy loading, and optimization plugins.
---

Below is the structured technical overview for image alt text implementation, image compression, lazy loading setup, and image optimization plugins extracted from the audit.

---

## Images without alt text

**Category:** Images | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Images on the site without image alt text. It is recommended that these be added.

- **Alt text requirements:**
  - Describe the content of each image in one sentence.
  - Length up to 100 characters.
  - Use keywords from the page.
  - Be in the same language as the text on the page.

Google uses these descriptions and titles to better understand the content of a given image. This will improve your presence in Image Search and increase traffic to the site.

**Recommendation:** Manually optimize all alt descriptions, or add functionality that generates them automatically (e.g. pulling the description from the H1 heading).
{% /recommendation %}

#### Useful Links & Resources

Images that need alt text added:

---

## Images over 100kb

**Category:** Images | **Team:** Dev team | **Type:** Technical

**Priority:** High | **Status:** Submitted to client

#### Recommendation

{% recommendation %}
Images on the site over 100 kb. It is recommended that you optimize all images to be 100 - 150 kb in "optimize for web" format and enable lazy load.

Larger images slow down the site's speed. If the currently large images cannot be optimized, keep this in mind for future uploads.
{% /recommendation %}

#### Useful Links & Recommended Plugins

- [WP Smush Plugin](https://bg.wordpress.org/plugins/wp-smushit/) - recommended plugin for automatic image compression.

This is the list of large images:

---
