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
/* ================= АПГРЕЙДЕР ================= */
function upgCost(it) { return [600, 1800, 6000, 25000][it.def.rar] || 0; }
function upgChance(it) { return [55, 40, 25, 12][it.def.rar] || 0; }

let upgSel = null;
function upgPick(uid) { upgSel = uid; vUpgrade(); }

function vUpgrade() {
  const u = $("#upgrade"); if (!u) return;
  if (!S.inv.length) { u.innerHTML = `<div class="card center"><p class="dim">Сначала открой кейс — улучшать пока нечего.</p></div>`; return; }
  if (!S.inv.some(i => i.uid === upgSel)) upgSel = S.inv[0].uid;
  const it = S.inv.find(i => i.uid === upgSel);
  const maxed = it.def.rar >= 4;
  const ch = upgChance(it), cost = upgCost(it);
  const opts = S.inv.map(i => `<option value="${i.uid}" ${i.uid === upgSel ? "selected" : ""}>${i.def.emoji} ${i.def.name}</option>`).join("");
  const nxt = R(Math.min(it.def.rar + 1, 4));
  u.innerHTML = `
    <div class="card">
      <h3>🔺 Апгрейдер</h3>
      <p class="dim">При неудаче NFT сгорает. Риск — дело благородное.</p>
      <select id="upgSel" onchange="upgPick(+this.value)">${opts}</select>
      <div class="upg-row">
        <div class="ncard" style="background:${it.custom ? CBG_CSS[it.custom] : R(it.def.rar).bg}">
          <div class="nc-emoji">${it.def.emoji}</div>
          <div class="nc-name">${it.def.name}</div>
          <div class="nc-rar" style="color:${R(it.def.rar).c}">${R(it.def.rar).n}</div>
        </div>
        <div class="upg-arrow">${maxed ? "MAX" : "➜"}</div>
        <div class="ncard" style="background:${nxt.bg};opacity:${maxed ? .4 : 1}">
          <div class="nc-emoji">${it.def.emoji}</div>
          <div class="nc-name">${it.def.name}</div>
          <div class="nc-rar" style="color:${nxt.c}">${nxt.n}</div>
        </div>
      </div>
      <div class="ring" id="ring" style="background:conic-gradient(#ffd75e 0% ${ch}%, #26262f ${ch}% 100%)">
        <div class="ring-in"><span id="ringPct">${ch}%</span></div>
      </div>
      <div class="center">
        ${maxed ? `<p class="gold-text">Максимальная редкость — выше только боги.</p>`
                : `<button class="btn" id="btnSpin" onclick="doSpin()">Крутить · ${fmt(cost)} ⭐</button>`}
      </div>
    </div>`;
}

async function doSpin() {
  const it = S.inv.find(i => i.uid === upgSel);
  if (!it) return;
  const cost = upgCost(it), ch = upgChance(it);
  if (S.bal < cost) return alert("Не хватает звёзд на прокрут!");
  S.bal -= cost; save(); updBal();
  const btn = $("#btnSpin"); if (btn) { btn.disabled = true; btn.textContent = "Крутим…"; }
  const success = Math.random() * 100 < ch;
  const show = success ? ch : Math.max(0, ri(0, ch - 1));
  const pct = $("#ringPct"), ring = $("#ring");
  for (let k = 0; k <= 20; k++) {
    const p = Math.round(show * k / 20);
    if (pct) pct.textContent = p + "%";
    if (ring) ring.style.background = `conic-gradient(#ffd75e 0% ${p}%, #26262f ${p}% 100%)`;
    await sleep(80);
  }
  await sleep(400);
  const m = el("div", "modal");
  if (success) {
    it.def = Object.assign({}, it.def, { rar: Math.min(it.def.rar + 1, 4), val: Math.round(it.def.val * 1.8) });
    it.custom = rnd(CBG); it.rarUp = (it.rarUp || 0) + 1;
    m.innerHTML = `<div class="modal-content center">
      <h3 class="gold-text">✨ УСПЕХ!</h3>
      <div class="ncard" style="background:${CBG_CSS[it.custom]}">
        <div class="nc-emoji" style="font-size:54px">${it.def.emoji}</div>
        <div class="nc-name">${it.def.name}</div>
        <div class="nc-rar" style="color:${R(it.def.rar).c}">${R(it.def.rar).n}</div>
        <div class="dim">Ценность выросла: ${fmt(instVal(it))} ⭐</div>
      </div>
      <button class="btn" onclick="this.closest('.modal').remove();nav('upgrade')">Крутить ещё</button></div>`;
  } else {
    S.inv = S.inv.filter(i => i.uid !== it.uid);
    if (S.worn === it.uid) S.worn = null;
    S.pinned = S.pinned.filter(u2 => u2 !== it.uid);
    m.innerHTML = `<div class="modal-content center">
      <h3 style="color:#ff6b7d">💥 ПРОВАЛ</h3>
      <div class="ncard" style="filter:grayscale(1)">
        <div class="nc-emoji" style="font-size:54px">💀</div>
        <div class="nc-name">${it.def.name} сгорел</div>
        <div class="dim">Такова цена амбиций…</div>
      </div>
      <button class="btn red" onclick="this.closest('.modal').remove();nav('upgrade')">Попробовать другой</button></div>`;
  }
  document.body.appendChild(m);
  save();
}

/* ================= КЕЙСЫ ================= */
function vCases() {
  const c = $("#cases"); if (!c) return;
  c.innerHTML = `<h3 class="sec-title">🎰 Кейсы · ${CASES.length} шт.</h3>
    <div class="grid">${CASES.map((cs, i) => `
      <button class="case" onclick="openCase(${i})">
        <div class="cface">${cs.emoji}</div>
        <div class="cname">${cs.name}</div>
        <div class="cprice gold-text">${fmt(cs.price)} ⭐</div>
      </button>`).join("")}</div>`;
}

function openCase(i) {
  const cs = CASES[i];
  if (S.bal < cs.price) return alert("Не хватает звёзд на этот кейс!");
  S.bal -= cs.price; save(); updBal();
  const pool = CASE_ITEMS[i];
  const won = pool[ri(0, 4)];
  const N = 64, WIN = 56;
  let strip = "";
  for (let k = 0; k < N; k++) {
    const d = k === WIN ? won : pool[ri(0, 4)];
    strip += `<div class="rcard" style="background:${R(d.rar).bg}"><div>${d.emoji}</div><div class="rname">${d.name}</div></div>`;
  }
  const wrap = el("div", "modal");
  wrap.innerHTML = `<div class="modal-content">
    <h3 class="center">${cs.emoji} ${cs.name}</h3>
    <div class="ribbon-wrap"><div class="ribbon" id="rib">${strip}</div></div>
    <p class="center dim">Крутим…</p></div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const rib = $("#rib"), box = wrap.querySelector(".ribbon-wrap");
    const CARD = 100;
    const off = WIN * CARD - box.clientWidth / 2 + CARD / 2 - ri(-28, 28);
    rib.style.transition = "transform 4.6s cubic-bezier(.12,.75,.18,1)";
    rib.style.transform = `translateX(-${off}px)`;
  }));
  setTimeout(() => {
    wrap.remove();
    S.inv.push(mkInst(won));
    save();
    revealModal(won);
  }, 4900);
}

function revealModal(d) {
  const m = el("div", "modal");
  m.innerHTML = `<div class="modal-content center">
    <div class="ncard bigpop" style="background:${R(d.rar).bg}">
      <div class="nc-emoji" style="font-size:56px">${d.emoji}</div>
      <div class="nc-name" style="font-size:18px">${d.name}</div>
      <div class="nc-rar" style="color:${R(d.rar).c}">${R(d.rar).n}</div>
      <div class="dim">Ценность: ${fmt(d.val)} ⭐</div>
    </div>
    <button class="btn" onclick="closeReveal()">Забрать!</button></div>`;
  document.body.appendChild(m);
}
function closeReveal() { const m = document.querySelector(".modal"); if (m) m.remove(); nav("cases"); }

/* ================= БАТЛ ================= */
const BT = { on: false, ci: 0, bot: null, round: 0, mine: [], theirs: [], stake: 0 };

function btReset() { BT.on = false; nav("battle"); }

function vBattle() {
  const b = $("#battle"); if (!b) return;
  if (!BT.on) {
    b.innerHTML = `<h3 class="sec-title">⚔️ Батл · 3 раунда</h3>
      <div class="card"><p class="dim">Вы и соперник по очереди открываете кейсы. У кого выбитые NFT в сумме дороже — забирает ОБЕ ставки!</p></div>
      <h3 class="sec-title">Выберите кейс — ставка равна его цене</h3>
      <div class="grid">${CASES.map((cs, i) => `
        <button class="case" onclick="btStart(${i})">
          <div class="cface">${cs.emoji}</div>
          <div class="cname">${cs.name}</div>
          <div class="cprice gold-text">ставка ${fmt(cs.price)} ⭐</div>
        </button>`).join("")}</div>`;
    return;
  }
  const c = CASES[BT.ci];
  const sm = BT.mine.reduce((a, d) => a + d.val, 0);
  const st = BT.theirs.reduce((a, d) => a + d.val, 0);
  b.innerHTML = `<div class="card">
    <div class="bt-head"><span>${BT.bot.emoji} ${BT.bot.name}</span><span class="gold-text">${c.emoji} ${c.name}</span><span>Вы</span></div>
    <div class="bt-score"><span>${fmt(st)} ⭐</span><span class="dim">Раунд ${Math.min(BT.round, 3)}/3</span><span>${fmt(sm)} ⭐</span></div>
    <div class="bt-items">${BT.theirs.map(d => d.emoji).join(" ") || "—"} <b>vs</b> ${BT.mine.map(d => d.emoji).join(" ") || "—"}</div>
  </div>`;
}

function btStart(ci) {
  const cs = CASES[ci];
  if (S.bal < cs.price) return alert("Не хватает звёзд на ставку!");
  S.bal -= cs.price; save(); updBal();
  const bn = rnd(BOTS);
  Object.assign(BT, { on: true, ci, round: 0, mine: [], theirs: [], stake: cs.price, bot: { name: bn[0], emoji: bn[1] } });
  nav("battle");
  btRound();
}

async function btRound() {
  BT.round++;
  const pool = CASE_ITEMS[BT.ci];
  vBattle();
  await sleep(500);
  const mine = pool[ri(0, 4)];
  await roundPop("Вы открыли", mine);
  BT.mine.push(mine); vBattle();
  await sleep(700);
  const theirs = pool[ri(0, 4)];
  await roundPop(`${BT.bot.name} открыл`, theirs);
  BT.theirs.push(theirs); vBattle();
  if (BT.round >= 3) btFinish(); else { await sleep(800); btRound(); }
}

function roundPop(who, d) {
  return new Promise(res => {
    const m = el("div", "modal");
    m.innerHTML = `<div class="modal-content center">
      <p class="dim">${who}</p>
      <div class="ncard" style="background:${R(d.rar).bg}">
        <div class="nc-emoji" style="font-size:48px">${d.emoji}</div>
        <div class="nc-name">${d.name}</div>
        <div class="nc-rar" style="color:${R(d.rar).c}">${R(d.rar).n}</div>
        <div class="gold-text">${fmt(d.val)} ⭐</div>
      </div></div>`;
    document.body.appendChild(m);
    setTimeout(() => { m.remove(); res(); }, 1500);
  });
}

function btFinish() {
  const sm = BT.mine.reduce((a, d) => a + d.val, 0);
  const st = BT.theirs.reduce((a, d) => a + d.val, 0);
  const win = sm >= st;
  BT.mine.forEach(d => S.inv.push(mkInst(d)));
  if (win) S.bal += BT.stake * 2;
  BT.on = false;
  const m = el("div", "modal");
  m.innerHTML = `<div class="modal-content center">
    <h3>${win ? "🏆 Вы забрали обе ставки!" : "😢 Соперник забрал обе ставки"}</h3>
    <p>${fmt(sm)} ⭐ против ${fmt(st)} ⭐</p>
    ${win ? `<p class="gold-text">+${fmt(BT.stake * 2)} ⭐ призовых</p>` : ""}
    <button class="btn" onclick="this.closest('.modal').remove();nav('battle')">Ещё батл!</button></div>`;
  document.body.appendChild(m);
  save(); updBal();
}

/* ================= ЛИДЕРЫ ================= */
let LEADBOTS = [];
function initBots() {
  const all = Object.values(DEF);
  LEADBOTS = BOTS.map(b => ({
    name: b[0], emoji: b[1],
    bal: ri(40000, 2500000),
    inv: Array.from({ length: ri(2, 9) }, () => mkInst(all[ri(0, all.length - 1)]))
  }));
}

function vLeaders() {
  const l = $("#leaders"); if (!l) return;
  const rows = LEADBOTS.map(b => ({ me: false, name: b.name, emoji: b.emoji, total: b.bal + b.inv.reduce((a, i) => a + instVal(i), 0) }))
    .concat([{ me: true, name: user.first_name, emoji: "🙂", total: S.bal + S.inv.reduce((a, i) => a + instVal(i), 0) }]);
  rows.sort((a, b) => b.total - a.total);
  const medals = ["🥇", "🥈", "🥉"];
  l.innerHTML = `<h3 class="sec-title">🏆 Лидеры</h3>` + rows.slice(0, 11).map((r, i) =>
    `<div class="lead-row ${r.me ? "me" : ""}">
      <span class="medal">${medals[i] || (i + 1) + "."}</span>
      <span class="le">${r.emoji} ${r.name}${r.me ? " (вы)" : ""}</span>
      <span class="lt gold-text">${fmt(r.total)} ⭐</span>
    </div>`).join("");
}

/* ================= ПРОФИЛЬ (стиль Telegram) ================= */
function vProfile() {
  const p = $("#profile"); if (!p) return;
  const wornIt = S.inv.find(i => i.uid === S.worn);
  const total = S.inv.reduce((a, i) => a + instVal(i), 0);
  const pinnedFirst = [...S.inv].sort((a, b) => (S.pinned.includes(b.uid) ? 1 : 0) - (S.pinned.includes(a.uid) ? 1 : 0));
  p.innerHTML = `
    <div class="card center">
      <div class="avatar">${wornIt ? wornIt.def.emoji : "🙂"}</div>
      <h3>${user.first_name}</h3>
      <p class="dim">Баланс: <span class="gold-text">${fmt(S.bal)} ⭐</span> · NFT: ${S.inv.length} · на сумму ${fmt(total)} ⭐</p>
      ${wornIt ? `<p>👑 Носит: <b>${wornIt.def.emoji} ${wornIt.def.name}</b></p>` : ""}
      <button class="btn gray" onclick="codeRedeem()">🎟 Ввести код друга</button>
    </div>
    <div class="grid">${pinnedFirst.map(i => `
      <button class="ncard tcard" style="background:${i.custom ? CBG_CSS[i.custom] : R(i.def.rar).bg}" onclick="nftDetail(${i.uid})">
        ${S.worn === i.uid ? '<div class="crown">👑</div>' : ""}${S.pinned.includes(i.uid) ? '<div class="pin">📌</div>' : ""}
        <div class="nc-emoji">${i.def.emoji}</div>
        <div class="nc-name">${i.def.name}</div>
        <div class="nc-rar" style="color:${R(i.def.rar).c}">${R(i.def.rar).n}</div>
      </button>`).join("")}</div>
    ${S.inv.length ? "" : `<div class="card center dim">Пока пусто — открой первый кейс!</div>`}`;
}

function nftDetail(uid) {
  const idx = S.inv.findIndex(i => i.uid === uid);
  if (idx < 0) return;
  const it = S.inv[idx];
  const qty = S.inv.filter(x => x.def.id === it.def.id).length;
  const m = el("div", "modal");
  m.innerHTML = `<div class="modal-content">
    <div class="ncard center" style="background:${it.custom ? CBG_CSS[it.custom] : R(it.def.rar).bg}">
      <div class="nc-emoji" style="font-size:60px">${it.def.emoji}</div>
      <div class="nc-name" style="font-size:19px">${it.def.name}</div>
      <div class="nc-rar" style="color:${R(it.def.rar).c}">${R(it.def.rar).n}</div>
    </div>
    <table class="props">
      <tr><td>Владелец</td><td>${user.first_name}</td></tr>
      <tr><td>Модель</td><td>${it.def.name}</td></tr>
      <tr><td>Узор</td><td>${it.pat}</td></tr>
      <tr><td>Фон</td><td>${it.custom || it.back}</td></tr>
      <tr><td>Количество</td><td>${qty}</td></tr>
      <tr><td>Ценность</td><td class="gold-text">${fmt(instVal(it))} ⭐</td></tr>
    </table>
    <div class="btnrow">
      <button class="btn" onclick="giveNFT(${idx});this.closest('.modal').remove()">Передать</button>
      <button class="btn ${S.worn === it.uid ? "gray" : ""}" onclick="wearNFT(${idx});this.closest('.modal').remove()">Носить</button>
      <button class="btn ${S.pinned.includes(it.uid) ? "gray" : ""}" onclick="pinNFT(${idx});this.closest('.modal').remove()">📌</button>
    </div>
    <div class="btnrow">
      <button class="btn gray" onclick="sellFromDetail(${idx});this.closest('.modal').remove()">Продать</button>
      <button class="btn gray" onclick="this.closest('.modal').remove()">Закрыть</button>
    </div></div>`;
  document.body.appendChild(m);
}

function sellFromDetail(idx) {
  const it = S.inv[idx];
  const price = +(prompt("Цена в звёздах:", Math.round(instVal(it) * 1.2)) || 0);
  if (price < 1) return;
  S.market.push({ def: it.def, pat: it.pat, back: it.back, custom: it.custom, price, seller: user.first_name });
  S.inv.splice(idx, 1);
  if (S.worn === it.uid) S.worn = null;
  S.pinned = S.pinned.filter(u => u !== it.uid);
  save(); vProfile();
}

function giveNFT(idx) {
  const it = S.inv[idx];
  let code = "STARS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  while (S.usedCodes.includes(code)) code = "STARS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  S.usedCodes.push(code);
  S.inv.splice(idx, 1);
  if (S.worn === it.uid) S.worn = null;
  S.pinned = S.pinned.filter(u => u !== it.uid);
  save();
  const link = "https://t.me/" + BOT_USERNAME + "?start=" + code;
  const m = el("div", "modal");
  m.innerHTML = `<div class="modal-content center">
    <h3>📤 Передача NFT</h3>
    <p class="dim">${it.def.emoji} ${it.def.name} закреплён за кодом.</p>
    <div class="codebox">${code}</div>
    <button class="btn" id="btnGoBot">Открыть бота у друга</button>
    <button class="btn gray" onclick="this.closest('.modal').remove()">Закрыть</button></div>`;
  document.body.appendChild(m);
  m.querySelector("#btnGoBot").addEventListener("click", () => {
    if (tg && tg.openTelegramLink) tg.openTelegramLink(link);
    else if (navigator.clipboard) navigator.clipboard.writeText(code);
  });
}

function codeRedeem() {
  const code = prompt("Введите код STARS-XXXXXX от друга:");
  if (!code) return;
  const c = code.trim().toUpperCase();
  if (!/^STARS-[A-Z0-9]{6}$/.test(c)) return alert("Неверный формат кода!");
  if (S.usedCodes.includes(c)) return alert("Этот код уже активирован в этом приложении.");
  S.usedCodes.push(c);
  const pool = Object.values(DEF);
  const gift = mkInst(pool.filter(d => d.rar <= 2)[ri(0, 4)] || pool[0]);
  S.inv.push(gift);
  save();
  alert("🎁 Принято! Вам зачислен: " + gift.def.emoji + " " + gift.def.name);
  vProfile();
}

/* ================= НАВИГАЦИЯ ================= */
const VIEWS = { cases: vCases, market: vMarket, upgrade: vUpgrade, battle: vBattle, leaders: vLeaders, profile: vProfile };
function nav(id) {
  document.querySelectorAll(".page-sec").forEach(s => { s.hidden = s.id !== id; });
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.dataset.t === id));
  VIEWS[id] && VIEWS[id]();
}
function updBal() { const b = $("#bal"); if (b) b.textContent = fmt(S.bal); }

/* ================= ПАТЧ СОХРАНЕНИЯ (апгрейды переживают перезагрузку) ================= */
save = function () {
  try {
    localStorage.setItem("nftcasino_v1", JSON.stringify({
      uidSeq,
      inv: S.inv.map(i => [i.def.id, i.pat, i.back, i.custom, i.rarUp || 0]),
      worn: S.worn, pinned: S.pinned,
      market: S.market.map(m => [m.def.id, m.pat, m.back, m.custom, m.price, m.seller]),
      usedCodes: S.usedCodes
    }));
  } catch (e) {}
};
load = function () {
  try {
    const d = JSON.parse(localStorage.getItem("nftcasino_v1"));
    if (!d) return false;
    uidSeq = d.uidSeq || 1;
    const fix = a => {
      const base = DEF[a[0]]; if (!base) return null;
      const up = a[4] || 0;
      const def = up ? Object.assign({}, base, { rar: Math.min(base.rar + up, 4), val: Math.round(base.val * Math.pow(1.8, up)) }) : base;
      return { uid: uidSeq++, def, pat: a[1], back: a[2], custom: a[3] || null, rarUp: up };
    };
    S.inv = (d.inv || []).map(fix).filter(Boolean);
    S.worn = d.worn; S.pinned = d.pinned || [];
    S.market = (d.market || []).map(a => DEF[a[0]] ? { def: DEF[a[0]], pat: a[1], back: a[2], custom: a[3], price: a[4], seller: a[5] } : null).filter(Boolean);
    S.usedCodes = d.usedCodes || [];
    return true;
  } catch (e) { return false; }
};

/* ================= ФИНАЛИЗАЦИЯ ================= */
// баланс всегда 9 999 999 при входе (по плану сейв его не хранит)
S.bal = 9999999;

// если init из части 1 уже отработал — перечитываем сейв и перерисовываем
try {
  S.inv = []; S.market = []; S.worn = null; S.pinned = [];
  load(); initBots(); updBal(); nav("cases");
} catch (e) {}

// экспорт обработчиков для inline onclick (иначе они не видны из IIFE)
Object.assign(window, {
  nav, openCase, closeReveal, btStart, btReset, upgPick, doSpin,
  nftDetail, wearNFT, pinNFT, giveNFT, sellFromDetail, codeRedeem,
  confirmSell, buyNFT
});

// alert("JS РАБОТАЕТ"); // ← после проверки удали эту строку

})();
    
