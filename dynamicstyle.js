// Dynamic theme and behavior for site header/navigation
(function () {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const GOLD = "#DAA520";
    const DARK_BG_GRADIENT = "linear-gradient(145deg, #606060 0%, #303030 100%)";
    const DARK_BG_SOLID = "#303030";

    function injectStyle() {
        const css = `
/* Container */
.header-wrap__inner { position: sticky; top: 0; z-index: 1000; background: ${DARK_BG_GRADIENT}; }
.header { max-width: 1200px; margin: 0 auto; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.jw-header-actions { display: inline-flex; align-items: center; gap: 10px; }
.jw-header-actions > li { list-style: none; }

/* Logo */
.jw-header-title { color: #fff !important; text-decoration: none; font-weight: 700; letter-spacing: 0.5px; }
.jw-header-title:hover { opacity: 0.9; }

/* Menu base */
.menu.jw-menu-copy { background: transparent; }
.jw-menu-horizontal { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 0 12px 6px; font-size: 0.85rem; }
.jw-menu-item { list-style: none; }
.jw-menu-link { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid transparent; border-radius: 6px; color: #f5f5f5; text-decoration: none; line-height: 1; transition: background .2s, border-color .2s, color .2s; }
.jw-menu-link:hover { background: rgba(255,255,255,0.06); border-color: ${GOLD}; }
.jw-menu-item.jw-menu-is-active > .jw-menu-link, .js-active-menu-item { background: rgba(218,165,32,0.15); border-color: ${GOLD}; }

/* Icons and badges */
.jw-menu-link--icon { padding: 8px 10px; border-radius: 10px; border: 1px solid ${GOLD}; background: ${DARK_BG_SOLID}; }
.jw-icon-badge-wrapper { position: relative; display: inline-flex; align-items: center; }
.jw-icon-badge { position: absolute; top: -6px; right: -6px; background: ${GOLD}; color: #101010; border-radius: 12px; font-size: 10px; padding: 0 5px; border: 1px solid #000; }

/* Top announcement bar expectation */
.site-announcement-bar { background: ${GOLD}; color: #111; text-align: center; padding: 6px 10px; font-weight: 600; }

/* Compact on scroll */
.header.is-compact { padding: 8px 16px; }
.header.is-compact .jw-menu-horizontal { padding-bottom: 6px; }

/* Divider */
.jw-menu-horizontal { border-top: 1px solid rgba(255,255,255,0.06); margin-top: -2px; }

/* Mobile */
.jw-burger { display: none; cursor: pointer; border: 1px solid ${GOLD}; border-radius: 8px; padding: 8px 10px; color: #fff; background: ${DARK_BG_SOLID}; }
.jw-burger:focus { outline: 2px solid ${GOLD}; outline-offset: 2px; }

@media (max-width: 1024px) {
  .jw-menu-horizontal { gap: 3px; font-size: 0.8rem; }
}
@media (max-width: 900px) {
  .header { flex-wrap: nowrap; }
  .menu.jw-menu-copy { width: 100%; }
  .jw-burger { display: inline-flex; }
  .jw-menu-horizontal { display: none; flex-direction: column; align-items: stretch; gap: 6px; padding: 6px 12px 10px; }
  .jw-menu-horizontal.is-open { display: flex; }
  .jw-menu-link { width: 100%; justify-content: space-between; }
}

/* Accessibility */
.jw-menu-link:focus { outline: 2px solid ${GOLD}; outline-offset: 2px; border-color: ${GOLD}; }
.header{
    width: 100%;
    padding: 0px;
    margin: 0px;
    display: flex;
    justify-content: space-between;
    align-items:center;
}
`;
        const style = document.createElement("style");
        style.setAttribute("data-dynamic-style", "true");
        style.textContent = css;
        document.head.appendChild(style);
    }

    function ensureBurgerButton(headerEl) {
        let burger = headerEl.querySelector(".jw-burger");
        if (burger) return burger;
        burger = document.createElement("button");
        burger.className = "jw-burger";
        burger.setAttribute("aria-label", "Toggle navigation");
        burger.setAttribute("aria-expanded", "false");
        burger.innerHTML = "<svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3 6h18M3 12h18M3 18h18\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>";
        headerEl.appendChild(burger);
        return burger;
    }

    function setupToggle(headerEl, menuEl) {
        const burger = ensureBurgerButton(headerEl);
        const toggle = () => {
            const open = menuEl.classList.toggle("is-open");
            burger.setAttribute("aria-expanded", String(open));
        };
        burger.addEventListener("click", toggle);
    }

    function moveIconLinksToHeader(menuEl, headerEl) {
        // Create actions container if not present
        let actions = headerEl.querySelector(".jw-header-actions");
        if (!actions) {
            actions = document.createElement("div");
            actions.className = "jw-header-actions";
            headerEl.appendChild(actions);
        }

        const candidates = [];
        menuEl.querySelectorAll("a.jw-menu-link--icon").forEach(a => {
            const li = a.closest("li.jw-menu-item");
            if (li && !candidates.includes(li)) candidates.push(li);
        });
        menuEl.querySelectorAll("li.jw-menu-item.js-menu-cart-item, li.jw-menu-item.jw-menu-wishlist-item").forEach(li => {
            if (li && !candidates.includes(li)) candidates.push(li);
        });

        // Move them to actions container (keeps popovers functional)
        candidates.forEach(li => actions.appendChild(li));
    }

    function setupCompactOnScroll(headerEl) {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            const compact = y > 10;
            headerEl.classList.toggle("is-compact", compact);
            lastY = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function init() {
        injectStyle();
        const headerWrap = document.querySelector(".header-wrap__inner");
        const header = document.querySelector(".header");
        const menu = document.querySelector(".menu.jw-menu-copy .jw-menu-horizontal");
        if (!headerWrap || !header || !menu) return;
        moveIconLinksToHeader(menu, header);
        setupToggle(header, menu);
        setupCompactOnScroll(header);
        header.style.width="100%";
        header.style.padding="0px";
        header.style.margin="0px";
        header.style.display="flex";
        header.style.justifyContent="space-between";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();


