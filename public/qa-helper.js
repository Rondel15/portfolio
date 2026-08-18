(function () {

  const existing =
    document.querySelectorAll('.ns-hmc-badge');

  if (existing.length) {
    existing.forEach(x => x.remove());
    return;
  }

  const HMC_BASE =
    "https://ecom-admin.nespresso.com/hmc/hybris?open=";

  const blocks =
    [...new Set(
      document.documentElement.outerHTML.match(
        /block-\d{13}/g
      ) || []
    )];

  // Build a lookup of the smallest element containing each block ID,
  // in a single pass over the DOM instead of re-scanning per block.
  // A block ID may appear in text content OR in an attribute
  // (e.g. data-block-id, class, href), so check both.
  const targets = new Map(); // block -> element (smallest match so far)

  const elementContainsBlock = (el, block) => {

    if ((el.textContent || "").includes(block)) return true;

    for (const attr of el.attributes) {
      if (attr.value.includes(block)) return true;
    }

    return false;

  };

  const allElements = document.querySelectorAll("*");

  allElements.forEach(el => {

    blocks.forEach(block => {

      if (!elementContainsBlock(el, block)) return;

      const current = targets.get(block);

      // Prefer the element with the smallest subtree (fewest children),
      // which is more likely to be the specific node referencing the block
      // rather than a large ancestor container.
      if (
        !current ||
        el.querySelectorAll("*").length <
          current.querySelectorAll("*").length
      ) {
        targets.set(block, el);
      }

    });

  });

  blocks.forEach(block => {

    const pk =
      block.replace("block-", "");

    const element = targets.get(block);

    if (!element) return;

    if (
      getComputedStyle(element).position
      === "static"
    ) {
      element.style.position = "relative";
    }
    
    const label =
      element.getAttribute("data-label") ||
      block;

    const badge =
      document.createElement("a");

    badge.className =
      "ns-hmc-badge";

    badge.href =
      `${HMC_BASE}${pk}`;

    badge.target =
      "_blank";

    badge.title =
      label;

    badge.innerHTML =
      `↗ HMC`;

    badge.style.cssText = `
      position:absolute;
      top:8px;
      left:8px;
      z-index:9999;
      background:#000;
      color:#fff;
      padding:4px 8px;
      border-radius:20px;
      font-size:11px;
      font-family:Arial;
      text-decoration:none;
      font-weight:600;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
      transition:.15s;
    `;

    badge.onmouseenter =
      () =>
        badge.style.background =
          "#B8860B";

    badge.onmouseleave =
      () =>
        badge.style.background =
          "#000";

    element.prepend(badge);

  });

})();