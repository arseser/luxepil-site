// ... весь код до renderServices остаётся без изменений ...

function renderServices(category) {
  serviceList.innerHTML = '';
  const services = category.services;
  const total = services.length;
  const initialShow = 3;

  services.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'service-card';
    if (index >= initialShow) {
      card.classList.add('service-card--hidden');
    }
    
    // Проверяем, есть ли изображение
    let imageHtml = '';
    if (item.image) {
      imageHtml = `<div class="service-card__image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>`;
    }
    
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

  if (total > initialShow) {
    const btn = document.createElement('button');
    btn.className = 'services__show-all-btn';
    btn.textContent = `Показать все (${total - initialShow})`;
    btn.addEventListener('click', function() {
      const hiddenCards = serviceList.querySelectorAll('.service-card--hidden');
      hiddenCards.forEach(card => card.classList.remove('service-card--hidden'));
      this.style.display = 'none';
    });
    serviceList.appendChild(btn);
  }
}
