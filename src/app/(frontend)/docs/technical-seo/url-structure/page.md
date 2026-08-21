---
title: URL Structure Audit Recommendations
nextjs:
  metadata:
    title: URL Structure Audit Recommendations
    description: Technical recommendations for URL optimization, ASCII encoding, character length limits, and 301 redirect mapping during URL structure changes.
---

Below is the structured technical overview for URL structure guidelines, character set compliance, and migration redirects extracted from the audit.

---

## Non- ASCII

**Category:** URL Structure | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Адреси на сайта със символи извън ASCII стандарта и такива с главни букви. Препоръчително е:

1. Нанесете корекции върху адресите. Те трябва да са на латиница с малки букви по ASCII стандарт. Също трябва да са без празни места (space) в тях.
2. Старите адреси са вече в индекса на Google. Нужно е след поправката да пренасочите всички стари адреси с 301 редирект към новите им локации!
   {% /recommendation %}

---

## Дълги URLs

**Category:** URL Structure | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Дълги адреси на страници. Препоръчително е да съкратите всички адреси до 115 символа. Дългите адреси трябва да пренасочите с 301 редирект към новите по-къси еквиваленти.
{% /recommendation %}

---

## Промяна в URL структурата

**Category:** URL Structure | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Промени в URL структурата на сайта. Препоръчително е:

1. Да приложите предложените в Карта на съдържанието нови адреси.
2. Да качите 301 редиректи от всички стари адреси към новите.
3. Да замените във вътрешната навигация, футър и линкове всички стари адреси с новите такива, за да не се преминава през 301 редирект.
   {% /recommendation %}

---
