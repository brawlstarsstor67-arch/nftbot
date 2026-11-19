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
    if (tab === 'market') loadMarket(document.querySelector('#market-filters .active')?.textContent || 'Мишка');
  };
});

/* ===== КЕЙСЫ (с предпросмотром) ===== */
const CASES = [
  { id: 'basic', name: 'Обычный', emoji: '🎁', price: 100, items: '🧸 Мишка, 💍 Кольцо, 🎩 Шляпа, ⭐ Звезда, 👑 Корона' },
  { id: 'adult', name: '18+', emoji: '🔞', price: 1000, items: '👅 Язык, 👙 Купальник, 🚬 Сигарета, 🔞 Знак, 👯 Танцор' },
  { id: 'newyear', name: 'Новый год', emoji: '🎄', price: 300, items: '🎄 Ёлка, ⛄ Снеговик, 🎁 Подарок, ❄️ Снежинка, 🎅 Дед Мороз' },
  { id: 'gta6', name: 'GTA 6', emoji: '🚗', price: 500, items: '🔫 Пистолет, 🚙 Тачка, 💵 Деньги, 🚁 Вертолёт, 🏰 Особняк' },
  { id: 'cny', name: 'Кит. НГ', emoji: '🐉', price: 400, items: '🏮 Фонарь, 🐼 Панда, 🐉 Дракон, 🪙 Монета, 👑 Император' },
  { id: 'rich', name: 'Богатый', emoji: '💎', price: 100000000, items: '💎 Алмаз, 👑 Корона, 🚀 Ракета, 💠 Джекпот' },
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
      if (confirm(`Кейс "${c.name}" за ${c.price}⭐\n\nВозможные подарки:\n${c.items}\n\nОткрыть?`)) {
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
  // Демо-карточки (пока бот не пришлёт реальные)
  grid.innerHTML = `
    <div class="nft-card bg-blue">
      <div class="emoji">🧸</div>
      <div class="name">Мишка</div>
      <div class="number">#1</div>
      <div class="price-tag">100⭐</div>
      <button class="btn small" style="margin-top:8px;" onclick="alert('Написать продавцу')">💬</button>
      <button class="btn small" style="margin-top:4px;" onclick="alert('Купить за 100⭐')">🛒</button>
    </div>
  `;
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
