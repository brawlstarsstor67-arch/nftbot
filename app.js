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

// Фоны: чёрный и радужный — самые редкие
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

// ---------- Кейсы по тематикам ----------
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
  return { bal: 1000, nfts: [], nid: 1, pin: null, status: null, friends: [], bonus: 0, color: "#ffd700", theme: "default",
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

const VIEWS = { roulette: vRoulette, cases: vCases, market: vMarket, inv: vInv, upg: vUpg, prof: vProf, extra: vExtra };
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

// ================= КЕЙСЫ =================
function vCases(v) {
  let h = '<div class="card">Выбери тематику. Внутри каждого кейса — предметы, шансы и цены. Там же кнопка «Бой».</div>';
  CASE_THEMES.forEach(function(th) {
    h += '<div class="theme-block"><div class="theme-title">' + th.name + '</div><div class="case-row">';
    CASE_TIERS.forEach(function(t) {
      h += '<div class="case-card" onclick="caseDetail(\'' + th.key + '\',\'' + t.key + '\')">' +
        '<div class="em">🎁</div><div class="nm">' + t.name + '</div>' +
        '<div class="pr">' + fmt(t.price) + ' ⭐</div>' +
        '<button class="btn-glass mini" style="margin-top:6px;padding:6px 10px" onclick="event.stopPropagation();battleDetail(\'' + th.key + '\',\'' + t.key + '\')">⚔️ Бой</button>' +
        '</div>';
    });
    h += '</div></div>';
  });
  v.innerHTML = h;
}

function caseDetail(th, tr) {
  const tier = CASE_TIERS.find(function(t){ return t.key === tr; });
  const theme = CASE_THEMES.find(function(t){ return t.key === th; });
  CUR_CASE = { th: th, tr: tr };
  let h = '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>' +
    '<div class="case-detail-hero bg-' + RAR[2] + '">' +
    '<div class="em floaty">🎁</div>' +
    '<b style="font-size:1.2rem">' + theme.name + ' · ' + tier.name + '</b><br>' +
    '<span class="muted">Цена: ' + fmt(tier.price) + ' ⭐</span></div>' +
    '<div class="card" style="text-align:left"><b>Содержимое и шансы:</b><br><br>';
  caseItems(th, tr).forEach(function(it) {
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
      '<span>' + REMO[it.g[2]] + ' ' + it.g[1] + ' ' + it.g[0] + '</span>' +
      '<span class="chip">' + it.chance + '%</span>' +
      '<span style="color:#ffd700;font-weight:700">' + fmt(it.g[3]) + ' ⭐</span></div>';
  });
  h += '</div>' +
    '<button class="ok-btn" onclick="openCase()">🎲 Купить и открыть за ' + fmt(tier.price) + ' ⭐</button>' +
    '<button class="btn-glass full" onclick="battleDetail(\'' + th + '\',\'' + tr + '\')">⚔️ Битва кейсов</button>';
  document.getElementById("view").innerHTML = h;
}

function openCase() {
  const c = CUR_CASE;
  if (!c) return go("cases");
  const tier = CASE_TIERS.find(function(t){ return t.key === c.tr; });
  const theme = CASE_THEMES.find(function(t){ return t.key === c.th; });
  if (!spend(tier.price)) return toast("Не хватает звёзд!");
  save(); updateBal();
  const g = rollCase(c.th, c.tr);
  const v = document.getElementById("view");
  v.innerHTML = reelView("🎁 Открываем кейс " + theme.name + " · " + tier.name);
  fillReel(g[1]);
  spinReel(3, function() {
    const track = document.getElementById("track");
    track.classList.add("upg-flash-win");
    setTimeout(function() {
      S.nfts.push({ id: S.nid++, gift: g[0], attrs: makeAttrs(g) });
      save(); updateBal();
      const vis = nftVisual({ gift: g[0], attrs: null });
      document.getElementById("reelres").innerHTML =
        '<div class="card pop ' + vis[0] + '" style="font-size:4rem;padding:20px 0"><span class="spin3d">' + g[1] + '</span></div>' +
        '<div class="card">' + REMO[g[2]] + ' <b>Выпал ' + g[0] + '!</b><br>' + fmt(g[3]) + ' ⭐</div>' +
        '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>' +
        '<button class="btn-glass full" onclick="caseDetail(\'' + c.th + '\',\'' + c.tr + '\')">🎁 Ещё раз</button>';
    }, 700);
  });
}

// ================= БИТВА КЕЙСОВ =================
let CUR_BATTLE = null;
function battleDetail(th, tr) {
  const tier = CASE_TIERS.find(function(t){ return t.key === tr; });
  const theme = CASE_THEMES.find(function(t){ return t.key === th; });
  CUR_BATTLE = { th: th, tr: tr };
  document.getElementById("view").innerHTML =
    '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>' +
    '<div class="card"><b>⚔️ Битва кейсов</b><br>' + theme.name + ' · ' + tier.name +
    '<br><span class="muted">Оба открывают кейс. Чей подарок дороже — забирает звёзды проигравшего!</span>' +
    '<br>Ставка: <b>' + fmt(tier.price) + ' ⭐</b></div>' +
    '<button class="ok-btn" onclick="battleStart()">⚔️ В бой за ' + fmt(tier.price) + ' ⭐</button>';
}

function battleStart() {
  const c = CUR_BATTLE;
  if (!c) return go("cases");
  const tier = CASE_TIERS.find(function(t){ return t.key === c.tr; });
  if (!spend(tier.price)) return toast("Не хватает звёзд!");
  save(); updateBal();
  const mine = rollCase(c.th, c.tr);
  const bot = rollCase(c.th, c.tr);
  const botName = ["Артём","Ксюша","Никита","Дмитрий"][Math.floor(Math.random()*4)];
  const win = mine[3] >= bot[3];
  const v = document.getElementById("view");
  v.innerHTML =
    '<div class="card"><b>⚔️ Битва · ' + tier.name + '</b></div>' +
    '<div class="battle-row">' +
      '<div class="battle-card' + (win ? ' win' : '') + '"><span class="muted">Ты</span><br>' +
        '<div class="em"><span class="spin3d">' + mine[1] + '</span></div><b>' + mine[0] + '</b><br>' + fmt(mine[3]) + ' ⭐</div>' +
      '<div class="battle-vs">VS</div>' +
      '<div class="battle-card' + (!win ? ' win' : '') + '"><span class="muted">' + botName + '</span><br>' +
        '<div class="em"><span class="spin3d">' + bot[1] + '</span></div><b>' + bot[0] + '</b><br>' + fmt(bot[3]) + ' ⭐</div>' +
    '</div>' +
    (win
      ? '<div class="card">🏆 <b>Победа!</b> Забираешь ' + fmt(bot[3]) + ' ⭐ противника</div>'
      : '<div class="card">💀 <b>Проигрыш!</b> Противник забрал ' + fmt(mine[3]) + ' ⭐</div>') +
    '<button class="ok-btn" onclick="battleStart()">⚔️ Ещё бой</button>' +
    '<button class="btn-glass full" onclick="go(\'cases\')">⬅️ Кейсы</button>';
  if (win) { addStars(bot[3]); save(); updateBal(); }
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
    '<div class="card"><b>🛒 Выставить на продажу</b><br>' + giftText(n) +
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

// ================= КАРТОЧКА NFT =================
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
// Статус: старый снимается автоматически, новый надевается
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

// ================= АПГРЕЙДЕР (как на фото) =================
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

// ================= ПРОФИЛЬ КАК В TELEGRAM =================
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
      return '<div class="gift-cell ' + vis[0] + '"' + vis[1] + ' onclick="menuNft(' + n.id + ')">' + ser + up + '<span class="spin3d">' + g[1] + '</span>' + pinMark + '</div>';
    }).join('') + '</div>';
  } else {
    h += '<div class="card"><span class="muted">Пока пусто — открой кейс 🎁</span></div>';
  }

  h += '<button class="btn-glass full" style="margin-top:12px" onclick="go(\'extra\')">📚 Коллекция · бонус, друзья, NFT</button>';
  v.innerHTML = h;
}

function editNick() {
  const el = document.getElementById("nickedit");
  if (el) el.style.display = (el.style.display === "none") ? "block" : "none";
}
function saveNick() {
  const val = document.getElementById("nickinp").value.trim();
  if (val.length < 1) return toast("Ник не может быть пустым");
  S.nick = val;
  save();
  toast("✏️ Ник сохранён!");
  renderView();
}
function editPhone() {
  if (S.phone) return;
  const el = document.getElementById("phoneedit");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
function savePhone() {
  const val = document.getElementById("phoneinp").value.trim();
  if (!/^\+?\d[\d\s\-()]{6,}$/.test(val)) return toast("Введи корректный номер");
  S.phone = val;
  save();
  toast("📱 Номер сохранён!");
  renderView();
}

// ================= КОЛЛЕКЦИЯ =================
function vExtra(v) {
  const bonusReady = (Date.now() - S.bonus) >= 86400000;
  let h = '<button class="btn-glass full" onclick="go(\'prof\')">⬅️ Профиль</button>';

  if (bonusReady) {
    h += '<button class="btn-glass full" onclick="giveBonus()">🎁 Забрать бонус +1000 ⭐</button>';
  } else {
    const left = Math.ceil((86400000 - (Date.now() - S.bonus)) / 3600000);
    h += '<div class="card"><span class="muted">🎁 Бонус через ~' + left + ' ч.</span></div>';
  }

  h += '<div class="card"><b>👥 Мои друзья (' + S.friends.length + ')</b></div>' +
    '<input id="fid" placeholder="ID друга (узнать: /id у бота)">' +
    '<button class="btn-glass full" onclick="addFriend()">➕ Добавить по ID</button>';

  S.friends.forEach(function(f) {
    h += '<div class="card">👤 ' + f.name + '<br><span class="muted">ID ' + f.id + '</span></div>';
  });

  h += '<div class="card"><b>🎁 Забрать NFT по коду</b></div>' +
    '<input id="claim" placeholder="NFT-XXXXXXXX|Название">' +
    '<button class="btn-glass full" onclick="claim()">Забрать NFT</button>';

  v.innerHTML = h;
}

function giveBonus() {
  addStars(1000); S.bonus = Date.now(); save(); updateBal();
  toast("🎁 +1000 звёзд!"); go("extra");
}

function addFriend() {
  const id = document.getElementById("fid").value.trim();
  if (!/^\d+$/.test(id)) return toast("Нужен числовой ID");
  if (S.friends.some(function(f){ return f.id === id; })) return toast("Уже в друзьях");
  S.friends.push({ id: id, name: "Друг ···" + id.slice(-4) });
  save(); toast("✅ Друг добавлен!"); go("extra");
}

function claim() {
  const t = document.getElementById("claim").value.trim().split("|");
  if (t.length !== 2 || !G[t[1].trim()]) return toast("Неверный код");
  S.nfts.push({ id: S.nid++, gift: t[1].trim(), attrs: makeAttrs(G[t[1].trim()]) });
  save();
  toast("🎁 Получен " + t[1].trim() + "!");
  go("inv");
}

// ================= ЗВЁЗДЫ =================
function toggleStarsPicker() { document.getElementById("stars-picker").classList.toggle("show"); }

function buyPackCmd(amount, xtr) {
  const cmd = "/buy " + amount;
  if (navigator.clipboard) navigator.clipboard.writeText(cmd);
  toast("📋 Команда " + cmd + " скопирована — отправь её боту");
}

function claimPromo() {
  const code = document.getElementById("promo").value.trim().toUpperCase();
  const m = code.match(/^STARS-(\d+)-(\d+)$/);
  if (!m) return toast("
// ---------- КОНЕЦ: claimPromo ----------
  if (!m) return toast("Неверный формат. Пример: STARS-1000-XXXXX");
  const amount = parseInt(m[1], 10);
  if ([1000, 5000, 10000].indexOf(amount) < 0) return toast("Такого кода нет");
  addStars(amount);
  save(); updateBal();
  document.getElementById("promo").value = "";
  toggleStarsPicker();
  toast("⭐ Зачислено +" + fmt(amount) + " звёзд!");
}

// ================= ТЕМЫ =================
function setTheme(name) {
  S.theme = name;
  document.body.classList.remove("theme-xmas", "theme-halloween", "theme-chinese");
  if (name !== "default") document.body.classList.add("theme-" + name);
  save();
}

// ================= ПОПАПЫ (создаются, если их нет в index.html) =================
function ensurePopup(id) {
  let p = document.getElementById(id);
  if (p) return p;
  p = document.createElement("div");
  p.className = "popup";
  p.id = id;
  document.body.appendChild(p);
  return p;
}

(function initPopups() {
  // Звёзды: пакеты + промокод
  const sp = ensurePopup("stars-picker");
  sp.innerHTML =
    '<h3>⭐ Пополнение</h3>' +
    '<div class="packs">' +
      '<button class="btn-glass full" style="margin:0 auto 8px" onclick="buyPackCmd(1000)">1000 ⭐ — /buy 1000</button>' +
      '<button class="btn-glass full" style="margin:0 auto 8px" onclick="buyPackCmd(5000)">5000 ⭐ — /buy 5000</button>' +
      '<button class="btn-glass full" style="margin:0 auto 8px" onclick="buyPackCmd(10000)">10000 ⭐ — /buy 10000</button>' +
    '</div>' +
    '<div class="muted">Бот скопирует команду — отправь её боту и оплати. Код придёт в чат.</div>' +
    '<input id="promo" placeholder="STARS-1000-XXXXX">' +
    '<button class="ok-btn" onclick="claimPromo()">Активировать код</button>' +
    '<button class="btn-glass full" style="margin:0 auto" onclick="toggleStarsPicker()">Закрыть</button>';

  // Цвет (настройки в профиле)
  const cp = ensurePopup("color-picker");
  let colors = "";
  ["#ffd700", "#ff4d6d", "#5ac8fa", "#7dff8a", "#c56bff", "#ff9d00", "#00e5ff", "#ff2bd6", "#ffffff"].forEach(function(c) {
    colors += '<button class="color-btn" style="background:' + c + '" onclick="pickColor(\'' + c + '\')"></button>';
  });
  cp.innerHTML =
    '<h3>🎨 Цвет профиля</h3>' +
    '<div class="color-grid">' + colors + '</div>' +
    '<button class="btn-glass full" style="margin:0 auto" onclick="toggleColorPicker()">Закрыть</button>';
})();

function toggleColorPicker() { ensurePopup("color-picker").classList.toggle("show"); }

function pickColor(c) {
  S.color = c;
  save();
  toast("🎨 Цвет сохранён!");
  toggleColorPicker();
  renderView();
}

// ================= СТАРТ =================
(function init() {
  // Применяем сохранённую тему
  const th = S.theme || "default";
  if (th !== "default") document.body.classList.add("theme-" + th);
  updateBal();
  go("roulette");
})();
