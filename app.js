const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

let balance = 999999999; 
let myNfts = [];

function send(data) { tg.sendData(JSON.stringify(data)); }

// СЛУШАЕМ БОТА (Ловим данные о выигрыше)
if (tg.onEvent) {
    tg.onEvent('messageReceived', (event) => {
        let text = event.message.text;
        if (text.startsWith("WIN_DATA:")) {
            let data = JSON.parse(text.replace("WIN_DATA:", ""));
            myNfts.push(data);
            showWinModal(data);
        }
    });
}

function showWinModal(data) {
    document.getElementById('win-emoji').innerText = data.emoji;
    document.getElementById('win-name').innerText = data.name;
    document.getElementById('win-rarity').innerText = data.rarity;
    document.getElementById('win-price').innerText = data.price;
    document.getElementById('win-bg').className = `nft-bg-preview ${data.bg}`;
    document.getElementById('modal-win').classList.remove('hidden');
}

// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
  btn.onclick = () => {
    if (!btn.dataset.tab) return; // Пропускаем TikTok
    document.querySelectorAll('.bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  };
});

// ЗАПРОС НА ПОПОЛНЕНИЕ (К тебе в бот)
function topupRequest(amount) {
    if (confirm(`Отправить заявку админу на ${amount}⭐?`)) {
        send({ action: 'topup_request', amount: amount });
        tg.showAlert('⏳ Заявка отправлена. Ожидайте подтверждения.');
    }
}

// Инициализация
send({ action: 'init_user' });
