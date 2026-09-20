const products = [
  { name: 'Sourdough Loaf', desc: 'Slow-fermented, crusty and tangy.', price: 5.5, cat: 'bread', color: 'linear-gradient(135deg,#e8b04b,#c98a2d)' },
  { name: 'Baguette Classic', desc: 'Crispy golden French baguette.', price: 4.0, cat: 'bread', color: 'linear-gradient(135deg,#f0c987,#d99a3d)' },
  { name: 'Butter Croissant', desc: 'Flaky layers of buttery goodness.', price: 3.2, cat: 'pastry', color: 'linear-gradient(135deg,#f7d9a8,#e09a4e)' },
  { name: 'Cinnamon Roll', desc: 'Soft swirl with sweet glaze.', price: 3.8, cat: 'pastry', color: 'linear-gradient(135deg,#e8b04b,#b9772b)' },
  { name: 'Chocolate Cake', desc: 'Rich dark chocolate fudge cake.', price: 24.0, cat: 'cake', color: 'linear-gradient(135deg,#5b3a1e,#2d1b0e)' },
  { name: 'Almond Tart', desc: 'Crumbly crust with toasted almonds.', price: 6.5, cat: 'cake', color: 'linear-gradient(135deg,#f2c07b,#c97b32)' }
];

const grid = document.getElementById('products');
const countEl = document.querySelector('.cart-count');
let cart = 0;

grid.innerHTML = products.map(p => `
  <div class="card reveal" data-cat="${p.cat}">
    <div class="card-img" style="background:${p.color}"></div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="card-bottom">
        <span class="price">$ ${p.price.toFixed(2)}</span>
        <button class="add-btn" data-name="${p.name}">Add</button>
      </div>
    </div>
  </div>`).join('');

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    cart++;
    countEl.textContent = cart;
    btn.textContent = 'Added';
    setTimeout(() => (btn.textContent = 'Add'), 800);
  });
});

document.querySelectorAll('.filter').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const filter = f.dataset.filter;
    document.querySelectorAll('.card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));