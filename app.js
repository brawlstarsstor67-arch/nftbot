const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.setHeaderColor('#17212b');
tg.setBackgroundColor('#17212b');

let userBalance = 0;
let isSpinning = false; // Блокировка во время прокрутки

function send(data) {
  tg.sendData(JSON.stringify(data));
}

// НАВИГАЦИЯ
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
  };
});

// ЗАПРОС БАЛАНСА
send({ action: 'check_balance' });

// ФУНКЦИЯ ВЫЗЫВАЕТСЯ ИЗ БОТА, КОГДА ПРИХОДИТ ОТВЕТ
tg.onEvent('viewportChanged', () => { /* триггер для перерисовки */ });
// Временная имитация получения баланса
setTimeout(() => {
    document.getElementById('balance-game').innerText = userBalance + ' ⭐';
    document.getElementById('bal-roulette').innerText = userBalance;
}, 1000);

// РУЛЕТКА
function spinWheel() {
  if (isSpinning) return;
  if (userBalance < 100) {
    tg.showAlert('❌ Недостаточно звезд для прокрута!');
    return;
  }
  
  isSpinning = true;
  const wheel = document.getElementById('wheel-display');
  
  // Анимация прокрутки
  let rotation = 0;
  const interval = setInterval(() => {
    rotation += 45;
    wheel.style.transform = `rotate(${rotation}deg)`;
  }, 50);

  // Отправляем запрос боту
  send({ action: 'spin_wheel' });

  // Через 2 секунды останавливаем
  setTimeout(() => {
    clearInterval(interval);
    isSpinning = false;
    // Текст изменится, когда бот пришлет результат
  }, 2000);
}

// РЕДАКТИРОВАНИЕ ПРОФИЛЯ
function editProfile(field) {
  let val = prompt('Введите новое значение:');
  if (val) {
    if (field === 'name') document.getElementById('username').innerText = val;
    if (field === 'bio') document.getElementById('bio').innerText = val;
    if (field === 'avatar') document.getElementById('avatar').innerText = val;
    send({ action: 'update_profile', field: field, value: val });
  }
}
