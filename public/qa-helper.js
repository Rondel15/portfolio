(function () {
  const PANEL_ID = "ns-qa-helper";

  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const HMC_BASE = "https://ecom-admin.nespresso.com/hmc?open=";

  const blocks = [
    ...new Set(
      document.documentElement.outerHTML.match(/block-\d{13}/g) || []
    )
  ];

  const panel = document.createElement("div");
  panel.id = PANEL_ID;

  panel.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    width:540px;
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
    <div id="nsqa-header"
      style="
        background:#111;
        color:white;
        padding:12px 16px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        cursor:move;
      ">

      <div>
        <div style="font-size:16px;font-weight:600">
          ☕ Nespresso QA Helper
        </div>

        <div style="
          font-size:11px;
          color:#aaa;
          margin-top:2px;
        ">
          ${blocks.length} Blocks Found
        </div>
      </div>

      <div>
        <button id="copyAll"
          style="
            cursor:pointer;
            padding:6px 10px;
            border:0;
            border-radius:6px;
            margin-right:8px;
            background:#fff;
          ">
          Copy All
        </button>

        <button id="closeQA"
          style="
            cursor:pointer;
            border:0;
            background:none;
            color:white;
            font-size:20px;
          ">
          ×
        </button>
      </div>
    </div>

    <div style="
      padding:12px;
      border-bottom:1px solid #eee;
      background:#f8f8f8;
    ">
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
        height:calc(100% - 120px);
        overflow:auto;
        padding:12px;
        background:#fafafa;
      ">
    </div>
  `;

  document.body.appendChild(panel);

  document.getElementById("closeQA").onclick =
    () => panel.remove();

  document.getElementById("copyAll").onclick =
    () => {
      navigator.clipboard.writeText(
        blocks.map(b => b.replace("block-", "")).join("\n")
      );
    };

  const list =
    document.getElementById("qaList");

  blocks.forEach(block => {

    const pk =
      block.replace("block-", "");

    const blockElement =
      [...document.querySelectorAll("*")]
        .find(el =>
          (el.outerHTML || "")
            .includes(block)
        );

    const title =
      blockElement
        ?.querySelector(
          "h1,h2,h3,h4,h5,h6"
        )
        ?.innerText
        ?.trim()
      || "Untitled Block";

    const image =
      blockElement
        ?.querySelector("img");

    const cta =
      [...(
        blockElement
          ?.querySelectorAll("a")
        || []
      )]
      .map(a =>
        a.innerText.trim()
      )
      .find(Boolean)
      || "";

    const preview =
      (
        blockElement?.innerText
        || ""
      )
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 150);

    const card =
      document.createElement("a");

    card.className =
      "qa-row";

    card.dataset.pk = block;

    card.href =
      `${HMC_BASE}${pk}`;

    card.target =
      "_blank";

    card.style.cssText = `
      display:flex;
      gap:12px;
      align-items:flex-start;
      text-decoration:none;
      color:#111;
      padding:12px;
      margin-bottom:10px;
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
      ${
        image
            ? `
            <img
                src="${image.src}"
                style="
                width:72px;
                height:72px;
                object-fit:cover;
                border-radius:8px;
                flex-shrink:rink:0;
                "
            >
            ` : ''
        }

      <div style="flex:1">

        <div style="
          color:#8C6A00;
          font-weight:700;
          font-size:12px;
          margin-bottom:4px;
        ">
          ${block}
        </div>

        <div style="
          font-size:14px;
          font-weight:600;
          margin-bottom:6px;
        ">
          ${title}
        </div>

        ${
          cta
          ? `
          <div style="
            font-size:11px;
            color:#0078d4;
            margin-bottom:6px;
          ">
            CTA: ${cta}
          </div>
          `
          : ""
        }

        <div style="
          font-size:11px;
          color:#666;
          line-height:1.4;
        ">
          ${preview}
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  document
    .getElementById("qaSearch")
    .addEventListener("input", e => {

      const value =
        e.target.value
          .toLowerCase();

      document
        .querySelectorAll(".qa-row")
        .forEach(row => {

          row.style.display =
            row.innerText
              .toLowerCase()
              .includes(value)
            ? ""
            : "none";

        });

    });

  // draggable
  const header =
    document.getElementById(
      "nsqa-header"
    );

  let drag = false;
  let posX = 0;
  let posY = 0;

  header.onmousedown = e => {

    drag = true;

    posX =
      e.clientX -
      panel.offsetLeft;

    posY =
      e.clientY -
      panel.offsetTop;

  };

  document.onmouseup = () =>
    drag = false;

  document.onmousemove = e => {

    if (!drag) return;

    panel.style.left =
      e.clientX - posX + "px";

    panel.style.top =
      e.clientY - posY + "px";

    panel.style.right =
      "auto";

  };

})();