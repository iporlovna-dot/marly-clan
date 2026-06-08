// ─── Leaderboard bar animation ────────────────────────────────
function animateBars() {
  document.querySelectorAll('.lb-bar').forEach(bar => {
    const target = bar.style.getPropertyValue('--w');
    bar.style.width = target;
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateBars();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const leaderboard = document.querySelector('.leaderboard');
if (leaderboard) observer.observe(leaderboard);

// ─── Nav active link on scroll ─────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ─── Drag & Drop ───────────────────────────────────────────────
let dragSource = null;

const pool = document.getElementById('pool');

function makeDraggable(el) {
  el.addEventListener('dragstart', onDragStart);
  el.addEventListener('dragend', onDragEnd);
}

function onDragStart(e) {
  dragSource = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  const name = e.currentTarget.dataset.name
    || e.currentTarget.textContent.replace('×', '').trim();
  e.dataTransfer.setData('text/plain', name);
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.slot-drop').forEach(s => s.classList.remove('drag-over'));
  dragSource = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const slot = e.currentTarget;
  slot.classList.remove('drag-over');

  const name = e.dataTransfer.getData('text/plain');
  if (!name) return;

  // If slot already filled, return current player to pool
  if (slot.classList.contains('filled')) {
    const existing = slot.dataset.player;
    if (existing) returnToPool(existing);
  }

  // Remove source from DOM
  if (dragSource) {
    if (dragSource.classList.contains('pool-player')) {
      dragSource.remove();
    } else if (dragSource.classList.contains('slot-drop')) {
      clearSlot(dragSource);
    }
  }

  fillSlot(slot, name);
}

function fillSlot(slot, name) {
  slot.textContent = name;
  slot.dataset.player = name;
  slot.classList.add('filled');
  slot.setAttribute('draggable', 'true');
  makeDraggable(slot);
}

function clearSlot(slot) {
  slot.textContent = 'Перетащи бойца';
  delete slot.dataset.player;
  slot.classList.remove('filled');
  slot.removeAttribute('draggable');
  slot.removeEventListener('dragstart', onDragStart);
  slot.removeEventListener('dragend', onDragEnd);
}

function returnToPool(name) {
  const el = document.createElement('div');
  el.className = 'pool-player';
  el.setAttribute('draggable', 'true');
  el.dataset.name = name;
  el.textContent = name;
  makeDraggable(el);
  pool.appendChild(el);
}

// Allow dropping back onto the pool area
pool.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

pool.addEventListener('drop', e => {
  e.preventDefault();
  const name = e.dataTransfer.getData('text/plain');
  if (!name) return;

  // Only move back if coming from a slot
  if (dragSource && dragSource.classList.contains('slot-drop')) {
    clearSlot(dragSource);
    returnToPool(name);
  }
});

// Click to return from slot
document.querySelectorAll('.slot-drop').forEach(slot => {
  slot.addEventListener('click', () => {
    if (slot.classList.contains('filled')) {
      const name = slot.dataset.player;
      clearSlot(slot);
      if (name) returnToPool(name);
    }
  });

  slot.addEventListener('dragover', onDragOver);
  slot.addEventListener('dragleave', onDragLeave);
  slot.addEventListener('drop', onDrop);
});

// Init pool players
document.querySelectorAll('.pool-player').forEach(makeDraggable);
