const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let balance = 999999999; 
let myNfts = [
    { id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: true }
];
let currentNftId = null;
let pinnedCount = 0;
let currentSelectedCase = null;

// ФЕЙКОВЫЙ ФЛАГ АДМИНА (в реальности приходит от бота, но для визуала ок)
const isAdmin = true; 

function send(data) { tg.sendData(JSON.stringify(data)); }

// НАВИГАЦИЯ
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

// --- ПРОФИЛЬ ---
function renderProfile() {
    document.getElementById('balance-game').innerText = balance + ' ⭐';
    
    const orbit = document.getElementById('orbit-container');
    orbit.innerHTML = '';
    const pinned = myNfts.filter(n => n.pinned).slice(0, 6); 
    pinnedCount = pinned.length;

    pinned.forEach((nft, index) => {
        const angle = (index / pinned.length) * (Math.PI * 2);
        const radius = 70;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const el = document.createElement('div');
        el.className = `orbit-item ${nft.bg}`;
        el.innerHTML = `<span style="transform: rotate(${-angle}rad);">${nft.emoji}</span>`;
        el.style.transform = `translate(${x}px, ${y}px)`;
        orbit.appendChild(el);
    });

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
    document.getElementById('nft-preview-price').innerText = nft.upgraded ? 1000 : 100;
    
    const bg = document.getElementById('nft-preview-bg');
    bg.className = `nft-bg-preview ${nft.bg}`;

    // Показываем кнопку админа
    document.querySelector('.admin-only').style.display = isAdmin ? 'block' : 'none';
    
    document.getElementById('modal-nft').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function upgradeNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft || nft.upgraded) { tg.showAlert('Этот NFT уже улучшен!'); return; }
    
    nft.upgraded = true;
    nft.bg = 'bg-black'; 
    nft.rarity = 'Легенда';
    
    tg.showAlert('✨ Улучшение успешно!');
    document.getElementById('nft-preview-bg').className = `nft-bg-preview ${nft.bg}`;
    renderProfile();
    send({ action: 'upgrade_nft', id: nft.id });
}

function pinNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft) return;
    if (nft.pinned) {
        nft.pinned = false;
        tg.showAlert('📌 NFT откреплен.');
    } else {
        if (pinnedCount >= 6) { tg.showAlert('❌ Максимум 6 закрепленных NFT!'); return; }
        nft.pinned = true;
        tg.showAlert('📌 NFT закреплен.');
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

// --- ВЫБОР ЦВЕТА (АДМИН) ---
function openColorPicker() {
    const grid = document.getElementById('color-picker-grid');
    grid.innerHTML = '';
    
    // Все доступные цвета
    const colors = [
        { class: 'bg-green', name: 'Зеленый' },
        { class: 'bg-blue', name: 'Синий' },
        { class: 'bg-red', name: 'Красный' },
        { class: 'bg-pink', name: 'Розовый' },
        { class: 'bg-gold', name: 'Золотой' },
        { class: 'bg-black', name: 'Черный' },
        { class: 'bg-rainbow', name: 'Радужный' }
    ];
    
    colors.forEach(c => {
        const div = document.createElement('div');
        div.className = `color-btn ${c.class}`;
        div.title = c.name;
        div.onclick = () => {
            let nft = myNfts.find(n => n.id === currentNftId);
            nft.bg = c.class;
            document.getElementById('nft-preview-bg').className = `nft-bg-preview ${nft.bg}`;
            renderProfile();
            closeModal('modal-color-picker');
            send({ action: 'admin_set_bg', id: nft.id, bg: c.class });
            tg.showAlert(`✅ Фон изменен на ${c.name}`);
        };
        grid.appendChild(div);
    });
    
    closeModal('modal-nft');
    document.getElementById('modal-color-picker').classList.remove('hidden');
}

// --- РУЛЕТКА ---
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
    
    const extraDegrees = Math.floor(Math.random() * 360) + 1440; 
    wheel.style.transform = `rotate(${extraDegrees}deg)`;

    setTimeout(() => {
        btn.innerText = "Крутить (100⭐)";
        isSpinning = false;
        send({ action: 'spin_wheel' });
    }, 4000);
}

// --- КЕЙСЫ С ПРЕДПРОСМОТРОМ ---
const CASES_DATA = [
  { id: 'basic', name: '🎁 Обычный', price: 100, theme: 'basic', items: '🧸 Мишка (50⭐), 💍 Кольцо (70⭐), 🎩 Шляпа (100⭐), ⭐ Звезда (150⭐), 👑 Корона (1000⭐)' },
  { id: 'gta6', name: '🚗 GTA 6', price: 500, theme: 'gta', items: '🔫 Пистолет (250⭐), 🚙 Тачка (400⭐), 💵 Деньги (800⭐), 🚁 Вертолёт (2000⭐), 🏰 Особняк (50000⭐)' },
  { id: 'newyear', name: '🎄 Новый год', price: 300, theme: 'ny', items: '🎄 Ёлка (150⭐), ⛄ Снеговик (200⭐), 🎁 Подарок (400⭐), ❄️ Снежинка (800⭐), 🎅 Дед Мороз (2000⭐)' },
];

function renderCases() {
  const grid = document.getElementById('cases-grid');
  grid.innerHTML = '';
  CASES_DATA.forEach(c => {
    const div = document.createElement('div');
    div.className = `case-card case-${c.theme}`; 
    div.innerHTML = `<div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => openCasePreview(c);
    grid.appendChild(div);
  });
}

function openCasePreview(c) {
    currentSelectedCase = c;
    document.getElementById('preview-case-name').innerText = c.name;
    document.getElementById('preview-case-list').innerText = c.items;
    document.getElementById('preview-case-min-price').innerText = `Мин. цена: ${c.price}⭐`;
    document.getElementById('modal-case-preview').classList.remove('hidden');
}

function confirmBuyCase() {
    closeModal('modal-case-preview');
    if (balance < currentSelectedCase.price) { tg.showAlert('❌ Недостаточно звезд!'); return; }
    balance -= currentSelectedCase.price;
    renderProfile();
    startCaseRoll(currentSelectedCase);
}

function startCaseRoll(c) {
    document.getElementById('cases-grid').classList.add('hidden');
    document.getElementById('case-roll-container').classList.remove('hidden');

    const tape = document.getElementById('case-tape');
    tape.innerHTML = '';
    tape.style.transition = 'none';
    tape.style.transform = 'translateX(0)';
    
    let emojis = [];
    if (c.theme === 'basic') emojis = ['🧸', '💍', '🎩', '⭐', '👑'];
    else if (c.theme === 'gta') emojis = ['🔫', '🚙', '💵', '🚁', '🏰'];
    else if (c.theme === 'ny') emojis = ['🎄', '⛄', '🎁', '❄️', '🎅'];

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
        
        const newId = myNfts.length > 0 ? Math.max(...myNfts.map(n => n.id)) + 1 : 1;
        myNfts.push({ id: newId, emoji: randomEmoji, name: 'Новый', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: false });
        renderProfile();

        send({ action: 'open_case', case_id: c.id });

        setTimeout(() => {
            document.getElementById('cases-grid').classList.remove('hidden');
            document.getElementById('case-result').classList.add('hidden');
        }, 3000);
    }, delay);
}

// --- РЫНОК ---
function renderMarket() {
    const list = document.getElementById('market-list');
    list.innerHTML = '';
    // Имитация: после покупки лот удаляется из массива
    let lots = [
        { id: 99, emoji: '👑', name: 'Корона', price: 5000, seller: '@user1', bg: 'bg-red' },
        { id: 100, emoji: '🚀', name: 'Ракета', price: 10000, seller: '@user2', bg: 'bg-black' }
    ];
    
    if (lots.length === 0) {
        list.innerHTML = '<div class="card" style="text-align:center;">Пусто</div>';
        return;
    }

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
                    lots = lots.filter(l => l.id !== lot.id); // УДАЛЯЕМ С РЫНКА
                    renderProfile();
                    send({ action: 'buy_nft', id: lot.id, price: lot.price });
                    tg.showAlert('✅ Куплено!');
                    renderMarket();
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
    for (let i = 100; i <= 10000000; i *= 10) { 
        const btn = document.createElement('div');
        btn.className = 'card';
        btn.style.textAlign = 'center';
        btn.style.cursor = 'pointer';
        btn.innerHTML = `<b>${i} ⭐</b>`;
        btn.onclick = () => tg.showAlert('Напишите админу @vazikonov для покупки!');
        grid.appendChild(btn);
        if (i > 1000) i += 900; 
    }
}

// --- ПРОЧЕЕ ---
function editPhone() {
    let phone = prompt("Введите номер:", "+7");
    if (phone) {
        if (!/^\+7\d+$/.test(phone)) { tg.showAlert("❌ Только цифры и +7."); return; }
        if (phone === "+999") { tg.showAlert("❌ Номер занят!"); return; }
        document.getElementById('phone-display').innerText = phone;
        send({ action: 'update_phone', phone: phone });
    }
}

function editUz() { 
    let uz = prompt("Введите юз:", "@my_username");
    if (uz) { document.getElementById('uz-text').innerText = uz; send({action: 'update_uz', uz: uz}); }
}
function editBio() { 
    let bio = prompt("Введите описание:", "");
    if (bio) { document.getElementById('bio').innerText = bio; send({action: 'update_bio', bio: bio}); }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
renderCases();
renderProfile();
