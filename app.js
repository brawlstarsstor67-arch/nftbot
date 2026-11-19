const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let balance = 999999999; 
let myNfts = [{ id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: true }];
let currentNftId = null;
let pinnedCount = 0;
let currentSelectedCase = null;
const isAdmin = true; 

// Имитация базы данных лотов
let marketLots = [
    { id: 1, emoji: '🎩', name: 'Шляпа', price: 2000, seller: '@vazikonov', bg: 'bg-red', rarity: 'Редкий' },
    { id: 2, emoji: '🎩', name: 'Шляпа', price: 2500, seller: '@user2', bg: 'bg-blue', rarity: 'Обычный' },
    { id: 3, emoji: '👑', name: 'Корона', price: 8000, seller: '@user3', bg: 'bg-black', rarity: 'Легенда' }
];

function send(data) { tg.sendData(JSON.stringify(data)); }

// НАВИГАЦИЯ
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    
    if (btn.dataset.tab === 'market') renderMarketPage();
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
        const x = Math.cos(angle) * 70; const y = Math.sin(angle) * 70;
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
    document.getElementById('nft-preview-bg').className = `nft-bg-preview ${nft.bg}`;
    document.querySelector('.admin-only').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('modal-nft').classList.remove('hidden');
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function upgradeNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (!nft || nft.upgraded) { tg.showAlert('Этот NFT уже улучшен!'); return; }
    nft.upgraded = true; nft.bg = 'bg-black'; nft.rarity = 'Легенда';
    document.getElementById('nft-preview-bg').className = `nft-preview-bg bg-black`;
    renderProfile(); send({ action: 'upgrade_nft', id: nft.id });
    tg.showAlert('✨ Улучшение успешно!');
}

function pinNft() {
    let nft = myNfts.find(n => n.id === currentNftId);
    if (nft.pinned) { nft.pinned = false; tg.showAlert('Откреплен.'); }
    else { if (pinnedCount >= 6) { tg.showAlert('Максимум 6!'); return; } nft.pinned = true; tg.showAlert('Закреплен.'); }
    renderProfile(); closeModal('modal-nft');
}

function sellNft() { 
    const price = prompt("За сколько ⭐ вы хотите продать этот NFT?", "1000");
    if (price && !isNaN(price)) {
        send({ action: 'sell_nft', id: currentNftId, price: parseInt(price) });
        tg.showAlert(`✅ NFT выставлен на рынок за ${price}⭐`);
        closeModal('modal-nft');
    }
}

function openColorPicker() {
    const grid = document.getElementById('color-picker-grid'); grid.innerHTML = '';
    const colors = [{ class: 'bg-green', name: 'Зеленый' }, { class: 'bg-blue', name: 'Синий' }, { class: 'bg-red', name: 'Красный' }, { class: 'bg-pink', name: 'Розовый' }, { class: 'bg-gold', name: 'Золотой' }, { class: 'bg-black', name: 'Черный' }, { class: 'bg-rainbow', name: 'Радужный' }];
    colors.forEach(c => {
        const div = document.createElement('div'); div.className = `color-btn ${c.class}`; div.title = c.name;
        div.onclick = () => {
            let nft = myNfts.find(n => n.id === currentNftId);
            nft.bg = c.class;
            document.getElementById('nft-preview-bg').className = `nft-preview-bg ${nft.bg}`;
            renderProfile(); closeModal('modal-color-picker'); send({ action: 'admin_set_bg', id: nft.id, bg: c.class });
        };
        grid.appendChild(div);
    });
    closeModal('modal-nft'); document.getElementById('modal-color-picker').classList.remove('hidden');
}

// --- РУЛЕТКА ---
let isSpinning = false;
function spinWheel() {
    if (isSpinning || balance < 100) return;
    isSpinning = true; balance -= 100; renderProfile();
    const wheel = document.getElementById('wheel'); const btn = document.getElementById('spin-btn');
    btn.innerText = "Крутится...";
    wheel.style.transform = `rotate(${Math.floor(Math.random() * 360) + 1440}deg)`;
    setTimeout(() => { btn.innerText = "Крутить (100⭐)"; isSpinning = false; send({ action: 'spin_wheel' }); }, 4000);
}

// --- КЕЙСЫ ---
const CASES_DATA = [
  { id: 'basic', name: 'Обычный', price: 100, theme: 'basic', items: '🧸 Мишка (50⭐), 💍 Кольцо (70⭐), 🎩 Шляпа (100⭐), ⭐ Звезда (150⭐), 👑 Корона (1000⭐)' },
  { id: 'gta6', name: 'GTA 6', price: 500, theme: 'gta', items: '🔫 Пистолет (250⭐), 🚙 Тачка (400⭐), 💵 Деньги (800⭐), 🚁 Вертолёт (2000⭐), 🏰 Особняк (50000⭐)' },
  { id: 'newyear', name: 'Новый год', price: 300, theme: 'ny', items: '🎄 Ёлка (150⭐), ⛄ Снеговик (200⭐), 🎁 Подарок (400⭐), ❄️ Снежинка (800⭐), 🎅 Дед Мороз (2000⭐)' },
];

function renderCases() {
  const grid = document.getElementById('cases-grid'); grid.innerHTML = '';
  CASES_DATA.forEach(c => {
    const div = document.createElement('div'); div.className = `case-card case-${c.theme}`;
    div.innerHTML = `<div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => { currentSelectedCase = c; document.getElementById('preview-case-name').innerText = c.name; document.getElementById('preview-case-list').innerText = c.items; document.getElementById('preview-case-min-price').innerText = `Мин. цена: ${c.price}⭐`; document.getElementById('modal-case-preview').classList.remove('hidden'); };
    grid.appendChild(div);
  });
}

function confirmBuyCase() {
    closeModal('modal-case-preview');
    if (balance < currentSelectedCase.price) { tg.showAlert('❌ Недостаточно звезд!'); return; }
    balance -= currentSelectedCase.price; renderProfile();
    document.getElementById('cases-grid').classList.add('hidden');
    document.getElementById('case-roll-container').classList.remove('hidden');
    const tape = document.getElementById('case-tape'); tape.innerHTML = ''; tape.style.transition = 'none'; tape.style.transform = 'translateX(0)';
    let emojis = currentSelectedCase.theme === 'basic' ? ['🧸', '💍', '🎩', '⭐', '👑'] : currentSelectedCase.theme === 'gta' ? ['🔫', '🚙', '💵', '🚁', '🏰'] : ['🎄', '⛄', '🎁', '❄️', '🎅'];
    for (let i = 0; i < 30; i++) { const item = document.createElement('div'); item.className = 'tape-item'; item.innerText = emojis[Math.floor(Math.random() * emojis.length)]; tape.appendChild(item); }
    setTimeout(() => { tape.style.transition = 'transform 10s ease-out'; tape.style.transform = 'translateX(-1200px)'; }, 100);
    setTimeout(() => {
        document.getElementById('case-roll-container').classList.add('hidden');
        document.getElementById('case-result').classList.remove('hidden');
        const randEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        document.getElementById('case-result').innerHTML = `Вы выбили: <span style="font-size: 40px;">${randEmoji}</span><br><small>Проверьте чат</small>`;
        myNfts.push({ id: Date.now(), emoji: randEmoji, name: 'Новый', rarity: 'Обычный', bg: 'bg-green', upgraded: false, pinned: false });
        renderProfile(); send({ action: 'open_case', case_id: currentSelectedCase.id });
        setTimeout(() => { document.getElementById('cases-grid').classList.remove('hidden'); document.getElementById('case-result').classList.add('hidden'); }, 3000);
    }, 10000);
}

// --- РЫНОК ---
function renderMarketPage() {
    document.getElementById('market-grid-view').classList.add('hidden');
    document.getElementById('market-ui').classList.remove('hidden');
    if (marketLots.length > 0) openMarketItem(marketLots[0].id);
}

function openMarketItem(id) {
    const lot = marketLots.find(l => l.id === id);
    if (!lot) return;
    
    document.getElementById('market-preview-emoji').innerText = lot.emoji;
    document.getElementById('market-preview-bg').className = `market-preview-bg ${lot.bg}`;
    document.getElementById('market-item-title').innerText = `${lot.name} #${lot.id}`;
    document.getElementById('market-item-rarity').innerText = lot.rarity;

    const list = document.getElementById('market-list');
    list.innerHTML = '';
    
    const sameItems = marketLots.filter(l => l.name === lot.name);
    
    sameItems.forEach(l => {
        let borderClass = 'border-green';
        if (l.bg === 'bg-red') borderClass = 'border-red';
        else if (l.bg === 'bg-blue') borderClass = 'border-blue';
        else if (l.bg === 'bg-gold') borderClass = 'border-gold';
        else if (l.bg === 'bg-black') borderClass = 'border-black';
        
        const row = document.createElement('div');
        row.className = `market-row ${borderClass}`;
        row.innerHTML = `
            <div class="market-row-left">
                <div class="market-row-icon">${l.emoji}</div>
                <div class="market-row-info">
                    <div class="market-row-name">${l.name} #${l.id}</div>
                    <div class="market-row-seller">${l.seller}</div>
                </div>
            </div>
            <div class="market-row-price">${l.price} ⭐</div>
            <button class="market-buy-btn" onclick="event.stopPropagation(); buyMarketItem(${l.id}, ${l.price})">КУПИТЬ</button>
        `;
        row.onclick = () => openMarketItem(l.id);
        list.appendChild(row);
    });
}

function buyMarketItem(id, price) {
    if (confirm(`Купить NFT за ${price}⭐?`)) {
        if (balance >= price) {
            balance -= price;
            marketLots = marketLots.filter(l => l.id !== id);
            send({ action: 'buy_nft', id: id, price: price });
            renderProfile();
            tg.showAlert('✅ Успешно куплено!');
            if (marketLots.length > 0) openMarketItem(marketLots[0].id);
            else renderMarketPage();
        } else {
            tg.showAlert('❌ Недостаточно средств!');
        }
    }
}

// --- ПОПОЛНЕНИЕ (С ЗАЯВКОЙ АДМИНУ) ---
function renderTopup() {
    const grid = document.getElementById('topup-grid'); grid.innerHTML = '';
    for (let i = 100; i <= 10000000; i *= 10) { 
        const btn = document.createElement('div'); btn.className = 'card'; btn.style.textAlign = 'center'; btn.style.cursor = 'pointer';
        btn.innerHTML = `<b>${i} ⭐</b>`;
        btn.onclick = () => {
            if (confirm(`Отправить заявку на пополнение на ${i} игровых ⭐?`)) {
                send({ action: 'topup_request', amount: i });
                tg.showAlert('⏳ Заявка отправлена админу. Ожидайте подтверждения.');
            }
        };
        grid.appendChild(btn); if (i > 1000) i += 900; 
    }
}

// --- ПРОЧЕЕ ---
function editPhone() {
    let phone = prompt("Введите номер:", "+7");
    if (phone && /^\+7\d+$/.test(phone) && phone !== "+999") {
        document.getElementById('phone-display').innerText = phone; send({ action: 'update_phone', phone: phone });
    } else { tg.showAlert("❌ Только цифры и +7. +999 занят."); }
}
function editUz() { let uz = prompt("Введите юз:", "@my_username"); if (uz) { document.getElementById('uz-text').innerText = uz; send({action: 'update_uz', uz: uz}); } }
function editBio() { let bio = prompt("Введите описание:", ""); if (bio) { document.getElementById('bio').innerText = bio; send({action: 'update_bio', bio: bio}); } }

renderCases(); renderProfile();
