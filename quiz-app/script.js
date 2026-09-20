const QUESTION_TIME = 20;

const questions = {
  Science: [
    { q: 'What planet is known as the Red Planet?', a: ['Mars', 'Venus', 'Jupiter', 'Mercury'], c: 0 },
    { q: 'How many bones are in the adult human body?', a: ['206', '201', '180', '196'], c: 0 },
    { q: 'H2O is the chemical formula for...', a: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], c: 1 },
    { q: 'What force keeps us on the ground?', a: ['Magnetism', 'Friction', 'Gravity', 'Inertia'], c: 2 },
    { q: 'Light travels fastest through...', a: ['Water', 'Glass', 'Air', 'Vacuum'], c: 3 },
    { q: 'Which element has symbol Au?', a: ['Silver', 'Gold', 'Osmium', 'Copper'], c: 1 },
    { q: 'Humans have how many pairs of chromosomes?', a: ['21', '23', '24', '22'], c: 1 },
    { q: 'The speed of sound is fastest in...', a: ['Solids', 'Liquids', 'Gases', 'Space'], c: 0 },
    { q: 'Which gas do plants absorb for photosynthesis?', a: ['Oxygen', 'Nitrogen', 'CO2', 'Hydrogen'], c: 2 },
    { q: 'Earth\'s moon is how far in average km?', a: ['384,400', '284,400', '484,400', '184,400'], c: 0 }
  ],
  History: [
    { q: 'Who built the Great Pyramid of Giza?', a: ['Khafre', 'Khufu', 'Tutankhamun', 'Ramses'], c: 1 },
    { q: 'The Renaissance started in which country?', a: ['France', 'England', 'Italy', 'Spain'], c: 2 },
    { q: 'Which empire was ruled by Julius Caesar?', a: ['Greek', 'Ottoman', 'Roman', 'Persian'], c: 2 },
    { q: 'WWII ended in which year?', a: ['1944', '1945', '1946', '1943'], c: 1 },
    { q: 'The Berlin Wall fell in...', a: ['1989', '1991', '1987', '1993'], c: 0 },
    { q: 'Who was the first man on the moon?', a: ['Yuri Gagarin', 'Buzz Aldrin', 'Neil Armstrong', 'John Glenn'], c: 2 },
    { q: 'The Magna Carta was signed in...', a: ['1215', '1315', '1115', '1415'], c: 0 },
    { q: 'The Indus Valley civilization was located in...', a: ['South America', 'South Asia', 'Africa', 'Europe'], c: 1 },
    { q: 'Cleopatra was the last ruler of which empire?', a: ['Greek', 'Rome', 'Macedon', 'Ptolemaic Egypt'], c: 3 },
    { q: 'Which city was the capital of the Inca Empire?', a: ['Tenochtitlan', 'Cusco', 'Machu Picchu', 'Lima'], c: 1 }
  ],
  Geography: [
    { q: 'What is the longest river in the world?', a: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], c: 1 },
    { q: 'How many continents are there?', a: ['5', '6', '7', '8'], c: 2 },
    { q: 'The Sahara desert is in which continent?', a: ['Asia', 'Australia', 'Africa', 'North America'], c: 2 },
    { q: 'What is the capital of Australia?', a: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], c: 2 },
    { q: 'Mount Everest is located in...', a: ['Nepal', 'India', 'Pakistan', 'Bhutan'], c: 0 },
    { q: 'The Great Barrier Reef is near which country?', a: ['Indonesia', 'Australia', 'Fiji', 'Thailand'], c: 1 },
    { q: 'Which is the largest ocean?', a: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], c: 2 },
    { q: 'The Amazon rainforest covers most of which country?', a: ['Colombia', 'Peru', 'Brazil', 'Venezuela'], c: 2 },
    { q: 'What is the smallest country in the world?', a: ['Monaco', 'Vatican City', 'Malta', 'San Marino'], c: 1 },
    { q: 'Which continent has no permanent population?', a: ['Africa', 'Australia', 'Antarctica', 'Asia'], c: 2 }
  ],
  Technology: [
    { q: 'What does CPU stand for?', a: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], c: 0 },
    { q: 'Which company created the iPhone?', a: ['Google', 'Microsoft', 'Apple', 'Samsung'], c: 2 },
    { q: 'HTML is used for...', a: ['Styling', 'Structuring web content', 'Server logic', 'Databases'], c: 1 },
    { q: 'The binary system uses how many digits?', a: ['8', '10', '2', '16'], c: 2 },
    { q: 'Which language is used to style web pages?', a: ['CSS', 'Python', 'Java', 'SQL'], c: 0 },
    { q: '1 GB equals how many MB?', a: ['512', '1000', '1024', '2048'], c: 2 },
    { q: 'Which company makes the PlayStation?', a: ['Nintendo', 'Sony', 'Microsoft', 'Sega'], c: 1 },
    { q: 'HTTP stands for...', a: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyperlink Transfer Program', 'Hidden Text Protocol'], c: 0 },
    { q: 'WiFi uses which frequency by default?', a: ['5GHz only', '2.4GHz and 5GHz', '900MHz', '1GHz'], c: 1 },
    { q: 'JavaScript adds what to a website?', a: ['Layout', 'Colors', 'Interactivity', 'Fonts'], c: 2 }
  ]
};

const cats = [
  { name: 'Science', emoji: '\u{1F52C}' },
  { name: 'History', emoji: '\u{1F3DC}' },
  { name: 'Geography', emoji: '\u{1F30D}' },
  { name: 'Technology', emoji: '\u{1F4BB}' }
];

let selectedCat = 'Science';
let pool = [];
let index = 0;
let score = 0;
let correct = 0;
let wrong = 0;
let timer = null;
let timeLeft = 0;
let totalTime = 0;

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

document.getElementById('catGrid').innerHTML = cats.map(c => `
  <button class="cat ${c.name === selectedCat ? 'selected' : ''}" data-cat="${c.name}">
    <span class="c-emoji">${c.emoji}</span>
    <span class="c-name">${c.name}</span>
    <span class="c-count">${questions[c.name].length} questions</span>
  </button>`).join('');

document.querySelectorAll('.cat').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.cat').forEach(x => x.classList.remove('selected'));
    c.classList.add('selected');
    selectedCat = c.dataset.cat;
  });
});

function show(screen) {
  [startScreen, gameScreen, resultScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

document.getElementById('startBtn').addEventListener('click', startGame);

function startGame() {
  pool = shuffle(questions[selectedCat]).slice(0, 10);
  index = 0;
  score = 0;
  correct = 0;
  wrong = 0;
  totalTime = 0;
  show(gameScreen);
  loadQuestion();
}

function loadQuestion() {
  const q = pool[index];
  document.getElementById('qIndex').textContent = `${index + 1}/10`;
  document.getElementById('qScore').textContent = score;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('feedback').textContent = '';
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('nextBtn').textContent = index === pool.length - 1 ? 'See Results' : 'Next';

  const opts = shuffle(q.a.map((text, i) => ({ text, isCorrect: i === q.c })));
  document.getElementById('options').innerHTML = opts.map(o => `
    <button class="option" data-correct="${o.isCorrect}">${o.text}</button>`).join('');

  document.querySelectorAll('.option').forEach(b => {
    b.addEventListener('click', () => select(b), { once: true });
  });

  timeLeft = QUESTION_TIME;
  updateTimer();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    totalTime++;
    updateTimer();
    if (timeLeft <= 0) {
      wrong++;
      clearInterval(timer);
      document.getElementById('feedback').textContent = 'Time\u2019s up!';
      reveal();
    }
  }, 1000);
}

function select(btn) {
  if (timeLeft <= 0) return;
  clearInterval(timer);
  const isCorrect = btn.dataset.correct === 'true';
  if (isCorrect) {
    correct++;
    score += 10;
    btn.classList.add('correct');
    document.getElementById('feedback').textContent = 'Correct! +10 points';
  } else {
    wrong++;
    btn.classList.add('wrong');
    const rightBtn = document.querySelector('.option[data-correct="true"]');
    if (rightBtn) rightBtn.classList.add('reveal-correct');
    document.getElementById('feedback').textContent = 'Wrong answer';
  }
  reveal();
}

function reveal() {
  document.getElementById('qScore').textContent = score;
  document.querySelectorAll('.option').forEach(o => o.disabled = true);
  document.getElementById('nextBtn').classList.add('show');
}

document.getElementById('nextBtn').addEventListener('click', () => {
  index++;
  if (index < pool.length) loadQuestion();
  else showResults();
});

function updateTimer() {
  document.getElementById('timerText').textContent = timeLeft;
  const bar = document.getElementById('timerBar');
  bar.style.width = (timeLeft / QUESTION_TIME) * 100 + '%';
  bar.style.background = timeLeft <= 5 ? 'var(--bad)' : timeLeft <= 10 ? 'var(--accent2)' : 'var(--ok)';
}

function showResults() {
  clearInterval(timer);
  const pct = Math.round((correct / pool.length) * 100);
  const ring = document.getElementById('resultRing');
  ring.style.background = `conic-gradient(var(--ok) ${pct}%, var(--accent) 0%)`;
  document.getElementById('resultPct').textContent = pct + '%';
  document.getElementById('resultGrade').textContent =
    pct === 100 ? 'Perfect' : pct >= 80 ? 'Expert' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Need practice';
  document.getElementById('resultTitle').textContent =
    pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Well done!' : pct >= 40 ? 'Keep going!' : 'Don\u2019t give up!';
  document.getElementById('resultText').textContent =
    `You scored ${score} points in ${selectedCat}.`;
  document.getElementById('rCorrect').textContent = correct;
  document.getElementById('rWrong').textContent = wrong;
  document.getElementById('rTime').textContent = totalTime + 's';
  show(resultScreen);
}

document.getElementById('retryBtn').addEventListener('click', startGame);
document.getElementById('homeBtn').addEventListener('click', () => {
  show(startScreen);
  document.querySelector('.cat.selected')?.classList.remove('selected');
  const el = document.querySelector(`.cat[data-cat="${selectedCat}"]`);
  if (el) el.classList.add('selected');
});