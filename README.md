# Сайт Даниила Шандалова

Конверсионный лендинг частной практики (Next.js) + админка контента для полноценного хостинга.

## Быстрый старт (локально)

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Сайт: [http://localhost:3000](http://localhost:3000)
- CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

Пароль админки — `ADMIN_PASSWORD` в `.env.local`.

## Демо для заказчика (GitHub Pages)

Статическая версия без серверного API и админки.

**Ссылка после деплоя:** [https://s3gam3.github.io/friends_site/](https://s3gam3.github.io/friends_site/)

### Как включить один раз

1. Запушьте `main` в GitHub.
2. Репозиторий → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Дождитесь workflow **Deploy GitHub Pages** (вкладка Actions) или запустите вручную **Run workflow**.

### Локальная проверка статики

```bash
npm run build:pages
npx serve out
```

На Pages форма записи открывает Telegram с готовым текстом (серверных заявок нет). Полная форма с сохранением заявок работает при обычном `npm run build` + Node-хостинге.

## CMS (только на Node-хостинге)

- `data/content.json` — контент
- `data/bookings.json` — заявки
- `/admin` — редактор

## Сборка

```bash
# обычный серверный билд
npm run build && npm start

# статика для GitHub Pages
npm run build:pages
```
