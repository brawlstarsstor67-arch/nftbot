const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let myNfts = [
    { id: 1, emoji: '🧸', name: 'Мишка', rarity: 'Обычный', price: 50, bg: 'bg-green' }
];
let currentNftId = null;

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
        const radius = 60; // Меньше радиус
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

// --- УЛУЧШЕНИЕ NFT (Смена фона) ---
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

    // Меняем фон и обновляем карточку прямо на глазах
    if (nft.bg === 'bg-green') { nft.bg = 'bg-blue'; nft.rarity = 'Редкий'; }
    else if (nft.bg === 'bg-blue') { nft.bg = 'bg-red'; nft.rarity = 'Эпик'; }
    else if (nft.bg === 'bg-red') { nft.bg = 'bg-black'; nft.rarity = 'Легенда'; }

    tg.showAlert('✨ Улучшение успешно! Фон изменен.');
    
    // Обновляем превью
    const bg = document.getElementById('nft-preview-bg');
    bg.className = `nft-bg-preview ${nft.bg}`;
    document.getElementById('nft-preview-rarity').innerText = nft.rarity;

    // Перерисовываем профиль
    renderProfile();
    send({ action: 'upgrade_nft', id: nft.id });
}

function sellNft() { 
    const price = prompt("За сколько ⭐ вы хотите продать этот NFT?", "100");
    if (price && !isNaN(price)) {
        send({ action: 'sell_nft', id: currentNftId, price: parseInt(price) });
        tg.showAlert(`✅ NFT выставлен на рынок за ${price}⭐`);
        closeModal('modal-nft');
    }
}

// --- РУЛЕТКА (Крутится) ---
let isSpinning = false;
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    
    const wheel = document.getElementById('wheel');
    const btn = document.getElementById('spin-btn');
    btn.innerText = "Крутится...";
    btn.style.opacity = "0.5";

    // Случайный поворот от 3 до 5 оборотов
    const extraDegrees = Math.floor(Math.random() * 720) + 1080; 
    wheel.style.transform = `rotate(${extraDegrees}deg)`;

    setTimeout(() => {
        btn.innerText = "Крутить (100⭐)";
        btn.style.opacity = "1";
        isSpinning = false;
        send({ action: 'spin_wheel' }); // Отправляем боту реальный результат
    }, 3000); // Ждем, пока докрутится
}

// --- КЕЙСЫ (Лента на 5-15 секунд) ---
const CASES_DATA = [
  { id: 'basic', name: '🎁 Обычный', price: 100 },
  { id: 'adult', name: '🔞 18+', price: 1000 },
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
    if (!confirm(`Купить кейс ${caseName} за ${casePrice}⭐?`)) return;

    document.getElementById('cases-grid').classList.add('hidden');
    document.getElementById('case-roll-container').classList.remove('hidden');
    document.getElementById('case-result').classList.add('hidden');

    // Заполняем ленту рандомными стикерами
    const tape = document.getElementById('case-tape');
    tape.innerHTML = '';
    tape.style.transition = 'none';
    tape.style.transform = 'translateX(0)';
    
    const emojis = ['🧸', '🎩', '💍', '👑', '⭐'];
    for (let i = 0; i < 30; i++) {
        const item = document.createElement('div');
        item.className = 'tape-item';
        item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        tape.appendChild(item);
    }

    // Ждем мгновение и запускаем анимацию прокрутки (сдвиг влево)
    setTimeout(() => {
        tape.style.transition = 'transform 10s ease-out'; // 10 секунд прокрутки
        // Сдвигаем так, чтобы центральный элемент оказался под указателем
        tape.style.transform = 'translateX(-1200px)'; 
    }, 100);

    // Показываем результат через 10-15 секунд
    const delay = Math.floor(Math.random() * 5000) + 10000; // от 10 до 15 сек
    setTimeout(() => {
        document.getElementById('case-roll-container').classList.add('hidden');
        document.getElementById('case-result').classList.remove('hidden');
        
        // Имитация того, что выпал подарок (бот пришлет точные данные в чат)
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        document.getElementById('case-result').innerHTML = `Вы выбили: <span style="font-size: 40px;">${randomEmoji}</span><br><small>Проверьте чат Telegram</small>`;
        
        // Добавляем в профиль визуально
        myNfts.push({ id: Date.now(), emoji: randomEmoji, name: 'Новый NFT', rarity: 'Обычный', price: 100, bg: 'bg-green' });
        renderProfile();

        send({ action: 'open_case', case_id: caseId }); // Отправляем боту для сохранения в БД

        // Возвращаем кнопку "Назад" через 3 секунды
        setTimeout(() => {
            document.getElementById('cases-grid').classList.remove('hidden');
            document.getElementById('case-roll-container').classList.add('hidden');
            document.getElementById('case-result').classList.add('hidden');
        }, 3000);
    }, delay);
}

// --- РЫНОК ---
function renderMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';
    const lots = [
        { emoji: '👑', name: 'Корона', price: 5000, bg: 'bg-red' },
        { emoji: '🚀', name: 'Ракета', price: 10000, bg: 'bg-black' }
    ];
    lots.forEach(lot => {
        const div = document.createElement('div');
        div.className = `nft-card ${lot.bg}`;
        div.innerHTML = `<div class="emoji">${lot.emoji}</div><div class="name">${lot.name}</div><div style="font-size:10px;">${lot.price}⭐</div>`;
        grid.appendChild(div);
    });
}

// --- ИНИЦИАЛИЗАЦИЯ ---
renderCases();
renderProfile();
