const books = [
  { title: 'A Memory of Light', author: 'Sarah Quinn', genre: 'Fantasy', year: 2024, rating: 4.8, cover: 'linear-gradient(135deg,#3a2e63,#191235)' },
  { title: 'The Silent Sea', author: 'James Hale', genre: 'Thriller', year: 2025, rating: 4.6, cover: 'linear-gradient(135deg,#0f4c5c,#072227)' },
  { title: 'Bread & Salt', author: 'Marta Weiss', genre: 'Cooking', year: 2023, rating: 4.5, cover: 'linear-gradient(135deg,#b5651d,#5b2c0e)' },
  { title: 'Wanderlust Atlas', author: 'Leo Moreno', genre: 'Travel', year: 2024, rating: 4.7, cover: 'linear-gradient(135deg,#2e7d32,#173b18)' },
  { title: 'Neon Skyline', author: 'Ava Chen', genre: 'Sci-Fi', year: 2025, rating: 4.9, cover: 'linear-gradient(135deg,#4b0082,#1a0033)' },
  { title: 'The Third Eye', author: 'Omar Idris', genre: 'Mystery', year: 2022, rating: 4.4, cover: 'linear-gradient(135deg,#37474f,#14191c)' },
  { title: 'Field Notes', author: 'Nina Park', genre: 'Memoir', year: 2023, rating: 4.3, cover: 'linear-gradient(135deg,#6d4c41,#2b1b16)' },
  { title: 'Gravity\'s Child', author: 'Elena Vasquez', genre: 'Sci-Fi', year: 2024, rating: 4.6, cover: 'linear-gradient(135deg,#283593,#0d1440)' },
  { title: 'Ember & Ash', author: 'Daniel Run', genre: 'Fantasy', year: 2025, rating: 4.7, cover: 'linear-gradient(135deg,#c62828,#4a0d0d)' },
  { title: 'Coastal Recipes', author: 'Giulia Marino', genre: 'Cooking', year: 2021, rating: 4.2, cover: 'linear-gradient(135deg,#0277bd,#013a5e)' },
  { title: 'The Last Train', author: 'Hugo Lindberg', genre: 'Thriller', year: 2025, rating: 4.5, cover: 'linear-gradient(135deg,#455a64,#1c2529)' },
  { title: 'Island Diaries', author: 'Maya Sato', genre: 'Travel', year: 2022, rating: 4.1, cover: 'linear-gradient(135deg,#00897b,#004d45)' }
];

const genres = ['All', ...new Set(books.map(b => b.genre))];
let library = JSON.parse(localStorage.getItem('pt_library') || '[]');
let activeGenre = 'All';

const grid = document.getElementById('bookGrid');
const libGrid = document.getElementById('libraryGrid');
const chipsEl = document.getElementById('chips');

function save() {
  localStorage.setItem('pt_library', JSON.stringify(library));
  document.getElementById('libCount').textContent = library.length;
}

function card(b, saved) {
  return `
    <div class="book">
      <button class="heart ${saved ? 'saved' : ''}" data-title="${b.title}">${saved ? '\u2665' : '\u2661'}</button>
      <div class="book-cover" style="background:${b.cover}">${b.title}</div>
      <h3>${b.title}</h3>
      <div class="author">by ${b.author}</div>
      <div class="meta">
        <span>${b.genre} \u00b7 ${b.year}</span>
        <span class="rating">\u2605 ${b.rating}</span>
      </div>
    </div>`;
}

function filtered() {
  let list = books.filter(b => activeGenre === 'All' || b.genre === activeGenre);
  const q = document.getElementById('search').value.trim().toLowerCase();
  if (q) {
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q));
  }
  const sort = document.getElementById('sort').value;
  list.sort((a, b) =>
    sort === 'title' ? a.title.localeCompare(b.title) :
    sort === 'year' ? b.year - a.year : b.rating - a.rating);
  return list;
}

function renderGrid() {
  const list = filtered();
  grid.innerHTML = list.map(b => card(b, library.includes(b.title))).join('');
  document.getElementById('emptyMsg').style.display = list.length ? 'none' : 'block';
  bindHearts();
}

function renderLib() {
  const saved = books.filter(b => library.includes(b.title));
  libGrid.innerHTML = saved.map(b => card(b, true)).join('');
  document.getElementById('libEmpty').style.display = saved.length ? 'none' : 'block';
  bindHearts();
}

function bindHearts() {
  document.querySelectorAll('.heart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const title = btn.dataset.title;
      const idx = library.indexOf(title);
      if (idx >= 0) library.splice(idx, 1);
      else library.push(title);
      toast(library.includes(title) ? 'Added to your library' : 'Removed from library');
      save();
      renderGrid();
      renderLib();
    });
  });
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

document.getElementById('search').addEventListener('input', renderGrid);
document.getElementById('sort').addEventListener('change', renderGrid);

chipsEl.innerHTML = genres.map((g, i) =>
  `<button class="chip ${i === 0 ? 'active' : ''}" data-g="${g}">${g}</button>`).join('');

chipsEl.querySelectorAll('.chip').forEach(c => {
  c.addEventListener('click', () => {
    chipsEl.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    activeGenre = c.dataset.g;
    renderGrid();
  });
});

document.getElementById('libBtn').addEventListener('click', () => {
  document.getElementById('library').scrollIntoView({ behavior: 'smooth' });
});

save();
renderGrid();
renderLib();