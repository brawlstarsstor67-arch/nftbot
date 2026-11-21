const tg = window.Telegram?.WebApp;
if (tg) tg.ready();

const ME = tg?.initDataUnsafe?.user || { id: 777000, first_name: "Гость" };
const KEY = "casino_" + ME.id;

// Каталог подарков (как в Telegram)
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
const G = Object.fromEntries(GIFTS.map(g => [g, g]));

const CASES = {
  bronze: {name:"🥉 Обычный", price:500, w:[90,9,1,0,0]},
  silver:{name:"🥈 Серебряный", price:3000, w:[60,30,9,1,0]},
  gold:  {name:"🥇 Золотой", price:15000, w:[30,40,20,9,1]},
  legend:{name:"💎 Легендарный", price:60000, w:[0,30,40,25,5]}
};

let S = load();

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d) return d;
  } catch(e) {}
  return { bal:1000, nfts:, nid:1, pin:null, status:null, friends:, bonus:0 };
}

function save() { localStorage.setItem(KEY, JSON.stringify(S)); }
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g," "); }
function gift(n) {
  const g = G[n.gift];
  return `${g} <b>${g}</b> ${REMO[g]} <span class="rarity-badge">${g}</span> · \${fmt(g)} монет`;
}

let TAB = "roulette";
const TABS = [
  ["roulette","🎰 Рулетка"],
  ["cases","🎁 Кейсы"],
  ["inv","💎 NFT"],
  ["upg","⬆️ Апгрейд"],
  ["prof","👤 Профиль"],
  ["friends","👥 Друзья"],
  ["bonus","🎁 Бонус"]
];

function render() {
  document.getElementById("bal").textContent = "💰 " + fmt(S.bal) + " монет";
  document.getElementById("tabs").innerHTML = TABS.map(([k,t]) =>
    `<div class="tab ${TAB===k?'on':''}" onclick="TAB='${k}';render()">\${t}</div>`
  ).join("");
  const v = document.getElementById("view");
  ({roulette:vRoulette, cases:vCases, inv:vInv, upg:vUpg, prof:vProf, friends:vFriends, bonus:vBonus})[TAB](v);
}

// Рулетка
function vRoulette(v) {
  v.innerHTML = `<div class="slot" id="slot">🎰</div><div id="res" class="muted" style="text-align:center">Шанс: x2 · x3 · x5 · x10</div>` +
    [100,500,1000,5000].map(b =>
      `<button class="btn" onclick="spin(${b})">Крутить на ${fmt(b)}</button>`
    ).join("");
}

function spin(bet) {
  if (S.bal < bet) return toast("Не хватает монет!");
  const slot = document.getElementById("slot"), res = document.getElementById("res");
  const frames = ["🍒 🍋 ⭐","⭐ 🍒 7️⃣","7️⃣ ⭐ 🍒","🍋 7️⃣ ⭐"];
  let i = 0;
  const iv = setInterval(() => { slot.textContent = frames[i++ % 4]; }, 150);
  S.bal -= bet; save(); render();
  setTimeout(() => {
    clearInterval(iv);
    const r = Math.random(); let mult = 0;
    if (r >= 0.45) mult = r < 0.75 ? 2 : r < 0.90 ? 3 : r < 0.97 ? 5 : 10;
    if (!mult) {
      res.innerHTML = `<span style="color:#ff6b6b">💥 Проигрыш! −\${fmt(bet)}</span>`;
    } else {
      const win = bet * mult - bet;
      S.bal += win; save();
      res.innerHTML = `<span style="color:#7dff8a">🎉 Выигрыш x${mult}! +${fmt(win)}</span>`;
    }
    document.getElementById("bal").textContent = "💰 " + fmt(S.bal) + " монет";
  }, 1800);
}

// Кейсы
function vCases(v) {
  v.innerHTML = Object.entries(CASES).map(([k,c]) =>
    `<div class="card"><div class="nft"><span>\${c.name} кейс</span>
     <button class="btn green" style="width:auto;margin:0;padding:8px 14px" onclick="openCase('${k}')">${fmt(c.price)}</button></div></div>`
  ).join("");
}

function openCase(k) {
  const c = CASES[k];
  if (S.bal < c.price) return toast("Не хватает монет!");
  S.bal -= c.price;
  const tier = tierPick(c.w);
  const pool = GIFTS.filter(g => g === tier);
  const giftName = pool[Math.floor(Math.random() * pool.length)];
  S.nfts.push({id:S.nid++, gift:giftName}); save();
  toast(`${G[giftName]} Выпал ${giftName}! ${REMO[tier]} ${tier}`);
  TAB = "inv"; render();
}

function tierPick(w) {
  const r = Math.random() * w.reduce((a,b)=>a+b,0); let s=0;
  for (let i=0;i<w.length;i++){ s+=w[i]; if (r<s) return RAR[i]; } return RAR;
}

// Инвентарь
function vInv(v) {
  if (!S.nfts.length) {
    v.innerHTML = `<div class="card">Пусто! Открой кейс 🎁</div>`; return;
  }
  v.innerHTML = S.nfts.map(n => {
    const pin = S.pin===n.id ? " 📌" : "";
    const worn = S.status===n.id ? " 👑" : "";
    return `<div class="card"><div class="nft"><span>${gift(n)}${pin}${worn}<br><span class="muted">ID ${n.id}</span></span></div>
      <button class="btn gray" onclick="menuNft(\${n.id})">Действия</button></div>`;
  }).join("");
}

function menuNft(id) {
  const n = S.nfts.find(x=>x.id===id); if(!n) return;
  TAB = "nftmenu"; const v = document.getElementById("view");
  v.innerHTML = `<div class="card">${gift(n)}<br><span class="muted">ID ${n.id}</span></div>
    <button class="btn" onclick="doPin(\${id})">📌 Закрепить</button>
    <button class="btn" onclick="doStatus(\${id})">👑 Надеть как статус</button>
    <button class="btn green" onclick="doSell(${id})">💱 Продать за ${fmt(Math.floor(G[n.gift]*0.7))}</button>
    <button class="btn red" onclick="doTransfer(\${id})">🎁 Передать (код)</button>
    <button class="btn gray" onclick="TAB='inv';render()">⬅️ Назад</button>`;
}

function doPin(id) { S.pin = id; save(); toast("📌 Закреплено!"); TAB="inv"; render(); }
function doStatus(id) { S.status = id; save(); toast("👑 Надето как статус!"); TAB="inv"; render(); }
function doSell(id) {
  const n = S.nfts.find(x=>x.id===id); if(!n) return;
  S.bal += Math.floor(G[n.gift]*0.7);
  S.nfts = S.nfts.filter(x=>x.id!==id);
  if (S.pin===id) S.pin=null; if (S.status===id) S.status=null;
  save(); toast("Продано!"); TAB="inv"; render();
}

function doTransfer(id) {
  const n = S.nfts.find(x=>x.id===id); if(!n) return;
  const code = "NFT-" + Math.random().toString(36).slice(2,10).toUpperCase();
  const text = `${code}|${n.gift}`;
  S.nfts = S.nfts.filter(x=>x.id!==id);
  if (S.pin===id) S.pin=null; if (S.status===id) S.status=null;
  save();
  TAB = "giftcode"; const v = document.getElementById("view");
  v.innerHTML = `<div class="card">🎁 NFT упакован в код. Отправь его другу в чат:<br><br>
    <b style="word-break:break-all">\${text}</b></div>
    <button class="btn" onclick="copyText('\${text}')">📋 Скопировать</button>
    <button class="btn" onclick="shareText('\${text}')">📨 Отправить в Telegram</button>
    <button class="btn gray" onclick="TAB='inv';render()">⬅️ Назад</button>`;
}

// Апгрейд
function vUpg(v) {
  if (!S.nfts.length) {
    v.innerHTML = `<div class="card">Нет NFT для улучшения</div>`; return;
  }
  v.innerHTML = `<div class="card">Выбери NFT. Успех — подарок на редкость выше. Провал — 💥 сгорает.</div>` +
    S.nfts.map(n => {
      const g = G[n.gift];
      return `<button class="btn" onclick="tryUpg(${n.id})">${g} ${g} · ${g}</button>`;
    }).join("");
}

function tryUpg(id) {
  const n = S.nfts.find(x=>x.id===id); if(!n) return;
  const ti = RAR.indexOf(G[n.gift]);
  if (ti >= 4) return toast("Это максимум!");
  const pool = GIFTS.filter(g=>g===RAR[ti+1]);
  const avg = pool.reduce((a,g)=>a+g,0)/pool.length;
  const chance = Math.round(Math.min(85, Math.max(10, G[n.gift]/avg*75)));
  const v = document.getElementById("view");
  v.innerHTML = `<div class="card">⬆️ ${G[n.gift]} <b>${n.gift}</b> → ${RAR[ti+1]}<br>Шанс: <b>${chance}%</b></div>
    <button class="btn" onclick="rollUpg(${id},${ti+1},\${chance})">🎲 Крутить</button>
    <button class="btn gray" onclick="TAB='upg';render()">⬅️ Назад</button>`;
}

function rollUpg(id, ti, chance) {
  const n = S.nfts.find(x=>x.id===id); if(!n) return;
  const v = document.getElementById("view");
  v.innerHTML = `<div class="slot" id="slot">🎲</div>`;
  setTimeout(() => {
    if (Math.random()*100 <= chance) {
      const pool = GIFTS.filter(g=>g===RAR[ti]);
      n.gift = pool[Math.floor(Math.random()*pool.length)]; save();
      v.innerHTML = `<div class="card" style="text-align:center">🎉 <b>АПГРЕЙД!</b><br>\${gift(n)}</div>
        <button class="btn" onclick="TAB='inv';render()">💎 Инвентарь</button>`;
    } else {
      S.nfts = S.nfts.filter(x=>x.id!==id);
      if (S.pin===id) S.pin=null; if (S.status===id) S.status=null; save();
      v.innerHTML = `<div class="card" style="text-align:center">💥 <b>Провал!</b><br>NFT сгорел...</div>
        <button class="btn" onclick="TAB='upg';render()">⬅️ Апгрейд</button>`;
    }
  }, 1500);
}

// Профиль
function vProf(v) {
  const pin = S.pin ? gift(S.nfts.find(n=>n.id===S.pin)||{}) : "—";
  const st  = S.status ? gift(S.nfts.find(n=>n.id===S.status)||{}) : "—";
  v.innerHTML = `<div class="card">👤 <b>${ME.first_name}</b><br>ID: <code>${ME.id}</code><br><br>
    💰 Баланс: <b>${fmt(S.bal)}</b><br>💎 NFT: ${S.nfts.length}<br>👥 Друзей: \${S.friends.length}<br><br>
    📌 Закреплено: ${pin}<br>👑 Статус: ${st}</div>
    <div class="card">🎁 Ввести код передачи:</div>
    <input id="claim" placeholder="NFT-XXXXXXXX|Название">
    <button class="btn green" onclick="claim()">Забрать NFT</button>`;
}

function claim() {
  const t = document.getElementById("claim").value.trim().split("|");
  if (t.length!==2 || !G[t.trim()]) return toast("Неверный код");
  S.nfts.push({id:S.nid++, gift:t.trim()}); save();
  toast(`${G[t.trim()]} Получен ${t.trim()}!`); TAB="inv"; render();
}

// Друзья
function vFriends(v) {
  v.innerHTML = `<div class="card">👥 Друзей: \${S.friends.length}</div>
    <input id="fid" placeholder="ID друга (узнать: /id у бота)">
    <button class="btn" onclick="addFriend()">➕ Добавить</button>` +
    S.friends.map(f=>`<div class="card">👤 ${f.name}<br><span class="muted">ID ${f.id}</span></div>`).join("");
}

function addFriend() {
  const id = document.getElementById("fid").value.trim();
  if (!/^\d+\$/.test(id)) return toast("Нужен числовой ID");
  if (S.friends.some(f=>f.id===id)) return toast("Уже в друзьях");
  S.friends.push({id, name:"Друг " + id.slice(-4)}); save(); TAB="friends"; render();
}

// Бонус
function vBonus(v) {
  const now = Date.now();
  if (now - S.bonus < 86400000) {
    v.innerHTML = `<div class="card">🎁 Бонус будет завтра!<br><span class="muted">Осталось: \${fmt(Math.floor((86400000 - (now - S.bonus))/60000))} минут</span></div>
      <button class="btn gray" onclick="TAB='roulette';render()">⬅️ Назад</button>`;
  } else {
    v.innerHTML = `<div class="card">🎁 Получи ежедневный бонус!</div>
      <button class="btn green" onclick="giveBonus()">+1000 монет</button>
      <button class="btn gray" onclick="TAB='roulette';render()">⬅️ Назад</button>`;
  }
}

function giveBonus() {
  S.bal += 1000; S.bonus = Date.now(); save();
  toast("🎁 +1000 монет!"); TAB="roulette"; render();
}

function copyText(t) { navigator.clipboard?.writeText(t); toast("Скопировано"); }
function shareText(t) {
  if (tg?.openTelegramLink)
    tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(t));
  else navigator.clipboard?.writeText(t);
}

function toast(msg) { tg?.showAlert?.(msg) ?? alert(msg); }

render();
