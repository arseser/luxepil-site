require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- Безопасность (CSP с поддержкой Метрики) -----
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://placehold.co", "https://api-maps.yandex.ru", "https://mc.yandex.ru"],
      "frame-src": ["'self'", "https://yandex.ru"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://mc.yandex.ru"],
      "script-src-attr": ["'unsafe-inline'"],
      "connect-src": ["'self'", "https://mc.yandex.ru"],
    },
  },
}));

// ----- Доверять прокси (для Render / Nginx) -----
app.set('trust proxy', 1);

// ----- Настройка CORS -----
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  credentials: true
}));

// ----- Rate Limiter (защита от спама) -----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Слишком много запросов. Подождите 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/booking', limiter);

// ----- Middleware -----
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// ----- Загрузка данных -----
const pricesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'prices.json'), 'utf8')
);
let reviewsData = [];
try {
  reviewsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
  );
} catch (e) {
  reviewsData = [];
}

// ----- API -----
app.get('/api/services', (req, res) => {
  res.json(pricesData);
});

app.get('/api/salons', (req, res) => {
  try {
    const salons = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'salons.json'), 'utf8')
    );
    res.json(salons);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/masters', (req, res) => {
  try {
    const masters = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'masters.json'), 'utf8')
    );
    res.json(masters);
  } catch (e) {
    res.json([]);
  }
});

app.get('/api/reviews', (req, res) => {
  res.json(reviewsData);
});

// ----- API: запись -----
app.post('/api/booking', async (req, res) => {
  const { name, phone, service, master, date, time, comment } = req.body;

  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Имя (минимум 2 символа)');
  if (!phone || !/^[\+\d\s\-\(\)]{10,20}$/.test(phone)) errors.push('Некорректный телефон');
  if (!service || service.trim() === '') errors.push('Услуга не выбрана');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Некорректная дата');
  if (!time || !/^\d{2}:\d{2}$/.test(time)) errors.push('Некорректное время');
  if (comment && comment.length > 500) errors.push('Комментарий не должен превышать 500 символов');

  if (!errors.length) {
    const parsedDate = new Date(date);
    if (parsedDate.toISOString().slice(0,10) !== date) {
      errors.push('Дата не существует (например, 30 февраля)');
    }
  }

  if (!errors.length) {
    const nowMs = Date.now();
    const selectedMs = new Date(date + 'T' + time + '+03:00').getTime();
    if (selectedMs < nowMs) {
      errors.push('Выбранное время уже прошло');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join('; ') });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ success: false, error: 'Сервис временно недоступен' });
  }

  const message = `
📝 Новая запись в Luxepil!

👤 Клиент: ${name}
📱 Телефон: ${phone}
💇 Услуга: ${service}
👩‍🎨 Мастер: ${master || 'Не выбран'}
📅 Дата: ${date}
⏰ Время: ${time}
✉️ Комментарий: ${comment || '—'}
  `;

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Ошибка Telegram');
    }

    res.json({ success: true, message: 'Заявка отправлена!' });
  } catch (error) {
    console.error('Telegram error:', error);
    res.status(500).json({ success: false, error: 'Не удалось отправить заявку. Попробуйте позже.' });
  }
});

// ----- Запуск -----
app.listen(PORT, () => {
  console.log(`🚀 Сервер Luxepil запущен на порту ${PORT}`);
  console.log(`🔒 CORS разрешён только для: ${allowedOrigin}`);
});
