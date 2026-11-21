(() => {
"use strict";

/* ================= TELEGRAM ================= */
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor("#0b0b12"); tg.setBackgroundColor("#0b0b12"); } catch (e) {} }

/* ================= СПРАВОЧНИКИ ================= */
const RARS = [
  { n: "Обычный",     c: "#9aa3b8", bg: "linear-gradient(160deg,#2b3040,#191c26)" },
  { n: "Редкий",      c: "#4da3ff", bg: "linear-gradient(160deg,#123459,#0d1c33)" },
  { n: "Эпический",   c: "#b44dff", bg: "linear-gradient(160deg,#311355,#1b0c30)" },
  { n: "Легендарный", c: "#ffc63a", bg: "linear-gradient(160deg,#4d3708,#261a04)" },
  { n: "Мифический",  c: "#ff4d6d", bg: "linear-gradient(160deg,#4d0e1d,#270710)" }
];
const R = k => RARS[k];

const NOUN = ["Кот","Дракон","Череп","Ракета","Монета","Корона","Самурай","Робот","Кофе","Пицца","Кристалл","Звезда","Лиса","Тигр","Дельфин","Феникс","Замок","Меч","Щит","Ключ","Часы","Кубок","Бомба","Гриб","Луна","Солнце","Молния","Пламя","Призрак","Демон","Ангел","Волк","Медведь","Панда","Осьминог","Скат","Ёж","Попугай","Кактус","Роза"];
const EMOJ = ["🐱","🐉","💀","🚀","🪙","👑","🥷","🤖","☕","🍕","💎","⭐","🦊","🐯","🐬","🦅","🏰","🗡️","🛡️","🗝️","⏰","🏆","💣","🍄","🌙","☀️","⚡","🔥","👻","😈","😇","🐺","🐻","🐼","🐙","🦈","🦔","🦜","🌵","🌹"];
const SUF  = ["Mini","Pro","Prime","Elite","Omega"];
const PATS  = ["Мрамор","Пиксель","Огонь","Лёд","Камуфляж","Граффити","Золото","Космос","Неон","Хамелеон"];
const BACKS = ["Чёрный","Синий","Красный","Золотой","Фиолетовый","Радужный","Мятный","Оранжевый"];
const CBG = ["Золотое свечение","Радуга","Неоновый дым","Лава","Аврора","Розовое золото"];
const CBG_CSS = {
  "Золотое свечение": "linear-gradient(160deg,#fff2b0,#ffb62e 60%,#7a4d00)",
  "Радуга": "linear-gradient(135deg,#ff5f6d,#ffc371,#47e5bc,#5b7fff)",
  "Неоновый дым": "linear-gradient(160deg,#12f7ff,#7a2bff)",
  "Лава": "linear-gradient(160deg,#ff9d00,#ff2d00,#4d0000)",
  "Аврора": "linear-gradient(135deg,#00f5a0,#00d9f5,#5b7fff)",
  "Розовое золото": "linear-gradient(160deg,#ffd6e0,#ff8ac2,#b76bff)"
};

const CEMO = ["📦","🎁","🧰","🎒","🛍️","💼","🗃️","🗄️"];
const CASE_NAMES = ["Бронзовый кейс","Стальной кейс","Медный кейс","Неоновый кейс","Кибер-кейс","Ледяной кейс","Огненный кейс","Пиратский кейс","Тропический кейс","Пустынный кейс","Космический кейс","Галактический кейс","Атомный кейс","Токсичный кейс","Городской кейс","Граффити-кейс","Механический кейс","Часовой кейс","Модельный кейс","Винтажный кейс","Ретро-кейс","Фарфоровый кейс","Императорский кейс","Королевский кейс","Титановый кейс","Платиновый кейс","Алмазный кейс","Изумрудный кейс","Рубиновый кейс","Сапфировый кейс","Обсидиановый кейс","Драконий кейс","Кейс «Феникс»","Кейс «Левиафан»","Кейс «Титан»","Кейс «Зевс»","Кейс «Олимп»","Кейс «Хаос»","Мифический кейс","Кейс «Вселенная»"];
const CASE_PRICES = [250,500,750,1000,1500,2000,2500,3000,3500,4000,5000,6000,7500,8500,10000,12000,14000,16000,18000,20000,22000,25000,30000,35000,40000,45000,50000,60000,70000,80000,90000,100000,120000,140000,160000,180000,200000,250000,300000,500000];

const CASES = CASE_NAMES.map((name, i) => ({ name, emoji: CEMO[i % CEMO.length], price: CASE_PRICES[i] }));

/* 40 кейсов × 5 NFT, редкости растут вместе с ценой кейса */
const CASE_ITEMS = CASES.map((c, i) => {
  const tier = Math.min(4, Math.floor(i / 8));
  const pools = [[0,0,1,1,2],[0,1,1,2,2],[1,1,2,2,3],[1,2,2,3,3],[2,2,3,3,4]];
  const mult = c.price / 1000 + 1;
  const BASE = [50, 150, 500, 2000, 10000];
  return pools[tier].map((rk, j) => {
    const ni = (i * 5 + j) % 40;
    return {
      id: "c" + i + "_" + j,
      name: NOUN[ni] + " " + SUF[j],
      emoji: EMOJ[ni],
      rar: rk,
      pat: PATS[(i * 3 + j) % PATS.length],
      back: BACKS[(i * 2 + j) % BACKS.length],
      val: Math.round(BASE[rk] * mult * (0.9 + ((i * 7 + j * 13) % 21) / 100))
    };
  });
});

const DEF = {};
CASE_ITEMS.forEach(l => l.forEach(d => { DEF[d.id] = d; }));

const BOTS = [["КриптоКот","🐱"],["ТапокLord","🥷"],["Дракон999","🐉"],["MissLucky","🍀"],["SlotKing","👑"],["Ананасик","🍍"],["GigaTop","💪"],["МистерХ","🕶️"],["АпгрейдерПро","🔺"],["НФТшник","🖼️"]];

/* ================= СОСТОЯНИЕ ================= */
let uidSeq = 1;
const S = { bal: 9999999, inv: [], worn: null, pinned: [], market: [], usedCodes: [] };

const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rnd = a => a[Math.floor(Math.random() * a.length)];
const fmt = n => Math.round(n).toLocaleString("ru-RU");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const mkInst = (def, o) => Object.assign({ uid: uidSeq++, def, pat: def.pat, back: def.back, custom: null }, o || {});
const instVal = it => Math.round(it.def.val * (it.custom ? 1.6 : 1));
const user = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : { id: 777000, first_name: "Игрок" };

function save() {
  try {
    localStorage.setItem("nftcasino_v1", JSON.stringify({
      uidSeq,
      inv: S.inv.map(i => [i.def.id, i.pat, i.back, i.custom]),
      worn: S.worn, pinned: S.pinned,
      market: S.market.map(m => [m.def.id, m.pat, m.back, m.custom, m.price, m.seller]),
      usedCodes: S.usedCodes
    }));
  } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem("nftcasino_v1"));
    if (!d) return false;
    uidSeq = d.uidSeq || 1;
    S.inv = (d.inv || []).map(a => DEF[a[0]] ? { uid: uidSeq++, def: DEF[a[0]], pat: a[1], back: a[2], custom: a[3] } : null).filter(Boolean);
    S.worn = d.worn; S.pinned = d.pinned || [];
    S.market = (d.market || []).map(a => DEF[a[0]] ? { def: DEF[a[0]], pat: a[1], back: a[2], custom: a[3], price: a[4], seller: a[5] } : null).filter(Boolean);
    S.usedCodes = d.usedCodes || [];
    return true;
  } catch (e) { return false; }
}

/* ================= СТИЛИ ================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Rubik:wght@400;600;800&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{background:radial-gradient(900px 420px at 50% -120px,#1d1607 0%,#0b0b12 60%);color:#f2f2f2;font-family:Rubik,-apple-system,'Segoe UI',sans-serif;overflow-x:hidden}
@keyframes pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes glowpulse{0%,100%{filter:drop-shadow(0 0 10px rgba(255,200,60,.35))}50%{filter:drop-shadow(0 0 22px rgba(255,200,60,.8))}}
@keyframes shine{0%{transform:translateX(-120%)}100%{
/* ================= РЫНОК (P2P) ================= */
function vMarket() {
  const m = $("#market");
  if (!m) return;
  m.innerHTML = `
    <div class="card market-card">
      <div class="market-header">
        <h3>💱 Рынок NFT</h3>
        <button id="btnSell" class="btn btn-gold">Выставить на продажу</button>
      </div>
      <div id="marketList" class="market-list"></div>
    </div>
  `;
  $("#btnSell").onclick = () => {
    if (!S.inv.length) return alert("У вас нет NFT для продажи!");
    const sel = S.inv.map((i, idx) => `<option value="${idx}">${i.def.name} (${R(i.def.rar).n})</option>`).join("");
    const html = `
      <div class="modal">
        <div class="modal-content">
          <h3>Выставить NFT на продажу</h3>
          <select id="sellItemIdx">${sel}</select>
          <input type="number" id="sellPrice" placeholder="Цена в звёздах" min="1" value="1000">
          <button class="btn btn-red" onclick="confirmSell()">Подтвердить</button>
          <button class="btn btn-gray" onclick="$('.modal').remove()">Отмена</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  };

  function confirmSell() {
    const idx = +$("#sellItemIdx").value;
    const price = +$("#sellPrice").value;
    if (price < 1) return alert("Цена должна быть ≥1");
    const item = S.inv[idx];
    S.market.push({ def: item.def, pat: item.pat, back: item.back, custom: item.custom, price, seller: user.first_name });
    S.inv.splice(idx, 1);
    save();
    $(".modal").remove();
    vMarket();
  }

  const list = $("#marketList");
  S.market.sort((a, b) => b.price - a.price);
  list.innerHTML = S.market.length
    ? S.market.map((m, i) => `
        <div class="market-item">
          <div class="mi-info">
            <span class="mi-name">${m.def.emoji} ${m.def.name}</span>
            <span class="mi-rar ${R(m.def.rar).c}">${R(m.def.rar).n}</span>
          </div>
          <div class="mi-price">${fmt(m.price)} ⭐</div>
          <div class="mi-seller">Продавец: ${m.seller}</div>
          <button class="btn btn-buy" onclick="buyNFT(${i})">Купить</button>
        </div>`
      ).join("")
    : "<p class='text-dim'>Пока нет предложений</p>";
}

function buyNFT(idx) {
  const m = S.market[idx];
  if (S.bal < m.price) return alert("Недостаточно звёзд!");
  S.bal -= m.price;
  S.inv.push(mkInst(m.def, { pat: m.pat, back: m.back, custom: m.custom }));
  S.market.splice(idx, 1);
  save();
  alert(`Вы купили ${m.def.name} за ${fmt(m.price)} ⭐`);
  vMarket();
  vProfile(); // обновить профиль
}

/* ================= ПРОФИЛЬ NFT (Telegram-стиль) ================= */
function vProfile() {
  const p = $("#profile");
  if (!p) return;
  p.innerHTML = `
    <div class="card profile-card">
      <div class="profile-header">
        <h3>👤 Ваш профиль</h3>
        <span class="badge">Баланс: ${fmt(S.bal)} ⭐</span>
      </div>
      <div class="profile-grid">
        ${S.inv.map((i, idx) => {
          const isWorn = i.uid === S.worn;
          const isPinned = S.pinned.includes(i.uid);
          return `
            <div class="nft-card ${isWorn ? "nft-worn" : ""} ${isPinned ? "nft-pinned" : ""}">
              <div class="nc-emoji">${i.def.emoji}</div>
              <div class="nc-name">${i.def.name}</div>
              <div class="nc-rar ${R(i.def.rar).c}">${R(i.def.rar).n}</div>
              <div class="nc-val">Ценность: ${fmt(instVal(i))}</div>
              <div class="nc-actions">
                ${!isWorn ? `<button onclick="wearNFT(${idx})" class="btn btn-sm">👑 Носить</button>` : `<span class="status">Носится</span>`}
                ${!isPinned ? `<button onclick="pinNFT(${idx})" class="btn btn-sm">📌 Закрепить</button>` : `<span class="status">Закреплено</span>`}
                <button onclick="giveNFT(${idx})" class="btn btn-sm btn-red">📤 Передать</button>
              </div>
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

function wearNFT(idx) {
  S.worn = S.inv[idx].uid;
  save();
  vProfile();
}

function pinNFT(idx) {
  const uid = S.inv[idx].uid;
  if (S.pinned.includes(uid)) S.pinned = S.pinned.filter(u => u !== uid);
  else S.pinned.push(uid);
  save();
  vProfile();
}

function giveNFT(idx) {
  const item = S.inv[idx];
  const code = "STARS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  if (S.usedCodes.includes(code)) return giveNFT(idx); // повтор при коллизии
  S.usedCodes.push(code);
  alert(`Код для передачи: ${code}\n\nОтправьте этот код другу. Он сможет активировать его в боте.`);
  // Здесь можно добавить отправку кода через sendData в бот, если нужно
  save();
}

