(function () {
  const PANEL_ID = "ns-qa-helper";

  // Toggle off if already open
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const HMC_BASE = "https://ecom-admin.nespresso.com/hmc?open=";

  // Collect PKs
  const pks = [
    ...new Set(
      document.documentElement.outerHTML.match(/\d{13}/g) || []
    )
  ];

  // Panel
  const panel = document.createElement("div");
  panel.id = PANEL_ID;

  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 550px;
    max-height: 85vh;
    overflow: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,.25);
    z-index: 999999999;
    font-family: Arial, sans-serif;
    font-size: 12px;
  `;

  panel.innerHTML = `
    <div id="nsqa-header"
      style="
        background:#000;
        color:#fff;
        padding:12px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:move;
        position:sticky;
        top:0;
      ">
      <div>
        <strong>☕ Nespresso QA Helper</strong><br>
        <small>${document.title}</small>
      </div>

      <div>
        <button id="ns-copy-all"
          style="margin-right:8px;cursor:pointer;">
          Copy All PKs
        </button>

        <button id="ns-close"
          style="cursor:pointer;">
          ✕
        </button>
      </div>
    </div>

    <div style="padding:12px;">

      <div style="margin-bottom:12px;">
        <strong>PKs Found:</strong> ${pks.length}
      </div>

      <div id="nsqa-content"></div>

    </div>
  `;

  document.body.appendChild(panel);

  // Close button
  document.getElementById("ns-close").onclick = () => {
    panel.remove();
  };

  // Copy all
  document.getElementById("ns-copy-all").onclick = () => {
    navigator.clipboard.writeText(pks.join("\n"));
  };

  const content = document.getElementById("nsqa-content");

  pks.forEach(pk => {
    const card = document.createElement("div");

    card.style.cssText = `
      border:1px solid #e5e5e5;
      border-radius:6px;
      padding:10px;
      margin-bottom:8px;
    `;

    card.innerHTML = `
      <div>
        <strong>PK:</strong> ${pk}
      </div>

      <div style="margin-top:4px;">
        <a href="${HMC_BASE}${pk}"
           target="_blank">
           🔗 Open HMC
style="margin-top:8px;">
        <button class="copy-pk"
          data-pk="${pk}">
          Copy PK
        </button>
      </div>
    `;

    content.appendChild(card);
  });

  // Copy buttons
  document.querySelectorAll(".copy-pk").forEach(btn => {
    btn.onclick = () => {
      navigator.clipboard.writeText(
        btn.getAttribute("data-pk")
      );
    };
  });

  // Dragging
  const header = document.getElementById("nsqa-header");

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", e => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;

    panel.style.left =
      e.clientX - offsetX + "px";

    panel.style.top =
      e.clientY - offsetY + "px";

    panel.style.right = "auto";
  });

})();