/**
 * D2C PDP Merchandising Inspector
 * --------------------------------
 * Purpose: On any product detail page, surface in one panel:
 *   1. What Google/price-comparison engines see (schema.org Product JSON-LD)
 *      vs. what's actually rendered on screen — catches price/stock drift.
 *   2. Every variant/SKU (color, size, capsule count, etc.) with its
 *      stock status, so you can spot "in stock" UI states pointing at
 *      out-of-stock SKUs.
 *   3. Subscription / "subscribe & save" plan options and how their price
 *      compares to one-time purchase.
 *   4. Any page-builder personalization blocks scoped to this PDP
 *      (cross-sell, bundle, badge, informative stripe) — same engine as
 *      the homepage inspector, reused here.
 *
 * Usage: paste as a "javascript:(function(){...})()" bookmark, click on
 * any live PDP.
 */
(function () {
  'use strict';
  const PANEL_ID = '__pdp_inspector_panel__';
  document.getElementById(PANEL_ID)?.remove();

  // ---- 1. schema.org Product JSON-LD -------------------------------------
  const ldBlocks = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]')
  )
    .map((s) => {
      try { return JSON.parse(s.textContent); } catch (e) { return null; }
    })
    .filter(Boolean)
    .flatMap((j) => (Array.isArray(j) ? j : [j]))
    .filter((j) => {
      const t = j['@type'];
      return t === 'Product' || (Array.isArray(t) && t.includes('Product'));
    });

  // ---- 2. Variant / SKU selector heuristics -------------------------------
  const variantSelectors = Array.from(
    document.querySelectorAll(
      '[data-sku], [data-variant-id], [data-product-id], [class*="variant"], [class*="sku-selector"] [role="radio"], [class*="sku-selector"] button'
    )
  );
  const variantRows = variantSelectors.slice(0, 60).map((el) => ({
    label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60),
    sku: el.getAttribute('data-sku') || el.getAttribute('data-variant-id') || '',
    disabled:
      el.hasAttribute('disabled') ||
      el.getAttribute('aria-disabled') === 'true' ||
      /out.?of.?stock|sold.?out/i.test(el.className + ' ' + (el.getAttribute('aria-label') || '')),
    selected:
      el.getAttribute('aria-checked') === 'true' ||
      el.getAttribute('aria-selected') === 'true' ||
      el.classList.contains('selected') ||
      el.classList.contains('active'),
  }));

  // ---- 3. Subscription / frequency plan heuristics ------------------------
  const subEls = Array.from(
    document.querySelectorAll(
      '[class*="subscri"], [data-testid*="subscri"], [class*="frequency"], [data-testid*="frequency"]'
    )
  );
  const subRows = subEls.slice(0, 30).map((el) => ({
    text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
  })).filter((r) => r.text);

  // ---- 4. Page-builder personalization blocks (reuse homepage engine) ----
  const dataScripts = Array.from(
    document.querySelectorAll('script[id^="page-builder-data-"]')
  );
  const personalRows = [];
  dataScripts.forEach((script) => {
    let payload;
    try { payload = JSON.parse(script.textContent); } catch (e) { return; }
    (payload.components || []).forEach((component) => {
      (component.variations || []).forEach((variation) => {
        const props = variation.properties || {};
        const campaign = props.campaign || {};
        const p = variation.personalisation;
        if (campaign.id || p) {
          personalRows.push({
            module: component.module || component.tag || '',
            campaignId: campaign.id || '',
            campaignName: campaign.name || '',
            segment: p ? p.name : '(default)',
            rules: p ? JSON.stringify(p.rules) : '',
          });
        }
      });
    });
  });

  // ---- Build panel ---------------------------------------------------------
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.style.cssText = `
    position:fixed; top:16px; right:16px; width:min(760px, 92vw);
    max-height:88vh; overflow:auto; background:#fff; color:#111;
    border:1px solid #ccc; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,.25);
    z-index:2147483647; font:12px/1.4 -apple-system, Segoe UI, Roboto, sans-serif;
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    position:sticky; top:0; background:#111; color:#fff; padding:10px 14px;
    display:flex; justify-content:space-between; align-items:center; cursor:move;
  `;
  header.innerHTML = `<strong>PDP Merchandising Inspector</strong>`;
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:16px;cursor:pointer;';
  closeBtn.onclick = () => panel.remove();
  header.appendChild(closeBtn);
  panel.appendChild(header);

  let dragging = false, offX = 0, offY = 0;
  header.addEventListener('mousedown', (e) => { dragging = true; offX = e.clientX - panel.offsetLeft; offY = e.clientY - panel.offsetTop; });
  document.addEventListener('mousemove', (e) => { if (dragging) { panel.style.left = e.clientX - offX + 'px'; panel.style.top = e.clientY - offY + 'px'; panel.style.right = 'auto'; } });
  document.addEventListener('mouseup', () => (dragging = false));

  function section(title, html) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:12px 14px; border-bottom:1px solid #eee;';
    wrap.innerHTML = `<div style="font-weight:600; margin-bottom:6px;">${title}</div>${html}`;
    return wrap;
  }

  // Schema section
  const schemaHtml = ldBlocks.length
    ? ldBlocks.map((p) => {
        const offer = Array.isArray(p.offers) ? p.offers[0] : p.offers || {};
        const rating = p.aggregateRating || {};
        return `<div style="padding:6px 0; border-top:1px solid #f5f5f5;">
          <div><strong>${p.name || '(no name)'}</strong> — SKU: <code>${p.sku || '—'}</code></div>
          <div>Price: <strong>${offer.priceCurrency || ''} ${offer.price || '—'}</strong> · Availability: <span style="color:${/InStock/i.test(offer.availability||'') ? '#0a0' : '#c00'}">${(offer.availability||'').split('/').pop() || '—'}</span></div>
          <div>Rating: ${rating.ratingValue || '—'} (${rating.reviewCount || 0} reviews)</div>
        </div>`;
      }).join('')
    : `<span style="color:#999;">No Product JSON-LD found on this page.</span>`;
  panel.appendChild(section('Schema.org Product data (what search engines see)', schemaHtml));

  // Variants section
  const variantHtml = variantRows.length
    ? `<table style="width:100%; border-collapse:collapse;">
        <tbody>
        ${variantRows.map((v) => `
          <tr style="border-bottom:1px solid #f5f5f5; ${v.disabled ? 'opacity:.5;' : ''}">
            <td style="padding:4px 8px;">${v.selected ? '🔵' : '⚪'}</td>
            <td style="padding:4px 8px;">${v.label || '(unlabeled)'}</td>
            <td style="padding:4px 8px; font-family:monospace;">${v.sku}</td>
            <td style="padding:4px 8px; color:${v.disabled ? '#c00' : '#0a0'};">${v.disabled ? 'Unavailable' : 'Available'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<span style="color:#999;">No variant selector detected (may be single-SKU or a custom component this heuristic doesn't match).</span>`;
  panel.appendChild(section(`Variants (${variantRows.length} detected)`, variantHtml));

  // Subscription section
  const subHtml = subRows.length
    ? `<ul style="margin:0; padding-left:18px;">${subRows.map((r) => `<li>${r.text}</li>`).join('')}</ul>`
    : `<span style="color:#999;">No subscription/frequency module detected on this page.</span>`;
  panel.appendChild(section('Subscription / frequency options', subHtml));

  // Personalization section
  const personalHtml = personalRows.length
    ? `<table style="width:100%; border-collapse:collapse;">
        <tbody>
        ${personalRows.map((r) => `
          <tr style="border-bottom:1px solid #f5f5f5;">
            <td style="padding:4px 8px;">${r.module}</td>
            <td style="padding:4px 8px; font-family:monospace;">${r.campaignId}</td>
            <td style="padding:4px 8px;">${r.campaignName}</td>
            <td style="padding:4px 8px; max-width:220px; word-break:break-word;">${r.segment}<br><small style="color:#888;">${r.rules}</small></td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : `<span style="color:#999;">No page-builder personalization blocks found on this PDP.</span>`;
  panel.appendChild(section(`Personalization / cross-sell blocks (${personalRows.length})`, personalHtml));

  document.body.appendChild(panel);
})();
