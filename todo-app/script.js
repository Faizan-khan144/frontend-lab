let tasks = JSON.parse(localStorage.getItem('focus_tasks') || '[]');
let priority = 'high';
let filter = 'all';

const list = document.getElementById('taskList');
const input = document.getElementById('taskInput');

function save() {
  localStorage.setItem('focus_tasks', JSON.stringify(tasks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function render() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  let data = tasks.filter(t =>
    (filter === 'all' || (filter === 'active' ? !t.done : t.done)) &&
    (!q || t.text.toLowerCase().includes(q)));

  list.innerHTML = data.map(t => `
    <li class="task ${t.priority}" data-id="${t.id}">
      <button class="check ${t.done ? 'done' : ''}" data-action="toggle">${t.done ? '\u2713' : ''}</button>
      <span class="task-text ${t.done ? 'done' : ''}" data-action="edit">${esc(t.text)}</span>
      <span class="priority-label">${t.priority}</span>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit" title="Edit">\u270e</button>
        <button class="icon-btn danger" data-action="delete" title="Delete">\u2715</button>
      </div>
    </li>`).join('');

  const done = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressRing').style.background =
    `conic-gradient(var(--accent) ${pct}%, var(--line) 0%)`;
  document.getElementById('sTotal').textContent = tasks.length;
  document.getElementById('sActive').textContent = tasks.length - done;
  document.getElementById('sDone').textContent = done;
  document.getElementById('remainingLbl').textContent =
    `${tasks.length - done} task${tasks.length - done === 1 ? '' : 's'} remaining`;
  document.getElementById('emptyState').style.display = data.length ? 'none' : 'block';
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: uid(), text, priority, done: false });
  input.value = '';
  save();
  render();
  toast('Task added');
}

document.getElementById('addBtn').addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

document.querySelectorAll('.pr').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.pr').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    priority = b.dataset.p;
  });
});

list.addEventListener('click', e => {
  const li = e.target.closest('.task');
  if (!li) return;
  const task = tasks.find(t => t.id === li.dataset.id);
  if (!task) return;
  const action = e.target.dataset.action;
  if (action === 'toggle') {
    task.done = !task.done;
    save();
    render();
  } else if (action === 'delete') {
    li.classList.add('leaving');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
      toast('Task deleted');
    }, 250);
  } else if (action === 'edit') {
    startEdit(li, task);
  }
});

function startEdit(li, task) {
  const span = li.querySelector('.task-text');
  const old = task.text;
  span.contentEditable = 'true';
  span.classList.add('editing');
  span.focus();
  const range = document.createRange();
  range.selectNodeContents(span);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  function commit() {
    span.contentEditable = 'false';
    span.classList.remove('editing');
    const next = span.textContent.trim();
    if (next && next !== old) {
      task.text = next;
      save();
      toast('Task updated');
    } else {
      span.textContent = old;
    }
    render();
  }

  span.addEventListener('keydown', function kd(e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); span.removeEventListener('keydown', kd); }
    if (e.key === 'Escape') { span.textContent = old; commit(); span.removeEventListener('keydown', kd); }
  }, { once: true });
  span.addEventListener('blur', commit, { once: true });
}

document.querySelectorAll('.ftab').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    filter = b.dataset.f;
    render();
  });
});

document.getElementById('searchInput').addEventListener('input', render);

document.getElementById('clearDone').addEventListener('click', () => {
  const before = tasks.length;
  tasks = tasks.filter(t => !t.done);
  save();
  render();
  toast(before !== tasks.length ? `Cleared ${before - tasks.length} tasks` : 'Nothing to clear');
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = dark ? 'Dark' : 'Light';
});

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

render();