const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const ME = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || { id: 777000, first_name: "Гость" };
const KEY = "casino_" + ME.id;

// Каталог подарков: [название, эмодзи, редкость, ценность]
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
const G = Object.fromEntries(GIFTS.map(function(g){ return [g[0], g]; }));

const CASES = {
  bronze: {name:"🥉 Обычный", price:500, w:[90,9,1,0,0]},
  silver: {name:"🥈 Серебряный", price:3000, w:[60,30,9,1,0]},
  gold:   {name:"🥇 Золотой", price:15000, w:[30,40,20,9,1]},
  legend: {name:"💎 Легендарный", price:60000, w:[0,30,40,25,5]}
};

let S = load();
let lastCode = "";

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.nfts) return d;
  } catch (e) {}
  return { bal:1000, nfts:[], nid:1, pin:null, status:null, friends:[], bonus:0 };
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

function giftText(n) {
  const g = G[n.gift];
  if (!g) return "?";
  return g[1] + " " + g[0] + " · " + REMO[g[2]] + " " + g[2] + " · " + fmt(g[3]) + " монет";
}

let TAB = "roulette";
const TABS = [
  ["roulette","🎰 Рулетка"], ["cases","🎁 Кейсы"], ["inv","💎 NFT"],
  ["upg","⬆️ Апгрейд"], ["prof","👤 Профиль"], ["friends","👥 Друзья"], ["bonus","🎁 Бонус"]
];

function render() {
  document.getElementById("bal").textContent = "💰 " + fmt(S.bal) + " монет";
  document.getElementById("tabs").innerHTML = TABS.map(function(t) {
    return '<div class="tab' + (TAB === t[0] ? " on" : "") + '" onclick="go(\'' + t[0] + '\')">' + t[1] + '</div>';
  }).join("");
  const v = document.getElementById("view");
  const views = { roulette:vRoulette, cases:vCases, inv:vInv, upg:vUpg, prof:vProf, friends:vFriends, bonus:vBonus };
  (views[TAB] || vRoulette)(v);
}
function go(tab) { TAB = tab; render(); }

function toast(msg) {
  if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg);
}

// ---- РУЛЕТКА ----
function vRoulette(v) {
  let h = '<div class="slot" id="slot">🎰</div>';
  h += '<div class="card" style="text-align:center">Шансы: x2 · x3 · x5 · x10</div>';
  h += '<div id="res" class="card" style="text-align:center">Выбери ставку</div>';
  [100,500,1000,5000].forEach(function(b) {
    h += '<button class="btn" onclick="spin(' + b + ')">Крутить на ' + fmt(b) + '</button>';
  });
  v.innerHTML = h;
}

function spin(bet) {
  if (S.bal < bet) return toast("Не хватает монет!");
  const slot = document.getElementById("slot");
  const res = document.getElementById("res");
  const frames = ["🍒 🍋 ⭐", "⭐ 🍒 7️⃣", "7️⃣ ⭐ 🍒", "🍋 7️⃣ ⭐"];
  let i = 0;
  S.bal -= bet; save();
  document.getElementById("bal").textContent = "💰 " + fmt(S.bal) + " монет";
  res.textContent = "Крутим...";
  const iv = setInterval(function() { slot.textContent = frames[i++ % 4]; }, 150);
  setTimeout(function() {
    clearInterval(iv);
    const r = Math.random();
    let mult = 0;
    if (r >= 0.45) mult = r < 0.75 ? 2 : (r < 0.90 ? 3 : (r < 0.97 ? 5 : 10));
    if (mult === 0) {
      res.innerHTML = '<span style="color:#ff6b6b">💥 Проигрыш! −' + fmt(bet) + '</span>';
    } else {
      const win = bet * mult - bet;
      S.bal += win; save();
      res.innerHTML = '<span style="color:#7dff8a">🎉 Выигрыш x' + mult + '! +' + fmt(win) + '</span>';
    }
    document.getElementById("bal").textContent = "💰 " + fmt(S.bal) + " монет";
  }, 1800);
}

// ---- КЕЙСЫ ----
function tierPick(w) {
  const total = w.reduce(function(a, b) { return a + b; }, 0);
  let r = Math.random() * total, s = 0;
  for (let i = 0; i < w.length; i++) { s += w[i]; if (r < s) return RAR[i]; }
  return RAR[0];
}

function vCases(v) {
  let h = '<div class="card">Чем дороже кейс — тем выше шанс на редкий подарок</div>';
  Object.keys(CASES).forEach(function(k) {
    const c = CASES[k];
    h += '<div class="card nft"><span>' + c.name + '</span>' +
         '<button class="btn green" style="width:auto;margin:0;padding:8px 14px" onclick="openCase(\'' + k + '\')">' + fmt(c.price) + '</button></div>';
  });
  v.innerHTML = h;
}

function openCase(k) {
  const c = CASES[k];
  if (S.bal < c.price) return toast("Не хватает монет!");
  S.bal -= c.price;
  const tier = tierPick(c.w);
  const pool = GIFTS.filter(function(g) { return g[2] === tier; });
  const giftName = pool[Math.floor(Math.random() * pool.length)][0];
  S.nfts.push({ id: S.nid++, gift: giftName });
  save();
  toast(G[giftName][1] + " Выпал " + giftName + "! " + REMO[tier] + " " + tier);
  go("inv");
}

// ---- ИНВЕНТАРЬ ----
function vInv(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Пусто! Открой кейс 🎁</div>'; return; }
  v.innerHTML = S.nfts.map(function(n) {
    const pin = (S.pin === n.id) ? " 📌" : "";
    const worn = (S.status === n.id) ? " 👑" : "";
    return '<div class="card nft"><span>' + giftText(n) + pin + worn +
           '<br><span class="muted">ID ' + n.id + '</span></span>' +
           '<button class="btn gray" style="width:auto;margin:0;padding:8px 14px" onclick="menuNft(' + n.id + ')">⚙️</button></div>';
  }).join("");
}

function menuNft(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  TAB = "nftmenu";
  const v = document.getElementById("view");
  v.innerHTML = '<div class="card">' + giftText(n) + '<br><span class="muted">ID ' + n.id + '</span></div>' +
    '<button class="btn" onclick="doPin(' + id + ')">📌 Закрепить</button>' +
    '<button class="btn" onclick="doStatus(' + id + ')">👑 Надеть как статус</button>' +
    '<button class="btn green" onclick="doSell(' + id + ')">💱 Продать за ' + fmt(Math.floor(G[n.gift][3] * 0.7)) + '</button>' +
    '<button class="btn red" onclick="doTransfer(' + id + ')">🎁 Передать другу</button>' +
    '<button class="btn gray" onclick="go(\'inv\')">⬅️ Назад</button>';
}

function clearMarks(id) {
  if (S.pin === id) S.pin = null;
  if (S.status === id) S.status = null;
}

function doPin(id) { S.pin = id; save(); toast("📌 Закреплено!"); go("inv"); }
function doStatus(id) { S.status = id; save(); toast("👑 Надето как статус!"); go("inv"); }

function doSell(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  S.bal += Math.floor(G[n.gift][3] * 0.7);
  S.nfts = S.nfts.filter(function(x) { return x.id !== id; });
  clearMarks(id); save();
  toast("Продано!"); go("inv");
}

function doTransfer(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  lastCode = "NFT-" + Math.random().toString(36).slice(2, 10).toUpperCase() + "|" + n.gift;
  S.nfts = S.nfts.filter(function(x) { return x.id !== id; });
  clearMarks(id); save();
  const v = document.getElementById("view");
  v.innerHTML = '<div class="card">🎁 NFT упакован в код. Отправь его другу в чат:</div>' +
    '<div class="card"><b style="word-break:break-all">' + lastCode + '</b></div>' +
    '<button class="btn" onclick="copyText()">📋 Скопировать</button>' +
    '<button class="btn gray" onclick="go(\'inv\')">⬅️ Назад</button>';
}

function copyText() {
  if (navigator.clipboard) navigator.clipboard.writeText(lastCode);
  toast("Скопировано — отправь другу в чат");
}

// ---- АПГРЕЙД ----
function vUpg(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Нет NFT для улучшения</div>'; return; }
  let h = '<div class="card">Выбери NFT. Успех — подарок на редкость выше. Провал — 💥 сгорает.</div>';
  S.nfts.forEach(function(n) {
    const g = G[n.gift];
    h += '<button class="btn" onclick="tryUpg(' + n.id + ')">' + g[1] + ' ' + g[0] + ' · ' + g[2] + '</button>';
  });
  v.innerHTML = h;
}

function tryUpg(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  const ti = RAR.indexOf(G[n.gift][2]);
  if (ti >= 4) return toast("Это максимум — Мифический!");
  const pool = GIFTS.filter(function(g) { return g[2] === RAR[ti + 1]; });
  let avg = 0;
  pool.forEach(function(g) { avg += g[3]; });
  avg = avg / pool.length;
  const chance = Math.round(Math.min(85, Math.max(10, G[n.gift][3] / avg * 75)));
  const v = document.getElementById("view");
  v.innerHTML = '<div class="card">⬆️ ' + G[n.gift][1] + ' <b>' + n.gift + '</b> → ' + RAR[ti + 1] +
    '<br>Шанс успеха: <b>' + chance + '%</b></div>' +
    '<button class="btn" onclick="rollUpg(' + id + ',' + (ti + 1) + ',' + chance + ')">🎲 Крутить</button>' +
    '<button class="btn gray" onclick="go(\'upg\')">⬅️ Назад</button>';
}

function rollUpg(id, ti, chance) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  const v = document.getElementById("view");
  v.innerHTML = '<div class="slot">🎲</div>';
  setTimeout(function() {
    if (Math.random() * 100 <= chance) {
      const pool = GIFTS.filter(function(g) { return g[2] === RAR[ti]; });
      n.gift = pool[Math.floor(Math.random() * pool.length)][0];
      save();
      v.innerHTML = '<div class="card" style="text-align:center">🎉 <b>АПГРЕЙД УДАЛСЯ!</b><br>' + giftText(n) + '</div>' +
        '<button class="btn" onclick="go(\'inv\')">💎 Инвентарь</button>';
    } else {
      S.nfts = S.nfts.filter(function(x) { return x.id !== id; });
      clearMarks(id); save();
      v.innerHTML = '<div class="card" style="text-align:center">💥 <b>Провал!</b><br>NFT сгорел...</div>' +
        '<button class="btn gray" onclick="go(\'upg\')">⬅️ Апгрейд</button>';
    }
  }, 1500);
}

// ---- ПРОФИЛЬ ----
function vProf(v) {
  const pinN = S.pin ? S.nfts.find(function(n) { return n.id === S.pin; }) : null;
  const stN = S.status ? S.nfts.find(function(n) { return n.id === S.status; }) : null;
  v.innerHTML = '<div class="card">👤 <b>' + ME.first_name + '</b><br>ID: <code>' + ME.id + '</code><br><br>' +
    '💰 Баланс: <b>' + fmt(S.bal) + '</b><br>💎 NFT: ' + S.nfts.length + '<br>👥 Друзей: ' + S.friends.length + '<br><br>' +
    '📌 Закреплено: ' + (pinN ? giftText(pinN) : "—") + '<br>👑 Статус: ' + (stN ? giftText(stN) : "—") + '</div>' +
    '<div class="card">🎁 Забрать NFT по коду передачи:</div>' +
    '<input id="claim" placeholder="NFT-XXXXXXXX|Название">' +
    '<button class="btn green" onclick="claim()">Забрать NFT</button>';
}

function claim() {
  const t = document.getElementById("claim").value.trim().split("|");
  if (t.length !== 2 || !G[t[1].trim()]) return toast("Неверный код");
  S.nfts.push({ id: S.nid++, gift: t[1].trim() });
  save();
  toast(G[t[1].trim()][1] + " Получен " + t[1].trim() + "!");
  go("inv");
}

// ---- ДРУЗЬЯ ----
function vFriends(v) {
  let h = '<div class="card">👥 Друзей: ' + S.friends.length + '</div>' +
    '<input id="fid" placeholder="ID друга (узнать: /id у бота)">' +
    '<button class="btn" onclick="addFriend()">➕ Добавить по ID</button>';
  S.friends.forEach(function(f) {
    h += '<div class="card">👤 ' + f.name + '<br><span class="muted">ID ' + f.id + '</span></div>';
  });
  v.innerHTML = h;
}

function addFriend() {
  const id = document.getElementById("fid").value.trim();
  if (!/^\d+$/.test(id)) return toast("Нужен числовой ID");
  if (S.friends.some(function(f) { return f.id === id; })) return toast("Уже в друзьях");
  S.friends.push({ id: id, name: "Друг " + id.slice(-4) });
  save();
  toast("✅ Друг добавлен!");
  go("friends");
}

// ---- БОНУС ----
function vBonus(v) {
  const now = Date.now();
  if (now - S.bonus < 86400000) {
    const left = Math.ceil((86400000 - (now - S.bonus)) / 3600000);
    v.innerHTML = '<div class="card">🎁 Бонус уже получен!<br><span class="muted">Следующий через ~' + left + ' ч.</span></div>' +
      '<button class="btn gray" onclick="go(\'roulette\')">⬅️ Назад</button>';
  } else {
    v.innerHTML = '<div class="card">🎁 Твой ежедневный бонус готов!</div>' +
      '<button class="btn green" onclick="giveBonus()">Забрать +1000 монет</button>' +
      '<button class="btn gray" onclick="go(\'roulette\')">⬅️ Назад</button>';
  }
}

function giveBonus() {
  S.bal += 1000; S.bonus = Date.now(); save();
  toast("🎁 +1000 монет!"); go("roulette");
}

render();
