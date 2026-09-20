const cities = ['Karachi', 'London', 'Tokyo', 'New York', 'Dubai', 'Sydney'];

const WEATHER_ICONS = {
  clear: '\u2600',
  partly: '\u26C5',
  cloudy: '\u2601',
  rain: '\u{1F327}',
  storm: '\u26C8',
  snow: '\u2603',
  fog: '\u{1F32B}'
};

let unit = 'c';

function parseCode(code) {
  if (code === 0) return { key: 'clear', label: 'Clear sky' };
  if (code <= 2) return { key: 'partly', label: 'Partly cloudy' };
  if (code === 3) return { key: 'cloudy', label: 'Overcast' };
  if ([45, 48].includes(code)) return { key: 'fog', label: 'Foggy' };
  if (code >= 95) return { key: 'storm', label: 'Thunderstorm' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { key: 'snow', label: 'Snowfall' };
  return { key: 'rain', label: 'Rainy' };
}

function themeFor(key) {
  if (key === 'clear' || key === 'partly') return 'sunny';
  if (key === 'cloudy' || key === 'fog') return 'cloudy';
  if (key === 'storm') return 'stormy';
  if (key === 'snow') return 'snowy';
  return 'rainy';
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 4000);
}

async function fetchWeather(lat, lon, cityLabel) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    render(data, cityLabel);
  } catch {
    showError('Could not load weather. Check your connection.');
  }
}

async function search(query) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  const data = await res.json();
  if (!data.results || !data.results.length) {
    showError(`No city found for "${query}".`);
    return;
  }
  const top = data.results[0];
  fetchWeather(top.latitude, top.longitude, top.name);
}

function render(data, label) {
  const cur = data.current;
  const w = parseCode(cur.weather_code);
  const t = cur.temperature_2m;

  document.getElementById('cityName').textContent = label;
  document.getElementById('weatherDesc').textContent = w.label;
  document.getElementById('bigTemp').textContent = convert(t) + '\u00b0';
  document.getElementById('feels').textContent = convert(cur.apparent_temperature) + '\u00b0';
  document.getElementById('humidity').textContent = cur.relative_humidity_2m + '%';
  document.getElementById('wind').textContent = Math.round(cur.wind_speed_10m);
  document.getElementById('pressure').textContent = Math.round(cur.surface_pressure);
  document.getElementById('condIcon').textContent = WEATHER_ICONS[w.key];
  document.body.className = themeFor(w.key);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = data.daily.time.map((d, i) => `
    <div class="day-card">
      <div class="day">${i === 0 ? 'Today' : days[new Date(d).getDay()]}</div>
      <div class="icon">${WEATHER_ICONS[parseCode(data.daily.weather_code[i]).key]}</div>
      <div class="hi">${convert(data.daily.temperature_2m_max[i])}\u00b0</div>
      <div class="lo">${convert(data.daily.temperature_2m_min[i])}\u00b0</div>
    </div>`).join('');
}

function convert(v) {
  return unit === 'c' ? Math.round(v) : Math.round(v * 9 / 5 + 32);
}

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('cityInput').value.trim();
  if (q) search(q);
});

document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'My Location'),
    () => showError('Could not find your location.')
  );
});

document.querySelectorAll('.unit').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.unit').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    unit = b.dataset.unit;
    const lat = 24.86, lon = 67.01;
    search(document.getElementById('cityName').textContent === 'My Location' ? 'Karachi' : document.getElementById('cityName').textContent || 'Karachi');
  });
});

fetchWeather(24.8607, 67.0011, 'Karachi');