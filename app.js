const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.setHeaderColor('#232e3c');
tg.setBackgroundColor('#17212b');

const USER_ID = tg.initDataUnsafe?.user?.id || 0;

function send(data) {
  tg.sendData(JSON.stringify(data));
}

/* ===== НАВИГАЦИЯ ===== */
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
  };
});

/* ===== КЕЙСЫ ===== */
const CASES = [
  { id: 'basic',   name: 'Обычный',  emoji: '🎁', price: 100 },
  { id: 'adult',   name: '18+',      emoji: '🔞', price: 1000 },
  { id: 'newyear', name: 'Новый год', emoji: '🎄', price: 300 },
  { id: 'gta6',    name: 'GTA 6',    emoji: '🚗', price: 500 },
  { id: 'cny',     name: 'Кит. НГ',  emoji: '🐉', price: 400 },
  { id: 'rich',    name: 'Богатый',  emoji: '💎', price: 100000000 },
];

function renderCases() {
  const grid = document.getElementById('cases-grid');
  grid.innerHTML = '';
  CASES.forEach(c => {
    const div = document.createElement('div');
    div.className = 'case-card';
    div.innerHTML = `
      <div class="emoji">${c.emoji}</div>
      <div class="name">${c.name}</div>
      <div class="price">${c.price.toLocaleString()}⭐</div>
    `;
    div.onclick = () => {
      if (confirm(`Открыть ${c.name} за ${c.price}⭐?`)) {
        send({ action: 'open_case', case_id: c.id, count: 1 });
      }
    };
    grid.appendChild(div);
  });
}

/* ===== РЫНОК ===== */
const NFT_TYPES = ['Мишка', 'Кольцо', 'Шляпа', 'Звезда', 'Ракета', 'Корона'];

function renderMarketFilters() {
  const wrap = document.getElementById('market-filters');
  wrap.innerHTML = '';
  NFT_TYPES.forEach((t, i) => {
    const b = document.createElement('button');
    b.textContent = t;
    if (i === 0) b.classList.add('active');
    b.onclick = () => {
      document.querySelectorAll('#market-filters button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      loadMarket(t);
    };
    wrap.appendChild(b);
  });
}

function loadMarket(type) {
  const grid = document.getElementById('market-grid');
  grid.innerHTML = `<div class="card">Загрузка «${type}»...</div>`;
  send({ action: 'market_list', type });
}

/* ===== ПРОФИЛЬ ===== */
function saveUz() {
  const text = document.getElementById('uz-input').value.trim();
  if (!text) return;
  send({ action: 'update_uz', text });
}

/* ===== ИНИЦИАЛИЗАЦИЯ ===== */
renderCases();
renderMarketFilters();

send({ action: 'check_balance' });
