const dests = [
  { name: 'Bali, Indonesia', country: 'Asia', budget: 1450, days: '7 days', rating: 4.9, places: ['Ubud Rice Terraces', 'Tegallalang', 'Nusa Penida'], color: 'linear-gradient(135deg,#0e7d5f,#064d39)' },
  { name: 'Santorini, Greece', country: 'Europe', budget: 2350, days: '6 days', rating: 4.8, places: ['Oia Sunset', 'Red Beach', 'Akrotiri Ruins'], color: 'linear-gradient(135deg,#1d6fb8,#0b2e55)' },
  { name: 'Kyoto, Japan', country: 'Asia', budget: 2890, days: '8 days', rating: 4.9, places: ['Fushimi Inari', 'Arashiyama', 'Kinkakuji'], color: 'linear-gradient(135deg,#b53d3d,#4d0f0f)' },
  { name: 'Reykjavik, Iceland', country: 'Europe', budget: 3900, days: '9 days', rating: 4.7, places: ['Blue Lagoon', 'Golden Circle', 'Northern Lights'], color: 'linear-gradient(135deg,#2a9d8f,#134e46)' },
  { name: 'Marrakech, Morocco', country: 'Africa', budget: 1590, days: '6 days', rating: 4.6, places: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Sahara Camp'], color: 'linear-gradient(135deg,#d9853b,#5c2f10)' },
  { name: 'Cusco, Peru', country: 'Americas', budget: 2150, days: '8 days', rating: 4.8, places: ['Machu Picchu', 'Sacred Valley', 'Rainbow Mountain'], color: 'linear-gradient(135deg,#2e7d32,#123b15)' },
  { name: 'Dubai, UAE', country: 'Middle East', budget: 3400, days: '7 days', rating: 4.5, places: ['Burj Khalifa', 'Desert Safari', 'Jumeirah'], color: 'linear-gradient(135deg,#b8860b,#4a3605)' },
  { name: 'Lisbon, Portugal', country: 'Europe', budget: 1780, days: '5 days', rating: 4.6, places: ['Belém Tower', 'Alfama', 'Sintra'], color: 'linear-gradient(135deg,#375a7f,#152436)' },
  { name: 'Banff, Canada', country: 'Americas', budget: 2680, days: '7 days', rating: 4.8, places: ['Lake Louise', 'Moraine Lake', 'Cave & Basin'], color: 'linear-gradient(135deg,#0f766e,#06302c)' }
];

const grid = document.getElementById('destGrid');

function render() {
  const budget = +document.getElementById('budget').value;
  const cont = document.getElementById('continent').value;
  const q = document.getElementById('heroSearch').value.trim().toLowerCase();
  let list = dests.filter(d =>
    d.budget <= budget &&
    (cont === 'All' || d.country === cont) &&
    (!q || d.name.toLowerCase().includes(q)));
  grid.innerHTML = list.map(d => `
    <div class="dest" data-name="${d.name}">
      <div class="dest-img" style="background:${d.color}">
        ${d.name.split(',')[0]}
        <span class="flag">${d.country}</span>
      </div>
      <div class="dest-body">
        <span class="country">${d.country}</span>
        <h3>${d.name}</h3>
        <p class="desc">${d.places.length} must-see spots curated by local guides.</p>
        <div class="dest-bottom">
          <span class="price">$ ${d.budget}</span>
          <span class="duration">${d.days} \u00b7 \u2605 ${d.rating}</span>
        </div>
      </div>
    </div>`).join('');
  document.getElementById('emptyMsg').style.display = list.length ? 'none' : 'block';
  bindCards();
}

function bindCards() {
  document.querySelectorAll('.dest').forEach(card => {
    card.addEventListener('click', () => {
      const d = dests.find(x => x.name === card.dataset.name);
      openModal(d);
    });
  });
}

function openModal(d) {
  document.getElementById('modalBox').innerHTML = `
    <button class="modal-close" id="modalClose">\u00d7</button>
    <span class="m-country">${d.country}</span>
    <h2>${d.name}</h2>
    <ul>${d.places.map(p => `<li>\u2726 ${p}</li>`).join('')}</ul>
    <div class="m-price">$ ${d.budget} <small>per person</small></div>
    <p style="color:var(--muted);font-size:0.9rem;margin-top:6px">${d.days} trip with a local guide</p>`;
  document.getElementById('modal').classList.add('show');
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

document.getElementById('budget').addEventListener('input', e => {
  document.getElementById('budgetLabel').textContent = '$' + e.target.value;
  render();
});

document.getElementById('continent').addEventListener('change', render);
document.getElementById('searchBtn').addEventListener('click', render);
document.getElementById('heroSearch').addEventListener('keydown', e => { if (e.key === 'Enter') render(); });

document.getElementById('newsForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('newsMsg').textContent = 'Welcome aboard! Deals are on the way to your inbox.';
  e.target.reset();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

render();