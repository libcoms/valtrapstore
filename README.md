# ВальтрапРу — магазин вальтрапов и ушек

Интернет-магазин конного снаряжения ручной работы. Вальтрапы и ушки для лошадей: конкур, выездка, универсальные модели.

## Стек

- **Next.js 16** (App Router)
- **Prisma 7** + PostgreSQL (Prisma Accelerate)
- **Tailwind CSS 4**
- **Zustand** — корзина (localStorage)
- **NextAuth v4** — авторизация в админке
- **Cloudinary** — хранение изображений
- **Telegram Bot API** — уведомления о заказах

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000)

## Переменные окружения

Создай `.env` на основе примера:

```env
DATABASE_URL="prisma+postgres://..."

NEXTAUTH_SECRET="случайная-строка"
NEXTAUTH_URL="http://localhost:3000"

TELEGRAM_BOT_TOKEN="токен-от-BotFather"
TELEGRAM_CHAT_ID="твой-chat-id"

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

NEXT_PUBLIC_SITE_URL="https://твой-домен.vercel.app"
```

## База данных

```bash
# Применить схему
npm run db:push

# Создать первого администратора
npm run admin:create admin ваш_пароль

# Заполнить тестовыми товарами
npm run db:seed

# Открыть Prisma Studio
npm run db:studio
```

## Структура

```
app/
  (shop)/          — публичный сайт (каталог, товар, корзина, оформление)
  admin/
    (protected)/   — панель управления (товары, заказы, баннеры, пользователи)
    login/         — страница входа
  api/             — API маршруты
components/
  admin/           — компоненты панели управления
  catalog/         — карточки товаров, опции
  layout/          — Header
  ui/              — баннер-слайдер и прочее
prisma/
  schema.prisma    — модели БД
  create-admin.ts  — скрипт создания администратора
lib/
  auth.ts          — конфигурация NextAuth
  prisma.ts        — клиент Prisma
  telegram.ts      — отправка уведомлений
```

## Админка

Доступна по адресу `/admin`. Требует авторизации.

Функционал: товары, заказы, баннеры главной страницы, управление пользователями.
