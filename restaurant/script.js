const menu = {
  starters: [
    { name: 'Burrata & Heirloom Tomato', desc: 'Creamy burrata, basil oil, balsamic pearls.', price: 14 },
    { name: 'Seared Scallops', desc: 'Brown butter, cauliflower purée, capers.', price: 19 },
    { name: 'Mushroom Arancini', desc: 'Crispy risotto balls, truffle aioli.', price: 12 },
    { name: 'Beef Tartare', desc: 'Hand-cut filet, smoked yolk, sourdough crisp.', price: 17 }
  ],
  mains: [
    { name: 'Duck à l\'Orange', desc: 'Crispy duck breast, citrus glaze, wild rice.', price: 32 },
    { name: 'Herb-Crusted Lamb', desc: 'Rack of lamb, rosemary jus, charred leeks.', price: 36 },
    { name: 'Seafood Linguine', desc: 'Mussels, prawns, saffron cream.', price: 28 },
    { name: 'Black Truffle Risotto', desc: 'Carnaroli rice, parmesan foam, truffle shavings.', price: 30 }
  ],
  desserts: [
    { name: 'Dark Chocolate Lava', desc: 'Molten centre, vanilla bean gelato.', price: 11 },
    { name: 'Crème Brûlée', desc: 'Madagascar vanilla, burnt caramel crust.', price: 10 },
    { name: 'Basque Cheesecake', desc: 'Burnt top, salted caramel drizzle.', price: 12 },
    { name: 'Lemon Tart', desc: 'Silky curd, meringue torch, raspberry.', price: 10 }
  ]
};

function renderMenu(tab) {
  document.getElementById('menuList').innerHTML = menu[tab].map(m => `
    <div class="menu-item">
      <div>
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
      </div>
      <span class="price">$ ${m.price}</span>
    </div>`).join('');
}

renderMenu('starters');

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderMenu(t.dataset.tab);
  });
});

const reviews = [
  { text: 'The duck was perfection. Easily the best fine dining experience in the city this year.', author: 'Amelia Grant' },
  { text: 'An unforgettable tasting menu. Every dish told a story. The service was world class.', author: 'Rayan Malik' },
  { text: 'Booked a window table for our anniversary. The staff even printed a personalised menu. Magic.', author: 'Sofia Rossi' }
];

let reviewIndex = 0;

document.getElementById('slides').innerHTML = reviews.map(r => `
  <div class="slide">
    <blockquote>&ldquo;${r.text}&rdquo;</blockquote>
    <cite>- ${r.author}</cite>
  </div>`).join('');

const slidesEl = document.getElementById('slides');

function move(i) {
  reviewIndex = (reviewIndex + i + reviews.length) % reviews.length;
  slidesEl.style.transform = `translateX(-${reviewIndex * 100}%)`;
}

document.querySelector('.next').addEventListener('click', () => move(1));
document.querySelector('.prev').addEventListener('click', () => move(-1));

setInterval(() => move(1), 6000);

document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('bName').value;
  const guests = document.getElementById('bGuests').value;
  const date = document.getElementById('bDate').value;
  const time = document.getElementById('bTime').value;
  const msg = document.getElementById('bookingResult');
  msg.textContent = `Thanks ${name}! Table for ${guests} confirmed on ${date} at ${time}.`;
  e.target.reset();
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});