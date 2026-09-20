const recipes = [
  {
    name: 'Creamy Garlic Pasta', meal: 'Dinner', time: 25, difficulty: 'Easy', servings: 4,
    emoji: '\u{1F35D}', color: 'linear-gradient(135deg,#f9d976,#f39f86)',
    ingredients: ['400g spaghetti', '6 cloves garlic', '200ml cream', '50g parmesan', '2 tbsp butter', 'Parsley, salt, pepper'],
    steps: ['Boil pasta in salted water until al dente.', 'Melt butter, sauté finely sliced garlic until golden.', 'Add cream, simmer 3 minutes, season well.', 'Toss pasta in sauce with parmesan and parsley.']
  },
  {
    name: 'Chicken Stir Fry', meal: 'Dinner', time: 20, difficulty: 'Easy', servings: 3,
    emoji: '\u{1F35C}', color: 'linear-gradient(135deg,#a8e063,#56ab2f)',
    ingredients: ['500g chicken breast', '1 red bell pepper', '1 broccoli head', '3 tbsp soy sauce', '1 tsp ginger', 'Sesame oil'],
    steps: ['Slice chicken and vegetables thin.', 'Sear chicken in hot sesame oil.', 'Add vegetables, stir over high heat.', 'Pour soy sauce and ginger, toss 2 minutes.']
  },
  {
    name: 'Classic Pancakes', meal: 'Breakfast', time: 15, difficulty: 'Easy', servings: 2,
    emoji: '\u{1F95E}', color: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)',
    ingredients: ['1 egg', '200g flour', '250ml milk', '1 tbsp sugar', '1 tsp baking powder', 'Butter, syrup'],
    steps: ['Whisk egg, milk and sugar.', 'Fold in flour and baking powder.', 'Pour batter on a buttered pan.', 'Flip when bubbles appear and cook golden.']
  },
  {
    name: 'Beef Tacos', meal: 'Dinner', time: 30, difficulty: 'Medium', servings: 4,
    emoji: '\u{1F32E}', color: 'linear-gradient(135deg,#e58e5a,#c9572b)',
    ingredients: ['500g minced beef', '8 taco shells', '1 onion', '2 tomatoes', 'Lettuce & cheese', '1 tbsp taco spice'],
    steps: ['Brown beef with onion and spice.', 'Chop tomatoes and lettuce.', 'Warm taco shells in oven.', 'Fill shells and top with cheese.']
  },
  {
    name: 'Berry Smoothie', meal: 'Breakfast', time: 5, difficulty: 'Easy', servings: 2,
    emoji: '\u{1F964}', color: 'linear-gradient(135deg,#c471f5,#fa71cd)',
    ingredients: ['2 cups mixed berries', '1 banana', '300ml yogurt', '2 tbsp honey', 'Ice cubes'],
    steps: ['Combine all ingredients in a blender.', 'Blend on high until silky.', 'Pour into glasses and serve chilled.']
  },
  {
    name: 'Grilled Salmon', meal: 'Dinner', time: 25, difficulty: 'Medium', servings: 2,
    emoji: '\u{1F9A6}', color: 'linear-gradient(135deg,#ff9966,#ff5e62)',
    ingredients: ['2 salmon fillets', '1 lemon', '2 tbsp olive oil', 'Garlic, dill', 'Asparagus'],
    steps: ['Marinate salmon in oil, lemon, garlic.', 'Grill skin-side down for 6 minutes.', 'Flip and cook 3 more minutes.', 'Serve with charred asparagus.']
  },
  {
    name: 'Tomato Soup', meal: 'Lunch', time: 40, difficulty: 'Easy', servings: 4,
    emoji: '\u{1F372}', color: 'linear-gradient(135deg,#f83600,#f9d423)',
    ingredients: ['800g canned tomatoes', '1 onion', '2 garlic cloves', '500ml stock', '100ml cream', 'Basil'],
    steps: ['Sauté onion and garlic.', 'Add tomatoes and stock, simmer 20 min.', 'Blend until smooth.', 'Stir cream and serve with basil.']
  },
  {
    name: 'Chocolate Muffins', meal: 'Dessert', time: 35, difficulty: 'Easy', servings: 6,
    emoji: '\u{1F9C1}', color: 'linear-gradient(135deg,#614385,#516395)',
    ingredients: ['200g flour', '150g sugar', '1 egg', '120g butter', '80g cocoa', 'Chocolate chips'],
    steps: ['Cream butter and sugar.', 'Beat in egg and fold cocoa.', 'Add flour and chips, fill cups.', 'Bake 22 minutes at 180\u00b0C.']
  }
];

let favorites = JSON.parse(localStorage.getItem('simmer_favs') || '[]');
const grid = document.getElementById('recipeGrid');
const favGrid = document.getElementById('favGrid');
let activeMeal = 'All';
const meals = ['All', ...new Set(recipes.map(r => r.meal))];

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function isFav(name) { return favorites.includes(name); }

function card(r) {
  return `
    <div class="recipe" data-name="${r.name}">
      <button class="star ${isFav(r.name) ? 'saved' : ''}">${isFav(r.name) ? '\u2605' : '\u2606'}</button>
      <div class="recipe-img" style="background:${r.color}">${r.emoji}</div>
      <div class="recipe-body">
        <span class="meal">${r.meal}</span>
        <h3>${r.name}</h3>
        <div class="recipe-meta">
          <span>&#9201; ${r.time} min</span>
          <span>&#9733; ${r.difficulty}</span>
        </div>
      </div>
    </div>`;
}

function allCards() {
  let list = recipes;
  if (activeMeal !== 'All') list = recipes.filter(r => r.meal === activeMeal);
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (q) list = list.filter(r => r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q)));
  return [...list];
}

function renderAll() {
  const list = allCards();
  grid.innerHTML = list.map(card).join('');
  document.getElementById('emptyMsg').style.display = list.length ? 'none' : 'block';
  bindGrid(grid);
}

function renderFavs() {
  const list = recipes.filter(r => isFav(r.name));
  favGrid.innerHTML = list.map(card).join('');
  document.getElementById('favEmpty').style.display = list.length ? 'none' : 'block';
  bindGrid(favGrid);
}

function bindGrid(root) {
  root.querySelectorAll('.recipe').forEach(el => {
    const name = el.dataset.name;
    el.addEventListener('click', e => {
      const star = e.target.closest('.star');
      if (star) {
        e.stopPropagation();
        toggleFav(name);
        return;
      }
      openRecipe(recipes.find(r => r.name === name));
    });
  });
}

function toggleFav(name) {
  const i = favorites.indexOf(name);
  if (i >= 0) favorites.splice(i, 1); else favorites.push(name);
  localStorage.setItem('simmer_favs', JSON.stringify(favorites));
  toast(i >= 0 ? 'Removed from favorites' : 'Added to favorites');
  renderAll();
  renderFavs();
}

let servings = 0;
let current = null;

function openRecipe(r) {
  current = r;
  servings = r.servings;
  updateModal();
  document.getElementById('modal').classList.add('open');
}

function updateModal() {
  const factor = servings / current.servings;
  const ing = current.ingredients.map(i => ({
    t: i, hasNum: /^\d/.test(i), num: parseFloat(i), unit: i.replace(/^\d+\s*/, '')
  }));
  document.getElementById('recipeModal').innerHTML = `
    <div class="rc-head">
      <h2>${current.name}</h2>
      <button class="rc-close" id="rcClose">\u00d7</button>
    </div>
    <div class="rc-meta">${current.meal} &middot; ${current.time} min &middot; ${current.difficulty}</div>
    <div class="servings">
      <button id="minusS">\u2212</button>
      <strong><span id="svCount">${servings}</span> servings</strong>
      <button id="plusS">+</button>
    </div>
    <div class="rc-body">
      <div class="rc-ingredients">
        <h3>Ingredients</h3>
        <ul>${ing.map(i => `<li>${i.hasNum ? Math.round(i.num * factor * 10) / 10 + ' ' + i.unit : i.t}</li>`).join('')}</ul>
      </div>
      <div class="rc-steps">
        <h3>Method</h3>
        <ol>${current.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>
    </div>`;
  document.getElementById('rcClose').addEventListener('click', closeModal);
  document.getElementById('minusS').addEventListener('click', () => {
    if (servings > 1) { servings--; updateModal(); }
  });
  document.getElementById('plusS').addEventListener('click', () => {
    if (servings < 12) { servings++; updateModal(); }
  });
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('backdrop').addEventListener('click', closeModal);
document.getElementById('searchInput').addEventListener('input', renderAll);

document.getElementById('filters').innerHTML = meals.map((m, i) =>
  `<button class="filter ${i === 0 ? 'active' : ''}" data-m="${m}">${m}</button>`).join('');

document.querySelectorAll('.filter').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    activeMeal = f.dataset.m;
    renderAll();
  });
});

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

renderAll();
renderFavs();