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
  const n = S.nfts.find(function(x){ return x.id ===
