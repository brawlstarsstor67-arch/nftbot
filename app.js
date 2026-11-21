const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const ME = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || { id: 777000, first_name: "Гость", photo_url: null };
const ADMIN_ID = 8906194733;
const MAX_STARS = 999999999;
const IS_ADMIN = ME.id == ADMIN_ID;
const KEY = "casino_" + ME.id;

// [название, эмодзи, редкость, цена в звездах]
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

const PATTERNS = ["Aztec Falcon","Dotted Purple","Snake Garden","Cosmic Swirl","Gold Orbit","Ice Bloom"];
const NFTBGS = ["Pacific Green","Midnight Blue","Rose Dawn","Violet Haze","Golden Sunset","Onyx Black"];
const SUPPLY = {"Обычный":500000,"Редкий":200000,"Эпический":100000,"Легендарный":50000,"Мифический":10000};

function makeAttrs(g) {
  const max = SUPPLY[g[2]];
  const minted = Math.floor(Math.random() * max * 0.9) + 1;
  return {
    serial: Math.floor(Math.random() * 499999) + 1,
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    bg: NFTBGS[Math.floor(Math.random() * NFTBGS.length)],
    minted: minted,
    max: max,
    modelPct: Math.max(0.1, Math.round(max / minted * 10) / 10),
    valueUsd: Math.max(1, Math.round(g[3] / 25000))
  };
}

const CASES = {
  bronze: {name:"🥉 Обычный", price:500, w:[90,9,1,0,0]},
  silver: {name:"🥈 Серебряный", price:3000, w:[60,30,9,1,0]},
  gold:   {name:"🥇 Золотой", price:15000, w:[30,40,20,9,1]},
  legend: {name:"💎 Легендарный", price:60000, w:[0,30,40,25,5]}
};

let S = load();

// Старым NFT без атрибутов генерируем их при первом запуске
S.nfts.forEach(function(n) {
  if (!n.attrs && G[n.gift]) n.attrs = makeAttrs(G[n.gift]);
});
if (IS_ADMIN) S.bal = MAX_STARS;
save();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.nfts) return d;
  } catch (e) {}
  return { bal: 1000, nfts: [], nid: 1, pin: null, status: null, friends: [], bonus: 0, color: "#ffd700", theme: "default" };
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }

function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function addStars(v) { S.bal = Math.min(MAX_STARS, S.bal + v); }
function spend(v) { if (S.bal < v) return false; S.bal -= v; return true; }
function updateBal() { document.getElementById("bal").textContent = fmt(S.bal); }

function rndGift(tier) {
  const pool = tier ? GIFTS.filter(function(g){ return g[2] === tier; }) : GIFTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function giftText(n) {
  const g = G[n.gift];
  if (!g) return "?";
  return g[1] + " " + g[0] + " · " + REMO[g[2]] + " " + g[2] + " · " + fmt(g[3]) + " ⭐";
}

// Свой цвет фона у апгрейднутых NFT
function bgStyle(n) {
  if (n.hue !== undefined) {
    return "linear-gradient(160deg, hsl(" + n.hue + ",75%,45%), hsl(" + ((n.hue + 50) % 360) + ",75%,20%))";
  }
  return null;
}

// ---------- Навигация ----------
let TAB = "roulette";

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
function tierPick(w) {
  const total = w.reduce(function(a,b){ return a+b; }, 0);
  let r = Math.random() * total, s = 0;
  for (let i = 0; i < w.length; i++) { s += w[i]; if (r < s) return RAR[i]; }
  return RAR[0];
}

function vCases(v) {
  let h = '<div class="card">Чем дороже кейс — тем выше шанс на редкий подарок</div>';
  Object.keys(CASES).forEach(function(k) {
    const c = CASES[k];
    h += '<div class="card"><b>' + c.name + '</b><br><br>' +
         '<button class="btn-glass" onclick="openCase(\'' + k + '\')">Открыть за ' + fmt(c.price) + ' ⭐</button></div>';
  });
  v.innerHTML = h;
}

function openCase(k) {
  const c = CASES[k];
  if (!spend(c.price)) return toast("Не хватает звёзд!");
  save(); updateBal();
  const tier = tierPick(c.w);
  const g = rndGift(tier);
  const v = document.getElementById("view");
  v.innerHTML = reelView("🎁 Открываем " + c.name + " кейс...");
  fillReel(g[1]);
  spinReel(3, function() {
    const track = document.getElementById("track");
    track.classList.add("upg-flash-win");
    setTimeout(function() {
      S.nfts.push({ id: S.nid++, gift: g[0], attrs: makeAttrs(g) });
      save(); updateBal();
      document.getElementById("reelres").innerHTML =
        '<div class="card pop nft-big bg-' + tier + '" style="font-size:4rem;padding:20px 0">' + g[1] + '</div>' +
        '<div class="card">' + REMO[tier] + ' <b>Выпал ' + g[0] + '!</b><br>' + fmt(g[3]) + ' ⭐</div>' +
        '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>' +
        '<button class="btn-glass full" onclick="go(\'cases\')">🎁 Ещё кейс</button>';
    }, 700);
  });
}

// Общая лента прокрутки
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

// ================= РЫНОК =================
function vMarket(v) {
  let h = '<div class="card"><b>🛍️ Купить подарок</b></div><div class="market-grid">';
  GIFTS.forEach(function(g, i) {
    h += '<div class="market-item" onclick="buyGift(' + i + ')">' +
      '<span class="g-emoji">' + g[1] + '</span>' +
      '<div class="market-price">⭐ ' + fmt(g[3]) + '</div></div>';
  });
  h += '</div>';
  v.innerHTML = h;
}

function buyGift(i) {
  const g = GIFTS[i];
  if (!g) return;
  if (!spend(g[3])) return toast("Не хватает звёзд!");
  S.nfts.push({ id: S.nid++, gift: g[0], attrs: makeAttrs(g) });
  save(); updateBal();
  toast(g[1] + " " + g[0] + " куплен!");
}

// ================= ИНВЕНТАРЬ =================
function vInv(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Пусто! Открой кейс или купи на рынке 🎁</div>'; return; }
  v.innerHTML = '<div class="mini-grid">' + S.nfts.map(function(n) {
    const g = G[n.gift];
    const bg = bgStyle(n);
    const cls = bg ? 'mini-nft' : 'mini-nft bg-' + g[2];
    const st = bg ? ' style="background:' + bg + '"' : '';
    const up = n.hue !== undefined ? '<span class="up-badge">UP</span>' : '';
    const mark = (S.pin === n.id) ? '<span class="mk">📌</span>' : ((S.status === n.id) ? '<span class="mk">👑</span>' : '');
    return '<div class="' + cls + '"' + st + ' onclick="menuNft(' + n.id + ')">' + up + g[1] + mark + '</div>';
  }).join('') + '</div>';
}

// ================= КАРТОЧКА NFT (как в Telegram) =================
function menuNft(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  const g = G[n.gift];
  const a = n.attrs || makeAttrs(g);
  const bg = bgStyle(n);
  const st = bg ? ' style="background:' + bg + '"' : '';
  const cls = bg ? 'nft-hero' : 'nft-hero bg-' + g[2];

  document.getElementById("view").innerHTML =
    '<div class="' + cls + '"' + st + '>' +
      '<div class="serial-badge">#' + fmt(a.serial) + '</div>' +
      '<div class="nft-emoji">' + g[1] + '</div>' +
      '<div class="nft-title">' + g[0] + ' #' + fmt(a.serial) + '</div>' +
      '<div class="nft-sub">' + g[2] + '</div>' +
      '<div class="hero-row">' +
        '<button class="btn-glass" onclick="doTransfer(' + id + ')">🎁<br>Передать</button>' +
        (S.status === id
          ? '<button class="btn-glass" onclick="doUnwear()">👑<br>Снять</button>'
          : '<button class="btn-glass" onclick="doStatus(' + id + ')">👑<br>Носить</button>') +
        '<button class="btn-glass" onclick="doSell(' + id + ')">💱<br>Продать</button>' +
      '</div>' +
    '</div>' +
    '<table class="attr-table">' +
      '<tr><td>Владелец</td><td>👤 ' + (ME.first_name || "Игрок") + (IS_ADMIN ? ' 👑' : '') + '</td></tr>' +
      '<tr><td>Модель</td><td>' + g[0] + '<span class="chip">' + a.modelPct + '%</span></td></tr>' +
      '<tr><td>Узор</td><td>' + a.pattern + '<span class="chip">' + (0.1 + Math.random() * 2).toFixed(1) + '%</span></td></tr>' +
      '<tr><td>Фон</td><td>' + a.bg + '<span class="chip">1.5%</span></td></tr>' +
      '<tr><td>Количество</td><td>' + fmt(a.minted) + '/' + fmt(a.max) + ' выпущено</td></tr>' +
      '<tr><td>Ценность</td><td>~' + a.valueUsd + ' $</td></tr>' +
    '</table>' +
    (n.hue !== undefined ? '<div class="card"><span style="color:var(--accent)">✨ Улучшено — свой цвет фона!</span></div>' : '') +
    (S.pin === id
      ? '<div class="card"><span class="muted">Подарок виден в Вашем профиле. </span>' +
        '<span style="color:#5ac8fa;cursor:pointer" onclick="doUnpin(' + id + ')">Скрыть ›</span></div>'
      : '<div class="card"><span style="color:#5ac8fa;cursor:pointer" onclick="doPin(' + id + ')">📌 Закрепить в профиле ›</span></div>') +
    '<button class="btn-glass full" onclick="go(\'upg\')">⬆️ Апгрейдить</button>' +
    '<button class="ok-btn" onclick="go(\'inv\')">OK</button>';
}

function clearMarks(id) {
  if (S.pin === id) S.pin = null;
  if (S.status === id) S.status = null;
}

function doPin(id) { S.pin = id; save(); toast("📌 Закреплено в профиле!"); go("prof"); }
function doUnpin(id) { if (S.pin === id) S.pin = null; save(); toast("📌 Откреплено"); go("prof"); }
function doStatus(id) { S.status = id; save(); toast("👑 Надето как статус!"); go("prof"); }
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

// ================= АПГРЕЙД =================
function upgCost(n) {
  return Math.max(25, Math.floor(G[n.gift][3] * 0.01));
}

function vUpg(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Нет NFT для улучшения</div>'; return; }
  let h = '<div class="card">Успех — подарок на редкость выше и <b>свой цвет фона</b> 🌈. Провал — 💥 сгорает.</div>';
  S.nfts.forEach(function(n) {
    const g = G[n.gift];
    const next = RAR[RAR.indexOf(g[2]) + 1];
    if (!next) {
      h += '<div class="card">' + g[1] + ' <b>' + g[0] + '</b><br>🔴 Мифический — максимум</div>';
    } else {
      h += '<div class="card" onclick="tryUpg(' + n.id + ')">' + g[1] + ' <b>' + g[0] + '</b><br>' +
        REMO[g[2]] + ' ' + g[2] + ' → ' + REMO[next] + ' ' + next +
        '<br><span class="muted">Стоимость: ' + fmt(upgCost(n)) + ' ⭐</span></div>';
    }
  });
  v.innerHTML = h;
}

function tryUpg(id) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  const ti = RAR.indexOf(G[n.gift][2]);
  if (ti >= 4) return toast("Это максимум — Мифический!");
  const target = RAR[ti + 1];
  const cost = upgCost(n);
  const pool = GIFTS.filter(function(g){ return g[2] === target; });
  let avg = 0;
  pool.forEach(function(g){ avg += g[3]; });
  avg = avg / pool.length;
  const chance = Math.round(Math.min(85, Math.max(10, G[n.gift][3] / avg * 75)));
  document.getElementById("view").innerHTML =
    '<div class="card">⬆️ ' + G[n.gift][1] + ' <b>' + n.gift + '</b> → ' + target +
    '<br>Шанс: <b>' + chance + '%</b> · Цена: <b>' + fmt(cost) + ' ⭐</b></div>' +
    reelView("Крутим апгрейд...", chance) +
    '<button class="btn-glass full" id="gobtn" onclick="rollUpg(' + id + ',' + (ti+1) + ',' + chance + ',' + cost + ')">🎲 Крутить за ' + fmt(cost) + ' ⭐</button>' +
    '<button class="btn-glass full" onclick="go(\'upg\')">⬅️ Назад</button>';
}

function rollUpg(id, ti, chance, cost) {
  const n = S.nfts.find(function(x){ return x.id === id; });
  if (!n) return;
  if (!spend(cost)) return toast("Не хватает звёзд на апгрейд!");
  save(); updateBal();
  const btn = document.getElementById("gobtn");
  if (btn) btn.remove();
  const win = Math.random() * 100 <= chance;
  const oldG = G[n.gift];
  const resultG = win ? rndGift(RAR[ti]) : oldG;

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
        save();
        res.innerHTML = '<div class="nft-big pop" style="background:linear-gradient(160deg,hsl(' + hue + ',75%,45%),hsl(' + ((hue+50)%360) + ',75%,20%));border-radius:20px;font-size:4rem;padding:30px 0">' + resultG[1] + '</div>' +
          '<div class="card">🎉 <b>АПГРЕЙД УДАЛСЯ!</b><br><b>' + resultG[0] + '</b><br>' + REMO[RAR[ti]] + ' ' + RAR[ti] +
          '<br><span style="color:var(--accent)">🌈 Получен свой цвет фона!</span></div>' +
          '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>';
      }, 800);
    } else {
      track.classList.add("upg-flash-lose");
      setTimeout(function() {
        S.nfts = S.nfts.filter(function(x){ return x.id !== id; });
        clearMarks(id); save();
        res.innerHTML = '<div class="card pop">💥 <b>Провал!</b><br>' + oldG[1] + ' ' + oldG[0] + ' сгорел...</div>' +
          '<button class="btn-glass full" onclick="go(\'upg\')">⬅️ Апгрейд</button>';
      }, 800);
    }
  });
}

// ================= ПРОФИЛЬ =================
function vProf(v) {
  const pinN = S.pin ? S.nfts.find(function(n){ return n.id === S.pin; }) : null;
  const stN = S.status ? S.nfts.find(function(n){ return n.id === S.status; }) : null;

  // Статус: цветная карточка с аватаром и сияющим значком
  if (stN) {
    const g = G[stN.gift];
    const a = stN.attrs || { serial: 0 };
    const bg = bgStyle(stN);
    const cls = bg ? 'status-hero' : 'status-hero bg-' + g[2];
    const stl = bg ? ' style="background:' + bg + '"' : '';
    v.innerHTML =
      '<div class="' + cls + '"' + stl + '>' +
        (ME.photo_url ? '<img class="st-avatar" src="' + ME.photo_url + '">' : '<div class="st-avatar-ph">👤</div>') +
        '<div class="st-name">' + (ME.first_name || "Игрок") + '<span class="st-badge">' + g[1] + '</span></div>' +
        '<span class="muted">в сети</span>' +
      '</div>' +
      '<div class="card"><b>Носите ' + g[0] + ' #' + fmt(a.serial) + '</b><br><span class="muted">для получения уникальных преимуществ</span></div>' +
      '<div class="benefit"><div class="ico">💎</div><div><b>Мерцающий значок</b><span>Подарок отображается рядом с Вашим именем в виде сияющего значка.</span></div></div>' +
      '<div class="benefit"><div class="ico">🖼️</div><div><b>Уникальное оформление профиля</b><span>Цвет и фон профиля меняются на цвет и фон подарка.</span></div></div>' +
      '<div class="benefit"><div class="ico">✅</div><div><b>Подтверждение статуса владельца</b><span>При нажатии на значок откроется информация о нём и его владельце.</span></div></div>' +
      '<button class="ok-btn" onclick="doUnwear()">Снять статус</button>' +
      '<button class="btn-glass full" onclick="go(\'inv\')">💎 Инвентарь</button>';
    return;
  }

  // Обычный профиль
  let hero;
  if (pinN) {
    const g = G[pinN.gift];
    const bg = bgStyle(pinN);
    const cls = bg ? 'prof-hero' : 'prof-hero bg-' + g[2];
    const stl = bg ? ' style="background:' + bg + '"' : '';
    hero = '<div class="' + cls + '"' + stl + '>' +
      '<div class="hero-gift">' + g[1] + '</div>' +
      '<div class="hero-content">' +
      '<span class="pin-chip">' + g[1] + '</span>' +
      (ME.photo_url ? '<img class="avatar" src="' + ME.photo_url + '">' : '<div class="avatar-ph">👤</div>') +
      '<b style="font-size:1.3rem">' + (ME.first_name || "Игрок") + '</b>' + (IS_ADMIN ? ' 👑' : '') +
      '<br><span class="muted">ID: <code>' + ME.id + '</code></span>' +
      '</div></div>';
  } else {
    hero = '<div class="card">' +
      (ME.photo_url ? '<img class="avatar" src="' + ME.photo_url + '">' : '<div class="avatar-ph">👤</div>') +
      '<b>' + (ME.first_name || "Игрок") + '</b>' + (IS_ADMIN ? ' 👑' : '') +
      '<br><span class="muted">ID: <code>' + ME.id + '</code></span><br>' +
      '<span class="muted">📌 Закрепи NFT — оно появится у аватара</span></div>';
  }

  let h = hero +
    '<div class="card">⭐ Баланс: <b>' + fmt(S.bal) + '</b><br>💎 NFT: ' + S.nfts.length +
    '<br>👥 Друзей: ' + S.friends.length + '</div>' +
    '<div class="card"><b>💎 Моя коллекция</b></div>';

  if (S.nfts.length) {
    h += '<div class="mini-grid">' + S.nfts.slice(0, 12).map(function(n) {
      const g = G[n.gift];
      const bg = bgStyle(n);
      const cls = bg ? 'mini-nft' : 'mini-nft bg-' + g[2];
      const stl = bg ? ' style="background:' + bg + '"' : '';
      const up = n.hue !== undefined ? '<span class="up-badge">UP</span>' : '';
      return '<div class="' + cls + '"' + stl + ' onclick="menuNft(' + n.id + ')">' + up + g[1] + '</div>';
    }).join('') + '</div>';
    if (S.nfts.length > 12) h += '<div class="card"><span class="muted">…и ещё ' + (S.nfts.length - 12) + ' — в инвентаре</span></div>';
  } else {
    h += '<div class="card"><span class="muted">Пока пусто — открой кейс 🎁</span></div>';
  }

  h += '<button class="btn-glass full" onclick="go(\'extra\')">📚 Коллекция · бонус, друзья, NFT</button>';
  v.innerHTML = h;
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

// ================= ЦВЕТ И ТЕМЫ =================
function toggleColorPicker() { document.getElementById("color-picker").classList.toggle("show"); }
function toggleThemePicker() { document.getElementById("theme-picker").classList.toggle("show"); }

function setColor(color) {
  S.color = color;
  document.documentElement.style.setProperty("--accent", color);
  save();
  toggleColorPicker();
  toast("🎨 Цвет изменён!");
}

function setTheme(theme) {
  S.theme = theme;
  document.body.classList.remove("theme-xmas", "theme-halloween", "theme-chinese");
  if (theme !== "default") document.body.classList.add("theme-" + theme);
  save();
  toggleThemePicker();
  toast("🎇 Тема изменена!");
}

// Применяем сохранённые настройки
document.documentElement.style.setProperty("--accent", S.color || "#ffd700");
if (S.theme && S.theme !== "default") document.body.classList.add("theme-" + S.theme);

updateBal();
go("roulette");
