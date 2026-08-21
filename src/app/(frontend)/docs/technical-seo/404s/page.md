---
title: 404 Pages & Error Handling Recommendations
nextjs:
  metadata:
    title: 404 Pages & Error Handling Recommendations
    description: Technical recommendations and action items for custom 404 pages, missing pages, broken links, soft 404 errors, and server response issues.
---

Below is the structured technical overview for 404 error page configurations, broken external/internal links, soft 404 issues, and server response handling extracted from the audit.

---

## Приятелска 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсва приятелска 404 страница на /bg/. Сайтът трябва да разполага с приятелска 404 страница и на двата езика. Виж ресурси.

Препоръчително е сайтът да има възможност да връща 404 страница при проблемни ситуации вместо да прави автоматични пренасочвания.
{% /recommendation %}

#### Useful Links

- [https://optinmonster.com/best-404-page-examples/](https://optinmonster.com/best-404-page-examples/)

---

## 404 грешки

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници на сайта с 404 грешка. Трябва или да се пренасочат с 301 към най-близката категория, или да се редактира самата страница.
{% /recommendation %}

---

## Не се връща 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
При редакция на адрес на вече заредена страница, сайтът не връща 404 страница, а зарежда същата с новия адрес. Например:

Първично зареждане: https://ekvator.bg/hotel-pochivka/paradise-bay-resort-4/556/979
След това редакция на адреса ръчно: https://ekvator.bg/hotel-pochivka/paradisetest-bay-resort-4/556/979

Страницата се зарежда отново с грешния адрес без да върне 404. Това е грешна практика.
{% /recommendation %}

---

## Външни 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници на сайта имат линкове към външни препратки с 404 грешки. Препоръчително е да обновите съдържанието на тези страници, за да налинквате към страници със статус код 200.
{% /recommendation %}

---

## Soft 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Наличие на празни страници, които е нужно да се коригират. Tези страници са с код 200, но след отваряне установяваме, че е празна и Google я индикита като Soft 404. Или да се пренасочат, или да се добави съдържание към тях.
{% /recommendation %}

---

## No response

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници и ресурси с No Respone - предимно събдомейни на gombashop.com. Препоръчително е да се премахнат линковете към тях, и да се пренасочат с 301.
{% /recommendation %}

---
