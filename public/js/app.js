document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ app.js загружен');
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Транслитерация ----
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

  // ===== ЗАГРУЗКА САЛОНОВ =====
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
