/**
 * D2C Campaign & Personalization Inspector
 * -----------------------------------------
 * Purpose: Audit every promo/banner variant embedded in a page-builder page
 * (like nespresso.com), including the personalisation targeting rules
 * (club tier, subscription status, UTM match, visitor segment, etc.)
 * that decide which variant a shopper actually sees.
 *
 * Why: these sites embed ALL variants + rules in <script id="page-builder-data-*">
 * JSON blocks, even though only one variant renders per visitor. Marketers/CX
 * teams normally can't see this without asking a dev to pull the campaign
 * config. This surfaces it instantly, client-side, on any live page.
 *
 * Usage:
 *   1. Minify this (or paste as-is into a "javascript:(function(){ ... })()" bookmark).
 *   2. Click the bookmark on any live page built on this platform.
 *   3. A floating panel lists every campaign variant found, its personalisation
 *      rule (if any), and whether it appears to be the one currently rendered.
 */
(function () {
  'use strict';

  const PANEL_ID = '__campaign_inspector_panel__';
  document.getElementById(PANEL_ID)?.remove();

  // 1. Collect every page-builder JSON payload on the page.
  const dataScripts = Array.from(
    document.querySelectorAll('script[id^="page-builder-data-"]')
  );

  const rows = [];

  dataScripts.forEach((script) => {
    let payload;
    try {
      payload = JSON.parse(script.textContent);
    } catch (e) {
      return; // skip malformed blocks
    }
    const projectName = payload.name || '(unnamed project)';
    (payload.components || []).forEach((component) => {
      (component.variations || []).forEach((variation) => {
        const props = variation.properties || {};
        const campaign = props.campaign || {};
        const personalisation = variation.personalisation;
        rows.push({
          project: projectName,
          module: component.module || component.tag || '',
          uuid: component.uuid || '',
          variantIndex: variation.index,
          campaignId: campaign.id || '',
          campaignName: campaign.name || '',
          creative: campaign.creative || '',
          position: campaign.position || '',
          segmentName: personalisation ? personalisation.name : '',
          rules: personalisation
            ? JSON.stringify(personalisation.rules)
            : '(default / no targeting — fallback variant)',
        });
      });
    });
  });

  // 2. Cross-check which campaign IDs are actually live in the rendered DOM
  //    (elements carry campaign_id as an attribute on nb-container).
  const liveCampaignIds = new Set(
    Array.from(document.querySelectorAll('[campaign_id]')).map((el) =>
      el.getAttribute('campaign_id')
    )
  );

  // 3. Build the UI.
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.style.cssText = `
    position:fixed; top:16px; right:16px; width:min(720px, 92vw);
    max-height:85vh; overflow:auto; background:#fff; color:#111;
    border:1px solid #ccc; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,.25);
    z-index:2147483647; font:12px/1.4 -apple-system, Segoe UI, Roboto, sans-serif;
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    position:sticky; top:0; background:#111; color:#fff; padding:10px 14px;
    display:flex; justify-content:space-between; align-items:center; cursor:move;
  `;
  header.innerHTML = `<strong>Campaign & Personalization Inspector</strong>
    <span>${rows.length} variant(s) found across ${dataScripts.length} block(s)</span>`;
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText =
    'background:none;border:none;color:#fff;font-size:16px;cursor:pointer;margin-left:12px;';
  closeBtn.onclick = () => panel.remove();
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // simple drag support
  let dragging = false, offX = 0, offY = 0;
  header.addEventListener('mousedown', (e) => {
    dragging = true; offX = e.clientX - panel.offsetLeft; offY = e.clientY - panel.offsetTop;
  });
  document.addEventListener('mousemove', (e) => {
    if (dragging) { panel.style.left = e.clientX - offX + 'px'; panel.style.top = e.clientY - offY + 'px'; panel.style.right = 'auto'; }
  });
  document.addEventListener('mouseup', () => (dragging = false));

  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'padding:8px 14px; display:flex; gap:8px; border-bottom:1px solid #eee;';
  toolbar.innerHTML = `
    <input id="ci_search" placeholder="Filter by campaign id / name / rule..."
      style="flex:1; padding:6px 8px; border:1px solid #ccc; border-radius:6px;">
    <button id="ci_copy" style="padding:6px 10px; border:1px solid #ccc; border-radius:6px; background:#f5f5f5; cursor:pointer;">Copy JSON</button>
  `;
  panel.appendChild(toolbar);

  const tableWrap = document.createElement('div');
  panel.appendChild(tableWrap);

  function render(filterText) {
    const f = (filterText || '').toLowerCase();
    const filtered = rows.filter((r) =>
      !f ||
      r.campaignId.toLowerCase().includes(f) ||
      r.campaignName.toLowerCase().includes(f) ||
      r.rules.toLowerCase().includes(f)
    );

    tableWrap.innerHTML = `
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#fafafa; text-align:left;">
            ${['Live?','Campaign ID','Name','Position','Segment / Rule'].map(
              (h) => `<th style="padding:6px 10px; border-bottom:1px solid #eee; position:sticky; top:0; background:#fafafa;">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${filtered.map((r) => {
            const isLive = liveCampaignIds.has(r.campaignId);
            return `<tr style="border-bottom:1px solid #f2f2f2; ${isLive ? 'background:#eafaf0;' : ''}">
              <td style="padding:6px 10px;">${isLive ? '🟢' : '⚪'}</td>
              <td style="padding:6px 10px; font-family:monospace; word-break:break-all;">${r.campaignId}</td>
              <td style="padding:6px 10px;">${r.campaignName}<br><small style="color:#888;">${r.module}</small></td>
              <td style="padding:6px 10px;">${r.position}</td>
              <td style="padding:6px 10px; max-width:260px; word-break:break-word; color:${r.segmentName ? '#111' : '#999'};">
                ${r.segmentName ? `<strong>${r.segmentName}</strong><br>` : ''}${r.rules}
              </td>
            </tr>`;
          }).join('') || `<tr><td colspan="5" style="padding:14px; color:#888;">No matches.</td></tr>`}
        </tbody>
      </table>
    `;
  }

  render('');
  toolbar.querySelector('#ci_search').addEventListener('input', (e) => render(e.target.value));
  toolbar.querySelector('#ci_copy').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
    const btn = toolbar.querySelector('#ci_copy');
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = 'Copy JSON'), 1200);
  });

  document.body.appendChild(panel);
})();
