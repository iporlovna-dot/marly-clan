// --- НАВИГАЦИЯ ---
function showPage(pageId, clickedLink) {
  document.querySelectorAll('main').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.remove('hidden');
  if (clickedLink) clickedLink.classList.add('active');
  window.scrollTo(0, 0);
}

// --- РОТАЦИЯ ---
const PLAYERS = [
  { id:'SK', name:'ShadowKing', av:'SK', bg:'#1f2e12', fg:'#C0DD97' },
  { id:'NX', name:'NightX',     av:'NX', bg:'#2a1010', fg:'#F09595' },
  { id:'VR', name:'VoidRay',    av:'VR', bg:'#1f2e12', fg:'#97C459' },
  { id:'CR', name:'CryptoRage', av:'CR', bg:'#1a1a1a', fg:'#888780' },
  { id:'PX', name:'PhantomX',   av:'PX', bg:'#1a1a1a', fg:'#888780' },
];

const DAYS = [
  { label:'Понедельник', date:'09.06', slots: { squad:'SK', sniper:'NX', medic:'VR', engi:null } },
  { label:'Среда',       date:'11.06', slots: { squad:'NX', sniper:'CR', medic:'PX', engi:'VR' } },
  { label:'Пятница',     date:'13.06', slots: { squad:'VR', sniper:null, medic:'SK', engi:'CR' } },
];

const ROLES = [
  { key:'squad',  label:'Ком. отряда', cls:'role-squad' },
  { key:'sniper', label:'Снайпер',     cls:'role-sniper' },
  { key:'medic',  label:'Медик',       cls:'role-medic' },
  { key:'engi',   label:'Сапёр',       cls:'role-engi' },
];

let editMode = false;
let dragPlayerId = null;
let dragFromDay = null;
let dragFromRole = null;

function playerById(id) { return PLAYERS.find(p => p.id === id); }

function toggleEdit() {
  editMode = !editMode;
  const btn = document.getElementById('edit-btn');
  if (btn) btn.textContent = editMode ? 'Готово' : 'Редактировать';
  renderRotation('rot-grid');
}

function renderRotation(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  DAYS.forEach((day, dayIdx) => {
    const col = document.createElement('div');
    const label = document.createElement('div');
    label.className = 'rot-day-label';
    label.innerHTML = `${day.label} <span>${day.date}</span>`;
    col.appendChild(label);

    const slotsDiv = document.createElement('div');
    slotsDiv.className = 'rot-slots';

    ROLES.forEach(role => {
      const pid = day.slots[role.key];
      const p = pid ? playerById(pid) : null;
      const slot = document.createElement('div');
      slot.className = 'slot';

      if (editMode && gridId === 'rot-grid') {
        slot.draggable = true;
        slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', e => {
          e.preventDefault();
          slot.classList.remove('drag-over');
          if (!dragPlayerId) return;
          if (dragFromDay !== null) DAYS[dragFromDay].slots[dragFromRole] = day.slots[role.key];
          day.slots[role.key] = dragPlayerId;
          dragPlayerId = null; dragFromDay = null; dragFromRole = null;
          renderRotation('rot-grid');
        });
        slot.addEventListener('dragstart', () => {
          dragPlayerId = pid;
          dragFromDay = dayIdx;
          dragFromRole = role.key;
        });
      }

      slot.innerHTML = `
        <span class="slot-role ${role.cls}">${role.label}</span>
        ${p ? `<span class="slot-name">${p.name}</span>` : `<span class="slot-empty">не назначен</span>`}
      `;
      slotsDiv.appendChild(slot);
    });

    col.appendChild(slotsDiv);
    grid.appendChild(col);
  });
}

renderRotation('rot-grid');
renderRotation('rot-grid-home');
