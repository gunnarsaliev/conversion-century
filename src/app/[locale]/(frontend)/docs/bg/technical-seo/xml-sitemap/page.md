---
title: XML Sitemap & Breadcrumbs Audit Recommendations
slug: xml-sitemap
nextjs:
  metadata:
    title: XML Sitemap & Breadcrumbs Audit Recommendations
    description: Technical recommendations for XML sitemap structuring, format validation, dynamic generation, indexing filters, and breadcrumb schema implementation.
---

По-долу е структуриран технически преглед на конфигурациите на XML sitemap, съответствието с формата, динамичните обновявания и подобренията в навигацията с breadcrumbs, извлечен от одита.

---

## XML карта в GSC

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Всички XML sitemaps трябва да бъдат подадени в Google Search Console.
{% /recommendation %}

---

## Грешен формат на XML карта

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Грешен формат на XML картата. В момента https://guns.bg/sitemap.xml е HTML страница и не е в подходящия XML формат (Incorrect http header content-type: "text/html; charset=utf-8" (expected: "application/xml")). По тази причина Google Search Console я отхвърля. Препоръчително е да изработите индекс от карти и отделни карти, които да отговарят на описаните по-горе XML изисквания.

За тестване може да използвате това: https://www.xml-sitemaps.com/validate-xml-sitemap.html?op=validate-xml-sitemap&go=1&sitemapurl=http%3A%2F%2Fguns.bg%2Fsitemap.xml&submit=Validate+Sitemap
{% /recommendation %}

#### Useful Links

- [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap)
- [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#sitemapformat](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#sitemapformat)

---

## Формат

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
В момента има един XML sitemap. Препоръчително е да създадете 3 отделни XML карти.
https://www.dzi.bg/sitemap.xml - всички страници
https://www.dzi.bg/image-sitemap.xml - всички снимки
https://www.dzi.bg/news-sitemap.xml - всички новини и статии

Всички XML карти трябва да съдържат само ресурси, които връщат статус код 200. Отделните карти трябва да бъдат откриваеми на посочените по-горе адреси. Отделните карти в индекса трябва да са ограничени до 50 MB големина и 50 000 адреса в тях.

Трябва да обедините всички карти в индекса, който имате в момента: /sitemap-index.xml.
{% /recommendation %}

#### Useful Links

- [https://support.google.com/webmasters/answer/183668?hl=en](https://support.google.com/webmasters/answer/183668?hl=en)

---

## Генериране

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
XML картите трябва да се генерират динамично веднъж дневно, независимо от заявките към тях.
{% /recommendation %}

---

## 404 в сайтмап

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
URL адреси с код 404, които са включени в sitemap. Трябва да се премахнат. В sitemap трябва да има само ресурси с код 200, които да са indexable.
{% /recommendation %}

---

## Затворени за индексация

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Страници, затворени за индексация, включени в XML sitemaps. Препоръчително е да ги премахнете или поправите. В XML картите е позволено само адреси, които връщат статус код 200.
{% /recommendation %}

---

## В повече от един

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
URL адреси, които са реферирани в повече от един XML sitemap. Препоръчително е да премахнете дублираните референции и да оставите тези в правилната карта.
{% /recommendation %}

---

## В нито един

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
URL адреси, които не са реферирани в нито един XML sitemap, но които връщат код 200 и са indexable. Препоръчително е да ги добавите към правилния.
{% /recommendation %}

---

## Last mod

**Category:** XML Sitemap | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
В XML sitemap-овете да се добави `<lastmod>` на всяка страница по sitemap-овете с дата и час на последната промяна по страницата.
Даден е пример вдясно.
{% /recommendation %}

#### Useful Links

- [<url>](url)
- [<loc>https://www.dzi.bg/individual-clients/individual-property</loc>](<loc>https://www.dzi.bg/individual-clients/individual-property</loc>)
- [<lastmod>2022-05-01T17:31:11+03:00</lastmod> //](<lastmod>2022-05-01T17:31:11+03:00</lastmod> //)
- [Това е точният синтаксис, който трябва да се спазва, единствено часовата зона зависи от настройката на сървъра](Това е точният синтаксис, който трябва да се спазва, единствено часовата зона зависи от настройката на сървъра)

---

## Breadcrumbs

**Category:** Breadcrumbs | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсват breadcrumbs (трохички) на сайта.

Breadcrumbs са важни, защото подобряват вътрешната архитектура и междусвързаност на сайта. Препоръчително е да добавите описателни трохички в целия сайт - глобално.

Препоръчително е да се използват някои от таргет ключовите думи. Препоръчително е да се маркират със Schema markup.
{% /recommendation %}

---
