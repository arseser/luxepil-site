document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ app.js загружен');
  document.getElementById('year').textContent = new Date().getFullYear();

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
    return name
      .split('')
      .map(ch => map[ch] || ch)
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
  }

  const MAX_WORKS = 10;
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
    try {
      const res = await fetch('/api/salons');
      if (!res.ok) throw new Error('Ошибка загрузки салонов');
      const data = await res.json();
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
      btn.textContent = salon.name.replace(/^Luxepil\s+на\s+/i, '');
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
    mapLink.href = `https://yandex.ru/maps/?pt=${coords[1]},${coords[0]}&z=16`;
  }

  function renderMasters(masters, salonId) {
    mastersGrid.innerHTML = '';
    const folders = { 1: 'popova_7', 2: 'kaybitskaya_2', 3: 'otdradnaya_15' };
    const folder = folders[salonId] || 'popova_7';

    function getPriority(master) {
      const hasWork = master.work_folder ? 1 : 0;
      const hasDesc = master.description ? 1 : 0;
      if (hasWork && hasDesc) return 1;
      if (hasWork && !hasDesc) return 2;
      if (!hasWork && hasDesc) return 3;
      return 4;
    }

    const sortedMasters = [...masters].sort((a, b) => {
      const pa = getPriority(a);
      const pb = getPriority(b);
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });

    sortedMasters.forEach(master => {
      const card = document.createElement('div');
      card.className = 'master-card';

      const photoName = transliterate(master.name) + '.jpg';
      const fullPath = `/images/masters/${folder}/${photoName}`;

      const photoContainer = document.createElement('div');
      photoContainer.className = 'master-card__photo';

      const img = document.createElement('img');
      img.src = fullPath;
      img.alt = master.name;
      img.onerror = function() {
        this.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.className = 'master-card__photo-fallback';
        fallback.textContent = master.name.charAt(0);
        this.parentElement.appendChild(fallback);
      };
      photoContainer.appendChild(img);
      card.appendChild(photoContainer);

      const nameEl = document.createElement('h3');
      nameEl.textContent = master.name;
      card.appendChild(nameEl);

      const specEl = document.createElement('div');
      specEl.className = 'master-spec';
      specEl.textContent = master.specialization;
      card.appendChild(specEl);

      if (master.reviews) {
        const ratingEl = document.createElement('div');
        ratingEl.className = 'master-rating';
        ratingEl.textContent = `★ 5.0 (${master.reviews} отзывов)`;
        card.appendChild(ratingEl);
      }

      if (master.description) {
        const descEl = document.createElement('div');
        descEl.className = 'master-card__desc';
        const textEl = document.createElement('div');
        textEl.className = 'master-card__desc-text';
        textEl.textContent = master.description;
        descEl.appendChild(textEl);

        const btn = document.createElement('button');
        btn.className = 'master-card__read-more';
        btn.textContent = 'Читать дальше';
        btn.addEventListener('click', () => {
          textEl.classList.toggle('expanded');
          btn.textContent = textEl.classList.contains('expanded') ? 'Свернуть' : 'Читать дальше';
        });
        descEl.appendChild(btn);
        card.appendChild(descEl);
      }

      if (master.work_folder) {
        const workBtn = document.createElement('button');
        workBtn.className = 'master-card__show-work';
        workBtn.textContent = 'Показать примеры работ';
        workBtn.addEventListener('click', () => {
          openWorksLightbox(folder, master.work_folder, master.name);
        });
        card.appendChild(workBtn);
      }

      mastersGrid.appendChild(card);
    });
  }

  function openWorksLightbox(folder, workFolder, masterName) {
    initLightbox();
    const lb = document.querySelector('.lightbox');
    if (!lb) return;

    const lbImg = lb.querySelector('.lightbox__img');
    const prevBtn = lb.querySelector('.lightbox__prev');
    const nextBtn = lb.querySelector('.lightbox__next');

    const works = [];
    let idx = 1;

    function loadWorks() {
      return new Promise((resolve) => {
        function tryNext() {
          if (idx > MAX_WORKS) { resolve(); return; }
          const testSrc = `/images/works/${folder}/${workFolder}/work-${idx}.jpg`;
          const testImg = new Image();
          testImg.onload = () => { works.push(testSrc); idx++; tryNext(); };
          testImg.onerror = () => resolve();
          testImg.src = testSrc;
        }
        tryNext();
      });
    }

    let currentIdx = 0;
    function showWork(i) {
      if (works.length === 0) return;
      currentIdx = (i + works.length) % works.length;
      lbImg.src = works[currentIdx];
      lbImg.alt = `Работа мастера ${masterName} (${currentIdx + 1}/${works.length})`;
    }

    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); showWork(currentIdx - 1); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); showWork(currentIdx + 1); };

    loadWorks().then(() => {
      if (works.length === 0) {
        lbImg.src = '';
        lbImg.alt = 'Работы не найдены';
        lb.classList.add('open');
        return;
      }
      showWork(0);
      lb.classList.add('open');
      if (works.length > 1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
      }
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

  const serviceTabs = document.getElementById('serviceTabs');
  const serviceList = document.getElementById('serviceList');

  async function loadServices() {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Ошибка загрузки услуг');
      const data = await res.json();
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

  function loadPromo() {
    const grid = document.getElementById('promoGrid');
    if (!grid) return;

    const promos = [
      { image: '/images/promo/promo-1.jpg', title: 'Знакомство с лазерной эпиляцией', text: 'Дарим -1000 ₽ на первое посещение любого комплекса лазерной эпиляции. Попробуйте премиальный уход с максимальной выгодой!', button: 'Записаться со скидкой', link: 'https://clck.ru/3B4viL' },
      { image: '/images/promo/promo-2.jpg', title: 'Разделите бьюти-день с подругой', text: 'Поделитесь заботой! Подарите подруге сертификат на -500 ₽ на её первый визит в наш салон, а мы начислим вам бонусы на следующий сеанс.', button: 'Получить сертификат', link: 'https://clck.ru/3B4viL' },
      { image: '/images/promo/promo-3.jpg', title: 'День рождения в Luxepil', text: 'Сияйте в свой особенный день! Дарим скидку 15% на любые услуги эпиляции и ногтевого сервиса (действует в день рождения, а также 3 дня до и после него).', button: 'Забронировать дату', link: 'https://clck.ru/3B4viL' },
      { image: '/images/promo/promo-4.jpg', title: 'Умный кешбэк', text: 'Оплачивайте услуги наличными и получайте повышенный кешбэк 5% на ваш бонусный счет.', button: 'Записаться онлайн', link: 'https://clck.ru/3B4viL' }
    ];

    grid.innerHTML = '';
    promos.forEach(promo => {
      const card = document.createElement('div');
      card.className = 'promo-card';
      card.innerHTML = `
        <div class="promo-card__image">
          <img src="${promo.image}" alt="${promo.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,#E8DDD4,#D4C5B2)';">
        </div>
        <div class="promo-card__body">
          <h3>${promo.title}</h3>
          <p>${promo.text}</p>
          <a href="${promo.link}" target="_blank" class="promo-card__btn">${promo.button}</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function loadAboutGallery() {
    const gallery = document.getElementById('aboutGallery');
    if (!gallery) return;

    const photos = [
      '/images/salons/salon-1.jpg', '/images/salons/salon-2.jpg', '/images/salons/salon-3.jpg',
      '/images/salons/salon-4.jpg', '/images/salons/salon-5.jpg', '/images/salons/salon-6.jpg',
      '/images/salons/salon-7.jpg', '/images/salons/salon-8.jpg', '/images/salons/salon-9.jpg'
    ];

    gallery.innerHTML = '';
    photos.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'about__gallery-item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Салон Luxepil ${index + 1}`;
      img.loading = 'lazy';
      img.onerror = function() {
        this.style.display = 'none';
        this.parentElement.style.background = 'linear-gradient(135deg, #E8DDD4, #D4C5B2)';
      };
      item.appendChild(img);
      item.addEventListener('click', () => openLightbox(src, img.alt));
      gallery.appendChild(item);
    });
  }

  function initLightbox() {
    if (document.querySelector('.lightbox')) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox__close" aria-label="Закрыть">&times;</button>
      <button class="lightbox__prev" aria-label="Предыдущее">‹</button>
      <img class="lightbox__img" src="" alt="">
      <button class="lightbox__next" aria-label="Следующее">›</button>
    `;
    document.body.appendChild(lb);

    const lbClose = lb.querySelector('.lightbox__close');
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target === lbClose) lb.classList.remove('open');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lb.classList.remove('open');
    });
  }

  function openLightbox(src, alt) {
    initLightbox();
    const lb = document.querySelector('.lightbox');
    if (!lb) return;
    const lbImg = lb.querySelector('.lightbox__img');
    const prevBtn = lb.querySelector('.lightbox__prev');
    const nextBtn = lb.querySelector('.lightbox__next');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('open');
  }

  loadPromo();
  loadAboutGallery();

  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (burger) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    document.querySelectorAll('.header__nav a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  loadSalons();
  loadServices();
});
