const tracks = [
  {
    name: 'Neon Nights', artist: 'Pulsewave Collective', bpm: 122,
    art: 'linear-gradient(135deg,#ff3f7f,#3a2a9c)', key: 'A',
    melody: ['A4', null, 'C5', null, 'A4', 'E5', null, 'D5', 'C5', null, 'B4', null, 'G4', 'A4', null, 'E5'],
    bass: ['A2', null, null, null, null, 'A2', null, null, 'F2', null, 'G2', null, null, 'G2', 'E2', null]
  },
  {
    name: 'Midnight Drive', artist: 'Lofi Lane', bpm: 88,
    art: 'linear-gradient(135deg,#00e5a9,#0b4f6c)', key: 'C',
    melody: ['C5', 'E5', null, 'G5', 'E5', null, 'D5', 'C5', null, 'A4', null, 'C5', 'E5', null, 'D5', 'C5'],
    bass: ['C3', null, null, 'G2', null, null, 'A2', null, null, 'F2', null, null, 'C3', null, 'G2', null]
  },
  {
    name: 'Solar Flare', artist: 'Retro Horizon', bpm: 100,
    art: 'linear-gradient(135deg,#ffb020,#ff3f7f)', key: 'F',
    melody: ['F4', 'Ab4', 'C5', null, 'Eb5', null, 'C5', 'Ab4', 'F4', null, 'Ab4', 'C5', null, 'D5', 'C5', 'Ab4'],
    bass: ['F2', null, 'F2', null, 'Eb2', null, 'Eb2', null, 'Db2', null, null, 'Db2', null, 'C2', null, 'C2']
  }
];

const freqMap = {};
(function initFreq() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let o = 1; o <= 6; o++) {
    for (let i = 0; i < 12; i++) {
      const midi = (o + 1) * 12 + i;
      freqMap[notes[i] + o] = 440 * Math.pow(2, (midi - 69) / 12);
    }
  }
})();

let audioCtx = null;
let analyser = null;
let master = null;
let timer = null;
let currentTime = 0;
let nextStep = 0;
let stepIndex = 0;
let trackIndex = 0;
let playing = false;

function ctx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = parseFloat(document.getElementById('volume').value);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    master.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  return audioCtx;
}

function playNote(freq, when, dur, type, gain, pan) {
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const p = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  if (p) { g.connect(p); p.connect(master); } else g.connect(master);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function stepDur() {
  return 60 / tracks[trackIndex].bpm / 2;
}

function scheduler() {
  const track = tracks[trackIndex];
  const sd = stepDur();
  const loopDur = sd * 16;
  while (nextStep < currentTime + 0.12) {
    const step = stepIndex % 16;
    const when = nextStep;
    const m = track.melody[step];
    if (m) playNote(freqMap[m], when, sd * 0.9, 'square', 0.11);
    if (step % 2 === 0) {
      const b = track.bass[step];
      if (b) playNote(freqMap[b], when, sd * 1.7, 'sawtooth', 0.15);
    }
    playNote(110, when, 0.02, 'sine', 0.05, 0);
    nextStep += sd;
    stepIndex++;
    if (stepIndex % 16 === 0) nextStep = currentTime;
  }
}

function tick() {
  currentTime = audioCtx.currentTime;
  scheduler();
  const sd = stepDur();
  const loopDur = sd * 16;
  let pos = ((audioCtx.currentTime - (nextStep - loopDur * 0.015)) % loopDur + loopDur) % loopDur;
  if (pos < 0) pos += loopDur;
  document.getElementById('seekFill').style.width =
    ((pos % loopDur) / loopDur) * 100 + '%';
  document.getElementById('curTime').textContent = fmt(((pos % loopDur) / loopDur) * 240);
  drawViz();
}

function fmt(s) {
  s = Math.floor(s);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function drawViz() {
  const canvas = document.getElementById('visualizer');
  const g = canvas.getContext('2d');
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  g.clearRect(0, 0, canvas.width, canvas.height);
  const bars = 40;
  for (let i = 0; i < bars; i++) {
    const idx = Math.floor(i / bars * data.length);
    const h = playing ? (data[idx] / 255) * canvas.height * 1.1 : 4;
    const x = (i / bars) * canvas.width;
    const grad = g.createLinearGradient(x, canvas.height, x, canvas.height - h);
    grad.addColorStop(0, '#ff3f7f');
    grad.addColorStop(1, '#00e5a9');
    g.fillStyle = grad;
    g.fillRect(x + 2, canvas.height - h, canvas.width / bars - 4, h);
  }
}

function start() {
  ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  currentTime = audioCtx.currentTime + 0.1;
  nextStep = currentTime;
  timer = setInterval(tick, 40);
}

function play() {
  start();
  playing = true;
  document.getElementById('playBtn').classList.add('playing');
  document.getElementById('vinyl').classList.add('spinning');
  document.querySelector('.eq').classList.add('playing');
}

function pause() {
  clearInterval(timer);
  playing = false;
  master.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.02);
  setTimeout(() => { master.gain.setTargetAtTime(parseFloat(document.getElementById('volume').value), audioCtx.currentTime, 0.02); }, 250);
  document.getElementById('playBtn').classList.remove('playing');
  document.getElementById('vinyl').classList.remove('spinning');
  document.querySelector('.eq').classList.remove('playing');
}

function switchTrack(dir) {
  const wasPlaying = playing;
  clearInterval(timer);
  playing = false;
  trackIndex = (trackIndex + dir + tracks.length) % tracks.length;
  stepIndex = 0;
  renderTrack();
  if (wasPlaying) play();
}

function renderTrack() {
  const t = tracks[trackIndex];
  document.getElementById('trackName').textContent = t.name;
  document.getElementById('trackArtist').textContent = t.artist;
  document.getElementById('vinylLabel').textContent = t.key;
  document.getElementById('vinylLabel').style.background =
    `conic-gradient(from 40deg, ${t.art === tracks[0].art ? '#ff3f7f' : t.art === tracks[1].art ? '#00e5a9' : '#ffb020'}, #222)`;
  document.getElementById('totalTime').textContent = '0:20';
  document.getElementById('seekFill').style.width = '0%';
  renderPlaylist();
}

function renderPlaylist() {
  const pl = document.getElementById('playlist');
  pl.innerHTML = tracks.map((t, i) => `
    <div class="playlist-item ${i === trackIndex ? 'active' : ''}" data-i="${i}">
      <div class="pl-art" style="background:${t.art}">${t.key}</div>
      <div class="pl-info">
        <strong>${t.name}</strong>
        <span>${t.artist}</span>
      </div>
      <span class="pl-time">0:20</span>
    </div>`).join('');
  pl.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      if (+item.dataset.i !== trackIndex) {
        trackIndex = +item.dataset.i;
        renderTrack();
        if (playing) { clearInterval(timer); playing = false; }
      }
      play();
    });
  });
}

document.getElementById('playBtn').addEventListener('click', () => playing ? pause() : play());
document.getElementById('prevBtn').addEventListener('click', () => switchTrack(-1));
document.getElementById('nextBtn').addEventListener('click', () => switchTrack(1));
document.getElementById('volume').addEventListener('input', e => {
  if (master) master.gain.setTargetAtTime(parseFloat(e.target.value), audioCtx.currentTime, 0.03);
});

document.getElementById('eqDots').innerHTML = '<span></span><span></span><span></span><span></span><span></span>';

renderTrack();