---
title: Indexation & Canonical Directives Audit Recommendations
nextjs:
  metadata:
    title: Indexation & Canonical Directives Audit Recommendations
    description: Technical recommendations for meta robot directives, canonical URLs, crawl control for search results, tag/author pages, category filter indexation, and brand landing pages.
---

Below is the structured technical overview for meta indexation rules, self-referencing canonical tags, parameter handling, and search/filter indexing strategy extracted from the audit.

---

## Meta index, follow

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
По подразбиране на всички отворени за четене и индексация страници трябва да има Meta index/noindex: index, follow мета таг.
{% /recommendation %}

---

## Самонасочен каноникал

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
На страниците на сайта липсват самонасочени rel=canonical елементи. Препоръчително е, по подразбиране, всяка страница, която е отворена за четене и индексация, да има самонасочен rel=canonical елемент. Пример:

https://thepacklion.com/cbd-cbd-cosmetics-packaging-cbd-cleanser/c
rel = canonical към https://thepacklion.com/cbd-cbd-cosmetics-packaging-cbd-cleanser/c
{% /recommendation %}

---

## Резултати от търсене

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Всички страници с резултати от търсене трябва да бъдат затворени за четене и индексация. Например:

https://batteryland.com/bg/browse/?s=n5010

Трябва да има Meta index/noindex: noindex, nofollow мета таг.
{% /recommendation %}

---

## Излишно индексирани страници

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Излишни страници отворени за индексация. Пример:

https://guns.bg/en/productreviews/12792
https://guns.bg/en/productreviews/12793
https://guns.bg/en/productreviews/12794

Препоръчително е да поставите noindex, nofollow на тези страници. В допълнение, такъв тип страници трябва да бъдат извадени от sitemap.xml файловете - ако са там.
{% /recommendation %}

---

## /embed/, /tag/ и /author/ страници

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
/embed/, /tag/ и /author/ типове страници отворени за индексация или с проблем в index / noindex директива. Трябва да остане само: Meta index/noindex: noindex, follow
{% /recommendation %}

---

## Неиндексиране на филтри

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
По подразбиране всички филтри Color, Size трябва да:

1. Запазват rel=canonical към основната страница без филтъра. Пример:
   https://thepacklion.com/tea-and-coffee-coffee-packaging-coffee-capsules/c?filter=attr.color;in;%22white%22
   rel = canonical към https://thepacklion.com/tea-and-coffee-coffee-packaging-coffee-capsules/c

2. Имат Meta index/noindex: noindex, follow мета таг.

3. Не се реферират в XML карти.
   {% /recommendation %}

---

## Индексация на филтри

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Ключови филтри на категориите трябва да се изведат като подкатегории отворени за индексация. Например:
калибър, производител

Тези филтри трябва да са уникални подкатегории с уникални заглавия, URL (без параметри), мета описания и хединг структура. Те трябва да са отворени за индексация.

Нужно извеждане за:
https://guns.bg/bojno-orzhie и подкатегориите му - калибър, производители
https://guns.bg/lovno-orzhie и подкатегориите му - калибър, производители
https://guns.bg/vzdushno-orzhie и подкатегориите му - калибър, производители
{% /recommendation %}

---

## Индексация на вендори/марки

**Category:** Indexation | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Филтър "?vendors=" трябва да е уникална и отворена за индексация (index, follow) страница. Например:

URL: https://aromarelaxbg.com/category/slance?vendors=zoya-goes-pretty
Title: ""| Aroma Relax"" се замества с "- марка [марка]"
Meta Description: Същото като на основната страница, но на края на първото изречение преди точката се добавя "- марка [марка]".

rel = canonical: https://aromarelaxbg.com/category/slance?vendors=zoya-goes-pretty - самонасочен
Heading 1: Име на подкатегория + ""- марка [марка]""

При избор на повече от един филтър (производител с нещо друго), адреса вече е затворен за индексация (noindex, follow).
Пример: https://befit.bg/zdrave/lekarstva/nastinka-grip вижte как са "Филтър по проблем". Изцяло уникални страници с мета данни, адреси, canonical и тн. Тоест, клиента може да ранкира за тях. "
{% /recommendation %}

---

## HTML Example

Here's an example of proper HTML implementation for indexation and canonical directives:

```html
<!DOCTYPE html>
<html lang="bg">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Meta indexation directives -->
    <meta name="robots" content="index, follow" />

    <!-- Self-referencing canonical -->
    <link rel="canonical" href="https://example.com/current-page" />

    <!-- Open Graph and other meta tags -->
    <meta property="og:title" content="Page Title - Brand Name" />
    <meta property="og:description" content="Page description" />
    <meta property="og:url" content="https://example.com/current-page" />

    <title>Page Title - Brand Name</title>
  </head>
  <body>
    <!-- Page content -->
  </body>
</html>
```

---
