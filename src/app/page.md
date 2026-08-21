---
title: Getting started
nextjs:
  metadata:
    title: Getting started
    description: Comprehensive technical SEO audit recommendations and implementation guidelines for website optimization.
---

Below is the comprehensive overview of technical SEO audit recommendations, organized by category and priority level for systematic implementation.

{% quick-links %}

{% quick-link title="General Requirements" icon="installation" href="/docs/technical-seo/general" description="Core technical SEO requirements including Yoast SEO, HTML5, and basic setup." /%}

{% quick-link title="Navigation & Architecture" icon="presets" href="/docs/technical-seo/navigation" description="Site structure optimization, navigation elements, and internal linking strategy." /%}

{% quick-link title="Schema Markup" icon="plugins" href="/docs/technical-seo/schema-markup" description="Structured data implementation for rich results and search visibility." /%}

{% quick-link title="Site Speed" icon="theming" href="/docs/technical-seo/site-speed" description="Performance optimization tools and techniques for faster loading times." /%}

{% /quick-links %}

---

## General Technical Requirements

**Category:** General | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

Основни технически изисквания за SEO оптимизация:

- Инсталация на Yoast SEO плъгин (безплатна версия)
- Добавяне на Opengraph мета тагове
- Употреба на семантични HTML5 елементи (head, nav, article, section, main)
- Всички текстове да са видими без JavaScript
- Избягване на iframe за важно съдържание
- Еднакво съдържание за всички user agents и устройства
- Heading структура (H1, H2, H3) за всяка страница
- Премахване на JS от навигационни елементи

#### Useful Links

- [Opengraph Testing Tool](https://freecodetools.org/ogp/)
- [Opengraph.xyz](https://www.opengraph.xyz/)

---

## Legal & Compliance

**Category:** General | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

GDPR и правни изисквания:

- Добавяне на Cookie Consent
- Terms and Conditions на двата езика
- Privacy Policy на двата езика
- Отметки за съгласие в контактни форми
- reCaptcha на всички контактни форми
- Съгласие с лични данни във всички форми

---

## Navigation & Architecture

**Category:** Navigation | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

Оптимизация на навигацията и архитектурата:

- Цялото съдържание достъпно с до 4 клика от началната страница
- Пълно легално наименование, адрес и телефон във футъра
- Click-to-call линкове за всички телефони
- Обновяване на copyright годината във футъра
- До 6 елемента в хедър менюто
- Огледална архитектура с линкове към основни категории във футъра
- Премахване на неработещи социални мрежи (Google+)

---

## Meta Optimization

**Category:** Meta titles and descriptions | **Team:** SEO team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

Оптимизация на мета данни:

- Поправка на дублирани мета заглавия/описания
- Добавяне на липсващи мета заглавия/описания
- Корекция на прекалено къси/дълги мета заглавия/описания
- Прилагане на Content mapping препоръките
- Динамично генериране на заглавия за продуктови страници чрез Yoast SEO

---

## Schema Markup

**Category:** Schema markup | **Team:** Dev team | **Type:** Техническа

**Priority:** Висок | **Status:** Подадено към клиент

#### Recommendation

Добавяне на структурирани данни:

- **Organization**: на началната страница
- **Website**: глобално
- **BreadcrumbList**: глобално
- **Product** и **SingleFamilyResidence**: на всички обяви
- **Article**: на блог статии
- **Local Business**: на страниците с локациите
- **Video**: на всички видеа

#### Useful Links & Tools

**Инструменти за генериране:**

- [Schema Markup Generator](https://technicalseo.com/tools/schema-markup-generator/)
- [JSON-LD Playground](https://jsonld.com/)
- [Schema.org Documentation](https://schema.org/Property)

**За тест:**

- [Rich Results Testing Tool](https://search.google.com/structured-data/testing-tool/u/0/)

---

## Site Speed & Performance

**Category:** Site speed | **Team:** Dev team | **Type:** Техническа

**Priority:** Среден | **Status:** Подадено към клиент

#### Recommendation

Оптимизация на скоростта на зареждане:

- Намалете неизползвания JavaScript
- Намалете началното време за реакция на сървъра
- Не използвайте DOM с твърде голям размер
- Сведете до минимум работата по основната нишка
- Елиминирайте блокиращите рендеринг ресурси

#### Useful Links & Testing Tools

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix Tool](https://gtmetrix.com/)
- [Pingdom Tools](https://tools.pingdom.com/)

---

## Additional Categories

Допълнителни технически SEO области за оптимизация:

- **301s и 302s**: Правилно пренасочване на променени URL адреси
- **404s**: Обработка на липсващи страници
- **500s**: Оптимизация на сървърни грешки
- **Breadcrumbs**: Навигационни пътеки за по-добра UX
- **Duplicate pages**: Разрешаване на дублирано съдържание
- **Force HTTPS**: SSL сертификат и HTTPS пренасочване
- **Google Analytics & GSC**: Инсталация и конфигурация на аналитики
- **H1 optimization**: Оптимизация на заглавни тагове
- **Images**: Оптимизация на изображения (alt текст, размер, формат)
- **Indexation**: Контрол на индексирането на страници
- **Internal linking**: Вътрешно линкване между страници
- **Keywords**: Изследване и оптимизация на ключови думи
- **Localized content**: Локализирано съдържание за различни региони
- **Page content**: Оптимизация на съдържанието на страниците
- **Pagination**: Правилна пагинация на каталози
- **Robots.txt**: Конфигурация на robots.txt файл
- **URL structure**: Оптимизация на URL структурата
- **XML Sitemap**: Създаване и поддръжка на XML sitemap
