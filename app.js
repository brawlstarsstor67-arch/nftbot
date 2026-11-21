const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const ME = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || { id: 777000, first_name: "Гость", photo_url: null, username: null };
const ADMIN_ID = 8906194733;
const MAX_STARS = 999999999;
const IS_ADMIN = ME.id == ADMIN_ID;
const KEY = "casino_" + ME.id;
const MKT_KEY = "casino_market_v1";

const GIFTS = [
["Durov's Glasses","👓","Мифический",1500000],["Plush Pepe","🐸","Мифический",1000000],
["Swiss Watch","⌚","Мифический",500000],["Heart Locket","🫀","Мифический",450000],
["Scared Cat","🐱","Мифический",400000],["Loot Bag","💰","Мифический",350000],
["Durov's Cap","🧢","Мифический",300000],["Ion Gem","💎","Мифический",250000],
["Precious Peach","🍑","Мифический",200000],
["Signet Ring","💍","Легендарный",100000],["Vintage Cigar","🚬","Легендарный",80000],
["Mini Oscar","🏆","Легендарный",75000],["Khabib's Papakha","🎩","Легендарный",70000],
["Heroic Helmet","🛡️","Легендарный",60000],["Neko Helmet","😼","Легендарный",55000],
["Astral Shard","🔮","Легендарный",50000],["Magic Potion","🧪","Легендарный",45000],
["Genie Lamp","🪔","Легендарный",40000],["Eternal Rose","🌹","Легендарный",35000],
["Sharp Tongue","👅","Легендарный",30000],["Sleigh Bell","🔔","Легендарный",25000],
["Restless Jar","🫙","Эпический",20000],["Voodoo Doll","🪆","Эпический",15000],
["Tama Gadget","📟","Эпический",12000],["Record Player","📻","Эпический",10000],
["Cosmic Rocket","🚀","Эпический",9000],["Diamond Flower","💮","Эпический",8000],
["Trapped Heart","💔","Эпический",7000],["Happy Brownie","🍫","Эпический",6000],
["Pet Snake","🐍","Эпический",5500],["Winter Wreath","🎄","Эпический",5000],
["Berry Box","🍒","Эпический",4500],["Money Pot","🏺","Эпический",4000],
["Jingle Bells","🛎️","Эпический",3500],["Bow Ties","🎀","Эпический",2000],
["Hanging Stars","⭐","Эпический",1800],["Kissed Frog","💋","Эпический",1500],
["Easter Egg","🥚","Редкий",1500],["Jolly Chimp","🐵","Редкий",1200],
["Lol Pop","🍭","Редкий",1000],["Snoop Dogg","🐕","Редкий",900],
["Vice Cream","🍦","Редкий",800],["Chill Flame","🔥","Редкий",700],
["Snow Globe","🌐","Редкий",600],["Santa Hat","🎅","Редкий",500],
["Spring Basket","🧺","Редкий",450],["Eternal Candle","🕯️","Редкий",400],
["Big Year","🐭","Редкий",350],["Faith Amulet","🧿","Редкий",300],
["Fresh Socks","🧦","Редкий",250],["Crafted Cake","🍰","Редкий",200],
["Toy Bear","🧸","Обычный",150],["Sparkles","🎇","Обычный",120],
["Joystick","🕹️","Обычный",100],["Homemade Cake","🎂","Обычный",90],
["Spicy Ramen","🍜","Обычный",80],["Hex Pot","🫖","Обычный",70],
["Evil Eye","👁️","Обычный",60],["Handshake","🤝","Обычный",50],
["Whip","🪢","Обычный",40],["Jack-in-the-Box","🃏","Обычный",35],
["Westside Sign","🤙","Обычный",30]
];

const RAR = ["Обычный","Редкий","Эпический","Легендарный","Мифический"];
const REMO = {"Обычный":"⚪","Редкий":"🔵","Эпический":"🟣","Легендарный":"🟠","Мифический":"🔴"};
const G = {};
GIFTS.forEach(function(g){ G[g[0]] = g; });

const RARBG = {
  "Обычный":"linear-gradient(160deg,#4a5568,#2d3748)",
  "Редкий":"linear-gradient(160deg,#2b6cb0,#1a365d)",
  "Эпический":"linear-gradient(160deg,#6b46c1,#44337a)",
  "Легендарный":"linear-gradient(160deg,#d69e2e,#9b2c2c)",
  "Мифический":"linear-gradient(160deg,#b83280,#702459)"
};

const PATTERNS = ["Aztec Falcon","Dotted Purple","Snake Garden","Cosmic Swirl","Gold Orbit","Ice Bloom"];

const BGS = [
  ["Pacific Green",20],["Midnight Blue",20],["Rose Dawn",18],
  ["Violet Haze",16],["Golden Sunset",12],["Onyx Black",3],["Rainbow",1]
];
const SUPPLY = {"Обычный":500000,"Редкий":200000,"Эпический":100000,"Легендарный":50000,"Мифический":10000};

function pickWeighted(arr) {
  const total = arr.reduce(function(a,b){ return a+b[1]; }, 0);
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) { r -= arr[i][1]; if (r <= 0) return arr[i][0]; }
  return arr[0][0];
}

function makeAttrs(g) {
  const max = SUPPLY[g[2]];
  const minted = Math.floor(Math.random() * max * 0.9) + 1;
  return {
    serial: Math.floor(Math.random() * 499999) + 1,
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    bg: pickWeighted(BGS),
    minted: minted,
    max: max,
    modelPct: Math.max(0.1, Math.round(max / minted * 10) / 10),
    valueUsd: Math.max(1, Math.round(g[3] / 25000))
  };
}

function nftVisual(n) {
  if (n.hue !== undefined) return ["", ' style="background:linear-gradient(160deg,hsl(' + n.hue + ',75%,45%),hsl(' + ((n.hue+50)%360) + ',75%,20%))"'];
  if (n.attrs && n.attrs.bg === "Rainbow") return ["bg-rainbow", ""];
  if (n.attrs && n.attrs.bg === "Onyx Black") return ["bg-blackn", ""];
  return ["bg-" + G[n.gift][2], ""];
}

// ---------- Кейсы по тематикам (старые) ----------
const THEME_KEYS = {
  party: ["Santa Hat","Sleigh Bell","Winter Wreath","Jingle Bells","Berry Box","Big Year","Spring Basket","Easter Egg","Crafted Cake","Homemade Cake","Toy Bear","Sparkles","Fresh Socks"],
  hellow: ["Scared Cat","Voodoo Doll","Restless Jar","Evil Eye","Hex Pot","Chill Flame","Trapped Heart","Pet Snake","Jack-in-the-Box","Whip","Lol Pop","Snow Globe","Faith Amulet"],
  random: ["Toy Bear","Joystick","Homemade Cake","Spicy Ramen","Hex Pot","Evil Eye","Handshake","Whip","Jack-in-the-Box","Westside Sign","Easter Egg","Jolly Chimp","Lol Pop","Vice Cream","Chill Flame","Snow Globe"],
  premium: GIFTS.filter(function(g){ return g[2]==="Легендарный" || g[2]==="Мифический"; }).map(function(g){ return g[0]; })
};
const CASE_THEMES = [
  {key:"party", name:"🎉 Праздничные"},
  {key:"hellow", name:"🎃 Хеллоуин"},
  {key:"random", name:"🎲 Разные"},
  {key:"premium", name:"👑 Премиум"}
];
const CASE_TIERS = [
  {key:"s", name:"Малый", price:500, w:[92,8,0,0,0]},
  {key:"m", name:"Средний", price:5000, w:[70,25,4.6,0.4,0]},
  {key:"l", name:"Элитный", price:40000, w:[40,40,17,3,0]}
];
function casePool(themeKey) {
  return GIFTS.filter(function(g){ return THEME_KEYS[themeKey].indexOf(g[0]) >= 0; });
}
function caseItems(themeKey, tierKey) {
  const tier = CASE_TIERS.find(function(t){ return t.key === tierKey; });
  const pool = casePool(themeKey);
  const items = [];
  RAR.forEach(function(r, ri) {
    const inR = pool.filter(function(g){ return g[2] === r; });
    if (!inR.length || tier.w[ri] <= 0) return;
    const share = tier.w[ri] / inR.length;
    inR.forEach(function(g) {
      items.push({g: g, chance: Math.round(share * 10000) / 100});
    });
  });
  return items;
}
function rollCase(themeKey, tierKey) {
  const tier = CASE_TIERS.find(function(t){ return t.key === tierKey; });
  const pool = casePool(themeKey);
  const ti = tierPick(tier.w);
  const inR = pool.filter(function(g){ return g[2] === RAR[ti]; });
  return (inR.length ? inR : pool)[Math.floor(Math.random() * (inR.length || pool.length))];
}

function tierPick(w) {
  const total = w.reduce(function(a,b){ return a+b; }, 0);
  let r = Math.random() * total, s = 0;
  for (let i = 0; i < w.length; i++) { s += w[i]; if (r < s) return i; }
  return 0;
}

// ---------- Состояние ----------
let S = load();

S.nfts.forEach(function(n) {
  if (!n.attrs && G[n.gift]) n.attrs = makeAttrs(G[n.gift]);
});
if (IS_ADMIN) S.bal = MAX_STARS;
if (S.bal < 9999999) S.bal = 9999999;
save();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.nfts) {
      d.nick = d.nick || null;
      d.frames = d.frames || [];
      d.activeFrame = d.activeFrame || null;
      d.number = d.number || null;
      d.phoneBought = d.phoneBought || false;
      d.phone = d.phone || null;
      return d;
    }
  } catch (e) {}
  return { bal: 9999999, nfts: [], nid: 1, pin: null, status: null, friends: [], bonus: 0, color: "#ffc93c", theme: "default",
           nick: null, frames: [], activeFrame: null, number: null, phoneBought: false, phone: null };
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }

function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function addStars(v) { S.bal = Math.min(MAX_STARS, S.bal + v); }
function spend(v) { if (S.bal < v) return false; S.bal -= v; return true; }
function updateBal() { document.getElementById("bal").textContent = fmt(S.bal); }

function rndGift(tierName) {
  const pool = tierName ? GIFTS.filter(function(g){ return g[2] === tierName; }) : GIFTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Рынок (P2P) ----------
let MKT = loadMkt();
function loadMkt() {
  try {
    const d = JSON.parse(localStorage.getItem(MKT_KEY));
    if (d && d.list) return d;
  } catch (e) {}
  const d = { list: [], nextId: 1 };
  const sellers = ["Артём","Ксюша","Никита","Мария","Дмитрий","Аня","Тимур","Лиза"];
  for (let i = 0; i < 8; i++) {
    const g = rndGift();
    d.list.push({ id: d.nextId++, type: "gift", seller: sellers[i % sellers.length],
      gift: g[0], attrs: makeAttrs(g), price: Math.floor(g[3] * 1.1), mine: false });
  }
  localStorage.setItem(MKT_KEY, JSON.stringify(d));
  return d;
}
function saveMkt() { localStorage.setItem(MKT_KEY, JSON.stringify(MKT)); }

// ---------- Навигация ----------
let TAB = "roulette";
let MKT_TAB = "p2p";
let CUR_CASE = null;

function go(tab) {
  TAB = tab;
  document.querySelectorAll(".glass-nav .glass-btn").forEach(function(b) {
    b.classList.toggle("active", b.getAttribute("data-tab") === tab);
  });
  renderView();
}

const VIEWS = { roulette: vRoulette, cases: vCases, market: vMarket, inv: vInv, upg: vUpg, prof: vProf, extra: vExtra, board: vBoard };
function renderView() { (VIEWS[TAB] || vRoulette)(document.getElementById("view")); }

function toast(msg) { if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg); }

// ================= РУЛЕТКА =================
function vRoulette(v) {
  let h = '<div class="slot" id="slot">🎰</div>';
  h += '<div id="res" class="card">Выбери ставку</div>';
  [100,500,1000,5000].forEach(function(b) {
    h += '<button class="btn-glass full" onclick="spin(' + b + ')">Крутить на ' + fmt(b) + '</button>';
  });
  v.innerHTML = h;
}

function spin(bet) {
  if (S.bal < bet) return toast("Не хватает звёзд!");
  const slot = document.getElementById("slot");
  const res = document.getElementById("res");
  const frames = ["🍒 🍋 ⭐", "⭐ 🍒 7️⃣", "7️⃣ ⭐ 🍒", "🍋 7️⃣ ⭐"];
  let i = 0;
  spend(bet); save(); updateBal();
  res.textContent = "Крутим...";
  const iv = setInterval(function() { slot.textContent = frames[i++ % 4]; }, 120);
  setTimeout(function() {
    clearInterval(iv);
    const r = Math.random();
    let mult = 0;
    if (r >= 0.45) mult = r < 0.75 ? 2 : (r < 0.90 ? 3 : (r < 0.97 ? 5 : 10));
    if (mult === 0) {
      res.innerHTML = '<span style="color:#ff6b6b">💥 Проигрыш! −' + fmt(bet) + '</span>';
    } else {
      const win = bet * mult - bet;
      addStars(win); save(); updateBal();
      res.innerHTML = '<span style="color:#7dff8a">🎉 Выигрыш x' + mult + '! +' + fmt(win) + '</span>';
    }
  }, 1800);
}

// ================= КЕЙСЫ: 40 видов, в каждом 5 NFT =================
const CASE40_NAMES = [
  "Праздничный","Хеллоуин","Новогодний","Китайский","Зимний","Огненный","Ледяной","Драконий",
  "Космический","Пиратский","Стимпанк","Неоновый","Золотой","Алмазный","Ретро","Аркадный",
  "Пляжный","Лесной","Пустынный","Вулкан","Джунгли","Ночной","Утренний","Радужный",
  "Чёрный","Белый","Кибер","Робо","Магический","Мистический","Королевский","Ниндзя",
  "Самурай","Сладкий","Фруктовый","Ягодный","Кофейный","Чайный","Морозный","Алхимик"
];
const CASES40 = CASE40_NAMES.map(function(name, ci) {
  const items = [];
  for (let k = 0; k < 5; k++) items.push(GIFTS[(ci * 5 + k) % GIFTS.length]);
  let price = 0;
  items.forEach(function(g){ price += g[3]; });
  return { name: name, items: items, price: Math.round(price * 1.2) };
});

function vCases(v) {
  let h = '<div class="card">🎁 <b>40 кейсов</b> · в каждом 5 разных NFT, шанс каждого — 20%</div>';
  h += '<div class="case40-grid">';
  CASES40.forEach(function(c, i) {
    h += '<div class="case-card" onclick="case40Detail(' + i + ')">' +
      '<div class="em">🎁</div><div class="nm">' + c.name + '</div>' +
      '<div class="pr">' + fmt(c.price) + ' ⭐</div></div>';
  });
  h += '</div>';
  v.innerHTML = h;
}

function case40Detail(i) {
  const c = CASES40[i];
  let h = '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>' +
    '<div class="case-detail-hero bg-Эпический"><div class="em floaty">🎁</div>' +
    '<b style="font-size:1.2rem">Кейс «' + c.name + '»</b><br>' +
    '<span class="muted">Цена: ' + fmt(c.price) + ' ⭐</span></div>' +
    '<div class="card" style="text-align:left"><b>Содержимое (по 20%):</b><br><br>';
  c.items.forEach(function(g) {
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
      '<span>' + REMO[g[2]] + ' ' + g[1] + ' ' + g[0] + '</span>' +
      '<span class="chip">20%</span>' +
      '<span style="color:#ffc93c;font-weight:700">' + fmt(g[3]) + ' ⭐</span></div>';
  });
  h += '</div>' +
    '<button class="ok-btn" onclick="openCase40(' + i + ')">🎲 Открыть за ' + fmt(c.price) + ' ⭐</button>' +
    '<button class="btn-glass full" onclick="battle40Setup(' + i + ')">⚔️ Батла на этом кейсе</button>';
  document.getElementById("view").innerHTML = h;
}

function openCase40(i) {
  const c = CASES40[i];
  if (!spend(c.price)) return toast("Не хватает звёзд!");
  save(); updateBal();
  const g = c.items[Math.floor(Math.random() * 5)];
  const v = document.getElementById("view");
  v.innerHTML = reelView("🎁 Открываем кейс «" + c.name + "»");
  fillReel(g[1]);
  spinReel(3, function() {
    setTimeout(function() {
      S.nfts.push({ id: S.nid++, gift: g[0], attrs: makeAttrs(g) });
      save(); updateBal();
      document.getElementById("reelres").innerHTML =
        '<div class="card pop bg-' + g[2] + '" style="font-size:4rem;padding:20px 0"><span class="spin3d">' + g[1] + '</span></div>' +
        '<div class="card">' + REMO[g[2]] + ' <b>Выпал ' + g[0] + '!</b><br>' + fmt(g[3]) + ' ⭐</div>' +
        '<button class="btn-glass full" onclick="openCase40(' + i + ')">🎲 Ещё раз</button>' +
        '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>' +
        '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>';
    }, 700);
  });
}

// ================= БАТЛА: по очереди, чей дроп дороже — забирает всё =================
let BAT40 = null;

function battle40Setup(i) {
  const c = CASES40[i];
  const stake = c.price * 3;
  document.getElementById("view").innerHTML =
    '<button class="btn-glass full" onclick="case40Detail(' + i + ')">⬅️ Назад</button>' +
    '<div class="card"><b>⚔️ БАТЛА · кейс «' + c.name + '»</b><br>' +
    'Три раунда. Ты и противник по очереди открываете кейсы. ' +
    'У кого выбитые NFT в сумме дороже — забирает ВСЁ.<br><br>' +
    'Ставка: <b>' + fmt(stake) + ' ⭐</b> (3 кейса с каждой стороны)</div>' +
    '<button class="ok-btn" onclick="battle40Start(' + i + ')">⚔️ Начать батлу за ' + fmt(stake) + ' ⭐</button>';
}

function battle40Start(i) {
  const stake = CASES40[i].price * 3;
  if (!spend(stake)) return toast("Не хватает звёзд!");
  BAT40 = { i: i, round: 0, mine: 0, bot: 0, mineItems: [], botItems: [] };
  save(); updateBal();
  battle40Screen();
}

function battle40Screen() {
  const c = CASES40[BAT40.i];
  const names = ["Артём","Ксюша","Никита","Дмитрий"];
  let h = '<div class="card"><b>⚔️ БАТЛА · «' + c.name + '»</b><br>' +
    'Раунд ' + (BAT40.round + 1) + ' из 3 · противник: ' + names[BAT40.round % 4] + '</div>' +
    '<div class="battle-row">' +
      '<div class="battle-card"><span class="muted">Ты</span><br><b>' + fmt(BAT40.mine) + ' ⭐</b>' +
        BAT40.mineItems.map(function(g){ return '<div class="em">' + g[1] + '</div>'; }).join('') + '</div>' +
      '<div class="battle-vs">VS</div>' +
      '<div class="battle-card"><span class="muted">Противник</span><br><b>' + fmt(BAT40.bot) + ' ⭐</b>' +
        BAT40.botItems.map(function(g){ return '<div class="em">' + g[1] + '</div>'; }).join('') + '</div>' +
    '</div>' +
    '<button class="ok-btn" onclick="battle40Open()">🎲 Открыть кейс (раунд ' + (BAT40.round + 1) + ')</button>';
  document.getElementById("view").innerHTML = h;
}

function battle40Open() {
  const c = CASES40[BAT40.i];
  const pg = c.items[Math.floor(Math.random() * 5)];
  const bg = c.items[Math.floor(Math.random() * 5)];
  BAT40.mine += pg[3];
  BAT40.bot += bg[3];
  BAT40.mineItems.push(pg);
  BAT40.botItems.push(bg);
  BAT40.round++;
  if (BAT40.round >= 3) return battle40Finish();
  battle40Screen();
  toast("Раунд " + BAT40.round + ": ты " + pg[0] + " (" + fmt(pg[3]) + " ⭐) · противник " + bg[0] + " (" + fmt(bg[3]) + " ⭐)");
}

function battle40Finish() {
  const stake = CASES40[BAT40.i].price * 3;
  const win = BAT40.mine >= BAT40.bot;
  if (win) addStars(stake * 2);
  save(); updateBal();
  let h = '<div class="card"><b>⚔️ Итог батлы</b></div>' +
    '<div class="battle-row">' +
      '<div class="battle-card' + (win ? ' win' : '') + '"><span class="muted">Ты</span><br><b>' + fmt(BAT40.mine) + ' ⭐</b>' +
        BAT40.mineItems.map(function(g){ return '<div class="em">' + g[1] + '</div>'; }).join('') + '</div>' +
      '<div class="battle-vs">VS</div>' +
      '<div class="battle-card' + (!win ? ' win' : '') + '"><span class="muted">Противник</span><br><b>' + fmt(BAT40.bot) + ' ⭐</b>' +
        BAT40.botItems.map(function(g){ return '<div class="em">' + g[1] + '</div>'; }).join('') + '</div>' +
    '</div>' +
    (win
      ? '<div class="card">🏆 <b>Победа!</b> Забираешь всё: +' + fmt(stake * 2) + ' ⭐</div>'
      : '<div class="card">💀 <b>Проигрыш.</b> Противник забрал ' + fmt(stake * 2) + ' ⭐</div>') +
    '<button class="ok-btn" onclick="battle40Start(' + BAT40.i + ')">⚔️ Ещё батла</button>' +
    '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>';
  document.getElementById("view").innerHTML = h;
  BAT40 = null;
}

// ================= ЛЕНТА =================
function reelView(title, zoneChance) {
  let zone = "";
  if (zoneChance !== undefined) {
    zone = '<div class="upg-zone" style="left:' + (50 - zoneChance/2) + '%;width:' + zoneChance + '%"></div>';
  }
  return '<div class="card">' + title + '</div>' +
    '<div class="upg-track" id="track">' + zone +
    '<div class="upg-arrow">▼</div><div class="upg-reel" id="reel"></div></div>' +
    '<div id="reelres" style="margin-top:8px"></div>';
}

function fillReel(finalEmoji) {
  const reel = document.getElementById("reel");
  let h = "";
  for (let i = 0; i < 46; i++) h += '<div class="upg-item">' + rndGift()[1] + '</div>';
  reel.innerHTML = h;
  reel.children[35].textContent = finalEmoji;
  reel.style.transition = "none";
  reel.style.transform = "translateX(0px)";
}

function spinReel(dur, onDone) {
  const reel = document.getElementById("reel");
  const track = document.getElementById("track");
  const w = 70;
  const offset = 35 * w + w/2 - track.clientWidth/2;
  requestAnimationFrame(function() {
    reel.style.transition = "transform " + dur + "s cubic-bezier(.12,.8,.2,1)";
    reel.style.transform = "translateX(-" + offset + "px)";
  });
  setTimeout(onDone, dur * 1000);
}

// ================= РЫНОК (P2P + ДОПОЛНЕНИЯ) =================
function vMarket(v) {
  let h = '<div class="mkt-tabs">' +
    '<button class="mkt-tab' + (MKT_TAB === "p2p" ? " on" : "") + '" onclick="mktTab(\'p2p\')">🤝 У игроков</button>' +
    '<button class="mkt-tab' + (MKT_TAB === "addons" ? " on" : "") + '" onclick="mktTab(\'addons\')">✨ Дополнения</button>' +
    '</div>';
  if (MKT_TAB === "p2p") {
    if (!MKT.list.length) {
      h += '<div class="card">Пока никто ничего не выставил</div>';
    }
    MKT.list.forEach(function(l) {
      if (l.type === "number") {
              if (l.type === "number") {
        h += '<div class="mkt-card"><div class="em">🔢</div><div class="mid">' +
          '<div class="who">Продавец: ' + l.seller + '</div>' +
          '<div class="nm">Номер профиля #' + l.number + '</div>' +
          '<div class="ser">Номер для профиля</div></div>' +
          '<button class="btn-glass buy" onclick="buyListing(' + l.id + ')">' + fmt(l.price) + ' ⭐</button></div>';
      } else {
        const g = G[l.gift];
        h += '<div class="mkt-card"><div class="em"><span class="spin3d">' + g[1] + '</span></div><div class="mid">' +
          '<div class="who">Продавец: ' + l.seller + '</div>' +
          '<div class="nm">' + g[0] + '</div>' +
          '<div class="ser">' + REMO[g[2]] + ' ' + g[2] + ' · #' + fmt(l.attrs.serial) + '</div></div>' +
          '<button class="btn-glass buy" onclick="buyListing(' + l.id + ')">' + fmt(l.price) + ' ⭐</button></div>';
      }
    });
  } else {
    h += vAddons();
  }
  v.innerHTML = h;
}

function mktTab(t) { MKT_TAB = t; renderView(); }

function buyListing(id) {
  const l = MKT.list.find(function(x){ return x.id === id; });
  if (!l) return;
  if (!spend(l.price)) return toast("Не хватает звёзд!");
  if (l.type === "number") {
    S.number = l.number;
  } else {
    S.nfts.push({ id: S.nid++, gift: l.gift, attrs: l.attrs });
  }
  MKT.list = MKT.list.filter(function(x){ return x.id !== id; });
  save(); saveMkt(); updateBal();
  toast("✅ Куплено!");
  renderView();
}

function listNft(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  document.getElementById("view").innerHTML =
    '<button class="btn-glass full" onclick="go(\'inv\')">⬅️ Назад</button>' +
    '<div class="card"><b>🛒 Выставить на продажу</b><br>' +
    '<br><span class="muted">Появится в разделе «У игроков». Снять — в любой момент.</span></div>' +
    '<input id="lprice" placeholder="Цена в ⭐ (например ' + fmt(Math.floor(G[n.gift][3]*1.1)) + ')">' +
    '<button class="ok-btn" onclick="confirmList(' + id + ')">Выставить</button>';
}

function confirmList(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  const p = parseInt(document.getElementById("lprice").value.replace(/\s/g, ""));
  if (!n || !p || p < 1) return toast("Укажи цену");
  MKT.list.push({ id: MKT.nextId++, type: "gift", seller: (S.nick || ME.first_name || "Ты"),
    gift: n.gift, attrs: n.attrs, price: p, mine: true });
  S.nfts = S.nfts.filter(function(x){ return x.id !== id; });
  clearMarks(id); save(); saveMkt();
  toast("🛒 Выставлено на продажу!");
  go("market");
}
function cancelList(id) {
  const l = MKT.list.find(function(x){ return x.id === id; });
  if (!l || !l.mine) return;
  MKT.list = MKT.list.filter(function(x){ return x.id !== id; });
  S.nfts.push({ id: S.nid++, gift: l.gift, attrs: l.attrs });
  saveMkt(); save();
  toast("Снято с продажи"); go("market");
}

// ---------- Дополнения ----------
const FRAMES = [
  {key:"neon", name:"Рамка «Неон»", price:1500},
  {key:"ice", name:"Рамка «Лёд»", price:2500},
  {key:"fire", name:"Рамка «Огонь»", price:4000},
  {key:"gold", name:"Рамка «Золото»", price:6000},
  {key:"rainbow", name:"Рамка «Радуга»", price:9000}
];

function vAddons() {
  let h = '<div class="card"><b>✨ Магазин дополнений</b></div>';

  FRAMES.forEach(function(f) {
    const owned = S.frames.indexOf(f.key) >= 0;
    const active = S.activeFrame === f.key;
    h += '<div class="addon-card"><div class="ic">🖼️</div><div class="mid">' +
      '<div class="nm">' + f.name + '</div>' +
      '<div class="ds">' + (owned ? (active ? "Надета" : "Куплена") : "Рамка для аватарки") + '</div></div>' +
      (owned
        ? '<button class="btn-glass buy" onclick="equipFrame(\'' + f.key + '\')">' + (active ? "Снять" : "Надеть") + '</button>'
        : '<button class="btn-glass buy" onclick="buyFrame(\'' + f.key + '\')">' + fmt(f.price) + ' ⭐</button>') +
      '</div>';
  });

  h += '<div class="addon-card"><div class="ic">🔢</div><div class="mid">' +
    '<div class="nm">Номер профиля</div>' +
    '<div class="ds">' + (S.number ? "Твой номер: #" + S.number : "Уникальный номер в профиле") + '</div></div>' +
    (S.number
      ? '<button class="btn-glass buy" onclick="sellNumber()">Продать</button>'
      : '<button class="btn-glass buy" onclick="buyNumber()">2500 ⭐</button>') +
    '</div>';

  h += '<div class="addon-card"><div class="ic">📱</div><div class="mid">' +
    '<div class="nm">Телефон в профиле</div>' +
    '<div class="ds">' + (S.phoneBought ? "Открыт — можно добавить номер" : "Скрытый номер телефона") + '</div></div>' +
    (S.phoneBought ? '' : '<button class="btn-glass buy" onclick="buyPhone()">1000 ⭐</button>') +
    '</div>';

  return h;
}

function buyFrame(key) {
  const f = FRAMES.find(function(x){ return x.key === key; });
  if (!spend(f.price)) return toast("Не хватает звёзд!");
  S.frames.push(key);
  S.activeFrame = key;
  save(); updateBal();
  toast("🖼️ Рамка куплена и надета!");
  renderView();
}

function equipFrame(key) {
  S.activeFrame = (S.activeFrame === key) ? null : key;
  save();
  renderView();
}

function buyNumber() {
  if (!spend(2500)) return toast("Не хватает звёзд!");
  const rare = Math.random() < 0.05;
  S.number = rare ? Math.floor(Math.random() * 100) + 1 : Math.floor(Math.random() * 9000) + 1000;
  save(); updateBal();
  toast("🔢 Твой номер: #" + S.number);
  renderView();
}

function sellNumber() {
  if (!S.number) return;
  MKT.list.push({ id: MKT.nextId++, type: "number", seller: (S.nick || ME.first_name || "Ты"),
    number: S.number, price: 1500, mine: true });
  S.number = null;
  save(); saveMkt();
  toast("🔢 Номер выставлен за 1500 ⭐");
  go("market");
}

function buyPhone() {
  if (!spend(1000)) return toast("Не хватает звёзд!");
  S.phoneBought = true;
  save(); updateBal();
  toast("📱 Телефон разблокирован! Добавь номер в профиле");
  go("prof");
}

// ================= ИНВЕНТАРЬ =================
function vInv(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Пусто! Открой кейс или купи на маркет у игроков 🎁</div>'; return; }
  v.innerHTML = '<div class="tg-gift-grid">' + S.nfts.map(function(n) {
    const g = G[n.gift];
    const vis = nftVisual(n);
    const up = n.upgraded ? '<span class="up-badge">UP</span>' : '';
    const mark = (S.pin === n.id) ? '<span class="g-pin">📌</span>' : ((S.status === n.id) ? '<span class="g-pin">👑</span>' : '');
    const ser = n.attrs ? '<span class="g-serial">#' + fmt(n.attrs.serial) + '</span>' : '';
    return '<div class="gift-cell ' + vis[0] + '"' + vis[1] + ' onclick="menuNft(' + n.id + ')">' + ser + up + '<span class="spin3d">' + g[1] + '</span>' + mark + '</div>';
  }).join('') + '</div>';
}

// ================= КАРТОЧКА NFT (как в Telegram) =================
function menuNft(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  const g = G[n.gift];
  const a = n.attrs || makeAttrs(g);
  const vis = nftVisual(n);
  const bgChipCls = a.bg === "Rainbow" ? "chip gold" : (a.bg === "Onyx Black" ? "chip dark" : "chip");

  document.getElementById("view").innerHTML =
    '<div class="nft-hero ' + vis[0] + '"' + vis[1] + '>' +
      '<div class="serial-badge">#' + fmt(a.serial) + '</div>' +
      (a.bg === "Rainbow" ? '<div class="rare-badge">🌈 РАДУЖНЫЙ ФОН</div>' : '') +
      (a.bg === "Onyx Black" ? '<div class="rare-badge">⬛ ЧЁРНЫЙ ФОН</div>' : '') +
      '<div class="nft-emoji"><span class="spin3d">' + g[1] + '</span></div>' +
      '<div class="nft-title">' + g[0] + ' #' + fmt(a.serial) + '</div>' +
      '<div class="nft-sub">' + a.bg + ' · ' + a.pattern + '</div>' +
      '<div class="hero-row">' +
        '<button class="btn-glass" onclick="doTransfer(' + id + ')">🎁<br>Передать</button>' +
        (S.status === id
          ? '<button class="btn-glass" onclick="doUnwear()">👑<br>Снять</button>'
          : '<button class="btn-glass" onclick="doStatus(' + id + ')">👑<br>Носить</button>') +
        '<button class="btn-glass" onclick="doSell(' + id + ')">💱<br>Продать</button>' +
      '</div>' +
    '</div>' +
    '<table class="attr-table">' +
      '<tr><td>Владелец</td><td>👤 ' + (S.nick || ME.first_name || "Игрок") + (IS_ADMIN ? ' 👑' : '') + '</td></tr>' +
      '<tr><td>Модель</td><td>' + g[0] + '<span class="chip">' + a.modelPct + '%</span></td></tr>' +
      '<tr><td>Узор</td><td>' + a.pattern + '<span class="chip">' + (0.1 + Math.random() * 2).toFixed(1) + '%</span></td></tr>' +
      '<tr><td>Фон</td><td>' + a.bg + '<span class="' + bgChipCls + '">' + (a.bg === "Rainbow" ? "0.2%" : (a.bg === "Onyx Black" ? "0.5%" : "1.5%")) + '</span></td></tr>' +
      '<tr><td>Количество</td><td>' + fmt(a.minted) + '/' + fmt(a.max) + ' выпущено</td></tr>' +
      '<tr><td>Ценность</td><td>~' + a.valueUsd + ' $</td></tr>' +
    '</table>' +
    (n.upgraded ? '<div class="card"><span style="color:var(--accent)">✨ Улучшено — свой цвет фона!</span></div>' : '<div class="card"><span style="color:#5ac8fa;cursor:pointer" onclick="tryUpg(' + id + ')">⬆️ Улучшить (апгрейдер) ›</span></div>') +
    (S.pin === id
      ? '<div class="card"><span class="muted">Подарок виден в Вашем профиле. </span>' +
        '<span style="color:#5ac8fa;cursor:pointer" onclick="doUnpin(' + id + ')">Скрыть ›</span></div>'
      : '<div class="card"><span style="color:#5ac8fa;cursor:pointer" onclick="doPin(' + id + ')">📌 Закрепить в профиле ›</span></div>') +
    '<button class="btn-glass full" onclick="listNft(' + id + ')">🛒 Выставить на маркет</button>' +
    '<button class="ok-btn" onclick="go(\'inv\')">OK</button>';
}

function clearMarks(id) {
  if (S.pin === id) S.pin = null;
  if (S.status === id) S.status = null;
}

function doPin(id) { S.pin = id; save(); toast("📌 Закреплено в профиле!"); go("prof"); }
function doUnpin(id) { if (S.pin === id) S.pin = null; save(); toast("📌 Откреплено"); go("prof"); }
function doStatus(id) { S.status = id; save(); toast("👑 Новый статус надет (старый снят)"); go("prof"); }
function doUnwear() { S.status = null; save(); toast("👑 Статус снят"); go("prof"); }

function doSell(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  addStars(Math.floor(G[n.gift][3] * 0.7));
  S.nfts = S.nfts.filter(function(x){ return x.id !== id; });
  clearMarks(id); save(); updateBal();
  toast("Продано!"); go("inv");
}

function doTransfer(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  lastCode = "NFT-" + Math.random().toString(36).slice(2,10).toUpperCase() + "|" + n.gift;
  S.nfts = S.nfts.filter(function(x){ return x.id !== id; });
  clearMarks(id); save();
  document.getElementById("view").innerHTML =
    '<div class="card">🎁 NFT упакован в код. Отправь другу в чат:</div>' +
    '<div class="card"><b style="word-break:break-all">' + lastCode + '</b></div>' +
    '<button class="btn-glass full" onclick="copyText()">📋 Скопировать</button>' +
    '<button class="btn-glass full" onclick="go(\'inv\')">⬅️ Назад</button>';
}

let lastCode = "";
function copyText() {
  if (navigator.clipboard) navigator.clipboard.writeText(lastCode);
  toast("Скопировано — отправь другу в чат");
}

// ================= АПГРЕЙДЕР =================
function upgCost(n) {
  return Math.max(25, Math.floor(G[n.gift][3] * 0.01));
}

function vUpg(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Нет NFT для улучшения</div>'; return; }
  let h = '<div class="card">Каждое NFT можно улучшить <b>один раз</b>. Успех — редкость выше и свой цвет фона 🌈. Провал — 💥 сгорает.</div>';
  const ups = S.nfts.filter(function(n){ return !n.upgraded && RAR.indexOf(G[n.gift][2]) < 4; });
  if (!ups.length) h += '<div class="card">Все NFT уже улучшены ✨</div>';
  ups.forEach(function(n) {
    const g = G[n.gift];
    const next = RAR[RAR.indexOf(g[2]) + 1];
    h += '<div class="card" onclick="tryUpg(' + n.id + ')">' + g[1] + ' <b>' + g[0] + '</b><br>' +
      REMO[g[2]] + ' ' + g[2] + ' → ' + REMO[next] + ' ' + next +
      '<br><span class="muted">Открыть в апгрейдере ›</span></div>';
  });
  S.nfts.filter(function(n){ return n.upgraded; }).forEach(function(n) {
    const g = G[n.gift];
    h += '<div class="card">' + g[1] + ' <b>' + g[0] + '</b> <span class="up-badge" style="position:static;display:inline-block">UP ✨</span><br><span class="muted">Уже улучшено</span></div>';
  });
  v.innerHTML = h;
}

function tryUpg(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  if (n.upgraded) return toast("Это NFT уже улучшено!");
  const ti = RAR.indexOf(G[n.gift][2]);
  if (ti >= 4) return toast("Это максимум — Мифический!");
  const target = RAR[ti + 1];
  const cost = upgCost(n);
  const pool = GIFTS.filter(function(g){ return g[2] === target; });
  let avg = 0;
  pool.forEach(function(g){ avg += g[3]; });
  avg = avg / pool.length;
  const chance = Math.round(Math.min(85, Math.max(5, G[n.gift][3] / avg * 75)) * 100) / 100;
  const targetG = rndGift(target);
  const C = Math.round(2 * Math.PI * 78);

  document.getElementById("view").innerHTML =
    '<div class="upg2">' +
      '<div class="upg2-title">⬆ UPGRADER</div>' +
      '<div class="upg2-icons"><span>ℹ️</span><span>⚙️</span><span>🔊</span><span>⚡</span></div>' +
      '<div class="upg2-ringwrap">' +
        '<svg class="upg2-svg" viewBox="0 0 200 200">' +
          '<circle class="upg2-track" cx="100" cy="100" r="78"/>' +
          '<circle class="upg2-arc" cx="100" cy="100" r="78" stroke-dasharray="' + (chance/100*C).toFixed(1) + ' ' + C + '"/>' +
          '<circle class="upg2-inner" cx="100" cy="100" r="60"/>' +
        '</svg>' +
        '<div class="upg2-pct">' + chance + '%<span>' + (chance < 40 ? "низкий шанс" : (chance < 70 ? "средний шанс" : "высокий шанс")) + '</span></div>' +
        '<div class="upg2-tick l">50%</div><div class="upg2-tick r">50%</div><div class="upg2-tick top">100%</div>' +
      '</div>' +
      '<div class="upg2-cards">' +
        '<div class="upg2-item"><div class="cat">' + G[n.gift][2] + '</div><div class="nm">' + G[n.gift][0] + '</div><div class="em"><span class="spin3d">' + G[n.gift][1] + '</span></div><div class="pr">' + fmt(G[n.gift][3]) + ' ⭐</div></div>' +
        '<div class="upg2-item"><div class="cat">' + targetG[2] + '</div><div class="nm">' + targetG[0] + '</div><div class="em"><span class="spin3d">' + targetG[1] + '</span></div><div class="pr">' + fmt(targetG[3]) + ' ⭐</div></div>' +
      '</div>' +
      '<button class="upg2-btn" id="gobtn2" onclick="rollUpg(' + id + ',' + ti + ',' + chance + ',' + cost + ')">⬆ Крутить за ' + fmt(cost) + ' ⭐</button>' +
    '</div>' +
    '<button class="btn-glass full" onclick="go(\'upg\')">⬅️ Назад</button>';
}

function rollUpg(id, ti, chance, cost) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  if (n.upgraded) return toast("Уже улучшено!");
  if (!spend(cost)) return toast("Не хватает звёзд на апгрейд!");
  save(); updateBal();
  const btn = document.getElementById("gobtn2");
  if (btn) btn.remove();
  const win = Math.random() * 100 <= chance;
  const oldG = G[n.gift];
  const resultG = win ? rndGift(RAR[ti]) : oldG;

  document.getElementById("view").insertAdjacentHTML("beforeend", reelView("Крутим апгрейд..."));
  fillReel(resultG[1]);
  spinReel(4, function() {
    const track = document.getElementById("track");
    const res = document.getElementById("reelres");
    if (win) {
      track.classList.add("upg-flash-win");
      setTimeout(function() {
        const hue = Math.floor(Math.random() * 360);
        n.gift = resultG[0];
        n.attrs = makeAttrs(resultG);
        n.hue = hue;
        n.upgraded = true;
        save();
        res.innerHTML = '<div class="pop" style="background:linear-gradient(160deg,hsl(' + hue + ',75%,45%),hsl(' + ((hue+50)%360) + ',75%,20%));border-radius:20px;font-size:4rem;padding:30px 0;margin:0 12px 10px"><span class="spin3d">' + resultG[1] + '</span></div>' +
          '<div class="card">🎉 <b>АПГРЕЙД УДАЛСЯ!</b><br><b>' + resultG[0] + '</b><br>' + REMO[RAR[ti]] + ' ' + RAR[ti] +
          '<br><span style="color:var(--accent)">🌈 Получен свой цвет фона! Больше не улучшается.</span></div>' +
          '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>';
      }, 800);
    } else {
      track.classList.add("upg-flash-lose");
      setTimeout(function() {
        S.nfts = S.nfts.filter(function(x){ return x.id !== id; });
        clearMarks(id); save();
        res.innerHTML = '<div class="card pop">💥 <b>Провал!</b><br>' + oldG[1] + ' ' + oldG[0] + ' сгорел...</div>' +
          '<button class="btn-glass full" onclick="go(\'upg\')">⬅️ Апгрейдер</button>';
      }, 800);
    }
  });
}

// ================= ПРОФИЛЬ =================
function vProf(v) {
  const stN = S.status ? S.nfts.find(function(n){ return n.id === S.status; }) : null;

  if (stN) {
    const g = G[stN.gift];
    const a = stN.attrs || { serial: 0 };
    const vis = nftVisual(stN);
    v.innerHTML =
      '<div class="nft-hero ' + vis[0] + '"' + vis[1] + '>' +
        '<div class="serial-badge">#' + fmt(a.serial) + '</div>' +
        '<div class="nft-emoji"><span class="spin3d">' + g[1] + '</span></div>' +
        '<div class="nft-title">' + g[0] + ' #' + fmt(a.serial) + '</div>' +
        '<div class="hero-row">' +
          '<button class="btn-glass" onclick="go(\'inv\')">🎁<br>Инвентарь</button>' +
          '<button class="btn-glass" onclick="doUnwear()">👑<br>Снять</button>' +
          '<button class="btn-glass" onclick="doSell(' + stN.id + ')">💱<br>Продать</button>' +
        '</div>' +
      '</div>' +
      '<table class="attr-table">' +
        '<tr><td>Владелец</td><td>👤 ' + (S.nick || ME.first_name || "Игрок") + '</td></tr>' +
        '<tr><td>Статус</td><td>👑 Надет как статус</td></tr>' +
      '</table>' +
      '<div class="benefit"><div class="ico">💎</div><div><b>Мерцающий значок</b><span>Подарок отображается рядом с Вашим именем в виде сияющего значка.</span></div></div>' +
      '<div class="benefit"><div class="ico">🖼️</div><div><b>Уникальное оформление профиля</b><span>Цвет и фон профиля меняются на цвет и фон подарка.</span></div></div>' +
      '<div class="benefit"><div class="ico">✅</div><div><b>Подтверждение статуса владельца</b><span>При нажатии на значок откроется информация о нём и его владельце.</span></div></div>' +
      '<button class="ok-btn" onclick="doUnwear()">Снять статус</button>';
    return;
  }

  const pinN = S.pin ? S.nfts.find(function(n){ return n.id === S.pin; }) : null;
  const gift = pinN ? G[pinN.gift] : null;

  let heroBg = RARBG["Мифический"];
  if (pinN) heroBg = (nftVisual(pinN)[1] || "").replace(' style="background:', "").replace(/"$/, "") || RARBG[gift[2]];

  let pat = "";
  for (let i = 0; i < 18; i++) {
    pat += '<span style="left:' + (Math.random() * 90) + '%;top:' + (Math.random() * 95) + '%;transform:rotate(' + (Math.random() * 60 - 30).toFixed(0) + 'deg)">' + (gift ? gift[1] : "✦") + '</span>';
  }

  const frameCls = S.activeFrame ? " fr-" + S.activeFrame : "";
  const phoneRow = S.phoneBought
    ? '<div class="row" onclick="editPhone()"><div class="val">📱 ' + (S.phone ? S.phone : "Добавить номер…") + '</div><div class="lbl">Телефон (только ты видишь)</div></div>'
    : '';

  let h =
  '<div class="tg-hero" style="background:' + heroBg + '">' +
    '<div class="tg-pattern">' + pat + '</div>' +
    '<div class="tg-hero-corner l" onclick="go(\'inv\')">▦</div>' +
    '<div class="tg-hero-corner r" onclick="go(\'extra\')">⋮</div>' +
    (pinN ? '<span class="tg-pin-chip" onclick="doUnpin(' + pinN.id + ')"><span class="spin3d">' + gift[1] + '</span></span>' : '') +
    '<div class="tg-avatar-ring' + frameCls + '">' +
      (ME.photo_url ? '<img src="' + ME.photo_url + '">' : '<div class="ph">👤</div>') +
    '</div>' +
    '<div class="tg-name">' + (S.nick || ME.first_name || "Игрок") + (IS_ADMIN ? ' 👑' : '') +
      (S.number ? '<span class="tg-num-chip">#' + S.number + '</span>' : '') +
    '</div>' +
    '<div class="tg-online"><span class="tg-lvl">🚀</span><span style="opacity:.9">в сети</span></div>' +
    '<div class="tg-actions">' +
      '<button class="act" onclick="toast(\'Фото берётся из Telegram 🙂\')"><span class="ic">📷</span>Фото</button>' +
      '<button class="act" onclick="editNick()"><span class="ic">✏️</span>Изменить</button>' +
      '<button class="act" onclick="toggleColorPicker()"><span class="ic">⚙️</span>Настройки</button>' +
    '</div>' +
    '<div class="tg-music" onclick="toast(\'🎵 NFT CASINO — Casino Theme\')">🎵 <b>NFT CASINO</b> — Casino Theme ›</div>' +
  '</div>' +

  '<div id="nickedit" style="display:none">' +
    '<input id="nickinp" placeholder="Новый ник" value="' + (S.nick || ME.first_name || "") + '">' +
    '<button class="ok-btn" onclick="saveNick()">Сохранить ник</button>' +
  '</div>' +
  (S.phoneBought && !S.phone
    ? '<div id="phoneedit"><input id="phoneinp" placeholder="+375 XX XXX-XX-XX">' +
      '<button class="ok-btn" onclick="savePhone()">Сохранить номер</button></div>'
    : '') +

  '<div class="tg-info">' +
    '<div class="row" onclick="editNick()"><div class="val">✏️ ' + (S.nick || ME.first_name || "Игрок") + '</div><div class="lbl">Ник (нажми, чтобы изменить)</div></div>' +
    '<div class="row noclick"><div class="val">' + (ME.username ? '@' + ME.username : '—') + '</div><div class="lbl">Имя пользователя · из Telegram</div></div>' +
    phoneRow +
    '<div class="row noclick"><div class="val" style="color:#5ac8fa"><code>' + ME.id + '</code></div><div class="lbl">ID для друзей и передачи NFT</div></div>' +
  '</div>' +

  '<div class="tg-tabs">' +
    '<button class="tg-tab">Публикации</button>' +
    '<button class="tg-tab">Архив публикаций</button>' +
    '<button class="tg-tab on">Подарки 🎁</button>' +
  '</div>' +

  '<div class="tg-chips">' +
    '<button class="tg-chip">Все подарки</button>' +
    '<button class="tg-chip add" onclick="go(\'extra\')">+ Добавить коллекцию</button>' +
  '</div>';

  if (S.nfts.length) {
    h += '<div class="tg-gift-grid">' + S.nfts.slice(0, 24).map(function(n) {
      const g = G[n.gift];
      const vis = nftVisual(n);
      const up = n.upgraded ? '<span class="up-badge">UP</span>' : '';
      const pinMark = (S.pin === n.id) ? '<span class="g-pin">📌</span>' : '';
      const ser = n.attrs ? '<span class="g-serial">#' + fmt(n.attrs.serial) + '</span>' : '';
      return '<div class="gift-cell ' + vis[0] + '"' + vis[1] + ' onclick="menuNft(' + n.id + ')">' + ser
