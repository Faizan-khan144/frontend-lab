const slides = [
  { title: 'Single Origin Pour Over', desc: 'Ethiopian Yirgacheffe roasted fresh every week, brewed to order.', color: 'linear-gradient(135deg,#3b2a1a,#1a120b)' },
  { title: 'Signature Cold Brew', desc: 'Slow-steeped for 18 hours with hints of cocoa and cherry.', color: 'linear-gradient(135deg,#41241d,#150d0a)' },
  { title: 'Vanilla Oat Latte', desc: 'House-made vanilla syrup with silky oat milk.', color: 'linear-gradient(135deg,#54402c,#201811)' }
];

const menu = {
  espresso: [
    { name: 'Espresso', desc: 'Double shot, chocolate notes.', price: 2.8, icon: 'ES', bg: '#b57e22' },
    { name: 'Americano', desc: 'Espresso with hot water.', price: 3.2, icon: 'AM', bg: '#8c6a2f' },
    { name: 'Cortado', desc: 'Equal parts espresso and milk.', price: 3.6, icon: 'CO', bg: '#a0732a' },
    { name: 'Flat White', desc: 'Velvety microfoam over ristretto.', price: 4.1, icon: 'FW', bg: '#c08a2e' }
  ],
  cold: [
    { name: 'Classic Cold Brew', desc: '18 hour steep, naturally sweet.', price: 4.5, icon: 'CB', bg: '#4a311e' },
    { name: 'Nitro Cold Brew', desc: 'Cascading nitrogen pour.', price: 5.2, icon: 'NC', bg: '#3f2d18' },
    { name: 'Cold Brew Tonic', desc: 'Espresso tonic with orange zest.', price: 5.0, icon: 'CT', bg: '#5a4a24' },
    { name: 'Iced Latte', desc: 'Chilled milk with double shot.', price: 4.3, icon: 'IL', bg: '#6f5a26' }
  ],
  special: [
    { name: 'Tumeric Gold Latte', desc: 'Warm spices and golden milk.', price: 4.8, icon: 'TG', bg: '#c9952f' },
    { name: 'Mocha Rooibos', desc: 'Caffeine-free with dark cocoa.', price: 4.6, icon: 'MR', bg: '#7a5520' },
    { name: 'Honey Lavender Latte', desc: 'Floral sweet blend.', price: 5.0, icon: 'HL', bg: '#93702e' },
    { name: 'Caramel Cloud Macchiato', desc: 'Layered caramel indulgence.', price: 5.4, icon: 'CM', bg: '#a97a26' }
  ]
};

let slideIndex = 0;

function renderSlide() {
  const s = slides[slideIndex];
  document.getElementById('heroTitle').textContent = s.title;
  document.getElementById('heroDesc').textContent = s.desc;
  const slider = document.getElementById('slider');
  slider.style.background = s.color;
  document.querySelectorAll('#dots button').forEach((d, i) => d.classList.toggle('active', i === slideIndex));
}

function renderDots() {
  document.getElementById('dots').innerHTML = slides.map((_, i) =>
    `<button data-i="${i}"></button>`).join('');
  document.querySelectorAll('#dots button').forEach(b =>
    b.addEventListener('click', () => { slideIndex = +b.dataset.i; renderSlide(); }));
}

renderDots();
renderSlide();
setInterval(() => { slideIndex = (slideIndex + 1) % slides.length; renderSlide(); }, 4500);

const grid = document.getElementById('menuGrid');

function renderMenu(tab) {
  grid.innerHTML = menu[tab].map(m => `
    <div class="drink-card">
      <div class="drink-top">
        <div class="drink-icon" style="background:${m.bg};color:#f3ece0">${m.icon}</div>
        <span class="drink-price">$ ${m.price.toFixed(2)}</span>
      </div>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <div class="rating">&#9733; 4.7 / 5</div>
    </div>`).join('');
}

renderMenu('espresso');

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderMenu(t.dataset.tab);
  });
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', light ? 'dark' : 'light');
  document.getElementById('themeToggle').textContent = light ? 'Dark' : 'Light';
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

const locations = [
  { city: 'Downtown', addr: '41 Main Street, Metro City', hrs: '7am - 8pm' },
  { city: 'Riverside', addr: '907 Riverbank Avenue', hrs: '7am - 6pm' },
  { city: 'Old Town', addr: '12 Cobblestone Lane', hrs: '8am - 9pm' }
];

document.getElementById('locations').innerHTML = locations.map(l => `
  <div class="location-card">
    <h3>${l.city}</h3>
    <p>${l.addr}</p>
    <p>Open: ${l.hrs}</p>
  </div>`).join('');