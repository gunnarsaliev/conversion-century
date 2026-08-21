---
title: Image Optimization Audit Recommendations
nextjs:
  metadata:
    title: Image Optimization Audit Recommendations
    description: Technical recommendations for image alt text attributes, image size compression, lazy loading, and optimization plugins.
---

Below is the structured technical overview for image alt text implementation, image compression, lazy loading setup, and image optimization plugins extracted from the audit.

---

## Снимки без алт текст

**Category:** Images | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Снимки на сайта без image alt текст. Препоръчително е да се добавят.

- **Изисквания към алт описанията:**
  - Да описват с едно изречение съдържанието на всяка снимка.
  - Дължина до 100 символа.
  - Да се използват ключови думи от страницата.
  - Да бъдат на езика, на който е текстът на страницата.

Google използва тези описания и заглавия, за да разбере по-добре съдържанието на дадена снимка. Това ще подобри вашето присъствие в Image Search и ще увеличи трафика към сайта.

**Препоръка:** Ръчно да се оптимизират всички alt описания или да се добави функционалност, която автоматично да ги генерира (напр. извличане на описанието от заглавието H1).
{% /recommendation %}

#### Useful Links & Resources

Снимките, на които е нужно да се добави алт текст:

---

## Снимки над 100кб

**Category:** Images | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

{% recommendation %}
Снимки на сайта над 100 кб. Препоръчително е да оптимизирате всички снимки да са с размер 100 - 150 кб във формат "optimize for web" и да се активира lazy load.

Снимки с по-голям размер забавят скоростта на сайта. Ако големите към момента снимки не могат да се оптимизират, имайте го предвид за следващи качвания.
{% /recommendation %}

#### Useful Links & Recommended Plugins

- [WP Smush Plugin](https://bg.wordpress.org/plugins/wp-smushit/) - препоръчителен плъгин за автоматично компресиране на снимки.

Това е списък с големите снимки:

---
