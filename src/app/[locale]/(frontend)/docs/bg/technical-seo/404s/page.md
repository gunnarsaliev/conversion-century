---
title: 404 Pages & Error Handling Recommendations
slug: 404s
nextjs:
  metadata:
    title: 404 Pages & Error Handling Recommendations
    description: Technical recommendations and action items for custom 404 pages, missing pages, broken links, soft 404 errors, and server response issues.
---

По-долу е структурираният технически преглед за конфигурацията на 404 страниците за грешки, счупени външни/вътрешни линкове, проблеми със soft 404 и обработката на сървърните отговори, извлечен от одита.

---

## Приятелска 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсва приятелска 404 страница на /bg/. Сайтът трябва да разполага с приятелска 404 страница и на двата езика. Виж ресурси.

Препоръчително е сайтът да има възможност да връща 404 страница при проблемни ситуации, вместо да прави автоматични пренасочвания.
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
При редакция на адреса на вече заредена страница сайтът не връща 404 страница, а зарежда същата страница с новия адрес. Например:

Първично зареждане: https://ekvator.bg/hotel-pochivka/paradise-bay-resort-4/556/979
След това ръчна редакция на адреса: https://ekvator.bg/hotel-pochivka/paradisetest-bay-resort-4/556/979

Страницата се зарежда отново с грешния адрес, без да върне 404. Това е грешна практика.
{% /recommendation %}

---

## Външни 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници на сайта имат линкове към външни препратки с 404 грешки. Препоръчително е да обновите съдържанието на тези страници, за да линквате към страници със статус код 200.
{% /recommendation %}

---

## Soft 404

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Наличие на празни страници, които е нужно да се коригират. Тези страници са със статус код 200, но след отваряне установяваме, че са празни и Google ги индексира като Soft 404. Или да се пренасочат, или да се добави съдържание към тях.
{% /recommendation %}

---

## No response

**Category:** 404s | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници и ресурси с No Response - предимно поддомейни на gombashop.com. Препоръчително е да се премахнат линковете към тях и да се пренасочат с 301.
{% /recommendation %}

---
