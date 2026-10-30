/*
 * reveal-table.hosted.js
 * Host this file on your own server (HTTPS). The tiny favorites "loader" bookmarklet injects it.
 *
 *   ?m=watch  -> watch this HMC window and every popup it opens; ask to reveal cut-off tables
 *   ?m=once   -> check just the current window (and its same-origin frames), ask, reveal / undo
 *   ?m=now    -> no question: reveal immediately; run again to undo (for pasting in the F12 console)
 *
 * Settings (AUTO_REVEAL, MAX_COL_PX, TABLE_SEL, HOTKEY) are at the top of core().
 */
(() => {
  'use strict';

  /* ======================= core: the check + pop-up + reveal =======================
     Kept as one self-contained function so "watch" mode can serialize it into other windows. */
  function core(MANUAL, NOW) {

    'use strict';

    /* ───────────── settings ───────────── */
    const AUTO_REVEAL = false;              // true = don't ask, just reveal when a cut-off table is found
    const MAX_COL_PX  = 700;                // a column may grow this wide, then text wraps. 0 = never wrap
    const TABLE_SEL   = 'table.listtable';  // the data table
    const HOTKEY      = e => e.altKey && e.shiftKey && e.code === 'KeyR';
    /* ──────────────────────────────────── */
    const STYLE_ID = '__reveal_tables_css';
    const UI_ID    = '__reveal_tables_ui';
    const ATTR     = 'data-reveal';
    const CLIPS    = new Set(['hidden', 'scroll', 'auto', 'clip']);
    const CELLS    = `${TABLE_SEL} .gilcEntry, ${TABLE_SEL} .gilcEntry-mandatory`;

    if (!MANUAL) {                                // don't install twice in the same frame
      if (window.__revealTableAuto) return;
      window.__revealTableAuto = true;
    }

    const CSS = `
      ${TABLE_SEL} { table-layout:auto !important; width:max-content !important; max-width:none !important; }
      ${TABLE_SEL} th:not(.checkbox):not(.gilcIcon),
      ${TABLE_SEL} td:not(.checkbox):not(.gilcIcon) {
        width:auto !important; min-width:0 !important; max-width:none !important;
        height:auto !important; overflow:visible !important;
      }
      ${CELLS} {
        width:auto !important; min-width:0 !important;
        max-width:${MAX_COL_PX ? MAX_COL_PX + 'px' : 'none'} !important;
        height:auto !important; max-height:none !important;
        overflow:visible !important; text-overflow:clip !important;
        white-space:${MAX_COL_PX ? 'normal' : 'nowrap'} !important;
        overflow-wrap:break-word !important;
      }
      [${ATTR}~="clip"] { overflow:visible !important; height:auto !important; max-height:none !important; }
      /* wrappers keep their own width/background; they just can't be narrower than the table inside */
      [${ATTR}~="size"] { min-width:max-content !important; max-width:none !important; }
    `;

    /* ───────────── table logic ───────────── */
    const tag = (el, ...tokens) => {
      const cur = new Set((el.getAttribute(ATTR) || '').split(' ').filter(Boolean));
      tokens.forEach(t => cur.add(t));
      el.setAttribute(ATTR, [...cur].join(' '));
    };

    const collectDocs = (root = document, out = []) => {
      out.push(root);
      root.querySelectorAll('iframe, frame').forEach(f => {
        try { if (f.contentDocument) collectDocs(f.contentDocument, out); } catch (_) { /* cross-origin */ }
      });
      return out;
    };

    const isOn = doc => !!doc.getElementById(STYLE_ID);

    /* How many places hide table content? Only counts content that is really clipped,
       not text that merely overflows its box while still being visible. */
    const hides = v => v === 'hidden' || v === 'clip';
    const truncatedCount = doc => {
      const win = doc.defaultView;
      let n = 0;

      // 1) cells whose text is wider/taller than the box AND the box (or a wrapper up to the table) clips it
      doc.querySelectorAll(CELLS).forEach(e => {
        if (!(e.clientWidth > 0)) return;
        if (!(e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1)) return;
        for (let x = e; x; x = x.parentElement) {
          const cs = win.getComputedStyle(x);
          if (hides(cs.overflowX) || hides(cs.overflowY)) { n++; break; }
          if (x.matches(TABLE_SEL)) break;
        }
      });

      // 2) the whole table sticks out of an overflow:hidden wrapper (fixed-size pane)
      doc.querySelectorAll(TABLE_SEL).forEach(tbl => {
        if (!tbl.offsetWidth) return;
        const tr = tbl.getBoundingClientRect();
        for (let a = tbl.parentElement; a && a !== doc.body && a !== doc.documentElement; a = a.parentElement) {
          const cs = win.getComputedStyle(a);
          if (!hides(cs.overflowX) && !hides(cs.overflowY)) continue;
          const ar = a.getBoundingClientRect();
          if ((hides(cs.overflowX) && tr.right > ar.right + 1) || (hides(cs.overflowY) && tr.bottom > ar.bottom + 1)) { n++; break; }
        }
      });
      return n;
    };

    const markAncestors = doc => {
      const win = doc.defaultView;
      doc.querySelectorAll(TABLE_SEL).forEach(tbl => {
        for (let el = tbl.parentElement; el; el = el.parentElement) {
          const cs = win.getComputedStyle(el);
          const t = [];
          if (CLIPS.has(cs.overflowX) || CLIPS.has(cs.overflowY) || cs.maxHeight !== 'none') t.push('clip');
          if (el !== doc.documentElement) t.push('size');
          if (t.length) tag(el, ...t);
        }
        const chip = tbl.closest('table.attributeChip');
        if (chip) chip.querySelectorAll('td.label, td.label > div').forEach(el => tag(el, 'clip', 'size'));
      });
    };

    const turnOn = doc => {
      if (isOn(doc)) return;
      const style = doc.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS;
      (doc.head || doc.documentElement).appendChild(style);
      markAncestors(doc);
      let timer;
      const obs = new doc.defaultView.MutationObserver(() => {   // survive partial re-renders
        clearTimeout(timer);
        timer = setTimeout(() => markAncestors(doc), 50);
      });
      obs.observe(doc.documentElement, { childList: true, subtree: true });
      doc.defaultView.__revealObserver = obs;
    };

    const turnOff = doc => {
      const s = doc.getElementById(STYLE_ID);
      if (s) s.remove();
      doc.querySelectorAll(`[${ATTR}]`).forEach(el => el.removeAttribute(ATTR));
      const w = doc.defaultView;
      if (w && w.__revealObserver) { w.__revealObserver.disconnect(); delete w.__revealObserver; }
    };

    const scan = docs => {
      const withTables = docs.filter(d => d.querySelector(TABLE_SEL));
      const clipped = withTables.reduce((n, d) => n + (isOn(d) ? 0 : truncatedCount(d)), 0);
      return { withTables, clipped };
    };

    /* ───────────── pop-up (shadow DOM so the site's CSS can't touch it) ───────────── */
    const hideUi = doc => { const h = doc.getElementById(UI_ID); if (h) h.remove(); };

    const showUi = (doc, text, buttons, autoHideMs) => {
      hideUi(doc);
      const host = doc.createElement('div');
      host.id = UI_ID;
      host.style.cssText = 'all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483647;';
      const root = host.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          .card{font:13px/1.4 "Segoe UI",Arial,sans-serif;background:#1f2937;color:#fff;border-radius:8px;
                padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:320px}
          .msg{margin-bottom:10px}
          .row{display:flex;gap:8px;justify-content:flex-end}
          button{font:inherit;border:0;border-radius:5px;padding:5px 12px;cursor:pointer;background:#374151;color:#fff}
          button.primary{background:#2563eb}
          button:hover{filter:brightness(1.2)}
        </style>
        <div class="card"><div class="msg"></div><div class="row"></div></div>`;
      root.querySelector('.msg').textContent = text;
      const row = root.querySelector('.row');
      buttons.forEach(([label, fn, cls]) => {
        const b = doc.createElement('button');
        b.textContent = label;
        if (cls) b.className = cls;
        b.addEventListener('click', () => { hideUi(doc); if (fn) fn(); });
        row.appendChild(b);
      });
      (doc.body || doc.documentElement).appendChild(host);
      if (autoHideMs) setTimeout(() => { if (host.isConnected) host.remove(); }, autoHideMs);
    };

    const usable = d => d && d.body && d.body.tagName === 'BODY';   // framesets can't show the pop-up
    const uiDocFor = (docs, preferred) => [preferred, ...docs].find(usable) || document;

    /* ───────────── actions ───────────── */
    const reveal = (docs, ui) => {
      docs.filter(d => d.querySelector(TABLE_SEL)).forEach(turnOn);
      showUi(ui, 'Table revealed.', [['Undo', () => undo(docs, ui)], ['OK', null, 'primary']], 6000);
    };

    const undo = (docs, ui) => {
      docs.forEach(turnOff);
      showUi(ui, 'Original layout restored.', [['OK', null, 'primary']], 3000);
    };

    const ask = (docs, ui) =>
      showUi(
        ui,
        'Part of this table is cut off. Reveal the full table?',
        [['Not now', null], ['Reveal table', () => reveal(docs, ui), 'primary']]
      );

    /* ───────────── entry points ───────────── */
    if (MANUAL) {                                   // bookmarklet: act now, across same-origin frames
      const docs = collectDocs();
      const { withTables, clipped } = scan(docs);
      const ui = uiDocFor(docs, withTables[0]);
      if (NOW && docs.some(isOn))   undo(docs, ui);
      else if (docs.some(isOn))          showUi(ui, 'The table is currently revealed.', [['Undo', () => undo(docs, ui)], ['Close', null, 'primary']]);
      else if (!withTables.length)  showUi(ui, 'No list table found on this page.', [['Close', null, 'primary']], 4000);
      else if (NOW)                 reveal(docs, ui);
      else if (!clipped)            showUi(ui, 'No cut-off content detected.', [['Reveal anyway', () => reveal(docs, ui)], ['Close', null, 'primary']]);
      else                          ask(docs, ui);
      return;
    }

    // userscript: watch this document, ask once when a cut-off table shows up
    let asked = false, poll;
    const check = () => {
      if (asked) return;
      const { clipped } = scan([document]);
      if (!clipped) return;
      asked = true;
      clearInterval(poll);
      if (AUTO_REVEAL) reveal([document], document);
      else ask([document], document);
    };
    setTimeout(check, 500);
    poll = setInterval(check, 2000);                // also catches tables that appear later / in other tabs

    document.addEventListener('keydown', e => {     // manual toggle any time
      if (!HOTKEY(e)) return;
      e.preventDefault();
      if (isOn(document)) undo([document], document);
      else if (document.querySelector(TABLE_SEL)) reveal([document], document);
    }, true);
  }

  /* ======================= entry point ======================= */
  let mode = 'watch';
  try { const m = new URL(document.currentScript.src).searchParams.get('m'); if (m === 'once' || m === 'now') mode = m; } catch (_) {}

  if (mode === 'once' || mode === 'now') { core(true, mode === 'now'); return; }

  /* ---------- watch mode ---------- */
  const SRC = '(' + core.toString() + ')(false);';
  const root = (() => { try { return window.top.document ? window.top : window; } catch (_) { return window; } })();

  const kids = (w, out = []) => {                 // a window + all its same-origin child frames
    out.push(w);
    let n = 0; try { n = w.frames.length; } catch (_) {}
    for (let i = 0; i < n; i++) { try { const c = w.frames[i]; c.document; kids(c, out); } catch (_) {} }
    return out;
  };

  const toast = msg => {
    const d = kids(root).map(w => { try { return w.document; } catch (_) { return null; } })
                        .find(d => d && d.body && d.body.tagName === 'BODY') || document;
    const old = d.getElementById('__reveal_watcher_ui'); if (old) old.remove();
    const h = d.createElement('div'); h.id = '__reveal_watcher_ui';
    h.style.cssText = 'all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483647;';
    const r = h.attachShadow({ mode: 'open' });
    r.innerHTML = '<style>div{font:13px/1.4 "Segoe UI",Arial,sans-serif;background:#1f2937;color:#fff;border-radius:8px;padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:320px}</style><div></div>';
    r.querySelector('div').textContent = msg;
    d.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
  };

  if (root.__revealWatcher) { toast('Reveal Table is already watching this HMC session.'); return; }
  root.__revealWatcher = true;

  const popups = new Set();
  const wrapOpen = w => {                         // remember every popup a window opens
    try {
      if (w.__rtOpen) return;
      const orig = w.open;
      w.open = function () { const p = orig.apply(this, arguments); if (p) popups.add(p); return p; };
      w.__rtOpen = 1;
    } catch (_) {}
  };
  const inject = w => {                           // run core() inside that window, once per page load
    try {
      const d = w.document;
      if (d.readyState !== 'complete' || !d.documentElement || w.__revealTableAuto) return;
      const s = d.createElement('script'); s.textContent = SRC;
      d.documentElement.appendChild(s); s.remove();
      if (!w.__revealTableAuto) w.eval(SRC);
    } catch (_) {}
  };
  const tick = () => {
    popups.forEach(p => { try { if (p.closed) popups.delete(p); } catch (_) { popups.delete(p); } });
    [root, ...popups].forEach(r => kids(r).forEach(w => { wrapOpen(w); inject(w); }));
  };
  tick();
  setInterval(tick, 1000);
  toast('Reveal Table is watching. Editor popups opened from now on are checked automatically.');
})();