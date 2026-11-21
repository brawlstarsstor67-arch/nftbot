(() => {
"use strict";

/* ================= TELEGRAM ================= */
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) { try { tg.ready(); tg.expand(); tg.setHeaderColor("#0b0b12"); tg.setBackgroundColor("#0b0b12"); } catch (e) {} }

/* юзернейм бота без @ — для передачи NFT по коду */
const BOT_USERNAME = "vazikonov_case_bot";

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
const SUF   = ["Mini","Pro","Prime","Elite","Omega"];
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
      inv: S.inv.map(i => [i.def.id, i.pat, i.back, i.custom, i.rarUp || 0]),
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
}

/* вкладки: слушатели ставим здесь, а nav объявлена ниже (hoisting сработает) */
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => nav(t.dataset.t)));
    window.confirmSell = confirmSell;
  Object.assign(window, {
  $, nav, openCase, closeReveal, btStart, btReset, upgPick, doSpin,
  nftDetail, wearNFT, pinNFT, giveNFT, sellFromDetail, codeRedeem,
  buyNFT
});

})();
