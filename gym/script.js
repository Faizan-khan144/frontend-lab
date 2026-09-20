const classes = [
  { num: '01', name: 'Strength Lab', desc: 'Barbell compounds, progressive overload coaching.' },
  { num: '02', name: 'HIIT Burn', desc: '30 minutes of maximum intensity intervals.' },
  { num: '03', name: 'Power Boxing', desc: 'Pad work, heavy bag combos and core.' },
  { num: '04', name: 'Yoga Flow', desc: 'Mobility and recovery to balance the grind.' }
];

document.getElementById('classGrid').innerHTML = classes.map(c => `
  <div class="class-card">
    <span class="num">${c.num}</span>
    <h3>${c.name}</h3>
    <p>${c.desc}</p>
  </div>`).join('');

const prices = {
  basic: { monthly: 29, yearly: 278 },
  pro: { monthly: 49, yearly: 470 },
  elite: { monthly: 79, yearly: 758 }
};

const planData = [
  { key: 'basic', name: 'Basic', features: ['Gym floor access', 'Locker room', '1 group class / week', 'Mobile app'] },
  { key: 'pro', name: 'Pro', features: ['Everything in Basic', 'Unlimited classes', 'Sauna & steam', '1 PT session / month'], featured: true },
  { key: 'elite', name: 'Elite', features: ['Everything in Pro', '24/7 coaching access', 'Recovery zone', 'Nutrition plan'] }
];

const plansEl = document.getElementById('plans');
let yearly = false;

function renderPlans() {
  plansEl.innerHTML = planData.map(p => {
    const price = yearly ? prices[p.key].yearly : prices[p.key].monthly;
    return `
      <div class="plan ${p.featured ? 'featured' : ''}">
        ${p.featured ? '<span class="badge">Most Popular</span>' : ''}
        <h3>${p.name}</h3>
        <div class="price">$ ${price}</div>
        <div class="period">${yearly ? 'per year' : 'per month'}</div>
        <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <button class="choose">Choose ${p.name}</button>
      </div>`;
  }).join('');
}

renderPlans();

document.getElementById('billingToggle').addEventListener('change', e => {
  yearly = e.target.checked;
  renderPlans();
});

document.getElementById('calcBmi').addEventListener('click', () => {
  const h = +document.getElementById('bmiHeight').value;
  const w = +document.getElementById('bmiWeight').value;
  const out = document.getElementById('bmiResult');
  if (!h || !w) {
    out.textContent = 'Enter height and weight.';
    return;
  }
  const m = h / 100;
  const bmi = w / (m * m);
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese';
  const color = bmi < 18.5 ? '#5aa8ff' : bmi < 25 ? '#48c774' : bmi < 30 ? '#e0b23a' : '#e0243a';
  out.style.color = color;
  out.textContent = `BMI ${bmi.toFixed(1)} - ${cat}`;
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});