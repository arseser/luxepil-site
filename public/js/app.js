document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ app.js загружен');
  document.getElementById('year').textContent = new Date().getFullYear();

  function transliterate(name) {
    const map = {
      'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i',
      'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
      'у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'',
      'э':'e','ю':'yu','я':'ya','А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E',
      'Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
      'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'H','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch',
      'Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
    };
    return name.split('').map(ch => map[ch] || ch).join('').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  let currentSalonId = 1;
  let salonsData = [];

  const salonsTabs = document.getElementById('salonsTabs');
  const mastersGrid = document.getElementById('mastersGrid');
  const reviewsGrid = document.getElementById('reviewsGrid');
  const contactsContent = document.getElementById('contactsContent');
  const mapLink = document.getElementById('mapLink');
  const whatsappLink = document.getElementById('whatsappLink');
  const telegramLink = document.getElementById('telegramLink');
  const vkLink = document.getElementById('vkLink');

  async function loadSalons() {
    console.log('🔄 Загружаем салоны...');
    try {
      const res = await fetch('/api/salons');
      console.log('📡 Статус ответа /api/salons:', res.status);
      if (!res.ok) throw new Error('Ошибка загрузки салонов');
      const data = await res.json();
      console.log('📦 Получено салонов:', data.length);
      if (!data || data.length === 0) {
        salonsTabs.innerHTML = '<p style="text-align:center;color:#c0392b;padding:10px;">Нет данных о салонах</p>';
        return;
      }
      salonsData = data;
      renderTabs(salonsData);
      currentSalonId = salonsData[0].id;
      renderSalon(currentSalonId);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      salonsTabs.innerHTML = '<p style="text-align:center;color:#c0392b;padding:10px;">Ошибка загрузки салонов</p>';
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
    renderMasters(salon.masters, salonId);
    renderReviews(salon.reviews);

    contactsContent.innerHTML = `
      <p><strong>Адрес:</strong> ${salon.address}</p>
      <p><strong>Телефон:</strong> <a href="tel:${salon.phone}">${salon.phone}</a></p>
      <p><strong>Режим работы:</strong> ежедневно, 9:00 – 21:00</p>
    `;
    whatsappLink.href = salon.whatsapp;
    telegramLink.href = salon.telegram;
    vkLink.href = salon.vk;

    const coords = salon.coordinates.split(',').map(s => s.trim());
    const lat = coords[0];
    const lng = coords[1];
    mapLink.href = `https://yandex.ru/maps/?pt=${lng},${lat}&z=16`;
  }

  function renderMasters(masters, salonId) {
    mastersGrid.innerHTML = '';
    const folders = { 1: 'popova_7', 2: 'kaybitskaya_2', 3: 'otdradnaya_15' };
    const folder = folders[salonId] || 'popova_7';

    masters.forEach(master => {
      const card = document.createElement('div');
      card.className = 'master-card';

      const photoName = transliterate(master.name) + '.jpg';
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
    console.log('🔄 Загружаем услуги...');
    try {
      const res = await fetch('/api/services');
      console.log('📡 Статус ответа /api/services:', res.status);
      if (!res.ok) throw new Error('Ошибка загрузки услуг');
      const data = await res.json();
      console.log('📦 Получены услуги, категорий:', data.categories ? data.categories.length : 0);
      if (!data.categories || data.categories.length === 0) {
        serviceTabs.innerHTML = '<p style="text-align:center;color:#c0392b;padding:10px;">Нет категорий услуг</p>';
        return;
      }
      renderTabsServices(data.categories);
      renderServices(data.categories[0]);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      serviceTabs.innerHTML = '<p style="text-align:center;color:#c0392b;padding:10px;">Ошибка загрузки услуг</p>';
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
    const services = category.services;
    const initialShow = 3;

    services.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      if (index >= initialShow) card.classList.add('service-card--hidden');
      let imageHtml = item.image ? `<div class="service-card__image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>` : '';
      card.innerHTML = `
        ${imageHtml}
        <h3>${item.name}</h3>
        <div class="price">${item.price} ₽</div>
        ${item.description ? `<div class="desc">${item.description}</div>` : ''}
      `;
      serviceList.appendChild(card);
    });

    const oldBtn = serviceList.querySelector('.services__show-all-btn');
    if (oldBtn) oldBtn.remove();

    if (services.length > initialShow) {
      const btn = document.createElement('button');
      btn.className = 'services__show-all-btn';
      btn.textContent = `Показать все (${services.length - initialShow})`;
      btn.addEventListener('click', function() {
        document.querySelectorAll('.service-card--hidden').forEach(c => c.classList.remove('service-card--hidden'));
        this.style.display = 'none';
      });
      serviceList.appendChild(btn);
    }
  }

  // ---- Бургер ----
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (burger) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.header__nav a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ---- Запуск ----
  loadSalons();
  loadServices();
});
