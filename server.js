require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- CSP -----
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://placehold.co", "https://api-maps.yandex.ru"],
      "frame-src": ["'self'", "https://yandex.ru"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "style-src": ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.set('trust proxy', 1);

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Слишком много заявок. Подождите 15 минут.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/booking', limiter);
app.use('/api/slots', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// ----- Загрузка данных -----
const pricesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'prices.json'), 'utf8')
);

// ----- API -----
app.get('/api/services', (req, res) => res.json(pricesData));

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

// ---- Запуск ----
app.listen(PORT, () => {
  console.log(`🚀 Сервер Luxepil запущен на порту ${PORT}`);
  console.log(`🔒 CORS разрешён только для: ${allowedOrigin}`);
});
