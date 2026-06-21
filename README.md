# 🏠 Interior Design AI

Профессиональное приложение для AI-редизайна интерьеров. Загружайте фотографию комнаты, выбирайте стиль и цветовую палитру, получайте фотореалистичное изображение преображённого пространства за секунды.

![Interior Design AI](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Возможности

- 📸 Загрузка фотографии любой комнаты (drag & drop)
- 🎨 12+ профессиональных стилей дизайна интерьера
- 🌈 Подбор цветовой палитры (16 готовых палитр)
- 🛋️ Выбор типа помещения (гостиная, спальня, кухня, и др.)
- 🤖 AI-генерация на базе Stable Diffusion + ControlNet (модель `adirik/interior-design`)
- ⬇️ Скачивание готовых результатов
- 📱 Полностью адаптивный интерфейс
- 🌙 Современный тёмный дизайн с анимациями

## 🏗️ Архитектура

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  React (Vite)   │ ──────► │  Express Server  │ ──────► │  Replicate API   │
│   Tailwind CSS  │ ◄────── │   TypeScript     │ ◄────── │  (Stable Diff.)  │
└─────────────────┘         └──────────────────┘         └──────────────────┘
```

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- npm 9+
- Replicate API токен ([получить здесь](https://replicate.com/account/api-tokens))

### Установка

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Открыть .env и вставить ваш REPLICATE_API_TOKEN

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### Запуск

В двух разных терминалах:

```bash
# Терминал 1 — Backend (порт 5000)
cd backend
npm run dev

# Терминал 2 — Frontend (порт 5173)
cd frontend
npm run dev
```

Откройте `http://localhost:5173` в браузере.

## 📦 Production-сборка

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

## 🔧 Переменные окружения

### Backend (`backend/.env`)
```env
PORT=5000
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxx
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

## 🛠️ Технологии

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Hot Toast

**Backend**: Node.js, Express, TypeScript, Multer, Replicate SDK, Helmet, Express Rate Limit

## 📄 Лицензия

MIT
