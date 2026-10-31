/* ============================================================
   IMPRIMIR A VIAGEM: um diário em A4, no mesmo estilo de Budapeste.
   Só entra o que foi vivido: lugares vistos, notas e fotos.
   ============================================================ */
const NAMES = 'Alfredo & Ester';
const DATES_TXT = '14 nov a 13 dez 2026';
let printBusy = false, printReturn = null, printCover = null, printCSS = null;
async function loadPrintCSS(){ if (!printCSS) printCSS = await (await fetch('print.css')).text(); return printCSS; }
async function openPrintTrip(){ printReturn = document.activeElement; $('#printTripDialog').showModal(); await renderPrintTrip(); }
function closePrintTrip(){ $('#printTripDialog').close(); if (printReturn) printReturn.focus({preventScroll:true}); }
function visitWhen(D, ts){ return D.wds + ' ' + D.d + ' ' + D.m.slice(0,3) + ' · ' + fmtClock(ts); }
function firstSentence(t){ const m = t.match(/^.*?[.!?](?:\s|$)/); return (m ? m[0] : t).trim(); }
async function getDayPhotos(key){ const out = []; for (const i of [0,1]) { try { const b = await idbGet(key + '_' + i); if (b) out.push(URL.createObjectURL(b)); } catch(e) {} } return out; }

async function renderPrintTrip(){
  if (printBusy) return; printBusy = true;
  const btn = $('#printNow'); btn.disabled = true; $('#printStatus').textContent = 'Montando o diário…';
  try {
    const full = $('#printMode').value === 'full', frame = $('#tripPrintFrame');
    const css = await loadPrintCSS();
    await new Promise(res => { frame.onload = res; frame.srcdoc = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lisboa · ' + esc(NAMES) + ' · Diário da viagem</title><style>' + css + '</style></head><body><main class="page-stack" id="printedPages"></main></body></html>'; });
    const doc = frame.contentDocument; await doc.fonts.ready; const stack = doc.getElementById('printedPages');
    const make = (tag, cls, text) => { const e = doc.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
    let main, flow, chapter = '';
    function newPage(title, cover){ const page = make('section', 'sheet' + (cover ? ' cover' : '')); main = make('div', 'page-main'); flow = make('div', 'page-flow'); main.append(flow); page.append(main); const foot = make('footer', 'page-foot'); foot.append(make('span', '', cover ? NAMES + ' · Nossa Lisboa' : title), make('span', 'folio')); page.append(foot); stack.append(page); if (!cover) { const top = make('div', 'topline'); top.append(make('span', '', title), make('span', 'rose', DATES_TXT)); flow.append(top); } }
    const fits = () => flow.getBoundingClientRect().bottom <= main.getBoundingClientRect().bottom - 1;
    const nextPage = () => newPage(chapter + ' · continuação');
    function splitUnit(node){ const p0 = node.querySelector('p'); if (!p0) throw Error('Um trecho ficou grande demais para a página.'); let rest = p0.textContent, first = true;
      while (rest.length) { const frag = first ? node.cloneNode(true) : make('div', node.className); const para = first ? frag.querySelector('p') : make('p', 'print-prose'); if (!first) frag.append(para); para.textContent = ''; flow.append(frag);
        let lo = 0, hi = rest.length; while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); para.textContent = rest.slice(0, mid); if (fits()) lo = mid; else hi = mid - 1; }
        if (lo < 1) { frag.remove(); throw Error('Não coube. Tentem o diário curto.'); }
        let cut = lo; if (lo < rest.length) { const sp = rest.lastIndexOf(' ', lo); if (sp > lo * .65) cut = sp + 1; }
        para.textContent = rest.slice(0, cut); rest = rest.slice(cut); first = false; if (rest) nextPage(); } }
    function add(node){ flow.append(node); if (fits()) return; node.remove(); if (flow.children.length > 1) nextPage(); flow.append(node); if (fits()) return; node.remove(); splitUnit(node); }
    function heading(kicker, title, sub){ const n = make('div', 'journal-heading'); n.append(make('div', 'eyebrow', kicker), make('h2', 'page-title', title)); if (sub) n.append(make('p', 'lead', sub)); return n; }
    function prose(label, text, cls){ const n = make('div', 'print-unit ' + (cls || '')); if (label) n.append(make('h4', 'note-label', label)); n.append(make('p', 'print-prose', text)); return n; }
    async function photoFigure(url, cap){ const f = make('figure', 'photo actual-photo'), img = make('img'); img.src = url; img.alt = cap || 'Foto da viagem'; f.append(img); if (cap) f.append(make('figcaption', '', cap)); try { await img.decode(); } catch(e) {} return f; }

    /* dados */
    const days = [];
    for (const D of DAYS) {
      const rows = seenOn(D.key);
      const n = ST.notes[D.key] || {}, notes = PERIODS.filter(([k]) => (n[k] || '').trim()).map(([k, lab]) => [lab, n[k].trim()]);
      const photos = await getDayPhotos(D.key);
      if (rows.length || notes.length || photos.length) days.push({D, info: DAYINFO[D.key] || {}, rows, notes, photos});
    }
    const total = days.reduce((s, d) => s + d.rows.length, 0);

    /* capa */
    newPage('Nossa Lisboa', true);
    flow.innerHTML = '<div class="topline"><span>' + esc(NAMES) + '</span><span class="rose">A viagem que vivemos</span></div><div class="eyebrow">Um diário para guardar</div><h1>Lisboa</h1><div class="cover-lines"><div class="main-line">Sem pressa, outra vez.</div><div class="sub-line">Trinta dias, nós dois e um pastel de nata por dia.</div></div>';
    if (printCover) { const fig = await photoFigure(printCover.url, ''); fig.classList.add('hero-art'); flow.append(fig); }
    else { const art = make('figure', 'photo hero-art cover-art'), img = make('img'); img.src = new URL('capa.jpg', location.href).href; img.alt = 'Lisboa ao entardecer'; art.append(img, make('figcaption', '', 'Lisboa ao entardecer')); try { await img.decode(); } catch(e) {} flow.append(art); }
    const bottom = make('div', 'cover-bottom'); bottom.innerHTML = '<div class="names">' + esc(NAMES) + '</div><div class="dates">' + DATES_TXT + '</div>'; flow.append(bottom);

    /* num olhar */
    chapter = 'A viagem num olhar'; newPage(chapter);
    add(heading('Os dias, como foram', 'A viagem que vivemos.', total + (total === 1 ? ' lugar visitado' : ' lugares visitados') + '. Horários no fuso de Lisboa.'));
    if (!days.length) add(prose('Uma história ainda em branco', 'Nada registrado ainda. Marquem lugares como vistos e escrevam no diário: este livrinho se preenche sozinho com a viagem que vocês viverem.'));
    for (const d of days) {
      const row = make('article', 'day-row'); row.innerHTML = '<div class="day-date">' + d.D.d + '<small>' + d.D.wds + ' · ' + d.D.m.slice(0,3) + '</small></div>';
      const body = make('div'); body.append(make('h3', '', d.info.t || 'Dia ' + d.D.n), make('p', '', [d.rows.length ? d.rows.length + (d.rows.length === 1 ? ' lugar' : ' lugares') : '', d.notes.length ? 'notas do diário' : '', d.photos.length ? 'fotos' : ''].filter(Boolean).join(' · ')));
      if (d.rows.length) body.append(make('p', 'glance-places', d.rows.map(r => r.info.n).join(' · ')));
      row.append(body); add(row);
    }

    /* um capítulo por dia */
    for (const d of days) {
      chapter = 'Dia ' + d.D.n + ' · ' + d.D.d + ' de ' + d.D.m;
      /* diário completo: cada dia abre página nova. Diário curto: os dias seguem um atrás do outro. */
      if (full || d === days[0]) newPage(chapter); else { const sp = make('div', 'print-unit day-gap'); flow.append(sp); }
      add(heading('Dia ' + d.D.n, (d.info.t || '') + '.', dayTitle(d.D) + (d.rows.length ? ' · ' + d.rows.length + (d.rows.length === 1 ? ' lugar' : ' lugares') : '')));
      d.notes.forEach(([lab, text], i) => { const u = prose(lab, text, 'personal-note'); if (i === 0 && d.info.s) u.prepend(make('div', 'day-prompt', d.info.s)); add(u); });
      if (d.photos.length === 1) add(await photoFigure(d.photos[0], ''));
      else if (d.photos.length > 1) { const pair = make('div', 'photo-pair'); for (const u of d.photos) pair.append(await photoFigure(u, '')); add(pair); }
      for (const r of d.rows) {
        const i = r.info, entry = make('div', 'print-unit entry-lead'), head = make('div', 'visit-heading');
        head.append(make('div', 'eyebrow', i.k === 'comer' ? 'Comemos aqui' : 'Lugar visitado'), make('h3', '', i.n), make('div', 'time', visitWhen(d.D, seenTs(r))));
        entry.append(head);
        if (!full) { entry.append(make('p', 'print-prose', firstSentence(i.d))); add(entry); continue; }
        entry.append(make('p', 'print-prose', i.d)); add(entry);
        if (i.hist) add(prose('História', i.hist));
        if (i.fact) add(prose('Você sabia', i.fact));
      }
    }

    /* última página */
    if (days.length) {
      chapter = 'Uma última página'; newPage(chapter);
      add(heading(NAMES, 'O que ficou com a gente.', 'Trinta dias, sem pressa, outra vez.'));
      add(prose('Nossa contagem', total + (total === 1 ? ' lugar visitado' : ' lugares visitados') + ' em ' + days.length + (days.length === 1 ? ' dia registrado.' : ' dias registrados.')));
      add(prose('Até a próxima', 'Lisboa, obrigado por mais uma.'));
    }
    const sheets = [...doc.querySelectorAll('.sheet')];
    sheets.forEach((s, i) => s.querySelector('.folio').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(sheets.length).padStart(2, '0'));
    $('#printStatus').textContent = sheets.length + ' páginas A4 · ' + (full ? 'Diário completo' : 'Diário curto') + ' · Pronto para imprimir ou salvar em PDF.';
    btn.disabled = false;
  } catch(e) { $('#printStatus').textContent = 'Não deu para montar a prévia. ' + e.message; }
  finally { printBusy = false; }
}
async function printTripNow(){ if (printBusy || $('#printNow').disabled) return; const f = $('#tripPrintFrame'); await f.contentDocument.fonts.ready; f.contentWindow.focus(); f.contentWindow.print(); }
document.addEventListener('DOMContentLoaded', () => {
  $('#printMode').addEventListener('change', renderPrintTrip);
  $('#printCoverFile').addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    if (printCover) URL.revokeObjectURL(printCover.url);
    printCover = {url: URL.createObjectURL(f)}; $('#printCoverClear').hidden = false; await renderPrintTrip();
  });
  $('#printCoverClear').addEventListener('click', async () => { if (printCover) URL.revokeObjectURL(printCover.url); printCover = null; $('#printCoverClear').hidden = true; await renderPrintTrip(); });
  $('#printTripDialog').addEventListener('cancel', () => { if (printReturn) printReturn.focus({preventScroll:true}); });
});
