const photos = [
  { seed: 'alpine', cat: 'Nature', title: 'Alpine Morning', h: 400 },
  { seed: 'coast', cat: 'Nature', title: 'Golden Coastline', h: 300 },
  { seed: 'forest', cat: 'Nature', title: 'Misty Forest', h: 480 },
  { seed: 'desert', cat: 'Nature', title: 'Silent Dunes', h: 340 },
  { seed: 'falls', cat: 'Nature', title: 'High Falls', h: 440 },
  { seed: 'metro', cat: 'City', title: 'Metro Pulse', h: 360 },
  { seed: 'skyline', cat: 'City', title: 'Night Skyline', h: 300 },
  { seed: 'alley', cat: 'City', title: 'Rainy Alley', h: 460 },
  { seed: 'bridge', cat: 'City', title: 'Suspension', h: 340 },
  { seed: 'market', cat: 'City', title: 'Street Market', h: 400 },
  { seed: 'portrait', cat: 'People', title: 'Golden Hour', h: 470 },
  { seed: 'dancer', cat: 'People', title: 'In Motion', h: 380 },
  { seed: 'cafe', cat: 'People', title: 'Corner Cafe', h: 320 },
  { seed: 'elder', cat: 'People', title: 'Wisdom', h: 420 },
  { seed: 'fox', cat: 'Animals', title: 'Red Fox', h: 330 },
  { seed: 'owl', cat: 'Animals', title: 'Night Owl', h: 450 },
  { seed: 'panda', cat: 'Animals', title: 'Bamboo Friend', h: 360 },
  { seed: 'toucan', cat: 'Animals', title: 'Tropical Touch', h: 410 }
];

const categories = ['All', 'Nature', 'City', 'People', 'Animals'];
const masonry = document.getElementById('masonry');
let activeCat = 'All';
let visible = [];

function img(idx) {
  const p = photos[idx];
  return `https://picsum.photos/seed/${p.seed}/600/${p.h}`;
}

function render() {
  visible = photos
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => activeCat === 'All' || p.cat === activeCat);
  masonry.innerHTML = visible.map(({ p, i }) => `
    <figure class="photo" data-i="${i}">
      <img src="${img(i)}" alt="${p.title}" loading="lazy">
      <figcaption class="overlay">
        <div><strong>${p.title}</strong><br><span>${p.cat}</span></div>
      </figcaption>
    </figure>`).join('');
  document.getElementById('visCount').textContent = visible.length;
  masonry.querySelectorAll('.photo').forEach(el => {
    el.addEventListener('click', () => openLightbox(+el.dataset.i));
  });
}

document.getElementById('cats').innerHTML = categories.map((c, i) =>
  `<button class="cat ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('');

document.querySelectorAll('.cat').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.cat').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    activeCat = c.dataset.cat;
    render();
  });
});

const lightbox = document.getElementById('lightbox');
let current = 0;

function openLightbox(i) {
  current = i;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const p = photos[current];
  document.getElementById('lbImg').src = `https://picsum.photos/seed/${p.seed}/1200/${Math.round(p.h * 2.4)}`;
  document.getElementById('lbImg').alt = p.title;
  document.getElementById('lbCaption').textContent = `${p.title} \u00b7 ${p.cat}`;
}

function stepFromVisible(index, dir) {
  const pos = visible.findIndex(v => v.i === index);
  return visible[(pos + dir + visible.length) % visible.length].i;
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => { current = stepFromVisible(current, -1); updateLightbox(); });
document.getElementById('lbNext').addEventListener('click', () => { current = stepFromVisible(current, 1); updateLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { current = stepFromVisible(current, -1); updateLightbox(); }
  if (e.key === 'ArrowRight') { current = stepFromVisible(current, 1); updateLightbox(); }
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

render();