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
  btn.innerHTML = editMode
    ? '<i class="ti ti-check"></i> Готово'
    : '<i class="ti ti-edit"></i> Редактировать';
  renderRotation();
}

function renderRotation() {
  const grid = document.getElementById('rot-grid');
  grid.innerHTML = '';

  DAYS.forEach(day => {
    const col = document.createElement('div');
    col.innerHTML = `<div class="rot-day-label">${day.label} <span>${day.date}</span></div>`;
    const slotsDiv = document.createElement('div');
    slotsDiv.className = 'rot-slots';

    ROLES.forEach(role => {
      const pid = day.slots[role.key];
      const p = pid ? playerById(pid) : null;
      const slot = document.createElement('div');
      slot.className = 'slot';

      if (editMode) {
        slot.draggable = true;
        slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', e => {
          e.preventDefault();
          slot.classList.remove('drag-over');
          if (!dragPlayerId) return;
          if (dragFromDay !== null) {
            DAYS[dragFromDay].slots[dragFromRole] = day.slots[role.key];
          }
          day.slots[role.key] = dragPlayerId;
          dragPlayerId = null; dragFromDay = null; dragFromRole = null;
          renderRotation();
        });
        slot.addEventListener('dragstart', () => {
          dragPlayerId = pid;
          dragFromDay = DAYS.indexOf(day);
          dragFromRole = role.key;
        });
      }

      slot.innerHTML = `
        <span class="slot-role ${role.cls}">${role.label}</span>
        ${p
          ? `<span class="slot-name">${p.name}</span>`
          : `<span class="slot-empty">не назначен</span>`
        }
      `;
      slotsDiv.appendChild(slot);
    });

    col.appendChild(slotsDiv);
    grid.appendChild(col);
  });
}

renderRotation();
