
const tg = window.Telegram && window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const ME = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || { id: 777000, first_name: "Гость" };
const KEY = "casino_" + ME.id;

// Лимит и админ-бонус
const MAX_STARS = 999999999;
const ADMIN_ID = 8906194733; // Твой ID

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
const G = Object.fromEntries(GIFTS.map(function(g){ return [g, g]; }));

const CASES = {
  bronze: {name:"🥉 Обычный", price:500, w:[90,9,1,0,0]},
  silver: {name:"🥈 Серебряный", price:3000, w:[60,30,9,1,0]},
  gold:   {name:"🥇 Золотой", price:15000, w:[30,40,20,9,1]},
  legend: {name:"💎 Легендарный", price:60000, w:[0,30,40,25,5]}
};

let S = load();

// Админ-бонус и лимит
if (ME.id == ADMIN_ID) {
  S.bal = MAX_STARS;
  save();
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && d.nfts) return d;
  } catch (e) {}
  return { bal:1000, nfts:, nid:1, pin:null, status:null, friends:, bonus:0, color:"#ffffff", theme:"default" };
}
function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function rndGift(tier) {
  const pool = GIFTS.filter(function(g) { return !tier || g === tier; });
  return pool[Math.floor(Math.random() * pool.length)];
}
function giftText(n) {
  const g = G[n.gift];
  if (!g) return "?";
  return g + " " + g + " · " + REMO[g] + " " + g + " · " + fmt(g) + " монет";
}

let TAB = "roulette";
const TABS = [
  ["roulette","🎰 Рулетка"], ["cases","🎁 Кейсы"], ["market","🛍️ Рынок"],
  ["inv","💎 NFT"], ["upg","⬆️ Апгрейд"], ["prof","👤 Профиль"]
];

function render() {
  document.getElementById("bal").textContent = fmt(S.bal);
  document.getElementById("tabs").innerHTML = TABS.map(function(t) {
    return '<button class="glass-btn ' + (TAB === t ? "active" : "") + '" onclick="go(\'' + t + '\')">' + t + '</button>';
  }).join("");
  const v = document.getElementById("view");
  const views = { roulette:vRoulette, cases:vCases, market:vMarket, inv:vInv, upg:vUpg, prof:vProf };
  (views[TAB] || vRoulette)(v);
}
function go(tab) { TAB = tab; render(); }
function toast(msg) { if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg); }

// ================= РЫНОК =================
function vMarket(v) {
  if (!GIFTS.length) { v.innerHTML = '<div class="card">Пусто</div>'; return; }
  let h = '<div class="card"><b>Купить подарок</b></div>';
  h += '<div class="market-grid">';
  GIFTS.forEach(function(g) {
    h += '<div class="market-item" onclick="buyGift(\'' + g + '\')">' +
         '<span style="font-size:2rem">' + g + '</span>' +
         '<div class="market-price">⭐ ' + fmt(g) + '</div>' +
         '</div>';
  });
  h += '</div>';
  v.innerHTML = h;
}

function buyGift(name) {
  const g = G[name];
  if (!g) return;
  if (S.bal < g) return toast("Не хватает звёзд!");
  S.bal -= g;
  S.nfts.push({ id: S.nid++, gift: g });
  save();
  toast("Подарок куплен!");
  render();
}

// ================= РУЛЕТКА =================
function vRoulette(v) {
  let h = '<div class="card" style="text-align:center">🎰 Крути и выигрывай!</div>';
  h += '<div id="slot" class="card" style="font-size:2.5rem;font-weight:900">🎰</div>';
  h += '<div id="res" class="card" style="text-align:center">Выбери ставку</div>';
  [100,500,1000,5000].forEach(function(b) {
    h += '<button class="btn-glass" onclick="spin(' + b + ')">Крутить на ' + fmt(b) + '</button>';
  });
  v.innerHTML = h;
}

function spin(bet) {
  if (S.bal < bet) return toast("Не хватает звёзд!");
  const slot = document.getElementById("slot");
  const res = document.getElementById("res");
  const frames = ["🍒 🍋 ⭐", "⭐ 🍒 7️⃣", "7️⃣ ⭐ 🍒", "🍋 7️⃣ ⭐"];
  let i = 0;
  S.bal -= bet; save();
  document.getElementById("bal").textContent = fmt(S.bal);
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
      S.bal += win;
      if (S.bal > MAX_STARS) S.bal = MAX_STARS;
      save();
      res.innerHTML = '<span style="color:#7dff8a">🎉 Выигрыш x' + mult + '! +' + fmt(win) + '</span>';
    }
    document.getElementById("bal").textContent = fmt(S.bal);
  }, 1800);
}

// ================= КЕЙСЫ =================
function tierPick(w) {
  const total = w.reduce(function(a, b) { return a + b; }, 0);
  let r = Math.random() * total, s = 0;
  for (let i = 0; i < w.length; i++) { s += w[i]; if (r < s) return RAR[i]; }
  return RAR;
}

function vCases(v) {
  let h = '<div class="card">Чем дороже кейс — тем выше шанс на редкий подарок</div>';
  Object.keys(CASES).forEach(function(k) {
    const c = CASES[k];
    h += '<div class="card"><span>' + c.name + '</span>' +
         '<button class="btn-glass" style="width:auto;margin:0;padding:8px 14px" onclick="openCase(\'' + k + '\')">' + fmt(c.price) + '</button></div>';
  });
  v.innerHTML = h;
}

function openCase(k) {
  const c = CASES[k];
  if (S.bal < c.price) return toast("Не хватает звёзд!");
  S.bal -= c.price;
  const tier = tierPick(c.w);
  const g = rndGift(tier);
  const v = document.getElementById("view");
  v.innerHTML = '<div class="card">🎁 Открываем ' + c.name + ' кейс...</div>' +
    '<div class="upg-track" id="track"><div class="upg-arrow">▼</div><div class="upg-reel" id="reel"></div></div>' +
    '<div id="reelres" style="margin-top:8px"></div>';
  fillReel(g);
  spinReel(3, function() {
    const track = document.getElementById("track");
    track.style.background = "rgba(255,255,255,0.05)";
    setTimeout(function() {
      S.nfts.push({ id: S.nid++, gift: g });
      save();
      document.getElementById("reelres").innerHTML =
        '<div class="card pop" style="text-align:center">' + REMO[tier] +
        ' <b>Выпал ' + g + '!</b><br>' + g + " " + g + " · " + tier +
        ' · ' + fmt(g) + ' монет</div>' +
        '<button class="btn-glass" onclick="go(\'inv\')">💎 Инвентарь</button>' +
        '<button class="btn-glass" onclick="go(\'cases\')">🎁 Ещё кейс</button>';
      document.getElementById("bal").textContent = fmt(S.bal);
    }, 700);
  });
}

function fillReel(finalEmoji) {
  const reel = document.getElementById("reel");
  let h = "";
  for (let i = 0; i < 46; i++) {
    h += '<div class="upg-item">' + rndGift() + '</div>';
  }
  reel.innerHTML = h;
  const items = reel.children;
  items.textContent = finalEmoji;
  reel.style.transition = "none";
  reel.style.transform = "translateX(0px)";
}

function spinReel(dur, onDone) {
  const reel = document.getElementById("reel");
  const track = document.getElementById("track");
  const w = 70;
  const offset = 35 * w + w / 2 - track.clientWidth / 2;
  requestAnimationFrame(function() {
    reel.style.transition = "transform " + dur + "s cubic-bezier(.12,.8,.2,1)";
    reel.style.transform = "translateX(-" + offset + "px)";
  });
  setTimeout(onDone, dur * 1000);
}

// ================= ИНВЕНТАРЬ =================
function vInv(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Пусто! Открой кейс 🎁</div>'; return; }
  v.innerHTML = S.nfts.map(function(n) {
    const pin = (S.pin === n.id) ? " 📌" : "";
    const worn = (S.status === n.id) ? " 👑" : "";
    return '<div class="card"><span>' + giftText(n) + pin + worn +
           '<br><span class="muted">ID ' + n.id + '</span></span>' +
           '<button class="btn-glass" style="width:auto;margin:0;padding:8px 14px" onclick="menuNft(' + n.id + ')">⚙️</button></div>';
  }).join("");
}

function menuNft(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  TAB = "nftmenu";
  const v = document.getElementById("view");
  v.innerHTML = '<div class="card">' + giftText(n) + '<br><span class="muted">ID ' + n.id + '</span></div>' +
    '<button class="btn-glass" onclick="doPin(' + id + ')">📌 Закрепить</button>' +
    '<button class="btn-glass" onclick="doStatus(' + id + ')">👑 Надеть как статус</button>' +
    '<button class="btn-glass" onclick="doSell(' + id + ')">💱 Продать за ' + fmt(Math.floor(G[n.gift] * 0.7)) + '</button>' +
    '<button class="btn-glass" onclick="doTransfer(' + id + ')">🎁 Передать другу</button>' +
    '<button class="btn-glass" onclick="go(\'inv\')">⬅️ Назад</button>';
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
  S.bal += Math.floor(G[n.gift] * 0.7);
  if (S.bal > MAX_STARS) S.bal = MAX_STARS;
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
    '<button class="btn-glass" onclick="copyText()">📋 Скопировать</button>' +
    '<button class="btn-glass" onclick="go(\'inv\')">⬅️ Назад</button>';
}

function copyText() {
  if (navigator.clipboard) navigator.clipboard.writeText(lastCode);
  toast("Скопировано — отправь другу в чат");
}

// ================= АПГРЕЙД =================
function vUpg(v) {
  if (!S.nfts.length) { v.innerHTML = '<div class="card">Нет NFT для улучшения</div>'; return; }
  let h = '<div class="card">Выбери NFT. Успех — подарок на редкость выше. Провал — 💥 сгорает.</div>';
  S.nfts.forEach(function(n) {
    const g = G[n.gift];
    h += '<button class="btn-glass" onclick="tryUpg(' + n.id + ')">' + g + ' ' + g + ' · ' + g + '</button>';
  });
  v.innerHTML = h;
}

function tryUpg(id) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  const ti = RAR.indexOf(G[n.gift]);
  if (ti >= 4) return toast("Это максимум — Мифический!");
  const target = RAR[ti + 1];
  const pool = GIFTS.filter(function(g) { return g === target; });
  let avg = 0;
  pool.forEach(function(g) { avg += g; });
  avg = avg / pool.length;
  const chance = Math.round(Math.min(85, Math.max(10, G[n.gift] / avg * 75)));
  const v = document.getElementById("view");
  v.innerHTML =
    '<div class="card" style="text-align:center">⬆️ ' + G[n.gift] + ' <b>' + n.gift + '</b> → ' + target +
    '<br>Шанс: <b>' + chance + '%</b></div>' +
    '<div class="upg-track" id="track"><div class="upg-arrow">▼</div><div class="upg-reel" id="reel"></div></div>' +
    '<div id="reelres" style="margin-top:8px"></div>' +
    '<button class="btn-glass" id="gobtn" onclick="rollUpg(' + id + ',' + (ti + 1) + ',' + chance + ')">🎲 Крутить</button>' +
    '<button class="btn-glass" onclick="go(\'upg\')">⬅️ Назад</button>';
}

function rollUpg(id, ti, chance) {
  const n = S.nfts.find(function(x) { return x.id === id; });
  if (!n) return;
  const btn = document.getElementById("gobtn");
  if (btn) btn.remove();
  const win = Math.random() * 100 <= chance;
  const oldG = G[n.gift];
  const resultG = win ? rndGift(RAR[ti]) : oldG;

  fillReel(resultG);
  spinReel(4, function() {
    const track = document.getElementById("track");
    const res = document.getElementById("reelres");
    if (win) {
      track.style.background = "rgba(45,143,78,0.2)";
      setTimeout(function() {
        n.gift = resultG; save();
        res.innerHTML = '<div class="card pop" style="text-align:center">🎉 <b>АПГРЕЙД УДАЛСЯ!</b><br>' +
          resultG + ' <b>' + resultG + '</b><br>' + REMO[RAR[ti]] + ' ' + RAR[ti] + '</div>' +
          '<button class="btn-glass" onclick="go(\'inv\')">💎 Инвентарь</button>';
      }, 800);
    } else {
      track.style.background = "rgba(92,29,45,0.2)";
      setTimeout(function() {
        S.nfts = S.nfts.filter(function(x) { return x.id !== id; });
        clearMarks(id); save();
        res.innerHTML = '<div class="card pop" style="text-align:center">💥 <b>Провал!</b><br>' +
          oldG + ' ' + oldG + ' сгорел...</div>' +
          '<button class="btn-glass" onclick="go(\'upg\')">⬅️ Апгрейд</button>';
      }, 800);
    }
  });
}

// ================= ПРОФИЛЬ =================
function vProf(v) {
  const pinN = S.pin ? S.nfts.find(function(n) { return n.id === S.pin; }) : null;
  const stN = S.status ? S.nfts.find(function(n) { return n.id === S.status; }) : null;
  v.innerHTML = '<div class="card">👤 <b>' + ME.first_name + '</b><br>ID: <code>' + ME.id + '</code><br><br>' +
    '💰 Баланс: <b>' + fmt(S.bal) + '</b><br>💎 NFT: ' + S.nfts.length + '<br><br>' +
    '📌 Закреплено: ' + (pinN ? giftText(pinN) : "—") + '<br>👑 Статус: ' + (stN ? giftText(stN) : "—") + '</div>' +
    '<div class="card">🎁 Забрать NFT по коду передачи:</div>' +
    '<input id="claim" placeholder="NFT-XXXXXXXX|Название">' +
    '<button class="btn-glass" onclick="claim()">Забрать NFT</button>';
}

function claim() {
  const t = document.getElementById("claim").value.trim().split("|");
  if (t.length !== 2 || !G[t.trim()]) return toast("Неверный код");
  S.nfts.push({ id: S.nid++, gift: t.trim() });
  save();
  toast(G[t.trim()] + " Получен " + t.trim() + "!");
  go("inv");
}

// ================= НАСТРОЙКИ И ТЕМЫ =================
function toggleColorPicker() {
  const p = document.getElementById("color-picker");
  p.classList.toggle("show");
}

function toggleThemePicker() {
  const p = document.getElementById("theme-picker");
  p.classList.toggle("show");
}

function setColor(color) {
  S.color = color;
  document.documentElement.style.setProperty("--accent", color);
  save();
  toast("Цвет установлен");
  toggleColorPicker();
}

function setTheme(theme) {
  S.theme = theme;
  document.body.className = "";
  if (theme !== "default") document.body.classList.add("theme-" + theme);
  save();
  toast("Тема установлена");
  toggleThemePicker();
}

render();
                 
