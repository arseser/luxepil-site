document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Транслитерация для имён файлов ----
  function transliterate(name) {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
      'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
      'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
      'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };
    return name.split('').map(ch => map[ch] || ch).join('').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  // ---- Загрузка салонов ----
  let currentSalonId = 1;
  let salonsData = [];

  const salonsTabs = document.getElementById('salonsTabs');
  const mastersGrid = document.getElementById('mastersGrid');
  const reviewsGrid = document.getElementById('reviewsGrid');
  const contactsContent = document.getElementById('contactsContent');
  const mapLink = document.getElementById('mapLink');
  const mapImage = document.getElementById('mapImage');
  const whatsappLink = document.getElementById('whatsappLink');
  const telegramLink = document.getElementById('telegramLink');
  const vkLink = document.getElementById('vkLink');

  async function loadSalons() {
    try {
      const res = await fetch('/api/salons');
      const data = await res.json();
      salonsData = data;
      renderTabs(salonsData);
      if (salonsData.length > 0) {
        currentSalonId = salonsData[0].id;
        renderSalon(currentSalonId);
      }
    } catch (err) {
      console.error('Ошибка загрузки салонов:', err);
    }
  }

  function renderTabs(salons) {
    salonsTabs.innerHTML = '';
    salons.forEach(salon => {
      const btn = document.createElement('button');
      btn.className = 'salon-tab';
      btn.textContent = salon.name;
      btn.dataset.id = salon.id;
      if (salon.id === currentSalonId) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.salon-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSalonId = salon.id;
        renderSalon(salon.id);
      });
      salonsTabs.appendChild(btn);
    });
  }

  function renderSalon(salonId) {
    const salon = salonsData.find(s => s.id === salonId);
    if (!salon) return;

    // Мастера
    renderMasters(salon.masters);

    // Отзывы
    renderReviews(salon.reviews);

    // Контакты
    contactsContent.innerHTML = `
      <p><strong>Адрес:</strong> ${salon.address}</p>
      <p><strong>Телефон:</strong> <a href="tel:${salon.phone}">${salon.phone}</a></p>
      <p><strong>Режим работы:</strong> ежедневно, 9:00 – 21:00</p>
    `;
    whatsappLink.href = salon.whatsapp;
    telegramLink.href = salon.telegram;
    vkLink.href = salon.vk;

    // Карта
    const coords = salon.coordinates.split(',').map(s => s.trim());
    const lat = coords[0];
    const lng = coords[1];
    const mapSrc = `https://api-maps.yandex.ru/services/static?ll=${lng},${lat}&z=16&l=map&size=600,300&pt=${lng},${lat},pm2rdl`;
    mapImage.src = mapSrc;
    mapImage.alt = `Карта проезда к ${salon.name}`;
    mapLink.href = `https://yandex.ru/maps/?pt=${lng},${lat}&z=16`;
  }

  function renderMasters(masters) {
    mastersGrid.innerHTML = '';
    masters.forEach(master => {
      const card = document.createElement('div');
      card.className = 'master-card';

      // Фото – транслитерируем имя
      const photoName = transliterate(master.name) + '.jpg';
      const photoPath = `/images/masters/popova_7/${photoName}`; // базовая папка, но мы будем подставлять папку филиала позже
      // Для каждого филиала своя папка:
      const salon = salonsData.find(s => s.id === currentSalonId);
      let folder = '';
      if (salon) {
        if (salon.id === 1) folder = 'popova_7';
        else if (salon.id === 2) folder = 'kaybitskaya_2';
        else if (salon.id === 3) folder = 'otdradnaya_15';
      }
      const fullPath = `/images/masters/${folder}/${photoName}`;

      const img = document.createElement('img');
      img.src = fullPath;
      img.alt = master.name;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
      img.onerror = function() {
        this.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'master-card__photo-fallback';
        fallback.textContent = master.name.charAt(0);
        fallback.style.cssText = `
          width: 100px; height: 100px; border-radius: 50%;
          background: #F0EAE5; display: flex; align-items: center;
          justify-content: center; font-size: 36px; font-weight: 600;
          color: #A67C6B; font-family: 'Playfair Display', serif;
        `;
        this.parentElement.appendChild(fallback);
      };

      const photoContainer = document.createElement('div');
      photoContainer.className = 'master-card__photo';
      photoContainer.appendChild(img);
      card.appendChild(photoContainer);

      const nameEl = document.createElement('h3');
      nameEl.textContent = master.name;
      card.appendChild(nameEl);

      if (master.reviews) {
        const ratingEl = document.createElement('div');
        ratingEl.className = 'master-rating';
        ratingEl.textContent = `★ 5.0 (${master.reviews} оценок)`;
        card.appendChild(ratingEl);
      }

      const specEl = document.createElement('p');
      specEl.textContent = master.specialization;
      card.appendChild(specEl);

      mastersGrid.appendChild(card);
    });
  }

  function renderReviews(reviews) {
    reviewsGrid.innerHTML = '';
    reviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `<p>“${review.text}”</p><span>— ${review.author}</span>`;
      reviewsGrid.appendChild(card);
    });
  }

  // ---- Загрузка услуг ----
  const serviceTabs = document.getElementById('serviceTabs');
  const serviceList = document.getElementById('serviceList');

  async function loadServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      renderTabsServices(data.categories);
      renderServices(data.categories[0]);
    } catch (err) {
      console.error('Ошибка загрузки услуг:', err);
    }
  }

  function renderTabsServices(categories) {
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

  // ---- Бургер-меню ----
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    document.querySelectorAll('.header__nav a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ---- Запуск ----
  loadSalons();
  loadServices();
});
