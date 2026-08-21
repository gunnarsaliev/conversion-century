---
title: Duplicate Content & Trailing Slash Audit Recommendations
slug: duplicate-pages
nextjs:
  metadata:
    title: Duplicate Content & Trailing Slash Audit Recommendations
    description: Technical recommendations for handling trailing slashes, .html extension redirects, duplicate product pages, and www vs non-www URL normalization.
---

По-долу е структурираният технически преглед за разрешаване на дублирано съдържание, несъответствия с наклонените черти, файловите разширения и канонизацията на hostname, извлечен от одита.

---

## Наклонени черти и дублирано съдържание

**Category:** Duplicate pages | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Наклонените черти (trailing slashes) създават дублирано съдържание и водят до загуба на crawl бюджет. Пример: https://befit.bg/stores и https://befit.bg/stores/. Препоръчително е да изберете една основна версия (например без „/“), единствено през която да може да бъде достъпен сайтът. Тоест версиите с „/“ автоматично да пренасочват към версията без „/“.
{% /recommendation %}

---

## Наклонени черти и 404

**Category:** Duplicate pages | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Наклонените черти (trailing slashes) връщат 404 и ERR_TOO_MANY_REDIRECTS. Пример:
https://ekvator.bg/oferti/pochivki-ot-sofia/4
https://ekvator.bg/oferti/pochivki-ot-sofia/4/

Препоръчително е да изберете една основна версия без „/“, единствено през която да може да бъде достъпен сайтът. Тоест версиите с „/“ автоматично да пренасочват към версията без „/“.
{% /recommendation %}

---

## .HTML

**Category:** Duplicate pages | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Всички страници на сайта трябва да са достъпни единствено без разширения като „.html“. Заявките с разширения трябва автоматично да пренасочват към canonical версията на страниците без „/“ и разширения.
{% /recommendation %}

---

## .HTML дублирани страници

**Category:** Duplicate pages | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Дублирани продуктови страници на сайта. Масово страници с .html разширения дублират основните продуктови страници. Въпреки че не създават дублирано съдържание, тези страници са излишен разход на crawl бюджет от търсачките. Препоръчително е да ги премахнете от сайта и да запазите само основните, canonical версии.
{% /recommendation %}

---

## www. / / https.www. / / http. / / http.www.

**Category:** Duplicate pages | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Версиите на страниците без www. отпред създават загуба на crawl бюджет и дублирано съдържание. Пример:

https://www.breaktime.bg/kafe/kafe-na-zarna/lavazza/
https://breaktime.bg/kafe/kafe-na-zarna/lavazza/

Препоръчително е страниците без www. автоматично да пренасочват с 301 redirect към версиите си с www. отпред.
{% /recommendation %}

---
