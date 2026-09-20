const products = [
  { name: 'Oversized Tee', cat: 'Men', price: 29, rating: 4.6, icon: 'T', color: 'linear-gradient(135deg,#3d3a36,#6e675e)', featured: true },
  { name: 'Linen Shirt', cat: 'Men', price: 59, rating: 4.8, icon: 'S', color: 'linear-gradient(135deg,#8c6a4a,#c9a877)', featured: false },
  { name: 'Slim Chinos', cat: 'Men', price: 69, rating: 4.5, icon: 'P', color: 'linear-gradient(135deg,#4f5a63,#2c323a)', featured: false },
  { name: 'Denim Jacket', cat: 'Men', price: 89, rating: 4.9, icon: 'J', color: 'linear-gradient(135deg,#2f4567,#16233a)', featured: true },
  { name: 'Silk Midi Dress', cat: 'Women', price: 119, rating: 4.9, icon: 'D', color: 'linear-gradient(135deg,#a97f57,#e6c9a2)', featured: true },
  { name: 'Tailored Blazer', cat: 'Women', price: 139, rating: 4.7, icon: 'B', color: 'linear-gradient(135deg,#6b4b3a,#8a6550)', featured: false },
  { name: 'Pleated Skirt', cat: 'Women', price: 79, rating: 4.4, icon: 'K', color: 'linear-gradient(135deg,#8f6b9c,#5b4565)', featured: false },
  { name: 'Knitted Cardigan', cat: 'Women', price: 99, rating: 4.6, icon: 'C', color: 'linear-gradient(135deg,#c98a6d,#a05a3c)', featured: true },
  { name: 'Leather Tote', cat: 'Accessories', price: 149, rating: 4.8, icon: 'T', color: 'linear-gradient(135deg,#4a3b2d,#2c221a)', featured: false },
  { name: 'Aviator Sunglasses', cat: 'Accessories', price: 49, rating: 4.3, icon: 'G', color: 'linear-gradient(135deg,#22201d,#4c463f)', featured: false },
  { name: 'Wool Scarf', cat: 'Accessories', price: 39, rating: 4.5, icon: 'F', color: 'linear-gradient(135deg,#7a5b3f,#4d3827)', featured: false },
  { name: 'Canvas Belt', cat: 'Accessories', price: 35, rating: 4.2, icon: 'B', color: 'linear-gradient(135deg,#5f6b7a,#39424e)', featured: false }
];

const cats = ['All', 'Men', 'Women', 'Accessories'];
let activeCat = 'All';
let cart = JSON.parse(localStorage.getItem('sahara_cart') || '[]');

const grid = document.getElementById('productGrid');

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function renderCartCount() {
  document.getElementById('cartCount').textContent = cartCount();
}

function renderProducts() {
  let list = products.filter(p => activeCat === 'All' || p.cat === activeCat);
  const sort = document.getElementById('sort').value;
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  grid.innerHTML = list.map(p => {
    const inCart = cart.find(i => i.name === p.name);
    return `
      <div class="product">
        <div class="product-img" style="background:${p.color}">${p.icon}</div>
        <div class="product-body">
          <span class="cat">${p.cat}</span>
          <h3>${p.name}</h3>
          <div class="rating">${'★'.repeat(5)} <small style="color:var(--muted)">${p.rating}</small></div>
          <div class="price-row">
            <span class="price">$ ${p.price}</span>
            <button class="quick-add" data-name="${p.name}">${inCart ? 'Add More' : 'Add to Cart'}</button>
          </div>
        </div>
      </div>`;
  }).join('');
  document.getElementById('emptyMsg').style.display = list.length ? 'none' : 'block';

  grid.querySelectorAll('.quick-add').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(products.find(p => p.name === b.dataset.name));
    });
  });
}

function addToCart(p) {
  const item = cart.find(i => i.name === p.name);
  if (item) item.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  renderCart();
  renderCartCount();
  toast(p.name + ' added to bag');
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  renderCart();
  renderCartCount();
}

function setQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name);
  else { saveCart(); renderCart(); renderCartCount(); }
}

function saveCart() {
  localStorage.setItem('sahara_cart', JSON.stringify(cart));
}

function renderCart() {
  const wrap = document.getElementById('cartItems');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (!cart.length) {
    wrap.innerHTML = '<p style="color:var(--muted);text-align:center;padding:30px 0">Your bag is empty.</p>';
  } else {
    wrap.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="ci-thumb" style="background:${i.color}"></div>
        <div class="ci-info">
          <strong>${esc(i.name)}</strong>
          <span class="ci-cat">${i.cat}</span>
          <div class="ci-controls">
            <button onclick="setQty('${i.name}',-1)">\u2212</button>
            <span class="ci-qty">${i.qty}</span>
            <button onclick="setQty('${i.name}',1)">+</button>
            <button class="ci-remove" onclick="removeFromCart('${i.name}')">Remove</button>
          </div>
        </div>
        <span class="ci-price">$ ${(i.price * i.qty).toFixed(2)}</span>
      </div>`).join('');
  }
  document.getElementById('cartTotal').textContent = '$ ' + total.toFixed(2);
}

document.getElementById('filters').innerHTML = cats.map((c, i) =>
  `<button class="filter ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');

document.querySelectorAll('.filter').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    activeCat = f.dataset.cat;
    renderProducts();
  });
});

const sortEl = document.getElementById('sort');
sortEl.addEventListener('change', renderProducts);

document.getElementById('cartBtn').addEventListener('click', () => {
  document.getElementById('cartPanel').classList.add('open');
});
document.getElementById('cartClose').addEventListener('click', () => {
  document.getElementById('cartPanel').classList.remove('open');
});
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) { toast('Your bag is empty'); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('coMsg').textContent = `Thanks! Your order of $ ${total.toFixed(2)} is on its way.`;
  document.getElementById('checkoutBackdrop').classList.add('show');
  document.getElementById('checkoutModal').classList.add('show');
});
document.getElementById('coClose').addEventListener('click', closeCheckout);
document.getElementById('checkoutBackdrop').addEventListener('click', closeCheckout);

function closeCheckout() {
  document.getElementById('checkoutBackdrop').classList.remove('show');
  document.getElementById('checkoutModal').classList.remove('show');
  cart = [];
  saveCart();
  renderCart();
  renderCartCount();
  renderProducts();
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

renderProducts();
renderCart();
renderCartCount();