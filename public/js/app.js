document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  const serviceOptions = document.getElementById('serviceOptions');
  const masterOptions = document.getElementById('masterOptions');
  const bookingServiceHidden = document.getElementById('bookingService');
  const bookingMasterHidden = document.getElementById('bookingMaster');

  function initCustomSelect(triggerSelector, optionsContainer, hiddenInput, onSelect) {
    const trigger = document.querySelector(triggerSelector);
    const container = trigger.parentElement;

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      container.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      container.classList.remove('open');
    });

    optionsContainer.addEventListener('click', function(e) {
      const option = e.target.closest('.custom-option');
      if (!option) return;
      const value = option.dataset.value;
      const label = option.textContent.trim();
      hiddenInput.value = value;
      trigger.querySelector('.custom-select__placeholder').textContent = label;
      container.classList.remove('open');
      if (onSelect) onSelect(value);
    });
  }

  // ---- УСЛУГИ ----
  async function loadServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      renderServiceOptions(data.categories);
      renderTabs(data.categories);
      renderServices(data.categories[0]);
    } catch (err) {
      console.error('Ошибка загрузки услуг:', err);
    }
  }

  function renderServiceOptions(categories) {
    serviceOptions.innerHTML = '';
    categories.forEach(cat => {
      cat.services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'custom-option';
        div.dataset.value = `${cat.name}: ${service.name}`;
        div.textContent = `${cat.name} — ${service.name} (${service.price} ₽)`;
        serviceOptions.appendChild(div);
      });
    });
    initCustomSelect('#serviceSelect .custom-select__trigger', serviceOptions, bookingServiceHidden);
  }

  const serviceTabs = document.getElementById('serviceTabs');
  const serviceList = document.getElementById('serviceList');

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

  // ---- МАСТЕРА (с фото) ----
  async function loadMasters() {
    try {
      const res = await fetch('/api/masters');
      const data = await res.json();
      renderMasterOptions(data);
      renderMastersGrid(data);
    } catch (err) {
      console.error('Ошибка загрузки мастеров:', err);
    }
  }

  function renderMasterOptions(masters) {
    masterOptions.innerHTML = '';
    const anyOption = document.createElement('div');
    anyOption.className = 'custom-option';
    anyOption.dataset.value = '';
    anyOption.textContent = 'Любой мастер';
    masterOptions.appendChild(anyOption);

    masters.forEach(master => {
      const div = document.createElement('div');
      div.className = 'custom-option';
      div.dataset.value = master.name;
      div.innerHTML = `
        <span class="master-option-name">${master.name}</span>
        <span class="master-option-rating">★ ${master.rating}</span>
        <span class="master-option-special">${master.specialization}</span>
      `;
      masterOptions.appendChild(div);
    });

    initCustomSelect('#masterSelect .custom-select__trigger', masterOptions, bookingMasterHidden);
  }

  function renderMastersGrid(masters) {
    const grid = document.getElementById('mastersGrid');
    grid.innerHTML = '';
    masters.forEach(master => {
      const card = document.createElement('div');
      card.className = 'master-card';
      
      // Формируем имя файла: все буквы строчные, пробелы и спецсимволы заменяем на _
      const fileName = master.name.toLowerCase().replace(/[^a-zа-яё0-9]/g, '_') + '.jpg';
      const photoPath = `/images/masters/${fileName}`;

      // Создаём элемент img с обработчиком ошибки
      const img = document.createElement('img');
      img.src = photoPath;
      img.alt = master.name;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
      img.onerror = function() {
        // Если фото не загрузилось, показываем инициал
        this.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'master-card__photo-fallback';
        fallback.textContent = master.name.charAt(0);
        this.parentElement.appendChild(fallback);
      };

      const photoContainer = document.createElement('div');
      photoContainer.className = 'master-card__photo';
      photoContainer.appendChild(img);

      card.appendChild(photoContainer);
      
      const nameEl = document.createElement('h3');
      nameEl.textContent = master.name;
      card.appendChild(nameEl);
      
      const ratingEl = document.createElement('div');
      ratingEl.className = 'master-rating';
      ratingEl.textContent = `★ ${master.rating} (${master.reviews} оценок)`;
      card.appendChild(ratingEl);
      
      const specEl = document.createElement('p');
      specEl.textContent = master.specialization;
      card.appendChild(specEl);
      
      grid.appendChild(card);
    });
  }

  // ---- ОТЗЫВЫ ----
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

  // ---- ЗАПУСК ----
  loadServices();
  loadMasters();
  loadReviews();

  // ---- ОТПРАВКА ФОРМЫ ----
  const form = document.getElementById('bookingForm');
  const messageEl = document.getElementById('bookingMessage');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const service = bookingServiceHidden.value;
    const master = bookingMasterHidden.value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const comment = document.getElementById('bookingComment').value.trim();

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

    const parsedDate = new Date(date);
    if (parsedDate.toISOString().slice(0,10) !== date) {
      showMessage('Выбранная дата не существует.', 'error');
      return;
    }

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
        document.querySelector('#serviceSelect .custom-select__placeholder').textContent = 'Нажмите, чтобы выбрать услугу';
        document.querySelector('#masterSelect .custom-select__placeholder').textContent = 'Любой мастер';
        bookingServiceHidden.value = '';
        bookingMasterHidden.value = '';
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

  // ---- БУРГЕР ----
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.header__nav a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ---- ДАТА (Казань UTC+3) ----
  const dateInput = document.getElementById('bookingDate');
  const kazanTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const today = kazanTime.toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
});
