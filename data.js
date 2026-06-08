// Начальные данные — загружаются один раз если localStorage пустой

const DEFAULT_DATA = {
  members: [
    { id:1, av:'SK', name:'ShadowKing', bg:'#1f2e12', fg:'#C0DD97', role:'Лидер', game:'Reforger', hours:1200, kd:3.2, online:true },
    { id:2, av:'NX', name:'NightX',     bg:'#2a1010', fg:'#F09595', role:'Офицер', game:'Reforger', hours:980,  kd:2.8, online:true },
    { id:3, av:'VR', name:'VoidRay',    bg:'#1f2e12', fg:'#97C459', role:'Офицер', game:'Reforger', hours:740,  kd:2.1, online:false },
    { id:4, av:'CR', name:'CryptoRage', bg:'#1a1a1a', fg:'#888780', role:'Участник', game:'Reforger', hours:520, kd:1.9, online:true },
    { id:5, av:'PX', name:'PhantomX',   bg:'#1a1a1a', fg:'#888780', role:'Участник', game:'Reforger', hours:310, kd:1.4, online:false },
  ],
  leaderboard: [
    { id:1, name:'ShadowKing', pts:4210 },
    { id:2, name:'NightX',     pts:3380 },
    { id:3, name:'VoidRay',    pts:2740 },
    { id:4, name:'CryptoRage', pts:2100 },
    { id:5, name:'PhantomX',   pts:1590 },
  ],
  rotation: [
    { label:'Понедельник', date:'09.06', slots:{ squad:'ShadowKing', sniper:'NightX', medic:'VoidRay', engi:'' } },
    { label:'Среда',       date:'11.06', slots:{ squad:'NightX', sniper:'CryptoRage', medic:'PhantomX', engi:'VoidRay' } },
    { label:'Пятница',     date:'13.06', slots:{ squad:'VoidRay', sniper:'', medic:'ShadowKing', engi:'CryptoRage' } },
  ],
  tournaments: [
    { id:1, date:'15.06.2025', name:'Reforger League — Сезон 3', desc:'Онлайн · 16 команд · Призовой фонд: 5000₽', status:'Регистрация' },
    { id:2, date:'01.05.2025', name:'Spring Reforger Cup', desc:'Онлайн · 12 команд', status:'2 место' },
    { id:3, date:'10.03.2025', name:'Winter Clash 2025', desc:'Онлайн · 8 команд', status:'1 место' },
  ],
  news: [
    { id:1, date:'05.06.2025', title:'Новый сезон — новые правила ротации', body:'С этой недели вводим обновлённую систему ротации. Каждый участник обязан сыграть минимум 2 сессии в неделю.' },
    { id:2, date:'01.06.2025', title:'MARLY занял 2 место на Spring Cup!', body:'Поздравляем весь состав с отличным результатом. Особая благодарность ShadowKing и NightX за командную игру в финале.' },
    { id:3, date:'20.05.2025', title:'Набор новых участников открыт', body:'Клан MARLY открывает набор. Требования: минимум 200 часов в Reforger, K/D от 1.0, активность минимум 3 раза в неделю.' },
  ]
};

function getData(key) {
  const raw = localStorage.getItem('marly_' + key);
  if (raw) return JSON.parse(raw);
  return DEFAULT_DATA[key];
}

function saveData(key, value) {
  localStorage.setItem('marly_' + key, JSON.stringify(value));
}

function initData() {
  Object.keys(DEFAULT_DATA).forEach(key => {
    if (!localStorage.getItem('marly_' + key)) {
      saveData(key, DEFAULT_DATA[key]);
    }
  });
}

initData();
