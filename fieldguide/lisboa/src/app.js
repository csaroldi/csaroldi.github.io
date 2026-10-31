
/* ============================================================
   CONFIG
   ============================================================ */
const CONFIG = {
  destination: 'Lisboa',
  tripStart: '2026-11-14',
  tripEnd:   '2026-12-13',
  ttsLang:   'pt-PT',
  timeZone:  'Europe/Lisbon',
  coords:    { lat: 38.7223, lng: -9.1393 },
  claudio:   ['2026-11-15','2026-11-25'],
  adonis:    ['2026-12-01','2026-12-13'],
  storageKey:'lisboa-guia-pais-v2'
};
const PERIODS = [['M','Manhã'],['T','Tarde'],['N','Noite']];
const WD = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const WDS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MO = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const EFF = ['', 'Leve', 'Moderado', 'Puxado'];

/* dias da viagem */
const DAYS = [];
(function(){
  const [y,m,d] = CONFIG.tripStart.split('-').map(Number);
  const end = CONFIG.tripEnd;
  for (let i = 0; ; i++) {
    const dt = new Date(Date.UTC(y, m-1, d+i));
    const key = dt.toISOString().slice(0,10);
    DAYS.push({key, n:i+1, wd:WD[dt.getUTCDay()], wds:WDS[dt.getUTCDay()], d:dt.getUTCDate(), m:MO[dt.getUTCMonth()], mi:dt.getUTCMonth(),
      withC: key >= CONFIG.claudio[0] && key <= CONFIG.claudio[1],
      withA: !!CONFIG.adonis && key >= CONFIG.adonis[0] && key <= CONFIG.adonis[1]});
    if (key === end) break;
  }
})();

/* ============================================================
   ESTADO (localStorage)
   ============================================================ */
let ST = {seen:{}, notes:{}, theme:'light', fold:{}};
try { const o = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null'); if (o) ST = Object.assign(ST, o); } catch(e) {}
let saveWarned = false;
function save(){
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(ST)); saveWarned = false; }
  catch(e) { if (!saveWarned) { saveWarned = true; setTimeout(() => toast('Atenção: não deu para salvar neste celular. Abram o guia pelo ícone da tela de início e tentem de novo.', null, 7000), 50); } }
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = s => document.querySelector(s);

/* instâncias do plano (cada lugar em cada dia/período) */
const INST = [];
DAYS.forEach(D => {
  const p = PLAN[D.key] || {};
  const rep = {};
  PERIODS.forEach(([k]) => (p[k] || []).forEach(id => {
    const info = INFO[id]; if (!info) return;
    rep[id] = (rep[id] || 0) + 1;
    INST.push({uid: D.key + '~' + id + (rep[id] > 1 ? '~' + rep[id] : ''), id, day: D.key, p: k, info});
  }));
});
const COUNTABLE = INST.filter(x => x.info.k !== 'livre');
const INST_BY = Object.fromEntries(INST.map(x => [x.uid, x]));
/* um visto guarda a hora e o dia em que foi visto (pode ser outro dia do plano) */
function seenRec(uid){ const v = ST.seen[uid]; if (!v) return null; if (typeof v === 'number') return {t: v, d: (INST_BY[uid] || {}).day}; return v; }
const isSeen = x => !!ST.seen[x.uid];
const seenTs = x => (seenRec(x.uid) || {}).t;
const seenDay = x => (seenRec(x.uid) || {}).d || x.day;
function seenOn(key){ return INST.filter(x => isSeen(x) && seenDay(x) === key).sort((a, b) => seenTs(a) - seenTs(b)); }

/* ============================================================
   TEMA
   ============================================================ */
function applyTheme(){ document.body.classList.toggle('light', ST.theme === 'light'); $('#btnTheme').textContent = ST.theme === 'light' ? '☾' : '☀'; }
function toggleTheme(){ ST.theme = ST.theme === 'light' ? 'dark' : 'light'; save(); applyTheme(); }
function toggleCard(id){ document.getElementById(id).classList.toggle('open'); }

/* ============================================================
   DIAS
   ============================================================ */
function dayTitle(D){ return D.wd.charAt(0).toUpperCase() + D.wd.slice(1) + ', ' + D.d + ' de ' + D.m; }
function mapsUrl(q){ return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
function stopHTML(x){
  const i = x.info, rec = seenRec(x.uid), seen = !!rec;
  const cls = ['stop', i.k === 'comer' ? 'food' : '', i.k === 'livre' ? 'livre' : '', seen ? 'checked' : '', i.warn ? 'has-warn' : ''].join(' ');
  const badge = i.b === 'must' ? '<span class="badge badge-must">Imperdível</span>' : i.b === 'hidden' ? '<span class="badge badge-hidden">Joia escondida</span>' : '';
  const eff = i.e ? `<span class="stop-eff e${i.e}">${EFF[i.e]}</span>` : '';
  const other = rec && rec.d && rec.d !== x.day ? dayShort(rec.d) + ', ' : '';
  const time = seen ? `<button type="button" class="stop-time" onclick="editSeen(event,'${x.uid}')" aria-label="Mudar o dia ou a hora">✓ visto ${other}${fmtClock(rec.t)} <span class="pen">✎</span></button>` : '';
  let det = `<div class="detail-rule"></div><div class="detail-desc">${esc(i.d)}</div>`;
  if (i.warn) det += `<div class="detail-warn"><span class="detail-label">Atenção</span>${esc(i.warn)}</div>`;
  if (i.how) det += `<div class="detail-how"><b>Como chegar:</b> ${esc(i.how)}</div>`;
  if (i.hist) det += `<div class="detail-hist"><span class="detail-label">História</span>${esc(i.hist)}</div>`;
  if (i.fact) det += `<div class="detail-fact"><span class="detail-label">Você sabia</span>${esc(i.fact)}</div>`;
  if (i.q) det += `<a href="${mapsUrl(i.q)}" target="_blank" rel="noopener" class="map-btn">📍 Me leve lá</a>`;
  const check = i.k === 'livre' ? '<span class="check-hit" aria-hidden="true"><span class="stop-check" style="visibility:hidden"></span></span>' : `<button type="button" class="check-hit" role="checkbox" aria-checked="${seen}" aria-label="Marcar ${esc(i.n)} como visto" onclick="checkStop(event,'${x.uid}')"><span class="stop-check"></span></button>`;
  return `<div class="${cls}" id="st_${x.uid}">
    <div class="stop-header" onclick="toggleStop('st_${x.uid}')">
      ${check}<div class="stop-main"><div class="stop-name">${esc(i.n)}</div>${(badge || eff || time) ? `<div class="stop-meta">${badge}${eff}${time}</div>` : ''}</div><span class="stop-expand">▾</span>
    </div>
    <div class="stop-details">${det}</div>
  </div>`;
}
function dayHTML(D){
  const info = DAYINFO[D.key] || {}, fx = info.fx || {};
  const items = INST.filter(x => x.day === D.key);
  const cnt = items.filter(x => x.info.k !== 'livre');
  const done = cnt.filter(isSeen).length;
  const tags = [];
  if (D.withC) tags.push('<span class="dtag">Com o Claudio</span>');
  if (D.withA) tags.push('<span class="dtag terra">Com Adonis e Dayse</span>');
  if (D.key === '2026-12-01' || D.key === '2026-12-08') tags.push('<span class="dtag blue">Feriado</span>');
  let body = info.i ? `<p class="day-intro">${esc(info.i)}</p>` : '';
  (fx.X || []).forEach(t => body += `<div class="fixed">📌 <span>${esc(t)}</span></div>`);
  PERIODS.forEach(([k, lab]) => {
    const list = items.filter(x => x.p === k);
    const f = fx[k] || [];
    if (!list.length && !f.length) return;
    body += `<div class="period">${lab}</div>`;
    f.forEach(t => body += `<div class="fixed">📌 <span>${esc(t)}</span></div>`);
    body += list.map(stopHTML).join('');
  });
  if (!items.length && !(fx.M || fx.T || fx.N || fx.X)) body += '<div class="fixed">🛋️ <span>Dia em aberto. Descansem ou decidam na hora.</span></div>';
  if (!items.length && (fx.M || fx.T || fx.N) && D.key !== '2026-12-13') body += '<div class="fixed">🛋️ <span>O resto do dia está em aberto.</span></div>';
  return `<div class="day ${D.withC ? 'withc' : ''} ${D.withA ? 'witha' : ''}" id="day_${D.key}" data-day="${D.n}">
    <button class="day-trigger" onclick="toggleCard('day_${D.key}')">
      <span class="day-num">${String(D.n).padStart(2,'0')}</span>
      <div class="day-info">
        <div class="day-name">${esc(info.t || 'Dia ' + D.n)}</div>
        <div class="day-tagline">${esc(info.s || '')}</div>
        <div class="day-date">${dayTitle(D)}</div>
        ${tags.length ? `<div class="day-tags">${tags.join('')}</div>` : ''}
      </div>
      ${cnt.length ? `<span class="day-count" id="dc_${D.key}">${done}/${cnt.length}</span>` : ''}
      <div class="day-arrow">▼</div>
    </button>
    <div class="day-body"><div class="day-divider"></div>${body}</div>
  </div>`;
}
/* dias agrupados por semana */
const WEEKS = [];
for (let i = 0; i < DAYS.length; i += 7) WEEKS.push(DAYS.slice(i, i + 7));
function weekLabel(w, n){ const a = w[0], b = w[w.length - 1]; return 'Semana ' + n + ' · ' + a.d + (a.mi !== b.mi ? ' ' + a.m.slice(0,3) : '') + ' a ' + b.d + ' ' + b.m.slice(0,3); }
function currentWeekIndex(){ const t = todayKey(); const i = WEEKS.findIndex(w => w.some(D => D.key === t)); return i >= 0 ? i : (t > CONFIG.tripEnd ? WEEKS.length - 1 : 0); }
function renderDays(){
  const cw = currentWeekIndex();
  $('#days').innerHTML = WEEKS.map((w, i) => {
    const cnt = INST.filter(x => w.some(D => D.key === x.day) && x.info.k !== 'livre'), done = cnt.filter(isSeen).length;
    return `<div class="week ${i === cw ? 'open' : ''}" id="wk_${i}">
      <button type="button" class="week-head" onclick="this.parentNode.classList.toggle('open')"><span>${weekLabel(w, i + 1)}</span><span class="week-count">${done}/${cnt.length}</span><span class="week-arrow">▾</span></button>
      <div class="week-body">${w.map(dayHTML).join('')}</div>
    </div>`;
  }).join('');
  renderStrip();
  $('#saved').innerHTML = '';
}
function renderStrip(){
  const today = todayKey();
  $('#strip').innerHTML = DAYS.map(D => {
    const cnt = INST.filter(x => x.day === D.key && x.info.k !== 'livre');
    const all = cnt.length && cnt.every(isSeen);
    return `<a href="#day_${D.key}" onclick="openDay('${D.key}')" class="${D.withC ? 'withc' : ''} ${D.withA ? 'witha' : ''} ${D.key === today ? 'today' : ''} ${all ? 'done' : ''}">${D.wds}<b>${D.d}</b></a>`;
  }).join('');
}
/* seções dobráveis */
const FOLDS = ['essencial','dias','diario','bomsaber','falar'];
function applyFolds(){
  FOLDS.forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    const folded = id in ST.fold ? ST.fold[id] : id !== 'dias';
    el.classList.toggle('folded', folded);
    const h = el.querySelector('.section-header'); if (h) h.setAttribute('aria-expanded', String(!folded));
  });
}
function unfold(id){ const el = document.getElementById(id); if (el && el.classList.contains('folded')) { ST.fold[id] = false; save(); applyFolds(); } }
function initFolds(){
  FOLDS.forEach(id => {
    const el = document.getElementById(id); if (!el) return;
    const h = el.querySelector('.section-header');
    h.setAttribute('role', 'button'); h.tabIndex = 0;
    h.insertAdjacentHTML('beforeend', '<span class="fold-arrow" aria-hidden="true">▾</span>');
    const t = () => { ST.fold[id] = !el.classList.contains('folded'); save(); applyFolds(); };
    h.addEventListener('click', t);
    h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
  });
  applyFolds();
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1)); if (!target) return;
    const sec = target.closest('.section-wrap'); if (sec) unfold(sec.id);
  }, true);
}
function openDay(key){ const el = document.getElementById('day_' + key); if (!el) return; el.classList.add('open'); const w = el.closest('.week'); if (w) w.classList.add('open'); unfold('dias'); }
function dayShort(key){ const D = DAYS.find(x => x.key === key); return D ? D.wds.toLowerCase() + ' ' + D.d : key; }
function toggleStop(id){ document.getElementById(id).classList.toggle('open'); }

/* ============================================================
   VISTO
   ============================================================ */
function refreshStop(uid){
  const x = INST_BY[uid]; if (!x) return;
  const el = document.getElementById('st_' + uid);
  if (el) { const open = el.classList.contains('open'); el.outerHTML = stopHTML(x); if (open) document.getElementById('st_' + uid).classList.add('open'); }
  const cnt = INST.filter(i => i.day === x.day && i.info.k !== 'livre');
  const dc = document.getElementById('dc_' + x.day); if (dc) dc.textContent = cnt.filter(isSeen).length + '/' + cnt.length;
}
function afterSeenChange(uid, before, daysTouched){
  refreshStop(uid);
  [...new Set(daysTouched.filter(Boolean))].forEach(renderJournalDay);
  renderProgress(before);
  updateTodayCard();
  renderStrip();
}
function setSeen(uid, rec, before){
  const old = seenRec(uid), x = INST_BY[uid];
  if (rec) ST.seen[uid] = rec; else delete ST.seen[uid];
  save();
  afterSeenChange(uid, before, [x && x.day, old && old.d, rec && rec.d]);
}
function checkStop(ev, uid){
  ev.stopPropagation();
  const x = INST_BY[uid]; if (!x) return;
  const before = progressPct(), old = seenRec(uid);
  if (old) {
    setSeen(uid, null, before);
    toast(x.info.n + ' desmarcado', () => setSeen(uid, old, progressPct()));
  } else {
    const rec = {t: Date.now(), d: todayInTrip() || x.day};
    setSeen(uid, rec, before);
    toast('✓ ' + x.info.n + ' visto às ' + fmtClock(rec.t), () => setSeen(uid, null, progressPct()));
  }
}
function todayInTrip(){ const t = todayKey(); return t >= CONFIG.tripStart && t <= CONFIG.tripEnd ? t : null; }
/* editar o dia e a hora de um visto */
let editingUid = null;
function editSeen(ev, uid){
  ev.stopPropagation();
  const x = INST_BY[uid], rec = seenRec(uid); if (!x || !rec) return;
  editingUid = uid;
  $('#seenEditName').textContent = x.info.n;
  $('#seenEditDay').innerHTML = DAYS.map(D => `<option value="${D.key}"${D.key === rec.d ? ' selected' : ''}>${D.wds} ${D.d} de ${D.m}${D.key === x.day ? ' (no plano)' : ''}</option>`).join('');
  $('#seenEditTime').value = fmtClock(rec.t);
  $('#seenEditor').showModal();
}
function lisbonTs(key, hhmm){
  const [y, m, d] = key.split('-').map(Number), [hh, mm] = (hhmm || '12:00').split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone: CONFIG.timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(new Date(guess)).map(o => [o.type, o.value]));
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return guess - (wall - guess);
}
function saveSeenEdit(){
  const uid = editingUid; if (!uid) return;
  const old = seenRec(uid), rec = {t: lisbonTs($('#seenEditDay').value, $('#seenEditTime').value), d: $('#seenEditDay').value};
  $('#seenEditor').close(); editingUid = null;
  setSeen(uid, rec, progressPct());
  toast('Visto atualizado para ' + dayShort(rec.d) + ', ' + fmtClock(rec.t), () => setSeen(uid, old, progressPct()));
}
function unseeFromEditor(){
  const uid = editingUid; if (!uid) return;
  const old = seenRec(uid), x = INST_BY[uid];
  $('#seenEditor').close(); editingUid = null;
  setSeen(uid, null, progressPct());
  toast(x.info.n + ' desmarcado', () => setSeen(uid, old, progressPct()));
}
function fmtClock(ts){ return new Date(ts).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit', timeZone:CONFIG.timeZone}); }

/* ============================================================
   BARRA DIVERTIDA
   ============================================================ */
const LEVELS = [
  [0,  'Ainda com cheiro de avião', 'Marquem "visto" em cada lugar, e o elétrico anda.'],
  [1,  'Turista de primeira viagem', 'Começou! Já dá para pedir uma bica sem gaguejar.'],
  [15, 'Já sabe o que é um galão', 'E já descobriu que couvert não é de graça.'],
  [30, 'Freguês da pastelaria', 'O moço do balcão já sabe o pedido.'],
  [50, 'Meio lisboeta', 'Metade da viagem vista. Chegou a hora de um jantar especial.'],
  [70, 'Conhece o Rossio de olhos fechados', 'Já sabe que a ladeira se vence de Bolt.'],
  [90, 'Quase lisboeta', 'Falta pouco. Guardem energia para o final.'],
  [100,'Lisboeta honorário', 'Lisboa conquistada! Agora é contar tudo no Rio.']
];
const MILES = [[25,'🥐','25%! Já merecem um pastel de nata.'],[50,'🏰','Metade da viagem! O castelo é de vocês.'],[75,'🎶','75%! Isso pede um fado.'],[100,'🏆','100%! Lisboa conquistada!']];
function progressPct(){ const t = COUNTABLE.length; return t ? COUNTABLE.filter(isSeen).length / t * 100 : 0; }
function renderProgress(before){
  const t = COUNTABLE.length, d = COUNTABLE.filter(isSeen).length, pct = t ? d / t * 100 : 0;
  $('#funFill').style.width = pct + '%';
  const tram = $('#funTram'); tram.style.left = pct + '%';
  $('#funCount').textContent = d + ' de ' + t + ' lugares';
  let lv = LEVELS[0];
  LEVELS.forEach(L => { if ((L[0] === 0 && d === 0) || (L[0] > 0 && (L[0] === 1 ? d >= 1 : pct >= L[0]))) lv = L; });
  $('#funLevel').textContent = lv[1];
  $('#funSub').textContent = lv[2];
  const dp = document.getElementById('dashPrint'); if (dp) dp.hidden = d === 0;
  document.querySelectorAll('.fun-mile').forEach((m, i) => m.classList.toggle('on', pct >= MILES[i][0]));
  if (typeof before === 'number' && pct > before) {
    tram.classList.remove('bump'); void tram.offsetWidth; tram.classList.add('bump');
    const crossed = MILES.filter(M => before < M[0] && pct >= M[0]).pop();
    if (crossed) { confetti(crossed[1]); setTimeout(() => toast(crossed[2]), 300); }
  }
}
function confetti(emoji){
  const box = $('#confetti'); const set = [emoji, '🎉', '✨', '🥐', '🇵🇹', '🇧🇷'];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.textContent = set[i % set.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = (Math.random() * 0.6) + 's';
    s.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    box.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }
}
let toastT;
let toastUndo = null;
function toast(msg, undo, ms){
  const t = $('#toast'); toastUndo = undo || null;
  t.innerHTML = '<span>' + esc(msg) + '</span>' + (undo ? '<button type="button" class="undo">Desfazer</button>' : '');
  t.classList.toggle('canundo', !!undo); t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => { t.classList.remove('show'); toastUndo = null; }, ms || (undo ? 7000 : 2800));
}
document.addEventListener('click', e => {
  if (!e.target.closest || !e.target.closest('#toast .undo') || !toastUndo) return;
  const f = toastUndo; toastUndo = null; $('#toast').classList.remove('show'); f();
});

/* ============================================================
   HOJE E CONTAGEM (no horário de Lisboa)
   ============================================================ */
function todayKey(){ return new Intl.DateTimeFormat('en-CA', {timeZone: CONFIG.timeZone, year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date()); }
function daysBetween(a, b){ return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000); }
function updateCountdown(){
  const t = todayKey(), d = daysBetween(t, CONFIG.tripStart);
  if (d > 0) { $('#countValue').textContent = d === 1 ? '1 dia' : d + ' dias'; $('#countSub').textContent = 'Até o pouso em Lisboa.'; }
  else if (t <= CONFIG.tripEnd) { const n = daysBetween(CONFIG.tripStart, t) + 1; $('#countValue').textContent = 'Dia ' + n; $('#countSub').textContent = 'de ' + DAYS.length + '. Aproveitem.'; }
  else { $('#countValue').textContent = 'Fim'; $('#countSub').textContent = 'Até a próxima, Lisboa.'; }
}
function updateTodayCard(){
  const t = todayKey();
  let D = DAYS.find(x => x.key === t), label = 'Hoje';
  if (!D) { D = t < CONFIG.tripStart ? DAYS[0] : DAYS[DAYS.length - 1]; label = t < CONFIG.tripStart ? 'Primeiro dia' : 'Último dia'; }
  const info = DAYINFO[D.key] || {};
  $('#todayLabel').textContent = label + ' · ' + D.wds + ' ' + D.d;
  $('#todayName').textContent = 'Dia ' + D.n + ' · ' + (info.t || '');
  $('#todayNote').textContent = info.s || '';
  const fx = info.fx || {}, lines = [];
  PERIODS.forEach(([k, lab]) => {
    const names = (fx[k] || []).concat(INST.filter(x => x.day === D.key && x.p === k).map(x => (isSeen(x) ? '✓ ' : '') + x.info.n));
    if (names.length) lines.push(`<li><b>${lab}</b>${esc(names.join(' · '))}</li>`);
  });
  (fx.X || []).forEach(x => lines.push(`<li><b>📌</b>${esc(x)}</li>`));
  $('#todayList').innerHTML = lines.join('') || '<li>Dia em aberto.</li>';
  $('#todayCta').setAttribute('href', '#day_' + D.key);
  $('#todayCta').onclick = () => openDay(D.key);
  if (D.key === t) openDay(D.key);
}

/* ============================================================
   LUZ DO DIA (horário de Lisboa em qualquer aparelho)
   ============================================================ */
function solarUT(lat, lng, y, m, d, rise){
  const rad = Math.PI/180, deg = 180/Math.PI;
  const N = Math.floor((Date.UTC(y, m, d) - Date.UTC(y, 0, 0)) / 86400000);
  const lngHour = lng / 15, t = N + ((rise ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = (M + 1.916 * Math.sin(M*rad) + 0.020 * Math.sin(2*M*rad) + 282.634 + 360) % 360;
  let RA = (Math.atan(0.91764 * Math.tan(L*rad)) * deg + 360) % 360;
  RA = (RA + Math.floor(L/90)*90 - Math.floor(RA/90)*90) / 15;
  const sinDec = 0.39782 * Math.sin(L*rad), cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(90.833*rad) - sinDec * Math.sin(lat*rad)) / (cosDec * Math.cos(lat*rad));
  if (cosH > 1 || cosH < -1) return null;
  const H = (rise ? 360 - Math.acos(cosH)*deg : Math.acos(cosH)*deg) / 15;
  const UT = (H + RA - 0.06571 * t - 6.622 - lngHour + 48) % 24;
  return new Date(Date.UTC(y, m, d) + UT * 3600000);
}
function fmtLis(dt){ return dt ? dt.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit', timeZone:CONFIG.timeZone}) : '--:--'; }
function updateLightCard(){
  const [y, m, d] = todayKey().split('-').map(Number);
  const rise = solarUT(CONFIG.coords.lat, CONFIG.coords.lng, y, m-1, d, true);
  const set = solarUT(CONFIG.coords.lat, CONFIG.coords.lng, y, m-1, d, false);
  $('#sunriseVal').textContent = fmtLis(rise); $('#sunsetVal').textContent = fmtLis(set);
  const g = $('#goldenVal');
  if (!rise || !set) { g.textContent = 'Hora dourada'; return; }
  const now = Date.now(), H = 3600000;
  if ((now >= rise && now <= rise.getTime() + H) || (now >= set.getTime() - H && now <= set)) { g.textContent = 'Hora dourada agora'; return; }
  const next = now < rise ? rise.getTime() : now < set.getTime() - H ? set.getTime() - H : null;
  if (!next) { g.textContent = 'Hora dourada amanhã'; return; }
  const mins = Math.round((next - now) / 60000), h = Math.floor(mins / 60), mm = mins % 60;
  g.textContent = 'Próxima hora dourada em ' + (h ? h + 'h ' : '') + mm + 'min';
}

/* ============================================================
   DIÁRIO (notas por período e fotos)
   ============================================================ */
function journalDayHTML(D){
  const info = DAYINFO[D.key] || {};
  const seen = seenOn(D.key);
  const n = ST.notes[D.key] || {};
  return `<div class="day-body" style="display:block">
      ${seen.length ? '<ul class="jseen">' + seen.map(x => `<li><span>${fmtClock(seenTs(x))}</span>${esc(x.info.n)}</li>`).join('') + '</ul>' : '<div class="jempty">Nada marcado como visto ainda.</div>'}
      ${PERIODS.map(([k, lab]) => `<label class="jnote-label" for="nt_${D.key}_${k}">${lab}</label><textarea class="notes-area jnote" id="nt_${D.key}_${k}" data-d="${D.key}" data-p="${k}" placeholder="Como foi a ${lab.toLowerCase()}?">${esc(n[k] || '')}</textarea>`).join('')}
      <div class="photos">${[0,1].map(i => `<label class="photo" id="ph_${D.key}_${i}"><input type="file" accept="image/*" data-d="${D.key}" data-i="${i}"><span>📷 Foto ${i+1}</span></label>`).join('')}</div>
    </div>`;
}
let journalAll = false;
function journalDays(){ const t = todayKey(); return journalAll ? DAYS : DAYS.filter(D => D.key <= t || seenOn(D.key).length || Object.values(ST.notes[D.key] || {}).some(v => (v || '').trim())); }
function renderJournal(){
  const list = journalDays(), hidden = DAYS.length - list.length;
  const intro = !list.length ? '<p class="jwait">O diário começa no dia 14 de novembro. Cada dia aparece aqui quando chegar, e o que vocês marcarem como visto entra sozinho.</p>' : '';
  const more = hidden ? `<button type="button" class="jmore" onclick="journalAll=true;renderJournal()">Mostrar os ${hidden} dias que ainda não chegaram</button>` : (journalAll ? '<button type="button" class="jmore" onclick="journalAll=false;renderJournal()">Mostrar só até hoje</button>' : '');
  $('#journal').innerHTML = intro + list.map(D => {
    const info = DAYINFO[D.key] || {};
    return `<div class="day jday" id="jd_${D.key}">
      <button class="day-trigger" onclick="toggleCard('jd_${D.key}')">
        <span class="day-num">${String(D.n).padStart(2,'0')}</span>
        <div class="day-info"><div class="day-name">${esc(info.t || '')}</div><div class="day-date">${dayTitle(D)}</div></div>
        <span class="day-count" id="jc_${D.key}"></span>
        <div class="day-arrow">▼</div>
      </button>
      <div class="jbox" id="jb_${D.key}"></div>
    </div>`;
  }).join('') + more;
  list.forEach(D => renderJournalDay(D.key));
}
function renderJournalDay(key){
  const D = DAYS.find(x => x.key === key), box = document.getElementById('jb_' + key);
  if (D && !box && journalDays().includes(D)) { renderJournal(); return; }
  if (!D || !box) return;
  box.innerHTML = journalDayHTML(D);
  box.firstElementChild.classList.add('jinner');
  box.firstElementChild.style.display = '';
  box.firstElementChild.className = 'day-body';
  const seen = seenOn(key).length;
  const n = ST.notes[key] || {}, notes = PERIODS.filter(([k]) => (n[k] || '').trim()).length;
  document.getElementById('jc_' + key).textContent = (seen || notes) ? (seen ? seen + (seen === 1 ? ' visto' : ' vistos') : '') + (seen && notes ? ' · ' : '') + (notes ? notes + (notes === 1 ? ' nota' : ' notas') : '') : '';
  [0,1].forEach(i => showPhoto(key, i));
}
document.addEventListener('input', e => {
  const t = e.target; if (!t.classList || !t.classList.contains('jnote')) return;
  ST.notes[t.dataset.d] = ST.notes[t.dataset.d] || {};
  ST.notes[t.dataset.d][t.dataset.p] = t.value; save();
});
document.addEventListener('change', e => {
  const t = e.target; if (!(t.type === 'file' && t.dataset.d)) return;
  const f = t.files && t.files[0]; if (!f) return;
  shrink(f).then(blob => idbPut(t.dataset.d + '_' + t.dataset.i, blob)).then(() => { showPhoto(t.dataset.d, +t.dataset.i); toast('Foto guardada'); })
    .catch(() => toast('Não deu para guardar a foto. Tentem uma menor.'));
});
document.addEventListener('click', e => {
  const rm = e.target.closest && e.target.closest('.photo .rm'); if (!rm) return;
  e.preventDefault(); e.stopPropagation();
  const [d, i] = rm.dataset.k.split('|');
  idbDel(d + '_' + i).then(() => showPhoto(d, +i));
});
function shrink(file){
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1100, s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(), 'image/jpeg', 0.72);
    };
    img.onerror = rej; img.src = url;
  });
}
function showPhoto(d, i){
  const el = document.getElementById('ph_' + d + '_' + i); if (!el) return;
  idbGet(d + '_' + i).then(b => {
    el.querySelectorAll('img,.rm').forEach(x => x.remove());
    if (b) {
      const img = new Image(); img.src = URL.createObjectURL(b); img.alt = 'Foto ' + (i+1);
      const rm = document.createElement('button'); rm.className = 'rm'; rm.textContent = '×'; rm.dataset.k = d + '|' + i; rm.setAttribute('aria-label', 'Apagar foto');
      el.appendChild(img); el.appendChild(rm);
    }
  }).catch(() => {});
}
/* IndexedDB para as fotos */
let dbp;
function db(){ if (!dbp) dbp = new Promise((res, rej) => { const r = indexedDB.open('lisboa26-fotos', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); return dbp; }
function idbOp(mode, fn){ return db().then(d => new Promise((res, rej) => { const tx = d.transaction('f', mode), st = tx.objectStore('f'), r = fn(st); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error); })); }
const idbPut = (k, v) => idbOp('readwrite', s => s.put(v, k));
const idbGet = k => idbOp('readonly', s => s.get(k));
const idbDel = k => idbOp('readwrite', s => s.delete(k));

/* ============================================================
   GUARDAR E RECUPERAR UMA CÓPIA DO DIÁRIO
   ============================================================ */
const blobToData = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
async function saveCopy(){
  try {
    toast('Preparando a cópia…');
    const photos = {};
    for (const D of DAYS) for (const i of [0,1]) { try { const b = await idbGet(D.key + '_' + i); if (b) photos[D.key + '_' + i] = await blobToData(b); } catch(e) {} }
    const data = {app:'lisboa26', v:2, criado: new Date().toISOString(), seen: ST.seen, notes: ST.notes, photos};
    const d = new Date(), name = 'diario-lisboa-' + String(d.getDate()).padStart(2,'0') + '-' + String(d.getMonth()+1).padStart(2,'0') + '.json';
    const file = new File([JSON.stringify(data)], name, {type:'application/json'});
    if (navigator.canShare && navigator.canShare({files:[file]})) {
      try { await navigator.share({files:[file], title:'Cópia do diário de Lisboa'}); toast('Cópia pronta. Guardem no iCloud ou mandem para o Claudio.'); return; }
      catch(e) { if (e && e.name === 'AbortError') { toast('Cópia cancelada.'); return; } }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Cópia baixada: ' + name);
  } catch(e) { toast('Não deu para fazer a cópia agora. Tentem de novo.'); }
}
let pendingCopy = null;
document.addEventListener('change', async e => {
  if (e.target.id !== 'copyFile') return;
  const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    if (!data || data.app !== 'lisboa26' || !data.seen) throw Error('formato');
    pendingCopy = data;
    const n = Object.keys(data.seen).length, when = data.criado ? new Date(data.criado).toLocaleDateString('pt-BR') : '';
    $('#copyAskText').textContent = 'Cópia' + (when ? ' de ' + when : '') + ', com ' + n + (n === 1 ? ' lugar visto' : ' lugares vistos') + ' e ' + Object.keys(data.photos || {}).length + ' fotos. Ela substitui o diário que está neste celular agora.';
    $('#copyAsk').showModal();
  } catch(err) { toast('Esse arquivo não é uma cópia do diário de Lisboa.'); }
});
async function restoreCopy(){
  const data = pendingCopy; pendingCopy = null; $('#copyAsk').close(); if (!data) return;
  ST.seen = data.seen || {}; ST.notes = data.notes || {}; save();
  for (const D of DAYS) for (const i of [0,1]) { try { await idbDel(D.key + '_' + i); } catch(e) {} }
  for (const [k, url] of Object.entries(data.photos || {})) { try { await idbPut(k, await (await fetch(url)).blob()); } catch(e) {} }
  renderDays(); renderJournal(); renderProgress(); updateTodayCard();
  toast('Diário recuperado.');
}

/* ============================================================
   PORTUGUÊS DE LÁ X DE CÁ
   ============================================================ */
const PHRASES = [
  ['No dia a dia', [
    ['Bom dia!','bom DI-a','Para entrar em loja, café e táxi. Funciona até umas 13h.'],
    ['Obrigado / Obrigada','o-bri-GA-du','Homem diz obrigado, mulher diz obrigada. Usem sempre.'],
    ['Se faz favor','se fash fa-VOR','O "por favor" deles. Também serve para chamar o garçom.'],
    ['Com licença','com li-SEN-sa','Para passar no meio do povo.'],
    ['Saúde!','sa-U-de','Antes de brindar.']
  ]],
  ['Na mesa', [
    ['A conta, se faz favor','a CON-ta','Pedir a conta.'],
    ['Uma bica','U-ma BI-ca','Cafezinho espresso. Aqui é "bica", não "cafezinho".'],
    ['Um galão','um ga-LÃO','Café com leite servido no copo alto. O nosso pingado.'],
    ['Água sem gás ou com gás?','sem GASH','Sempre perguntam. "Natural" quer dizer fora da geladeira.'],
    ['Quanto custa?','QUAN-tu CUSH-ta','Na feira e na lojinha.'],
    ['Sou alérgico a marisco','alér-gi-cu a ma-RISH-cu','Para avisar no restaurante. Marisco é o nosso "frutos do mar".'],
    ['Sem marisco, se faz favor','sem ma-RISH-cu','Para pedir o prato sem frutos do mar.']
  ]],
  ['Para se virar', [
    ['Onde fica a casa de banho?','CA-za de BA-nhu','"Casa de banho" é o banheiro. Se pedirem "banheiro", eles entendem, mas riem.'],
    ['Estou perdido','shto per-DI-du','Quando o mapa não ajuda.'],
    ['Ajuda!','a-JU-da','Emergência é 112.']
  ]],
  ['De lá x de cá', [
    ['Autocarro','','É o <b>ônibus</b>.'],
    ['Comboio','','É o <b>trem</b>.'],
    ['Pequeno-almoço','','É o <b>café da manhã</b>.'],
    ['Pastelaria','','É a <b>padaria com doces</b>, onde se toma café.'],
    ['Fixe!','FI-she','É o nosso <b>maneiro</b>.'],
    ['Giro','','É <b>bonito, fofo</b>. "Que giro!"'],
    ['Rapariga','','Aqui é só <b>moça</b>, sem duplo sentido. Não estranhem.'],
    ['Bicha','','É a <b>fila</b>. "Estar na bicha" é estar na fila.'],
    ['Telemóvel','','É o <b>celular</b>.'],
    ['Esplanada','','É a <b>mesinha na calçada</b> do café ou restaurante.'],
    ['Fino ou imperial','','É o <b>chope</b>. Fino no Porto, imperial em Lisboa.'],
    ['Está bem','shtá BEIN','É o <b>tá bom</b>. Vão ouvir umas cem vezes por dia.']
  ]]
];
function renderPhrases(){
  $('#phrases').innerHTML = PHRASES.map(([g, list]) => `<div class="phrase-group fold-group"><button type="button" class="phrase-group-title" onclick="this.parentNode.classList.toggle('open')">${g} <span class="pg-count">${list.length}</span><span class="week-arrow">▾</span></button><div class="pg-body">` + list.map(([o, pr, mean]) => `
    <div class="phrase-row"><div class="phrase-texts">
      <div class="phrase-orig">${esc(o)}</div>
      ${pr ? `<div class="phrase-note">${esc(pr)}</div>` : ''}
      <div class="phrase-br">${mean}</div>
    </div><button class="speak-btn" onclick="speak(this.dataset.t)" data-t="${esc(o)}" aria-label="Ouvir ${esc(o)}"><svg viewBox="0 0 10 10" width="12" height="12" fill="currentColor"><polygon points="2,1 9,5 2,9"/></svg></button></div>`).join('') + '</div></div>').join('');
}
function speak(text){
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${CONFIG.ttsLang}&client=tw-ob`;
  const a = new Audio(url);
  a.play().catch(() => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang = CONFIG.ttsLang; u.rate = 0.9; speechSynthesis.speak(u); } });
}

/* ============================================================
   DOCK
   ============================================================ */
function initDockScroll(){
  const deck = $('#deck'); let ticking = false;
  const update = () => { document.body.classList.toggle('dock-visible', deck.getBoundingClientRect().bottom < 8); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
  window.addEventListener('resize', update); update();
}

/* ============================================================
   INÍCIO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  initFolds();
  renderDays();
  renderJournal();
  renderPhrases();
  renderProgress();
  updateCountdown();
  updateTodayCard();
  updateLightCard();
  initDockScroll();
  setInterval(() => { updateLightCard(); updateCountdown(); }, 60000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
});
window.__guia = {INST, COUNTABLE, ST: () => ST};
