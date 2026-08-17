(function () {

  const PANEL_ID = "ns-qa-helper";

  const existing = document.getElementById(PANEL_ID);

  if (existing) {
    existing.remove();
    return;
  }

  const HMC_BASE =
    "https://ecom-admin.nespresso.com/hmc?open=";

  const blocks = [
    ...new Set(
      document.documentElement.outerHTML.match(
        /block-\d{13}/g
      ) || []
    )
  ];

  const panel = document.createElement("div");

  panel.id = PANEL_ID;

  panel.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    width:420px;
    height:80vh;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 12px 40px rgba(0,0,0,.25);
    z-index:999999999;
    font-family:'Segoe UI',Arial,sans-serif;
    border:1px solid #ddd;
  `;

  panel.innerHTML = `
    <div
      id="nsqa-header"
      style="
        background:#111;
        color:white;
        padding:12px 16px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:move;
      "
    >

      <div>

        <div
          style="
            font-size:16px;
            font-weight:600;
          "
        >
          ☕ Nespresso QA Helper
        </div>

        <div
          style="
            font-size:11px;
            color:#aaa;
            margin-top:2px;
          "
        >
          ${blocks.length} Blocks Found
        </div>

      </div>

      <button
        id="closeQA"
        style="
          cursor:pointer;
          border:0;
          background:none;
          color:white;
          font-size:20px;
        "
      >
        ×
      </button>

    </div>

    <div
      style="
        padding:12px;
        border-bottom:1px solid #eee;
        background:#f8f8f8;
      "
    >

      <input
        id="qaSearch"
        placeholder="Search block..."
        style="
          width:100%;
          padding:10px;
          border-radius:8px;
          border:1px solid #ddd;
          box-sizing:border-box;
        "
      >

    </div>

    <div
      id="qaList"
      style="
        overflow:auto;
        height:calc(100% - 110px);
        padding:12px;
        background:#fafafa;
      "
    ></div>
  `;

  document.body.appendChild(panel);

  const list =
    document.getElementById("qaList");

  blocks.sort().forEach(block => {

    const pk =
      block.replace("block-", "");

    const card =
      document.createElement("a");

    card.className =
      "qa-row";

    card.dataset.pk =
      block.toLowerCase();

    card.href = `${HMC_BASE}${pk}`;

    card.target =
      "_blank";

    card.style.cssText = `
      display:block;
      text-decoration:none;
      color:#111;
      padding:12px;
      margin-bottom:8px;
      background:white;
      border:1px solid #e8e8e8;
      border-radius:10px;
      transition:.15s;
      cursor:pointer;
    `;

    card.onmouseenter = () => {
      card.style.background =
        "#f5f5f5";
      card.style.borderColor =
        "#cfcfcf";
    };

    card.onmouseleave = () => {
      card.style.background =
        "#fff";
      card.style.borderColor =
        "#e8e8e8";
    };

    card.innerHTML = `
      <div
        style="
          color:#B8860B;
          font-weight:700;
          font-size:13px;
          margin-bottom:4px;
        "
      >
        ${block}
      </div>

      <div
        style="
          font-size:11px;
          color:#777;
        "
      >
        PK: ${pk}
      </div>

      <div
        style="
          margin-top:6px;
          color:#0078d4;
          font-size:11px;
        "
      >
        Open in HMC →
      </div>
    `;

    list.appendChild(card);

  });

  document
    .getElementById("closeQA")
    .onclick = () =>
      panel.remove();

  document
    .getElementById("qaSearch")
    .addEventListener("input", e => {

      const value =
        e.target.value.toLowerCase();

      document
        .querySelectorAll(".qa-row")
        .forEach(card => {

          card.style.display =
            card.dataset.pk.includes(value)
            ? ""
            : "none";

        });

    });

  const header =
    document.getElementById("nsqa-header");

  let drag = false;
  let offsetX = 0;
  let offsetY = 0;

  header.onmousedown = e => {

    drag = true;

    offsetX =
      e.clientX -
      panel.offsetLeft;

    offsetY =
      e.clientY -
      panel.offsetTop;

  };

  document.onmouseup =
    () => drag = false;

  document.onmousemove = e => {

    if (!drag) return;

    panel.style.left =
      e.clientX - offsetX +
      "px";

    panel.style.top =
      e.clientY - offsetY +
      "px";

    panel.style.right =
      "auto";

  };

})();