---
title: Localized Content & Multilingual Audit Recommendations
slug: localized-content
nextjs:
  metadata:
    title: Localized Content & Multilingual Audit Recommendations
    description: Technical recommendations for handling localized content URL structure, hreflang tags, HTML lang attributes, and missing translations.
---

По-долу е структуриран технически преглед за маршрутизацията на многоезичните URL адреси, имплементацията на hreflang, корекциите на HTML lang тага и качеството на превода, извлечен от одита.

---

## Неправилно локализирано съдържание

**Category:** Локализирано съдържание | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Неправилни адреси на локализирано съдържание. Съдържание на английски трябва да е достъпно под /en/. В момента на началната страница може да се заменя езика без това да води до промяна в URL адреса. Препоръчваме на английската версия на сайта да запазите изцяло същата URL структура като на български, като просто добавите /en/ отпред в адреса. Продуктови и други страници на английски, които в момента имат уникални адреси, трябва да се пренасочат с 301 редирект към новата им /en/ локация.
{% /recommendation %}

---

## Маркиране

**Category:** Локализирано съдържание | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсва правилно маркиране на локализирано съдържание. Препоръчително е да следвате препоръките от Google за HTTP Headers и да добавите rel="alternate"; hreflang=" тагове на всички страници към еквивалента им.
{% /recommendation %}

#### Useful Links

- [https://developers.google.com/search/docs/advanced/crawling/localized-versions](https://developers.google.com/search/docs/advanced/crawling/localized-versions)

---

## Lang tag

**Category:** Локализирано съдържание | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Грешен lang таг в HTML-а. В момента HTML lang="bg" е грешно, защото сайтът е на английски. Трябва да се коригира на HTML lang="en".
{% /recommendation %}

---

## Превод на английски

**Category:** Локализирано съдържание | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
В момента сайтът има и английска версия, но повечето неща не са преведени. Това създава дублирано съдържание. Препоръчително е да се премахне английската версия на този етап. След като оптимизираме страниците и добавим съдържание, ще се добави отново езиковата версия с напълно преведени страници.
{% /recommendation %}

---
