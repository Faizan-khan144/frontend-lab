let expr = '';
let history = JSON.parse(localStorage.getItem('calcore_history') || '[]');

const exprEl = document.getElementById('expression');
const resEl = document.getElementById('result');
const padEl = document.querySelector('.pad');
const sciPadEl = document.getElementById('sciPad');

let tokens = [];
let pos = 0;

function tokenize(input) {
  tokens = [];
  pos = 0;
  const re = /\d+\.?\d*|[a-z]+|[+\-*/^%()!,]/g;
  let m;
  input = input.replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/x2/g, '**2').replace(/x3/g, '**3').replace(/sqrt/g, 'sqrt');
  while ((m = re.exec(input))) {
    tokens.push(m[0]);
  }
}

function peek() { return tokens[pos]; }
function next() { return tokens[pos++]; }

function parseExpr() {
  let left = parseTerm();
  while (peek() === '+' || peek() === '-') {
    const op = next();
    const right = parseTerm();
    left = op === '+' ? left + right : left - right;
  }
  return left;
}

function parseTerm() {
  let left = parseFactor();
  while (peek() === '*' || peek() === '/' || peek() === '%') {
    const op = next();
    const right = parseFactor();
    if (op === '*') left *= right;
    else if (op === '/') {
      if (right === 0) throw new Error('Division by zero');
      left /= right;
    } else left %= right;
  }
  return left;
}

function parseFactor() {
  const left = parseUnary();
  if (peek() === '^') {
    next();
    const right = parseUnary();
    return Math.pow(left, right);
  }
  return left;
}

function parseUnary() {
  if (peek() === '-' || peek() === '+') {
    const op = next();
    const v = parseUnary();
    return op === '-' ? -v : v;
  }
  return parsePostfix();
}

function parsePostfix() {
  let v = parsePrimary();
  while (peek() === '!') {
    next();
    if (v < 0 || !Number.isInteger(v)) throw new Error('Invalid factorial');
    v = factorial(v);
  }
  return v;
}

function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function parsePrimary() {
  const t = next();
  if (t === undefined) throw new Error('Incomplete expression');
  if (t === '(') {
    const v = parseExpr();
    if (next() !== ')') throw new Error('Missing bracket');
    return v;
  }
  if (t === 'pi') return Math.PI;
  if (t === 'e') return Math.E;
  if (/^\d+\.?\d*$/.test(t)) return parseFloat(t);
  if (t === 'sin' || t === 'cos' || t === 'tan' || t === 'ln' || t === 'log' || t === 'sqrt') {
    const v = parsePrimary();
    if (t === 'sin') return Math.sin(v);
    if (t === 'cos') return Math.cos(v);
    if (t === 'tan') return Math.tan(v);
    if (t === 'ln') return Math.log(v);
    if (t === 'log') return Math.log10(v);
    return Math.sqrt(v);
  }
  throw new Error('Invalid expression');
}

function evaluate(input) {
  tokenize(input);
  const val = parseExpr();
  if (pos !== tokens.length) throw new Error('Invalid expression');
  return val;
}

function fmt(v) {
  if (!isFinite(v)) return 'Error';
  if (Number.isInteger(v)) return String(v);
  const s = v.toPrecision(10);
  return String(parseFloat(s));
}

function refresh() {
  exprEl.textContent = expr || '0';
  resEl.innerHTML = '&nbsp;';
}

function compute() {
  try {
    const val = evaluate(expr);
    resEl.textContent = '= ' + fmt(val);
    resEl.classList.remove('error');
    pushHistory(expr, fmt(val));
  } catch (err) {
    resEl.textContent = err.message;
    resEl.classList.add('error');
  }
}

function pushHistory(e, r) {
  history.unshift({ exp: e, res: r });
  if (history.length > 30) history.pop();
  localStorage.setItem('calcore_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  document.getElementById('historyList').innerHTML = history.map(h => `
    <div class="history-item" data-res="${h.res}">
      <div class="h-exp">${esc(h.exp)}</div>
      <div class="h-res">${esc(h.res)}</div>
    </div>`).join('');
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      expr = item.dataset.res;
      refresh();
      try {
        const v = evaluate(expr);
        resEl.textContent = '= ' + fmt(v);
        resEl.classList.remove('error');
      } catch (err) {
        resEl.textContent = err.message;
        resEl.classList.add('error');
      }
    });
  });
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function handleKey(k) {
  if (k === 'AC') { expr = ''; resEl.textContent = '&nbsp;'; resEl.classList.remove('error'); refresh(); return; }
  if (k === 'del') { expr = expr.slice(0, -1); refresh(); return; }
  if (k === '=') { compute(); return; }
  if (k === 'x2') { compute(); expr = evaluate(expr) + '**2'; refresh(); return; }
  if (k === 'x3') { compute(); expr = evaluate(expr) + '**3'; refresh(); return; }
  if (k === 'fact') { compute(); expr = evaluate(expr) + '!'; refresh(); return; }
  if (k === 'sin' || k === 'cos' || k === 'tan' || k === 'ln' || k === 'log' || k === 'sqrt') {
    compute();
    expr = k + '(' + evaluate(expr) + ')';
    refresh();
    return;
  }

  const last = expr.slice(-1);
  const ops = ['+', '-', '*', '/', '%', '^'];
  if (k === '(' || k === ')' || k === 'pi' || k === 'e') {
    if (last && /[\d)]$/.test(last) && k === '(') expr += '*';
    expr += k === 'pi' ? 'pi' : k;
    refresh();
    return;
  }
  if (ops.includes(k)) {
    if (ops.includes(last)) expr = expr.slice(0, -1);
    else if (expr === '' || last === '(') { if (k !== '-') return; }
    expr += k;
    refresh();
    return;
  }
  if (k === '.') {
    const part = expr.split(/[+\-*/%^()]/).pop();
    if (part.includes('.')) return;
    if (part === '') expr += '0';
    expr += '.';
    refresh();
    return;
  }
  if (/^[0-9]$/.test(k)) {
    expr += k;
    refresh();
  }
}

function bindPad(root) {
  root.querySelectorAll('.key').forEach(b => {
    b.addEventListener('click', () => handleKey(b.dataset.k));
  });
}

bindPad(padEl);
bindPad(sciPadEl);

document.querySelectorAll('.mode').forEach(m => {
  m.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach(x => x.classList.remove('active'));
    m.classList.add('active');
    sciPadEl.classList.toggle('hidden', m.dataset.mode !== 'scientific');
  });
});

document.getElementById('historyBtn').addEventListener('click', () => {
  document.getElementById('historyPanel').classList.toggle('open');
});

document.getElementById('clearHistory').addEventListener('click', () => {
  history = [];
  localStorage.setItem('calcore_history', '[]');
  renderHistory();
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
});

document.addEventListener('keydown', e => {
  if (/^[0-9.]$/.test(e.key)) { handleKey(e.key); return; }
  if (e.key === 'Enter') { handleKey('='); return; }
  if (e.key === 'Backspace') { handleKey('del'); return; }
  if (e.key === 'Escape') { handleKey('AC'); return; }
  if (['+', '-', '*', '/', '%', '^', '(', ')'].includes(e.key)) { handleKey(e.key); return; }
});

renderHistory();
refresh();