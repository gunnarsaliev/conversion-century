---
title: Robots.txt & Indexing Recommendations
slug: "robots.txt"
nextjs:
  metadata:
    title: Robots.txt & Indexing Recommendations
    description: Technical recommendations and action items for robots.txt configuration, sitemap submission, and search indexing rules.
---

По-долу е структуриран технически преглед на конфигурацията на `robots.txt`, контрола върху индексирането от търсачките и директивите за sitemap, извлечен от одита на сайта.

{% youtube id="https://www.youtube.com/watch?v=RyJYGpVyl0o" title="Robots.txt explained" /%}

---

## Формат

**Category:** Robots.txt | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Редакция в robots.txt файл.

Препоръчително е да редактирате robots.txt файла на /robots.txt, като в директивата Disallow забраните административната част на сайта, както и страници, които не искате да са в индекса. След редакцията той трябва да изглежда така:

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

## Стар сайтмап

**Category:** Robots.txt | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
В robots.txt е подаден само старият sitemap на сайта. Трябва да се създаде/редактира и подаде нов XML sitemap.
{% /recommendation %}

---

## Търсачка

**Category:** Robots.txt | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Резултати от вътрешната търсачка на сайта в индекса на Google. Препоръчително е освен с NOINDEX мета таг да забраните индексацията на резултатите от търсачката на сайта (/search) в robots.txt. Пример:

```txt
 Disallow: /search
```

{% /recommendation %}

---

## Излишни директиви

**Category:** Robots.txt | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Излишни директиви в robots.txt. В момента файлът забранява прекалено обширен брой директории на сайта. Препоръчително е да оставите в него забрана само за /admin, а на всички останали страници като /cart, /checkout, /compareproducts, /customer/, /order, /wishlist да поставите index/noindex мета таг със стойност: noindex, nofollow.
{% /recommendation %}

---
