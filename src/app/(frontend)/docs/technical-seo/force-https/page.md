---
title: Force HTTPS & Security Audit Recommendations
nextjs:
  metadata:
    title: Force HTTPS & Security Audit Recommendations
    description: Technical recommendations for enforcing SSL/HTTPS protocol across all pages, resolving HTTP resources, and eliminating mixed content.
---

Below is the structured technical overview for SSL implementation, HTTP to HTTPS redirection rules, and mixed content resolution extracted from the audit.

---

## Force HTTPS

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсва SSL на сайта. Препоръчително е след пускането на новия сайт да добавите SSL, както и force HTTPS - всички страници и ресурси на сайта да се зареждат само през https://.
{% /recommendation %}

---

## HTTP

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Има страници, които зареждат под http. Трябва да се направят https и след това да се сложи редирект от стария към новия адрес.
{% /recommendation %}

---

## Mixed Content

**Category:** Force HTTPS | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
На тези страници има ресурси, които зареждат под http и това води до създаване на mixed content. Всички ресурси на сайта трябва да зареждат под https. Линковете в колона С или трябва да се променят, или пренасочат.
{% /recommendation %}

---
