import { openDB } from 'https://unpkg.com/idb?module';
const DB_NAME = 'retrochat', STORE = 'messages';
const API = location.origin + '/api';
let db, lastT = 0;

const box = document.getElementById('box');
const inp = document.getElementById('inp');
const btn = document.getElementById('btn');

// PWA install banner
const installBtn = document.getElementById('install');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  installBtn.style.display = 'inline-block';
  installBtn.onclick = () => e.prompt();
});

// open IndexedDB
async function initDB() {
  db = await openDB(DB_NAME, 1, { upgrade(d) { d.createObjectStore(STORE, { keyPath: 't' }); } });
  const local = await db.getAll(STORE);
  local.forEach(render);
  if (local.length) lastT = Math.max(...local.map(m => m.t));
  const remote = await (await fetch(API + '/history')).json();
  remote.forEach(m => store(m));
}
initDB();

// store locally
async function store(m) {
  const exists = await db.get(STORE, m.t);
  if (!exists) { await db.put(STORE, m); render(m); }
}

// render message
function render(m) {
  const d = document.createElement('div'); d.className = 'msg';
  d.innerHTML = `<span class="time">[${new Date(m.t).toLocaleTimeString()}]</span> <b>${m.u}</b>: ${m.m}`;
  box.appendChild(d); box.scrollTop = 1e9;
}

// send message
btn.onclick = async () => {
  const m = inp.value.trim(); if (!m) return;
  const body = { u: 'anon', m, t: Date.now() };
  await fetch(API + '/send', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  inp.value = '';
};

// Server-Sent Events for live sync
const sse = new EventSource(API + '/sse');
sse.onmessage = e => store(JSON.parse(e.data));
