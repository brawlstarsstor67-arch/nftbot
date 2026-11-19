const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let myNfts = [
    { id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', price: 50, bg: 'bg-green' },
    { id: 2, emoji: '🎩', name: 'Шляпа', rarity: 'Редкий', price: 100, bg: 'bg-blue' },
    { id: 3, emoji: '👑', name: 'Корона', rarity: 'Легенда', price: 500, bg: 'bg-black' }
];
let currentNftId = null;
let isSpinning = false;

function send(data) { tg.sendData(JSON.stringify(data)); }

// НАВИГАЦИЯ
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    
    if (btn.dataset.tab === 'market') renderMarket();
    if (btn.dataset.tab === 'profile') renderProfile();
  };
});

// --- ПРОФИЛЬ И ОРБИТА ---
function renderProfile() {
    const orbit = document.getElementById('orbit-container');
    orbit.innerHTML = '';
    myNfts.forEach((nft, index) => {
        const angle = (index / myNfts.length) * (Math.PI * 2);
        const radius = 70;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const el = document.createElement('div');
        el.className = 'orbit-item';
        el.innerText = nft.emoji;
        el.style.transform = `translate(${x}px, ${y}px)`;
        orbit.appendChild(el);
    });

    const grid = document.getElementById('my-nfts');
    grid.innerHTML = '';
    myNfts.forEach(nft => {
        const div = document.createElement('div');
        div.className = `nft-card ${nft.bg}`;
        div.innerHTML = `<div class="emoji">${nft.emoji}</div><div class="name">${nft.name}</div>`;
        div.onclick = () => openNftModal(nft);
        grid.appendChild(div);
    });
}

// --- МОДАЛЬНОЕ ОКНО NFT ---
function openNftModal(nft) {
    currentNftId = nft.id;
    document.getElementById('nft-preview-emoji').innerText = nft.emoji;
    document.getElementById('nft-preview-name').innerText = nft.name;
    document.getElementById('nft-preview-rarity').innerText = nft.rarity;
    document.getElementById('nft-preview-number').innerText = '#' + nft.id;
    document.getElementById('nft-preview-price').innerText = nft.price;
    
    const bg = document.getElementById('nft-preview-bg');
    bg.className = `nft-bg-preview ${nft.bg}`;
    
    document.getElementById('modal-nft').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function upgradeNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft) return;

    if (nft.bg === 'bg-black') {
        tg.showAlert('Этот NFT уже максимального уровня!');
        return;
    }

    // Меняем фон
    if (nft.bg === 'bg-green') { nft.bg = 'bg-blue'; nft.rarity = 'Редкий'; }
    else if (nft.bg === 'bg-blue') { nft.bg = 'bg-red'; nft.rarity = 'Эпик'; }
    else if (nft.bg === 'bg-red') { nft.bg = 'bg-black'; nft.rarity = 'Легенда'; }

    tg.showAlert('✨ Улучшение успешно!');
    closeModal('modal-nft');
    renderProfile();
    send({ action: 'upgrade_nft', id: nft.id }); // Отправляем боту для сохранения
}

function sellNft() { 
    const price = prompt("За сколько ⭐ вы хотите продать этот NFT?", "100");
    if (price && !isNaN(price)) {
        send({ action: 'sell_nft', id: currentNftId, price: parseInt(price) });
        tg.showAlert(`✅ NFT выставлен на рынок за ${price}⭐`);
        closeModal('modal-nft');
    }
}

// --- РЫНОК (Демо-лоты, пока нет сервера) ---
function renderMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    
    const lots = [
        { emoji: '👑', name: 'Корона', price: 5000, seller: 'user123', bg: 'bg-red' },
        { emoji: '🚀', name: 'Ракета', price: 10000, seller: 'user456', bg: 'bg-black' }
    ];
    
    lots.forEach(lot => {
        const div = document.createElement('div');
        div.className = `nft-card ${lot.bg}`;
        div.innerHTML = `
            <div class="emoji">${lot.emoji}</div>
            <div class="name">${lot.name}</div>
            <div style="font-size:10px; color:#aaa;">${lot.price}⭐</div>
        `;
        div.onclick = () => tg.showAlert(`Продавец: ${lot.seller}\nЦена: ${lot.price}⭐`);
        grid.appendChild(div);
    });
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
    div.innerHTML = `<div class="emoji">${c.name.split(' ')[0]}</div><div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => { 
        tg.showAlert(`Вы открыли кейс! (Проверьте Telegram)`);
        send({ action: 'open_case', case_id: c.id }); 
    };
    grid.appendChild(div);
  });
}

// --- РУЛЕТКА ---
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    
    const btn = document.getElementById('spin-btn');
    const wheel = document.getElementById('wheel-display');
    btn.innerText = "Крутится...";
    btn.style.opacity = "0.5";

    let count = 0;
    const interval = setInterval(() => {
        count++;
        wheel.style.transform = `rotate(${count * 45}deg)`;
        if (count > 10) {
            clearInterval(interval);
            btn.innerText = "Крутить (100⭐)";
            btn.style.opacity = "1";
            isSpinning = false;
            
            send({ action: 'spin_wheel' });
        }
    }, 100);
}

// --- ИНИЦИАЛИЗАЦИЯ ---
renderCases();
renderProfile();
