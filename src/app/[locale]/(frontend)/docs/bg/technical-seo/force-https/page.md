---
title: Force HTTPS & Security Audit Recommendations
slug: force-https
nextjs:
  metadata:
    title: Force HTTPS & Security Audit Recommendations
    description: Technical recommendations for enforcing SSL/HTTPS protocol across all pages, resolving HTTP resources, and eliminating mixed content.
---

По-долу е структурираният технически преглед за внедряване на SSL, правилата за пренасочване от HTTP към HTTPS и разрешаването на mixed content, извлечен от одита.

---

## Force HTTPS

**Категория:** Force HTTPS | **Екип:** Dev team | **Тип:** Техническа

**Приоритет:** Висок | **Статус:** Подадено към клиент

#### Препоръка

{% recommendation %}
Липсва SSL на сайта. Препоръчително е след пускането на новия сайт да добавите SSL, както и force HTTPS - всички страници и ресурси на сайта да се зареждат само през https://.
{% /recommendation %}

---

## HTTP

**Категория:** Force HTTPS | **Екип:** Dev team | **Тип:** Техническа

**Приоритет:** Висок | **Статус:** Подадено към клиент

#### Препоръка

{% recommendation %}
Има страници, които зареждат под http. Трябва да се направят https и след това да се сложи редирект от стария към новия адрес.
{% /recommendation %}

---

## Mixed Content

**Категория:** Force HTTPS | **Екип:** Dev team | **Тип:** Техническа

**Приоритет:** Среден | **Статус:** Подадено към клиент

#### Препоръка

{% recommendation %}
На тези страници има ресурси, които зареждат под http и това води до създаване на mixed content. Всички ресурси на сайта трябва да зареждат под https. Линковете в колона С или трябва да се променят, или пренасочат.
{% /recommendation %}

---
