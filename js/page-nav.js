/**
 * TYT – Page switcher
 * -----------------------------------------------------------------
 * The site behaves like separate screens (Home / Menu / Offers /
 * Comments) instead of one long scrolling page:
 *   - Opening the site shows ONLY the Home hero.
 *   - Tapping "View Menu" shows ONLY the Menu section.
 *   - Tapping "Offers" shows ONLY the Offers section.
 *   - Tapping "Comments" shows ONLY the Comments (guestbook) section.
 *   - Tapping the logo (top-left) goes back to Home.
 * Scrolling down on Home never reveals the other sections — they're
 * display:none until their button is tapped (see css/style.css).
 * -----------------------------------------------------------------
 */
(function () {
  const pages = {
    home: document.getElementById("home"),
    menu: document.getElementById("menu"),
    offers: document.getElementById("offers"),
    comments: document.getElementById("comments")
  };

  function pageKeyFromHash() {
    const h = (window.location.hash || "").replace("#", "");
    if (h === "menu") return "menu";
    if (h === "offers") return "offers";
    if (h === "comments") return "comments";
    return "home";
  }

  function showPage(key, opts) {
    opts = opts || {};
    Object.keys(pages).forEach((k) => {
      const el = pages[k];
      if (el) el.classList.toggle("is-active", k === key);
    });

    // The menu/offers/comments sections sit at display:none until this
    // switch. Any [data-reveal] content already rendered inside them
    // (e.g. the menu categories, built while the section was hidden)
    // was observed by the scroll-reveal IntersectionObserver while it
    // had no layout box, so it never gets marked visible on its own —
    // the whole section would stay blank. Force it visible the moment
    // its page is switched to; content rendered later (after the page
    // is already active) is unaffected and reveals normally on scroll.
    const activeEl = pages[key];
    if (activeEl) {
      activeEl.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible", "in-view");
      });
    }

    if (!opts.skipScroll) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  // Intercept clicks on any link that points to #top / #menu / #offers
  // so we switch pages instead of letting the browser try to scroll to
  // a hidden element.
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href="#top"], a[href="#menu"], a[href="#offers"], a[href="#comments"]');
    if (!link) return;
    e.preventDefault();
    const href = link.getAttribute("href");
    const key = href === "#menu" ? "menu" : href === "#offers" ? "offers" : href === "#comments" ? "comments" : "home";
    showPage(key);
    history.replaceState(null, "", key === "home" ? "#top" : "#" + key);
  });

  window.addEventListener("hashchange", () => showPage(pageKeyFromHash()));

  // Initial page on load (respects a direct link like site.html#menu).
  showPage(pageKeyFromHash(), { skipScroll: true });
})();
