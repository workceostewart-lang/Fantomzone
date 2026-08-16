import { BrowserPhysicsEngine } from './physics.js';
import { ArenaRenderer } from './renderer.js';

const screens = [...document.querySelectorAll('[data-screen]')];
const canvas = document.querySelector('#arena-canvas');
const renderer = new ArenaRenderer(canvas);
const physics = new BrowserPhysicsEngine();
const state = {
  activeScreen: 'home', playerHp: 100, rivalHp: 100, currentTurn: 'player', aiming: false, power: 0, roomCode: '',
  player: { x: 0.21, y: 0.62 }, rival: { x: 0.79, y: 0.62 }, projectile: null, lastFrame: performance.now(), turnTime: 15,
};

const showScreen = (name) => {
  state.activeScreen = name;
  screens.forEach((screen) => screen.classList.toggle('is-active', screen.dataset.screen === name));
  if (name === 'battle') requestAnimationFrame(frame);
};

const setToast = (message, tone = 'normal') => {
  const toast = document.querySelector('#battle-toast'); toast.textContent = message; toast.dataset.tone = tone; toast.classList.add('is-visible');
  window.clearTimeout(setToast.timeout); setToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
};

const resetBattle = () => {
  state.playerHp = 100; state.rivalHp = 100; state.currentTurn = 'player'; state.turnTime = 15; state.projectile = null; state.aiming = false; state.power = 0;
  updateHealth(); updateTurn(); updatePower(); document.querySelector('#aim-hint').classList.add('is-visible');
};

const startBattle = () => { resetBattle(); showScreen('battle'); setToast('Your turn. Make it count.'); };

const updateHealth = () => {
  document.querySelector('#player-hp').textContent = state.playerHp; document.querySelector('#rival-hp').textContent = state.rivalHp;
  document.querySelector('#player-health').style.width = `${state.playerHp}%`; document.querySelector('#rival-health').style.width = `${state.rivalHp}%`;
};

const updatePower = () => { document.querySelector('#power-fill').style.width = `${Math.round(state.power * 100)}%`; };

const generateRoomCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let code = '';
  for (let i = 0; i < 6; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
};

const makeRoom = () => { state.roomCode = generateRoomCode(); document.querySelector('#room-code').firstChild.textContent = `${state.roomCode} `; document.querySelector('#copy-note').textContent = 'Tap the code to copy it to your clipboard.'; showScreen('lobby'); };
const joinRoom = () => {
  const input = document.querySelector('#room-input'); const code = input.value.trim().toUpperCase();
  if (code.length !== 6) { document.querySelector('#room-note').textContent = 'Enter a six-character code to join the lobby.'; input.focus(); return; }
  state.roomCode = code; document.querySelector('#room-code').firstChild.textContent = `${code} `; showScreen('lobby');
};

const copyRoomCode = async () => {
  try { await navigator.clipboard.writeText(state.roomCode); document.querySelector('#copy-note').textContent = 'Copied. Send it to your rival.'; } catch { document.querySelector('#copy-note').textContent = `Room code: ${state.roomCode}`; }
};

const screenPoint = (event) => { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height }; };
const aimStart = (event) => {
  if (state.activeScreen !== 'battle' || state.currentTurn !== 'player' || state.projectile) return;
  event.preventDefault(); state.aiming = true; document.querySelector('#aim-hint').classList.remove('is-visible'); canvas.setPointerCapture?.(event.pointerId); aimMove(event);
};
const aimMove = (event) => {
  if (!state.aiming) return; const point = screenPoint(event); const dx = state.player.x - point.x; const dy = state.player.y - point.y; state.power = Math.min(1, Math.hypot(dx, dy) / 0.44); updatePower();
};
const aimEnd = (event) => {
  if (!state.aiming) return; state.aiming = false; const point = screenPoint(event); const dx = state.player.x - point.x; const dy = state.player.y - point.y; const angle = Math.atan2(-dy, dx); const power = Math.max(0.32, state.power) * 2.35;
  physics.launch({ x: state.player.x, y: state.player.y - 0.04, angle, power, owner: 'player' }); state.projectile = physics.projectile; state.turnTime = 15; state.currentTurn = 'flight'; updateTurn();
};

const updateTurn = () => {
  const label = state.currentTurn === 'player' ? 'YOUR TURN' : state.currentTurn === 'flight' ? 'IN FLIGHT' : state.currentTurn === 'won' ? 'MATCH WON' : state.currentTurn === 'lost' ? 'MATCH LOST' : 'RIVAL TURN';
  document.querySelector('#turn-label').textContent = label;
  document.querySelector('#turn-timer').textContent = state.currentTurn === 'won' || state.currentTurn === 'lost' ? '✓' : Math.ceil(state.turnTime);
};

const handleLanding = (shot) => {
  const hitsTarget = shot.owner === 'player' ? shot.x > 0.66 && shot.x < 0.94 && shot.y > 0.39 : shot.x > 0.06 && shot.x < 0.34 && shot.y > 0.39;
  if (hitsTarget && shot.owner === 'player') { state.rivalHp = Math.max(0, state.rivalHp - 22); setToast('THWACK!  —  22 DAMAGE', 'hit'); updateHealth(); }
  else if (hitsTarget && shot.owner === 'rival') { state.playerHp = Math.max(0, state.playerHp - 18); setToast('BJORN CONNECTS  —  18 DAMAGE', 'hit'); updateHealth(); }
  else setToast('A clean miss. Read the arc.', 'miss');
  if (state.rivalHp <= 0) { setToast('MATCH WON  —  CLEAN SHOT', 'win'); state.currentTurn = 'won'; updateTurn(); return; }
  if (state.playerHp <= 0) { setToast('MATCH LOST  —  TRY AGAIN', 'miss'); state.currentTurn = 'lost'; updateTurn(); return; }
  window.setTimeout(() => { state.currentTurn = 'rival'; state.turnTime = 15; updateTurn(); }, 650);
};

const rivalShot = () => { const angle = Math.PI - 0.42 - Math.random() * 0.3; physics.launch({ x: state.rival.x, y: state.rival.y - 0.04, angle, power: 1.85 + Math.random() * 0.3, owner: 'rival' }); state.projectile = physics.projectile; };

const frame = (time) => {
  if (state.activeScreen !== 'battle') return;
  const dt = (time - state.lastFrame) / 1000; state.lastFrame = time;
  if (state.currentTurn === 'player') { state.turnTime = Math.max(0, state.turnTime - dt); if (state.turnTime === 0) { state.currentTurn = 'rival'; setToast('Turn forfeited. Rival is up.'); } }
  if (state.currentTurn === 'rival' && !state.projectile) rivalShot();
  if (state.projectile) { const next = physics.step(dt); state.projectile = physics.projectile; if (next) { state.projectile = null; handleLanding(next); } }
  updateTurn(); renderer.render(state); requestAnimationFrame(frame);
};

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action; if (!action) return;
  if (action === 'home') showScreen('home'); if (action === 'modes') showScreen('modes'); if (action === 'play' || action === 'duel') startBattle(); if (action === 'room') showScreen('room'); if (action === 'create-room') makeRoom(); if (action === 'join-room') joinRoom(); if (action === 'copy-code') copyRoomCode(); if (action === 'start-battle') startBattle(); if (action === 'settings') showScreen('settings'); if (['apple', 'skeet'].includes(action)) { showScreen('modes'); setToast(`${action.toUpperCase()} is coming to the next arena drop.`); }
});
document.querySelector('#room-input').addEventListener('input', (event) => { event.target.value = event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase(); });
canvas.addEventListener('pointerdown', aimStart); canvas.addEventListener('pointermove', aimMove); canvas.addEventListener('pointerup', aimEnd); canvas.addEventListener('pointercancel', aimEnd);
window.addEventListener('resize', () => renderer.resize());
document.querySelector('#reduce-motion').addEventListener('change', (event) => document.body.classList.toggle('reduce-motion', event.target.checked));
document.querySelector('#shake-range').addEventListener('input', (event) => document.documentElement.style.setProperty('--shake', `${event.target.value / 100}`));
showScreen('home');

