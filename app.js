const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let balance = 1000; // Начальный баланс
let myNfts = [
    { id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: true }
];
let currentNftId = null;
let pinnedCount = 0;

function send(data) { tg.sendData(JSON.stringify(data)); }

// --- НАВИГАЦИЯ ---
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    
    if (btn.dataset.tab === 'market') renderMarket();
    if (btn.dataset.tab === 'topup') renderTopup();
    if (btn.dataset.tab === 'profile') renderProfile();
  };
});

// --- ПРОФИЛЬ (Орбита) ---
function renderProfile() {
    document.getElementById('balance-game').innerText = balance + ' ⭐';
    
    // 1. Рисуем закрепленные NFT вокруг аватарки
    const orbit = document.getElementById('orbit-container');
    orbit.innerHTML = '';
    const pinned = myNfts.filter(n => n.pinned).slice(0, 6); // Максимум 6
    pinnedCount = pinned.length;

    pinned.forEach((nft, index) => {
        // Высчитываем позицию по кругу
        const angle = (index / pinned.length) * (Math.PI * 2);
        const radius = 70;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const el = document.createElement('div');
        el.className = `orbit-item ${nft.bg}`;
        // Вставляем эмодзи и сбрасываем вращение
        el.innerHTML = `<span style="transform: rotate(${-angle}rad);">${nft.emoji}</span>`;
        // Позиционируем
        el.style.transform = `translate(${x}px, ${y}px)`;
        orbit.appendChild(el);
    });

    // 2. Рисуем все NFT в сетку 3 в ряд
    const grid = document.getElementById('my-nfts');
    grid.innerHTML = '';
    myNfts.forEach(nft => {
        const div = document.createElement('div');
        div.className = `nft-card ${nft.bg}`;
        div.innerHTML = `<div class="emoji">${nft.emoji}</div><div class="name">#${nft.id}</div>`;
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
    document.getElementById('nft-preview-price').innerText = nft.upgraded ? 1000 : 100; // Номер 1 = 1000
    
    const bg = document.getElementById('nft-preview-bg');
    bg.className = `nft-bg-preview ${nft.bg}`;
    
    document.getElementById('modal-nft').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Улучшение (только 1 раз)
function upgradeNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft) return;
    if (nft.upgraded) {
        tg.showAlert('Этот NFT уже улучшен! Повторно нельзя.');
        return;
    }
    
    nft.upgraded = true;
    nft.bg = 'bg-black'; 
    nft.rarity = 'Легенда';
    
    tg.showAlert('✨ Улучшение успешно! Теперь он черный.');
    document.getElementById('nft-preview-bg').className = `nft-bg-preview ${nft.bg}`;
    renderProfile();
    send({ action: 'upgrade_nft', id: nft.id });
}

// Закрепление
function pinNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft) return;
    if (nft.pinned) {
        nft.pinned = false;
        tg.showAlert('📌 NFT откреплен от профиля.');
    } else {
        if (pinnedCount >= 6) {
            tg.showAlert('❌ Максимум 6 закрепленных NFT!');
            return;
        }
        nft.pinned = true;
        tg.showAlert('📌 NFT закреплен на профиле.');
    }
    renderProfile();
    closeModal('modal-nft');
}

function sellNft() { 
    const price = prompt("За сколько ⭐ вы хотите продать этот NFT?", "1000");
    if (price && !isNaN(price)) {
        send({ action: 'sell_nft', id: currentNftId, price: parseInt(price) });
        tg.showAlert(`✅ NFT выставлен на рынок за ${price}⭐`);
        closeModal('modal-nft');
    }
}

// --- РУЛЕТКА (Крутится, списание) ---
let isSpinning = false;
function spinWheel() {
    if (isSpinning) return;
    if (balance < 100) { tg.showAlert('❌ Недостаточно звезд!'); return; }
    
    isSpinning = true;
    balance -= 100;
    renderProfile();

    const wheel = document.getElementById('wheel');
    const btn = document.getElementById('spin-btn');
    btn.innerText = "Крутится...";
    
    // Чем больше кругов, тем больше шанс (для вида добавляем рандом)
    const extraDegrees = Math.floor(Math.random() * 360) + 1440; 
    wheel.style.transform = `rotate(${extraDegrees}deg)`;

    setTimeout(() => {
        btn.innerText = "Крутить (100⭐)";
        isSpinning = false;
        send({ action: 'spin_wheel' }); // Бот решит: выиграл или проиграл
    }, 4000);
}

// --- КЕЙСЫ (Списание и лента) ---
const CASES_DATA = [
  { id: 'basic', name: '🎁 Обычный', price: 100 },
  { id: 'gta6', name: '🚗 GTA 6', price: 500 },
];

function renderCases() {
  const grid = document.getElementById('cases-grid');
  grid.innerHTML = '';
  CASES_DATA.forEach(c => {
    const div = document.createElement('div');
    div.className = 'case-card';
    div.innerHTML = `<div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => startCaseOpening(c.id, c.name, c.price);
    grid.appendChild(div);
  });
}

function startCaseOpening(caseId, caseName, casePrice) {
    if (balance < casePrice) { tg.showAlert('❌ Недостаточно звезд!'); return; }
    if (!confirm(`Купить кейс ${caseName} за ${casePrice}⭐?`)) return;

    balance -= casePrice;
    renderProfile();

    document.getElementById('cases-grid').classList.add('hidden');
    document.getElementById('case-roll-container').classList.remove('hidden');

    // Рандомная лента
    const tape = document.getElementById('case-tape');
    tape.innerHTML = '';
    tape.style.transition = 'none';
    tape.style.transform = 'translateX(0)';
    
    const emojis = ['🧸', '🎩', '💍', '👑', '⭐', '🔫', '🚙'];
    for (let i = 0; i < 30; i++) {
        const item = document.createElement('div');
        item.className = 'tape-item';
        item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        tape.appendChild(item);
    }

    setTimeout(() => {
        tape.style.transition = 'transform 10s ease-out';
        tape.style.transform = 'translateX(-1200px)'; 
    }, 100);

    const delay = Math.floor(Math.random() * 5000) + 10000; 
    setTimeout(() => {
        document.getElementById('case-roll-container').classList.add('hidden');
        document.getElementById('case-result').classList.remove('hidden');
        
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        document.getElementById('case-result').innerHTML = `Вы выбили: <span style="font-size: 40px;">${randomEmoji}</span><br><small>Проверьте чат</small>`;
        
        // Визуально добавляем (реальное сохранение делает бот)
        const newId = myNfts.length > 0 ? Math.max(...myNfts.map(n => n.id)) + 1 : 1;
        myNfts.push({ id: newId, emoji: randomEmoji, name: 'Новый', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: false });
        renderProfile();

        send({ action: 'open_case', case_id: caseId });

        setTimeout(() => {
            document.getElementById('cases-grid').classList.remove('hidden');
            document.getElementById('case-result').classList.add('hidden');
        }, 3000);
    }, delay);
}

// --- РЫНОК STANDOFF 2 ---
function renderMarket() {
    const list = document.getElementById('market-list');
    list.innerHTML = '';
    const lots = [
        { id: 99, emoji: '👑', name: 'Корона', price: 5000, seller: '@user1', bg: 'bg-red' },
        { id: 100, emoji: '🚀', name: 'Ракета', price: 10000, seller: '@user2', bg: 'bg-black' }
    ];
    lots.forEach(lot => {
        const div = document.createElement('div');
        div.className = 'market-item';
        div.innerHTML = `
            <div class="nft-icon ${lot.bg}">${lot.emoji}</div>
            <div class="nft-details">
                <div style="font-weight:bold;">${lot.name} #${lot.id}</div>
                <div style="font-size:12px; color:gray;">${lot.seller}</div>
            </div>
            <div class="nft-price">${lot.price}⭐</div>
        `;
        div.onclick = () => {
            if (confirm(`Купить ${lot.name} за ${lot.price}⭐?`)) {
                if (balance >= lot.price) {
                    balance -= lot.price;
                    renderProfile();
                    send({ action: 'buy_nft', id: lot.id, price: lot.price });
                    tg.showAlert('✅ Куплено!');
                } else {
                    tg.showAlert('❌ Недостаточно средств!');
                }
            }
        };
        list.appendChild(div);
    });
}

// --- ПОПОЛНЕНИЕ ---
function renderTopup() {
    const grid = document.getElementById('topup-grid');
    grid.innerHTML = '';
    for (let i = 100; i <= 10000000; i *= 10) { // Упрощенно, для вида
        const btn = document.createElement('div');
        btn.className = 'card';
        btn.style.textAlign = 'center';
        btn.style.cursor = 'pointer';
        btn.innerHTML = `<b>${i} ⭐</b>`;
        btn.onclick = () => tg.showAlert('Напишите админу @vazikonov для покупки!');
        grid.appendChild(btn);
        if (i > 1000) i += 900; // Шаг 1000
    }
}

// --- ВВОД ТЕЛЕФОНА ---
function editPhone() {
    let phone = prompt("Введите номер (только цифры, начиная с +7):", "+7");
    if (phone) {
        if (!/^\+7\d+$/.test(phone)) {
            tg.showAlert("❌ Ошибка! Только цифры и начинается с +7.");
            return;
        }
        if (phone === "+999") {
            tg.showAlert("❌ Этот номер занят!");
            return;
        }
        document.getElementById('phone-display').innerText = "📞 " + phone;
        send({ action: 'update_phone', phone: phone });
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
renderCases();
renderProfile();
