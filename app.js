const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let myNfts = []; // Сюда бот пришлет твои NFT (пока имитируем)
let currentNftId = null;

function send(data) { tg.sendData(JSON.stringify(data)); }

// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    
    if (btn.dataset.tab === 'market') send({ action: 'get_market' });
    if (btn.dataset.tab === 'profile') renderProfile();
  };
});

// --- ОТРИСОВКА ПРОФИЛЯ И КРУЖАЩИХ NFT ---
function renderProfile() {
    // Имитация: создаем 3 NFT для орбиты
    myNfts = [
        { id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', price: 50 },
        { id: 2, emoji: '🎩', name: 'Шляпа', rarity: 'Редкий', price: 100 },
        { id: 3, emoji: '👑', name: 'Корона', rarity: 'Легенда', price: 500 }
    ];
    
    const orbit = document.getElementById('orbit-container');
    orbit.innerHTML = '';
    
    // Ставим иконки по кругу
    myNfts.forEach((nft, index) => {
        const angle = (index / myNfts.length) * (Math.PI * 2);
        const radius = 70; // радиус круга
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const el = document.createElement('div');
        el.className = 'orbit-item';
        el.innerText = nft.emoji;
        el.style.transform = `translate(${x}px, ${y}px)`;
        orbit.appendChild(el);
    });

    // Отрисовка карточек в профиле
    const grid = document.getElementById('my-nfts');
    grid.innerHTML = '';
    myNfts.forEach(nft => {
        const div = document.createElement('div');
        div.className = 'nft-card bg-green'; // Пока зеленый фон
        div.innerHTML = `<div class="emoji">${nft.emoji}</div><div class="name">${nft.name}</div>`;
        div.onclick = () => openNftModal(nft);
        grid.appendChild(div);
    });
}

// --- ОТКРЫТИЕ ОКНА NFT ---
function openNftModal(nft) {
    currentNftId = nft.id;
    document.getElementById('nft-preview-emoji').innerText = nft.emoji;
    document.getElementById('nft-preview-name').innerText = nft.name;
    document.getElementById('nft-preview-rarity').innerText = nft.rarity;
    document.getElementById('nft-preview-number').innerText = '#' + nft.id;
    document.getElementById('nft-preview-price').innerText = nft.price;
    
    // Красим фон в зависимости от редкости
    const bg = document.getElementById('nft-preview-bg');
    bg.className = 'nft-bg-preview bg-green'; // По умолчанию
    if(nft.rarity === 'Редкий') bg.className = 'nft-bg-preview bg-blue';
    if(nft.rarity === 'Легенда' || nft.rarity === 'Эпик') bg.className = 'nft-bg-preview bg-red';
    
    document.getElementById('modal-nft').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function upgradeNft() { 
    tg.showAlert('✨ Вы пытаетесь улучшить NFT! Бот обработает запрос.');
    send({ action: 'upgrade_nft', id: currentNftId }); 
    closeModal('modal-nft'); 
}

function sellNft() { 
    const price = prompt("За сколько ⭐ вы хотите продать этот NFT?", "100");
    if (price && !isNaN(price)) {
        send({ action: 'sell_nft', id: currentNftId, price: parseInt(price) });
        tg.showAlert(`✅ NFT выставлен на рынок за ${price}⭐`);
        closeModal('modal-nft');
    }
}

// --- КЕЙСЫ ---
const CASES_DATA = [
  { id: 'basic', name: '🎁 Обычный', price: 100 },
  { id: 'adult', name: '🔞 18+', price: 1000 },
  { id: 'newyear', name: '🎄 Новый год', price: 300 },
];
function renderCases() {
  const grid = document.getElementById('cases-grid');
  grid.innerHTML = '';
  CASES_DATA.forEach(c => {
    const div = document.createElement('div');
    div.className = 'case-card';
    div.innerHTML = `<div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => { 
        if(confirm(`Купить кейс ${c.name} за ${c.price}⭐?`)) {
            send({ action: 'open_case', case_id: c.id }); 
        }
    };
    grid.appendChild(div);
  });
}

// --- РУЛЕТКА ---
function spinWheel() { send({ action: 'spin_wheel' }); }

// --- ИНИЦИАЛИЗАЦИЯ ---
renderCases();
renderProfile();
send({ action: 'check_balance' });
