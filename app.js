const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let balance = parseInt(localStorage.getItem('nft_balance')) || 999999999; 
let myNfts = JSON.parse(localStorage.getItem('nft_inventory')) || [{ id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', bg: 'bg-green', pinned: true }];
let pinnedCount = 0;
let currentSelectedCase = null;
let currentMarketLot = null;

// В реальности лоты подтягиваются из БД. Пока для визуала:
let marketLots = [
    { id: 10, emoji: '🎩', name: 'Шляпа', price: 2000, seller: '@vazikonov', seller_id: 8906194733, rarity: 'Редкий' }
];

function send(data) { tg.sendData(JSON.stringify(data)); }

function save() {
    localStorage.setItem('nft_balance', balance);
    localStorage.setItem('nft_inventory', JSON.stringify(myNfts));
}

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

// ПРОФИЛЬ
function renderProfile() {
    document.getElementById('balance-game').innerText = balance + ' ⭐';
    const orbit = document.getElementById('orbit-container'); orbit.innerHTML = '';
    const pinned = myNfts.filter(n => n.pinned).slice(0, 6); pinnedCount = pinned.length;

    pinned.forEach((nft, index) => {
        const angle = (index / pinned.length) * (Math.PI * 2);
        const x = Math.cos(angle) * 70; const y = Math.sin(angle) * 70;
        const el = document.createElement('div'); el.className = `orbit-item ${nft.bg}`;
        el.innerHTML = `<span style="transform: rotate(${-angle}rad);">${nft.emoji}</span>`;
        el.style.transform = `translate(${x}px, ${y}px)`; orbit.appendChild(el);
    });

    const grid = document.getElementById('my-nfts'); grid.innerHTML = '';
    myNfts.forEach(nft => {
        const div = document.createElement('div'); div.className = `nft-card ${nft.bg}`;
        div.innerHTML = `<div class="emoji">${nft.emoji}</div><div class="name">#${nft.id}</div>`;
        div.onclick = () => openNftModal(nft); grid.appendChild(div);
    });
    save();
}

// МОДАЛКА NFT
function openNftModal(nft) {
    document.getElementById('nft-preview-emoji').innerText = nft.emoji;
    document.getElementById('nft-name').innerText = nft.name;
    document.getElementById('nft-rarity').innerText = nft.rarity;
    document.getElementById('nft-num').innerText = '#' + nft.id;
    document.getElementById('nft-preview-bg').className = `nft-bg-preview ${nft.bg}`;
    document.getElementById('modal-nft').classList.remove('hidden');
}
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function pinNft() {
    let nft = myNfts.find(n => n.name === document.getElementById('nft-name').innerText); // Упрощенно
    if (nft.pinned) { nft.pinned = false; tg.showAlert('Откреплен'); }
    else { if(pinnedCount >= 6) return tg.showAlert('Максимум 6!'); nft.pinned = true; tg.showAlert('Закреплен'); }
    renderProfile(); closeModal('modal-nft');
}
function sellNft() { let p = prompt("Цена:", "1000"); if(p) { send({action:'sell_nft', id: 1, price: p}); closeModal('modal-nft'); } }

// РУЛЕТКА
function spinWheel() {
    if (balance < 100) return tg.showAlert('Мало звезд!');
    balance -= 100; renderProfile();
    const wheel = document.getElementById('wheel'); wheel.style.transform = `rotate(${Math.floor(Math.random()*360)+1440}deg)`;
    setTimeout(() => send({ action: 'spin_wheel' }), 4000);
}

// КЕЙСЫ
const CASES = [
  { id: 'basic', name: 'Обычный', price: 100, theme: 'basic', items: '🧸 Мишка (50⭐), 💍 Кольцо (70⭐), 🎩 Шляпа (100⭐), ⭐ Звезда (150⭐), 👑 Корона (1000⭐)' },
  { id: 'gta6', name: 'GTA 6', price: 500, theme: 'gta', items: '🔫 Пистолет (250⭐), 🚙 Тачка (400⭐), 🚁 Вертолёт (2000⭐)' }
];
function renderCases() {
  const grid = document.getElementById('cases-grid'); grid.innerHTML = '';
  CASES.forEach(c => {
    const div = document.createElement('div'); div.className = `case-card case-${c.theme}`;
    div.innerHTML = `<div class="name">${c.name}</div><div class="price">${c.price}⭐</div>`;
    div.onclick = () => { currentSelectedCase = c; document.getElementById('preview-name').innerText = c.name; document.getElementById('preview-list').innerText = c.items; document.getElementById('modal-case').classList.remove('hidden'); };
    grid.appendChild(div);
  });
}
function confirmCase() {
    closeModal('modal-case');
    if (balance < currentSelectedCase.price) return tg.showAlert('Мало звезд!');
    balance -= currentSelectedCase.price; renderProfile();
    document.getElementById('cases-grid').classList.add('hidden'); document.getElementById('case-roll-container').classList.remove('hidden');
    const tape = document.getElementById('case-tape'); tape.innerHTML = ''; tape.style.transition = 'none'; tape.style.transform = 'translateX(0)';
    let e = currentSelectedCase.theme === 'basic' ? ['🧸','💍','🎩','⭐'] : ['🔫','🚙','🚁'];
    for(let i=0; i<30; i++) { let d = document.createElement('div'); d.className='tape-item'; d.innerText = e[Math.floor(Math.random()*e.length)]; tape.appendChild(d); }
    setTimeout(() => { tape.style.transition='transform 8s ease-out'; tape.style.transform='translateX(-1200px)'; }, 100);
    send({ action: 'open_case', case_id: currentSelectedCase.id });
    setTimeout(() => {
        document.getElementById('case-roll-container').classList.add('hidden'); document.getElementById('case-result').classList.remove('hidden');
        document.getElementById('case-result').innerHTML = `Проверьте бота!<br><small>Предмет придет в чат.</small>`;
        setTimeout(() => { document.getElementById('cases-grid').classList.remove('hidden'); document.getElementById('case-result').classList.add('hidden'); }, 3000);
    }, 8000);
}

// РЫНОК
function renderMarket() {
    const grid = document.getElementById('market-grid'); grid.innerHTML = '';
    marketLots.forEach(lot => {
        const div = document.createElement('div'); div.className = 'market-card';
        div.innerHTML = `<div class="nft-icon">${lot.emoji}</div><div class="nft-name">${lot.name} #${lot.id}</div><div class="nft-seller">${lot.seller}</div><div class="nft-price">${lot.price} ⭐</div>`;
        div.onclick = () => { currentMarketLot = lot; document.getElementById('m-emoji').innerText = lot.emoji; document.getElementById('m-name').innerText = `${lot.name} #${lot.id}`; document.getElementById('m-rarity').innerText = lot.rarity; document.getElementById('m-price').innerText = `${lot.price} ⭐`; document.getElementById('m-seller').innerText = `Продавец: ${lot.seller}`; document.getElementById('modal-market').classList.remove('hidden'); };
        grid.appendChild(div);
    });
}
function offerPrice() { let p = prompt("Ваша цена:", "1000"); if(p) { send({action:'make_offer', id: currentMarketLot.id, seller_id: currentMarketLot.seller_id, price: p}); tg.showAlert('Предложено!'); closeModal('modal-market'); } }
function buyNft() { if(balance >= currentMarketLot.price) { balance -= currentMarketLot.price; marketLots = marketLots.filter(l => l.id !== currentMarketLot.id); send({action:'buy_nft', id: currentMarketLot.id, price: currentMarketLot.price}); renderProfile(); renderMarket(); closeModal('modal-market'); tg.showAlert('Куплено!'); } else tg.showAlert('Мало звезд!'); }

// ПОПОЛНЕНИЕ
function renderTopup() {
    const grid = document.getElementById('topup-grid'); grid.innerHTML = '';
    for(let i=100; i<=10000000; i*=10) {
        let btn = document.createElement('div'); btn.className='card'; btn.style.textAlign='center'; btn.style.cursor='pointer';
        btn.innerHTML = `<b>${i} ⭐</b>`; btn.onclick = () => { if(confirm(`Отправить заявку на ${i}⭐?`)) { send({action:'topup_request', amount: i}); tg.showAlert('Ожидайте.'); } };
        grid.appendChild(btn); if(i>1000) i+=900;
    }
}

function editPhone() { let p = prompt("Телефон:", "+7"); if(p) document.getElementById('phone-display').innerText = p; }
function editUz() { let u = prompt("Юз:", "@user"); if(u) document.getElementById('uz-text').innerText = u; }
function editBio() { let b = prompt("Описание:", ""); if(b) document.getElementById('bio').innerText = b; }

renderCases(); renderProfile();
