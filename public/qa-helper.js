(function () {
  const PANEL_ID = "ns-qa-helper";

  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.remove();
    return;
  }

  const HMC_BASE = "https://ecom-admin.nespresso.com/hmc?open=";

  const pks = [
    ...new Set(
      document.documentElement.outerHTML.match(/\d{13}/g) || []
    )
  ];

  const panel = document.createElement("div");
  panel.id = PANEL_ID;

  panel.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    width:520px;
    height:80vh;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 12px 40px rgba(0,0,0,.25);
    z-index:999999999;
    font-family:Segoe UI,Arial,sans-serif;
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
            margin-top:2px;">
            ${pks.length} PKs Found
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
       placeholder="Search PK..."
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
      ">
    </div>
  `;

  document.body.appendChild(panel);

  const list = document.getElementById("qaList");

  pks.forEach(pk => {

    const row = document.createElement("div");

    row.className = "qa-row";

    row.dataset.pk = pk;

    row.style.cssText = `
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:10px;
      border:1px solid #eee;
      border-radius:8px;
      margin-bottom:8px;
      transition:.2s;
      background:white;
    `;

    row.onmouseenter = () =>
      row.style.background = "#f5f5f5";

    row.onmouseleave = () =>
      row.style.background = "#fff";

    row.innerHTML = `
      <div>

        <div style="
          font-weight:600;
          font-size:13px;
        ">
          ${pk}
        </div>

        <div style="
          color:#888;
          font-size:11px;
          margin-top:2px;
        ">
          Page Builder / CMS Object
        </div>

      </div>

      <div>

        <a
         href="${HMC_BASE}${pk}"
         target="_blank"
         style="
          text-decoration:none;
          padding:6px 10px;
          background:#111;
          color:white;
          border-radius:6px;
          font-size:12px;
          margin         background:white;
          "
        >
          Copy
        </button>

      </div>
    `;

    list.appendChild(row);

  });

  document.getElementById("closeQA").onclick =
    () => panel.remove();

  document.getElementById("copyAll").onclick =
    () => navigator.clipboard.writeText(
      pks.join("\n")
    );

  document.querySelectorAll(".copyBtn")
    .forEach(btn => {

      btn.onclick = () => {

        navigator.clipboard.writeText(
          btn.dataset.pk
        );

        btn.innerText = "Copied";

        setTimeout(() => {
          btn.innerText = "Copy";
        }, 1000);

      };

    });

  document.getElementById("qaSearch")
    .addEventListener("input", e => {

      const value =
        e.target.value.toLowerCase();

      document
      .querySelectorAll(".qa-row")
      .forEach(row => {

        row.style.display =
          row.dataset.pk.includes(value)
          ? ""
          : "none";

      });

    });

  // draggable

  const header =
    document.getElementById("nsqa-header");

  let drag = false;
  let x = 0;
  let y = 0;

  header.onmousedown = e => {

    drag = true;

    x = e.clientX - panel.offsetLeft;
    y = e.clientY - panel.offsetTop;

  };

  document.onmouseup = () =>
    drag = false;

  document.onmousemove = e => {

    if (!drag) return;

    panel.style.left =
      (e.clientX - x) + "px";

    panel.style.top =
      (e.clientY - y) + "px";

    panel.style.right = "auto";

  };

})();