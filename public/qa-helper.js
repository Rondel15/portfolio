(function () {

    const existing =
        document.querySelectorAll('.ns-hmc-badge');

    if (existing.length) {
        existing.forEach(x => x.remove());
        return;
    }

    const HMC_BASE =
        "https://ecom-admin.nespresso.com/hmc?open=";

    const blocks =
        [...new Set(
            document.documentElement.outerHTML.match(
                /block-\d{13}/g
            ) || []
        )];

    blocks.forEach(block => {

        const pk =
            block.replace("block-", "");

        const element =
            [...document.querySelectorAll("*")]
                .find(el =>
                    (el.outerHTML || "")
                        .includes(block)
                );

        if (!element) return;

        if (
            getComputedStyle(element).position
            === "static"
        ) {
            element.style.position = "relative";
        }

        const badge =
            document.createElement("a");

        badge.className =
            "ns-hmc-badge";

        badge.href =
            ${HMC_BASE}${pk};

        badge.target =
            "_blank";

        badge.innerHTML =
            ↗ HMC;

        badge.style.cssText = `
            position:absolute;
            top:8px;
            right:8px;
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