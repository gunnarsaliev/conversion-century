---
title: Pagination Audit Recommendations
nextjs:
  metadata:
    title: Pagination Audit Recommendations
    description: Technical recommendations for pagination setup, unique meta titles/descriptions, rel="next" and rel="prev" tags, and self-referential canonical links.
---

Below is the structured technical overview for pagination setup and sequence metadata management extracted from the audit.

---

## Пагинация

**Category:** Pagination | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Липсва правилно поставена пагинация / странициране на сайта/. Пример:
https://www.dzi.bg/news
https://www.dzi.bg/news/index/page:2

Въпреки, че Google не приема пагинацията като ранков сигнал, други търсачки като Bing все още я ползват. По тази причина е препоръчително да спазите следните правила, когато изреждате страници в поредица:

1. Всяка страница в поредицата трябва да има уникално заглавие и мета описание. Тези елементи може да са същите като на първата страница от поредицата с добавена частица - страница #. Използвайте ето тези данни, които вече сме предоставили:

Мета заглавие: Новини, събития и съобщения за клиенти: Страница 2 | ДЗИ
Мета описание: Прочетете повече за последните новини и тенденции в индустрията, намерете информация за събитията, в които сме участвали, както и за съобщенията за клиенти тук. Страница 2.

2. Всяка страница в поредицата трябва да е маркирана с rel="next" и rel="prev" елементи, както е описано тук: https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html

3. Всяка страница от поредицата трябва да има самонасочен rel=canonical мета таг. Тоест, всяка страница да се подразбира като уникална.

4. Всяка страница от поредицата трябва да е отворена за индексация с Meta index/noindex мета таг. По този начин, всяка страница ще е отворена за индексация.
   {% /recommendation %}

#### Useful Links

- [https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html](https://webmasters.googleblog.com/2011/09/pagination-with-relnext-and-relprev.html)

---
