const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let userBalance = 0;
let isSpinning = false;
let currentCaseId = null;

function send(data) { tg.sendData(JSON.stringify(data)); }

// НАВИГАЦИЯ
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  };
});

// КЕЙСЫ (Данные для предпросмотра)
const CASES_DATA = [
  { id: 'basic', name: '🎁 Обычный', price: 100, items: '🧸 Мишка (40%), 💍 Кольцо (30%), 🎩 Шляпа (20%), ⭐ Звезда (9.99%), 👑 Корона (0.01%)' },
  { id: 'adult', name: '🔞 18+', price: 1000, items: '👅 Язык (50%), 👙 Купальник (30%), 🚬 Сигарета (15%), 🔞 Знак (4.99%), 👯 Танцор (0.01%)' },
  { id: 'newyear', name: '🎄 Новый год', price: 300, items: '🎄 Ёлка (45%), ⛄ Снеговик (30%), 🎁 Подарок (18%), ❄️ Снежинка (6.99%), 🎅 Дед Мороз (0.01%)' },
];

function renderCases() {
  const grid = document.getElementById('cases-grid');
  grid.innerHTML = '';
  CASES_DATA.forEach(c => {
    const div = document.createElement('div');
    div.className = 'case-card';
    div.innerHTML = `<div class="emoji">${c.name.split(' ')[0]}</div><div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => openCasePreview(c);
    grid.appendChild(div);
  });
}

function openCasePreview(c) {
  currentCaseId = c.id;
  document.getElementById('modal-case-title').innerText = c.name;
  document.getElementById('modal-case-items').innerText = c.items;
  document.getElementById('modal-case').classList.remove('hidden');
}

function buyCase() {
  send({ action: 'open_case', case_id: currentCaseId, count: 1 });
  closeModal('modal-case');
}

// NFT ИНТЕРФЕЙС
function openNftInterface(nft) {
  document.getElementById('nft-icon').innerText = nft.emoji;
  document.getElementById('nft-name').innerText = nft.name;
  document.getElementById('nft-rarity').innerText = nft.rarity;
  document.getElementById('nft-number').innerText = '#' + nft.id;
  document.getElementById('nft-price').innerText = nft.price;
  document.getElementById('modal-nft').classList.remove('hidden');
}

function upgradeNft() { send({ action: 'upgrade_nft' }); closeModal('modal-nft'); }
function sellNft() { send({ action: 'sell_nft' }); closeModal('modal-nft'); }

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// РУЛЕТКА
function spinWheel() {
  if (isSpinning) return;
  if (userBalance < 100) { tg.showAlert('❌ Недостаточно звезд!'); return; }
  isSpinning = true;
  let rot = 0;
  const wheel = document.getElementById('wheel-display');
  const int = setInterval(() => { rot += 45; wheel.style.transform = `rotate(${rot}deg)`; }, 50);
  send({ action: 'spin_wheel' });
  setTimeout(() => { clearInterval(int); isSpinning = false; }, 2000);
}

// ИНИЦИАЛИЗАЦИЯ
renderCases();
send({ action: 'check_balance' });
