const tg = window.Telegram.WebApp;
tg.ready();

// === ГЛОБАЛЬНОЕ СОСТОЯНИЕ ===
const state = {
  balance: 0,
  stars: 0,
  nfts: [],
  friends: [],
  tab: 'roulette',
  theme: 'default',
  color: '#ffd700',
  upgProgress: 0.37, // 37%
  upgCost: 1200,
  upgTier: 1,
  inventory: [],
  market: []
};

// === ИНИЦИАЛИЗАЦИЯ ===
function init() {
  loadState();
  renderNav();
  go(state.tab || 'roulette');
  updateBalanceUI();
}

function loadState() {
  try {
    const saved = localStorage.getItem('nftcasino_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    } else {
      // демо-данные для первого запуска
      state.balance = 5000;
      state.nfts = [
        { id: 1, em: '💎', name: 'Базовый кристалл', rarity: 'Обычный', lvl: 1, power: 10 },
        { id: 2, em: '🔥', name: 'Пламя хаоса', rarity: 'Редкий', lvl: 2, power: 25 }
      ];
      state.inventory = [
        { em: '🎲', name: 'Кубик удачи', count: 3 },
        { em: '🎁', name: 'Кейс новичка', count: 2 }
      ];
    }
    saveState();
  } catch (e) {
    console.error('loadState', e);
  }
}

function saveState() {
  try {
    localStorage.setItem('nftcasino_v1', JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage full or blocked');
  }
}

// === НАВИГАЦИЯ И ОТРИСОВКА ===
function renderNav() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === state.tab);
  });
}

function go(tab) {
  state.tab = tab;
  renderNav();
  const view = document.getElementById('view');
  view.innerHTML = '';
  switch (tab) {
    case 'roulette': view.appendChild(rouletteScreen()); break;
    case 'cases':   view.appendChild(casesScreen()); break;
    case 'market':  view.appendChild(marketScreen()); break;
    case 'inv':     view.appendChild(inventoryScreen()); break;
    case 'upg':     view.appendChild(upgraderScreen()); break;
    case 'prof':    view.appendChild(profileScreen()); break;
    default:        view.appendChild(rouletteScreen());
  }
  // применить тему
  document.body.className = '';
  if (state.theme !== 'default') {
    document.body.classList.add(`theme-${state.theme}`);
  }
}

// === БАЛАНС И ПОПОЛНЕНИЕ ===
function updateBalanceUI() {
  const el = document.getElementById('bal');
  if (el) el.textContent = Math.floor(state.balance).toLocaleString();
}

function toggleStarsPicker() {
  const p = document.getElementById('stars-picker');
  p.classList.toggle('show');
}

function buyPackOpen(starsCount) {
  // Здесь будет вызов бота для оплаты звёздами
  // Для Pydroid 3 и локального теста просто начислим
  state.balance += starsCount;
  saveState();
  updateBalanceUI();
  toggleStarsPicker();
  showToast(`+${starsCount} ⭐`);
}

function claimPromo() {
  const code = document.getElementById('promo').value.trim();
  if (!code) return showToast('Введите код');
  // Заглушка валидации
  state.balance += 500;
  saveState();
  updateBalanceUI();
  document.getElementById('promo').value = '';
  showToast('Промокод активирован: +500 ⭐');
}

function setColor(c) {
  state.color = c;
  saveState();
  document.documentElement.style.setProperty('--accent', c);
  showToast(`Цвет: ${c}`);
}

function toggleColorPicker() {
  document.getElementById('color-picker').classList.toggle('show');
}

function setTheme(t) {
  state.theme = t;
  saveState();
  go(state.tab); // перерисовать с новой темой
  showToast(`Тема: ${t}`);
}

function toggleThemePicker() {
  document.getElementById('theme-picker').classList.toggle('show');
}

// === РУЛЕТКА ===
function rouletteScreen() {
  const container = document.createElement('div');
  container.className = 'card';
  container.innerHTML = `
    <h3>🎰 Рулетка</h3>
    <p>Ставка: <b>${state.balance.toLocaleString()} ⭐</b></p>
    <div class="slot">
      <span id="r1">🎲</span>
      <span id="r2">🎲</span>
      <span id="r3">🎲</span>
    </div>
    <button class="ok-btn" onclick="spinRoulette()">КРУТИТЬ</button>
    <p class="muted">Шанс выигрыша зависит от редкости твоего NFT-статуса.</p>
  `;
  return container;
}

async function spinRoulette() {
  if (state.balance < 100) return showToast('Недостаточно средств');
  state.balance -= 100;
  saveState();
  updateBalanceUI();

  const reels = document.querySelectorAll('#r1,#r2,#r3');
  reels.forEach(r => r.classList.add('pop'));
  await new Promise(r => setTimeout(r, 200));

  // Простая логика: 3 одинаковых — большой выигрыш, 2 — средний, иначе проигрыш
  const icons = ['🎲','💎','🔥','⚡','⭐','🎱','🃏','🍀'];
  const res = icons.map(i => i[Math.floor(Math.random() * i.length)]);
  for (let i = 0; i < 3; i++) {
    reels[i].textContent = res[i];
  }

  let win = 0;
  if (res[0] === res[1] && res[1] === res[2]) win = 800;
  else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) win = 250;

  if (win) {
    state.balance += win;
    saveState();
    updateBalanceUI();
    showToast(`Выигрыш: ${win} ⭐`);
  } else {
    showToast('Попробуй ещё раз');
  }
}

// === КЕЙСЫ ===
function casesScreen() {
  const container = document.createElement('div');
  container.className = 'card';
  const cases = [
    { em: '📦', name: 'Новичок', cost: 500, odds: { Обычный: 70, Редкий: 25, Эпический: 5 } },
    { em: '💼', name: 'Профи', cost: 1500, odds: { Редкий: 60, Эпический: 30, Легендарный: 10 } },
    { em: '👑', name: 'Легенда', cost: 4000, odds: { Эпический: 40, Легендарный: 45, Мифический: 15 } }
  ];
  let html = `<h3>🎁 Кейсы</h3><p>Баланс: ${state.balance.toLocaleString()} ⭐</p>`;
  cases.forEach(c => {
    html += `
      <div class="case-card" onclick="openCase('${c.name}')">
        <div class="em">${c.em}</div>
        <div class="nm">${c.name}</div>
        <div class="pr">${c.cost.toLocaleString()} ⭐</div>
      </div>
    `;
  });
  container.innerHTML = html;
  return container;
}

function openCase(name) {
  const costs = { 'Новичок': 500, 'Профи': 1500, 'Легенда': 4000 };
  const cost = costs[name] || 500;
  if (state.balance < cost) return showToast('Не хватает средств');

  state.balance -= cost;
  saveState();
  updateBalanceUI();

  // Определение редкости по весам
  const odds = {
    'Новичок': { Обычный: 70, Редкий: 25, Эпический: 5 },
    'Профи': { Редкий: 60, Эпический: 30, Легендарный: 10 },
    'Легенда': { Эпический: 40, Легендарный: 45, Мифический: 15 }
  };
  const weights = odds[name];
  const total = Object.values(weights).reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  let rarity = '';
  for (const [k,v] of Object.entries(weights)) {
    if (r < v) { rarity = k; break; }
    r -= v;
  }

  const emojis = {
    Обычный: '💎', Редкий: '🔥', Эпический: '⚡', Легендарный: '✨', Мифический: '🌙'
  };
  const names = {
    Обычный: 'Кристалл', Редкий: 'Пламя', Эпический: 'Молния', Легендарный: 'Звезда', Мифический: 'Луна'
  };

  const nft = {
    id: Date.now(),
    em: emojis[rarity],
    name: names[rarity] + ' #' + Math.floor(Math.random()*1000),
    rarity: rarity,
    lvl: 1,
    power: Math.floor(Math.random()*(rarity === 'Мифический' ? 100 : 50)) + 10
  };
  state.nfts.push(nft);
  saveState();
  showToast(`Кейс открыт: ${nft.em} ${nft.name} (${nft.rarity})`);
  go('inv');
}

// === ИНВЕНТАРЬ ===
function inventoryScreen() {
  const container = document.createElement('div');
  container.className = 'card';
  let html = `<h3>💎 Инвентарь</h3>`;
  if (state.nfts.length === 0) html += `<p class="muted">Инвентарь пуст. Открой кейс!</p>`;
  state.nfts.forEach(n => {
    html += `
      <div class="nft-hero ${'bg-' + n.rarity.toLowerCase()}">
        <span class="serial-badge">#${n.id % 1000}</span>
        <span class="rare-badge">${n.rarity}</span>
        <div class="nft-emoji floaty">${n.em}</div>
        <div class="nft-title">${n.name}</div>
        <div class="nft-sub">Уровень: ${n.lvl} | Сила: ${n.power}</div>
        <div class="hero-row">
          <button class="btn-glass" onclick="setStatus(${n.id})">Закрепить</button>
          <button class="btn-glass" onclick="sellNFT(${n.id})">Продать</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  return container;
}

function setStatus(id) {
  const nft = state.nfts.find(n => n.id === id);
  if (!nft) return;
  // Тут можно отправлять запрос боту на установку статуса
  showToast('Статус закреплён (заглушка)');
}

function sellNFT(id) {
  const idx = state.nfts.findIndex(n => n.id === id);
  if (idx === -1) return;
  const nft = state.nfts[idx];
  const price = Math.floor(nft.power * 1.5) * 10; // примерная формула
  state.balance += price;
  state.nfts.splice(idx, 1);
  saveState();
  updateBalanceUI();
  showToast(`Продано: ${nft.name} за ${price} ⭐`);
  go('inv');
}

// === АПГРЕЙДЕР ===
function upgraderScreen() {
  const container = document.createElement('div');
  container.className = 'upg2';
  const percent = Math.min(100, state.upgProgress * 100);
  container.innerHTML = `
    <div class="upg2-title">⬆️ Апгрейдер</div>
    <div class="upg2-icons">⚡⚡⚡</div>
    <div class="upg2-ringwrap">
      <svg class="upg2-svg" viewBox="0 0 230 230">
        <circle class="upg2-track" cx="115" cy="115" r="95"></circle>
        <path class="upg2-arc" d="M115 20A95 95 0 ${percent>0?1:0} 1 ${115+95*Math.sin(percent*Math.PI/180)} ${115-95*Math.cos(percent*Math.PI/180)}"></path>
        <circle class="upg2-inner" cx="115" cy="115" r="80"></circle>
      </svg>
      <div class="upg2-pct">${Math.floor(percent)}%<span>до следующего уровня</span></div>
      <div class="upg2-tick l">0%</div>
      <div class="upg2-tick r">100%</div>
      <div class="upg2-tick top">50%</div>
    </div>
    <div class="upg2-cards">
      <div class="upg2-item">
        <div class="cat">Энергия</div>
        <div class="nm">⚡ Энергия</div>
        <div class="em">⚡</div>
        <div class="pr">+15% к шансу</div>
      </div>
      <div class="upg2-item">
        <div class="cat">Удача</div>
        <div class="nm">🍀 Удача</div>
        <div class="em">🍀</div>
        <div class="pr">+10% к награде</div>
      </div>
    </div>
    <button class="upg2-btn" onclick="upgrade()">УЛУЧШИТЬ ЗА ${state.upgCost.toLocaleString()} ⭐</button>
    <p class="muted">При неудаче часть прогресса сгорает. Риск — часть игры.</p>
  `;
  return container;
}

function upgrade() {
  if (state.balance < state.upgCost) return showToast('Не хватает средств');
  state.balance -= state.upgCost;
  saveState();
  updateBalanceUI();

  // 65% шанс успеха
  const success = Math.random() < 0.65;
  if (success) {
    state.upgProgress = Math.min(1, state.upgProgress + 0.25);
    state.upgTier++;
    state.upgCost = Math.floor(state.upgCost * 1.4);
    showToast('Успех! Прогресс увеличен.');
  } else {
    state.upgProgress = Math.max(0, state.upgProgress - 0.15);
    showToast('Неудача… Прогресс уменьшен.');
  }
  saveState();
  go('upg');
}

// === ПРОФИЛЬ ===
function profileScreen() {
  const container = document.createElement('div');
  container.className = 'tg-hero';
  // Имитация аватара Telegram
  const avatarHtml = `
    <div class="tg-avatar-ring">
      <div class="ph">��
      
