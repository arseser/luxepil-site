document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Загрузка услуг ----
  const serviceTabs = document.getElementById('serviceTabs');
  const serviceList = document.getElementById('serviceList');
  const bookingSelect = document.getElementById('bookingService');
  let allServices = [];

  async function loadServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      allServices = data.categories;
      renderTabs(allServices);
      renderServices(allServices[0]);
      populateBookingSelect(allServices);
    } catch (err) {
      console.error('Ошибка загрузки услуг:', err);
    }
  }

  function renderTabs(categories) {
    serviceTabs.innerHTML = '';
    categories.forEach((cat, index) => {
      const btn = document.createElement('button');
      btn.textContent = cat.name;
      btn.dataset.index = index;
      if (index === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.services__tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderServices(categories[index]);
      });
      serviceTabs.appendChild(btn);
    });
  }

  function renderServices(category) {
    serviceList.innerHTML = '';
    category.services.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <div class="price">${item.price} ₽</div>
        ${item.description ? `<div class="desc">${item.description}</div>` : ''}
      `;
      serviceList.appendChild(card);
    });
  }

  function populateBookingSelect(categories) {
    bookingSelect.innerHTML = '<option value="">Выберите услугу</option>';
    categories.forEach(cat => {
      cat.services.forEach(service => {
        const opt = document.createElement('option');
        opt.value = `${cat.name}: ${service.name}`;
        opt.textContent = `${cat.name} — ${service.name} (${service.price} ₽)`;
        bookingSelect.appendChild(opt);
      });
    });
  }

  loadServices();

  // ---- Загрузка отзывов ----
  async function loadReviews() {
    try {
      const res = await fetch('/api/reviews');
      const reviews = await res.json();
      const grid = document.getElementById('reviewsGrid');
      grid.innerHTML = '';
      reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `<p>“${review.text}”</p><span>— ${review.author}</span>`;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  }
  loadReviews();

  // ---- Отправка формы ----
  const form = document.getElementById('bookingForm');
  const messageEl = document.getElementById('bookingMessage');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const service = document.getElementById('bookingService').value;
    const master = document.getElementById('bookingMaster').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const comment = document.getElementById('bookingComment').value.trim();

    // ---- Валидация ----
    if (!name || name.length < 2) {
      showMessage('Имя должно содержать минимум 2 символа.', 'error');
      return;
    }
    if (!phone || !/^[\+\d\s\-\(\)]{10,20}$/.test(phone)) {
      showMessage('Введите корректный номер телефона.', 'error');
      return;
    }
    if (!service) {
      showMessage('Выберите услугу.', 'error');
      return;
    }
    if (!date || !time) {
      showMessage('Выберите дату и время.', 'error');
      return;
    }
    if (comment.length > 500) {
      showMessage('Комментарий не должен превышать 500 символов.', 'error');
      return;
    }

    // Проверка существования даты
    const parsedDate = new Date(date);
    if (parsedDate.toISOString().slice(0,10) !== date) {
      showMessage('Выбранная дата не существует (например, 30 февраля).', 'error');
      return;
    }

    // ---- Проверка времени (без лишнего смещения) ----
    const nowMs = Date.now();
    const selectedMs = new Date(date + 'T' + time + '+03:00').getTime();
    if (selectedMs < nowMs) {
      showMessage('Нельзя записаться на прошедшее время.', 'error');
      return;
    }

    const payload = { name, phone, service, master, date, time, comment };

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        showMessage('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
      } else {
        showMessage('❌ Ошибка: ' + (result.error || 'попробуйте позже'), 'error');
      }
    } catch (err) {
      showMessage('❌ Ошибка соединения. Проверьте интернет.', 'error');
      console.error(err);
    }
  });

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'booking__message ' + type;
    messageEl.style.display = 'block';
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 6000);
  }

  // ---- Бургер-меню ----
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.header__nav a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ---- Минимальная дата (сегодня в Казани UTC+3) ----
  const dateInput = document.getElementById('bookingDate');
  // Просто добавляем 3 часа к текущему UTC-времени
  const kazanTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const today = kazanTime.toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
});
