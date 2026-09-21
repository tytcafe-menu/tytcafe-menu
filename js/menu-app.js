/* TYT — menu-app.js
   Standalone digital menu, built to look and behave exactly like the
   menu section of the main site (same CSS, same i18n.js, same Firebase
   project/admin.html). Ported from the main site's main.js: tabs, search,
   quick-view modal, favorites, drag/swipe scrolling, scroll-reveal,
   navbar shrink + progress bar, offers, and live Firestore/admin sync —
   leaving out only what needs the full one-page site (hero parallax,
   gallery, hamburger nav).
   Menu/offers are managed from admin.html (Firebase project
   tyt-cafe-8c2ae, shared with the main site) and fall back to the
   bundled js/menu-data.js / js/offers-data.js when Firestore is
   unavailable. */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------------------------------------------------------------
     NAVBAR: shrink + blur on scroll, scroll progress bar
  --------------------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const scrollProgress = document.getElementById("scrollProgress");

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     HERO PARALLAX: subtle mouse-follow + scroll depth on decorative
     elements and the logo. Desktop (fine-pointer) only; fully skipped for
     touch devices and prefers-reduced-motion.
  --------------------------------------------------------------------- */
  const heroSection = document.getElementById("home");
  const heroDecor = document.getElementById("heroDecor");
  const heroLogoWrap = document.getElementById("heroLogoWrap");

  if (heroSection && canHover && !prefersReducedMotion) {
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;
    let scrollOffset = 0;
    let rafId = null;

    function applyParallax() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      if (heroDecor) {
        heroDecor.style.transform = `translate3d(${curX * 1}px, ${curY * 0.75 - scrollOffset * 0.15}px, 0)`;
      }
      if (heroLogoWrap) {
        heroLogoWrap.style.transform = `translate3d(${curX * 0.5}px, ${curY * 0.4 - scrollOffset * 0.06}px, 0)`;
      }
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        rafId = requestAnimationFrame(applyParallax);
      } else {
        rafId = null;
      }
    }
    function requestFrame() {
      if (!rafId) rafId = requestAnimationFrame(applyParallax);
    }

    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = nx * 8;
      targetY = ny * 6;
      requestFrame();
    });
    heroSection.addEventListener("mouseleave", () => {
      targetX = 0; targetY = 0;
      requestFrame();
    });
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        scrollOffset = y;
        requestFrame();
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     SCROLL-REVEAL: [data-reveal] elements fade/slide in once in view
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible", "in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  if (document.getElementById("year")) {
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     MENU: render categories/tabs from MENU_DATA, wire search + filter
  --------------------------------------------------------------------- */
  const menuContainer = document.getElementById("menuContainer");
  const menuTabs = document.getElementById("menuTabs");
  const menuSearch = document.getElementById("menuSearch");
  const menuSearchClear = document.getElementById("menuSearchClear");
  const menuEmpty = document.getElementById("menuEmpty");
  const menuStage = document.getElementById("menuStage");
  const menuPager = document.getElementById("menuPager");
  const menuArrowLeft = document.getElementById("menuArrowLeft");
  const menuArrowRight = document.getElementById("menuArrowRight");
  const menuPagerStatus = document.getElementById("menuPagerStatus");

  /* Search clear (×) button: purely a UI convenience on top of the
     existing search input — doesn't touch the filter logic itself. */
  if (menuSearch && menuSearchClear) {
    const syncClearBtn = () => { menuSearchClear.hidden = !menuSearch.value; };
    menuSearch.addEventListener("input", syncClearBtn);
    menuSearchClear.addEventListener("click", () => {
      menuSearch.value = "";
      menuSearch.dispatchEvent(new Event("input"));
      menuSearch.focus();
    });
    syncClearBtn();
  }

  let activeCategory = "all";
  let menuSource = (typeof MENU_DATA !== "undefined") ? MENU_DATA : [];

  /* ---------------------------------------------------------------------
     FIREBASE DATA: same tyt-cafe-8c2ae project the main site + admin.html
     use. When available, the Menu tabs/items and Offers below are driven
     live by whatever is saved in the Admin Panel — no code edits needed.
     If Firestore is unavailable, everything falls back to the bundled
     js/menu-data.js (offers show the "no active offer" placeholder).

     LIVE SYNC: the Firebase app/db instance is cached at module level (an
     app can only be initialized once), and after the first load a set of
     onSnapshot listeners are attached to menu/menuCategories/offers. Any
     change saved from the Admin Panel fires those listeners, which re-run
     the same fetch+merge logic below and re-render the live Menu/Offers —
     no page reload needed, on both mobile and desktop. */
  let REMOTE_MENU = null;
  let REMOTE_OFFERS = null;
  let _fbDb = null;
  let _fsMod = null;
  let _liveSyncStarted = false;

  async function getFirebaseDb() {
    if (_fbDb && _fsMod) return { db: _fbDb, fsMod: _fsMod };
    const [{ initializeApp }, , fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js")
    ]);
    const firebaseConfig = {
      apiKey: "AIzaSyA_iRaVTZwvi25XabH_PfC8cKK_BeYYRPY",
      authDomain: "tyt-cafe-8c2ae.firebaseapp.com",
      projectId: "tyt-cafe-8c2ae",
      storageBucket: "tyt-cafe-8c2ae.firebasestorage.app",
      messagingSenderId: "298823761893",
      appId: "1:298823761893:web:7652134d929a5466c9f90c",
      measurementId: "G-FPYN8MT74C"
    };
    initializeApp(firebaseConfig);
    _fbDb = fsMod.getFirestore();
    _fsMod = fsMod;
    return { db: _fbDb, fsMod: _fsMod };
  }

  async function loadRemoteData() {
    try {
      const { db, fsMod } = await getFirebaseDb();
      const menuSnap = await fsMod.getDocs(fsMod.collection(db, "menu"));
      const categorySnap = await fsMod.getDocs(fsMod.collection(db, "menuCategories"));

      const baseCategories = (typeof MENU_DATA !== "undefined" ? MENU_DATA : []).map(cat => ({
        ...cat,
        items: [],
        __base: true
      }));
      const categoryMap = new Map(baseCategories.map(cat => [cat.id, { ...cat }]));
      const categoryOrder = baseCategories.map(cat => cat.id);

      categorySnap.forEach(d => {
        const x = d.data();
        const current = categoryMap.get(d.id);
        if (x.deleted === true) {
          categoryMap.delete(d.id);
          return;
        }
        if (current) {
          categoryMap.set(d.id, { ...current, ...x, id: d.id, items: [] });
        } else {
          categoryMap.set(d.id, {
            id: d.id,
            name: x.name || "New Category",
            icon: x.icon || "extra",
            description: x.description || "",
            items: [],
            ...x,
            __base: false
          });
        }
      });

      const categories = [...categoryMap.values()].sort((a, b) => {
        const ai = categoryOrder.indexOf(a.id);
        const bi = categoryOrder.indexOf(b.id);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return Number(a.order ?? 999999) - Number(b.order ?? 999999);
      });

      const menuKeyPart = (value) => String(value ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const canonicalKey = (catId, itemName) => `menu:${catId}:${menuKeyPart(itemName)}`;

      const baseMenu = (typeof MENU_DATA !== "undefined" ? MENU_DATA : []).map(cat => ({
        ...cat,
        items: (cat.items || []).map((item) => ({
          ...item,
          __sourceKey: canonicalKey(cat.id, item.name),
          __baseName: item.name,
          __baseCategoryId: cat.id,
          __baseCategoryName: cat.name
        }))
      }));

      const byKey = new Map();
      const legacyLookup = new Map();
      const legacyKeyLookup = new Map();

      baseMenu.forEach(cat => {
        cat.items.forEach(item => {
          byKey.set(item.__sourceKey, item);
          legacyLookup.set(`${String(cat.name).trim().toLowerCase()}||${String(item.__baseName).trim().toLowerCase()}`, item.__sourceKey);
          legacyLookup.set(`${String(cat.id).trim().toLowerCase()}||${String(item.__baseName).trim().toLowerCase()}`, item.__sourceKey);
          legacyKeyLookup.set(`menu:${cat.id}:${menuKeyPart(item.__baseName)}`, item.__sourceKey);
          legacyKeyLookup.set(`menu:${cat.id}:${cat.items.indexOf(item)}`, item.__sourceKey);
        });
      });

      const extras = [];

      menuSnap.forEach(d => {
        const x = d.data();

        if (x.deleted === true) {
          const deletedKey =
            legacyKeyLookup.get(String(x.sourceKey || "")) ||
            legacyLookup.get(`${String(x.category || "").trim().toLowerCase()}||${String(x.originalName || x.name || "").trim().toLowerCase()}`) ||
            legacyLookup.get(`${String(x.categoryId || "").trim().toLowerCase()}||${String(x.originalName || x.name || "").trim().toLowerCase()}`);
          if (deletedKey && byKey.has(deletedKey)) byKey.delete(deletedKey);
          return;
        }

        let key = legacyKeyLookup.get(String(x.sourceKey || "")) || "";
        const originalName = String(x.originalName || x.baseName || "").trim();

        if (!key && originalName) {
          key =
            legacyLookup.get(`${String(x.categoryId || "").trim().toLowerCase()}||${originalName.toLowerCase()}`) ||
            legacyLookup.get(`${String(x.category || "").trim().toLowerCase()}||${originalName.toLowerCase()}`) || "";
        }

        if (!key) {
          key =
            legacyLookup.get(`${String(x.categoryId || "").trim().toLowerCase()}||${String(x.name || "").trim().toLowerCase()}`) ||
            legacyLookup.get(`${String(x.category || "").trim().toLowerCase()}||${String(x.name || "").trim().toLowerCase()}`) || "";
        }

        if (key && byKey.has(key)) {
          byKey.set(key, {
            ...byKey.get(key),
            ...x,
            /* keep the bundled picture unless the admin deliberately deleted it */
            image: x.imageDeleted === true ? "" : (x.image || byKey.get(key).image || ""),
            __sourceKey: key,
            __baseName: byKey.get(key).__baseName,
            __baseCategoryId: byKey.get(key).__baseCategoryId,
            __baseCategoryName: byKey.get(key).__baseCategoryName
          });
        } else {
          extras.push({ ...x, __sourceKey: `remote:${d.id}` });
        }
      });

      REMOTE_MENU = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon || "extra",
        description: cat.description || "",
        items: []
      }));

      const ensureFallbackCategory = () => {
        let fallback = REMOTE_MENU.find(c => c.id === "other");
        if (!fallback) {
          fallback = { id: "other", name: "Other", icon: "extra", items: [] };
          REMOTE_MENU.push(fallback);
        }
        return fallback;
      };

      baseMenu.forEach(baseCat => {
        baseCat.items.forEach(baseItem => {
          const item = byKey.get(baseItem.__sourceKey);
          if (!item) return;
          const targetId = item.categoryId || item.__baseCategoryId || baseCat.id;
          let target = REMOTE_MENU.find(c => c.id === targetId);
          if (!target) target = ensureFallbackCategory();
          target.items.push({ ...item, categoryId: target.id, category: target.name });
        });
      });

      extras.forEach(x => {
        const targetId = x.categoryId || "";
        let target = REMOTE_MENU.find(c => c.id === targetId);
        if (!target) {
          const byName = REMOTE_MENU.find(c => String(c.name).trim().toLowerCase() === String(x.category || "").trim().toLowerCase());
          target = byName || ensureFallbackCategory();
        }
        target.items.push({ ...x, categoryId: target.id, category: target.name });
      });

      const offersSnap = await fsMod.getDocs(fsMod.collection(db, "offers"));
      REMOTE_OFFERS = [];
      offersSnap.forEach(d => {
        const x = d.data();
        if (x.deleted !== true && x.active === true) REMOTE_OFFERS.push(x);
      });

      /*
       * Firebase can return category documents while the menu item
       * documents are temporarily missing/incompatible. The old behavior
       * then replaced the working bundled menu with empty categories.
       * Only accept remote menu data when it contains actual items.
       */
      const remoteItemCount = REMOTE_MENU.reduce(
        (sum, cat) => sum + (Array.isArray(cat.items) ? cat.items.length : 0),
        0
      );
      if (remoteItemCount === 0 && typeof MENU_DATA !== "undefined") {
        REMOTE_MENU = null;
        console.info("TYT Firebase returned no usable menu items; keeping bundled menu data.");
      }
    } catch (e) {
      REMOTE_MENU = null;
      console.info("TYT Firebase data unavailable; using bundled data.", e);
    }
  }

  function startLiveMenuSync() {
    if (_liveSyncStarted) return;
    _liveSyncStarted = true;
    getFirebaseDb().then(({ db, fsMod }) => {
      let debounceTimer = null;
      const scheduleReload = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadRemoteData().then(() => {
            if (REMOTE_MENU && REMOTE_MENU.some(cat => Array.isArray(cat.items) && cat.items.length > 0)) {
              const changed = menuChanged(REMOTE_MENU);
              menuSource = REMOTE_MENU;
              if (menuContainer && changed) {
                renderTabs();
                renderMenu();
                filterMenu(menuSearch ? menuSearch.value : "", { keepPlace: true });
                prefetchMenuImages();
              }
            }
            renderOffers();
          });
        }, 300);
      };
      fsMod.onSnapshot(fsMod.collection(db, "menu"), scheduleReload, () => {});
      fsMod.onSnapshot(fsMod.collection(db, "menuCategories"), scheduleReload, () => {});
      fsMod.onSnapshot(fsMod.collection(db, "offers"), scheduleReload, () => {});
    }).catch(() => {});
  }

  function tt(key, fallback) {
    return window.TYT_I18N ? window.TYT_I18N.t(key) : fallback;
  }

  /* Small line-icon set, one per menu category "icon" key in menu-data.js. */
  const MENU_ICONS = {
    all: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    coffee: '<path d="M3 8h13v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2"/><path d="M7.5 2.8c-.6 1 .5 1.4-.1 2.4M11.5 2.8c-.6 1 .5 1.4-.1 2.4"/>',
    iced: '<path d="M6 4h12l-1.2 15.2A2 2 0 0 1 14.8 21H9.2a2 2 0 0 1-2-1.8L6 4Z"/><path d="M6.6 9.2h10.8"/><path d="M14.5 2.2 13.8 6"/>',
    bean: '<path d="M12 3.2C7 3.2 4.2 8 4.2 12.8s2.8 8 7.8 8 7.8-3.9 7.8-8-2.8-9.6-7.8-9.6Z"/><path d="M12 5.4c2.8 2.6 2.8 9.6 0 15"/>',
    tea: '<path d="M3 8h13v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z"/><path d="M16 9h2a2 2 0 1 1 0 4h-2"/><rect x="9" y="2" width="3" height="3" rx="0.6"/>',
    citrus: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7"/>',
    smoothie: '<path d="M7.2 4h9.6l-1.1 14.4a2 2 0 0 1-2 1.8h-3.4a2 2 0 0 1-2-1.8L7.2 4Z"/><path d="M6.2 4h11.6"/><path d="M15.5 2 16.5 6"/>',
    shake: '<path d="M8 6h8l-1.1 13.2A2 2 0 0 1 12.9 21h-1.8a2 2 0 0 1-2-1.8L8 6Z"/><path d="M7 6h10"/><path d="M13 2v4"/><path d="M13 2c1.3 0 2.2.7 2.2 1.6"/>',
    frappe: '<path d="M8 5h8l-1 14.2a2 2 0 0 1-2 1.8h-2a2 2 0 0 1-2-1.8L8 5Z"/><path d="M7 5h10"/><path d="M16 3l1.4 3.8"/><path d="M10.2 9.4h3.6M10.2 13.2h3.6"/>',
    soda: '<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M7 8.5h10M7 15h10"/>',
    croissant: '<path d="M3 15c3-9 8-11 12-9 3 1.5 4.5 5 3 8-1 2-3 3-5 2.5"/><path d="M6 13c2-4 5-5 7-4"/>',
    dessert: '<path d="M4 20h16"/><path d="M6 20v-6a6 6 0 0 1 12 0v6"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.1"/>',
    extra: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'
  };
  const ICON_ALIASES = { food: "croissant", "hot-drink": "coffee", "cold-drink": "iced", other: "extra" };
  function iconSvg(key) {
    const resolvedKey = MENU_ICONS[key] ? key : (ICON_ALIASES[key] || "extra");
    const paths = MENU_ICONS[resolvedKey] || MENU_ICONS.extra;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  /* Favorites: per-visitor, localStorage only. */
  const FAV_STORAGE_KEY = "tyt_favorites";
  const HEART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.7-4.35-9.3-8.28C1.02 10.2 1.6 6.9 4.2 5.3c2.2-1.35 4.9-.75 6.3 1.15L12 8.1l1.5-1.65c1.4-1.9 4.1-2.5 6.3-1.15 2.6 1.6 3.18 4.9 1.5 7.42C18.7 16.65 12 21 12 21Z"/></svg>';

  function loadFavorites() {
    try {
      const raw = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch (err) {
      return new Set();
    }
  }
  function saveFavorites() {
    try { localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(Array.from(favorites))); } catch (err) { /* no-op */ }
  }
  const favorites = loadFavorites();
  function isFavorite(key) { return !!key && favorites.has(key); }
  function favKeyFor(cat, item) { return `menu:${cat.id}:${item.name}`; }

  function favButtonHtml(key) {
    const active = isFavorite(key);
    const label = active ? tt("menu.favRemove", "Remove from favorites") : tt("menu.favAdd", "Add to favorites");
    return `<span class="menu-item-fav${active ? " is-fav" : ""}" role="button" tabindex="0" data-fav-key="${esc(key)}" aria-pressed="${active}" aria-label="${esc(label)}">${HEART_SVG}</span>`;
  }
  function setFavoriteState(favEl, active) {
    favEl.classList.toggle("is-fav", active);
    favEl.setAttribute("aria-pressed", String(active));
    favEl.setAttribute("aria-label", active ? tt("menu.favRemove", "Remove from favorites") : tt("menu.favAdd", "Add to favorites"));
    const itemEl = favEl.closest(".menu-item");
    if (itemEl) itemEl.classList.toggle("is-fav", active);
  }
  function toggleFavorite(favEl) {
    const key = favEl.dataset.favKey;
    if (!key) return;
    const active = !favorites.has(key);
    if (active) favorites.add(key); else favorites.delete(key);
    saveFavorites();
    setFavoriteState(favEl, active);
    if (activeCategory === "favorites") filterMenu(menuSearch.value, { keepPlace: true });
  }

  function esc(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  /* Search-friendly text: lowercases and folds Arabic hamza variants
     (أ/إ/آ/ء/ؤ/ئ) onto their base letters, so searching "احمد" still
     finds "أحمد" without the person needing to type the hamza. Used for
     both the stored item text and whatever the person types. */
  function searchNormalize(str) {
    return String(str ?? "")
      .toLowerCase()
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ء/g, "");
  }

  const BADGE_LABELS = { "new": "New", "best-seller": "⭐ Best Seller", "popular": "Popular" };
  function badgeHtml(item) {
    const key = String(item.badge || "none").trim().toLowerCase();
    const label = (window.TYT_I18N && window.TYT_I18N.translateBadgeLabel(key)) || BADGE_LABELS[key];
    if (!label) return "";
    return `<span class="menu-item-badge menu-item-badge--${key}">${label}</span>`;
  }

  function renderTabs() {
    menuTabs.innerHTML = "";
    const all = document.createElement("button");
    all.className = "menu-tab active";
    all.type = "button";
    all.innerHTML = `${iconSvg("all")}<span>${tt("menu.all", "All")}</span>`;
    all.dataset.target = "all";
    all.setAttribute("role", "tab");
    all.setAttribute("aria-selected", "true");
    menuTabs.appendChild(all);

    const favTab = document.createElement("button");
    favTab.className = "menu-tab menu-tab--fav";
    favTab.type = "button";
    favTab.innerHTML = `${HEART_SVG}<span>${tt("menu.favorites", "Favorites")}</span>`;
    favTab.dataset.target = "favorites";
    favTab.setAttribute("role", "tab");
    favTab.setAttribute("aria-selected", "false");
    menuTabs.appendChild(favTab);

    menuSource.forEach((cat) => {
      const catL10n = window.TYT_I18N ? window.TYT_I18N.translateCategory(cat) : cat;
      const tab = document.createElement("button");
      tab.className = "menu-tab";
      tab.type = "button";
      tab.innerHTML = `${iconSvg(cat.icon)}<span>${catL10n.name}</span>`;
      tab.dataset.target = cat.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", "false");
      menuTabs.appendChild(tab);
    });

    const stillExists = activeCategory === "all" || activeCategory === "favorites" || menuSource.some((c) => c.id === activeCategory);
    const targetTarget = stillExists ? activeCategory : "all";
    menuTabs.querySelectorAll(".menu-tab").forEach((t) => {
      const isActive = t.dataset.target === targetTarget;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });
    activeCategory = targetTarget;
  }

  function selectCategory(targetId) {
    if (!menuTabs) return;
    const btn = menuTabs.querySelector(`.menu-tab[data-target="${targetId}"]`);
    menuTabs.querySelectorAll(".menu-tab").forEach((t) => {
      const isActive = t.dataset.target === targetId;
      t.classList.toggle("active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });
    activeCategory = targetId;
    if (btn) btn.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });

    animateMenuFilterSwitch(() => filterMenu(menuSearch.value));
  }

  let menuTabsDragging = false;
  let menuTabsListenerBound = false;
  function bindMenuTabsListener() {
    if (menuTabsListenerBound || !menuTabs) return;
    menuTabsListenerBound = true;
    menuTabs.addEventListener("click", (e) => {
      if (menuTabsDragging) {
        e.preventDefault();
        e.stopPropagation();
        menuTabsDragging = false;
        return;
      }
      const btn = e.target.closest(".menu-tab");
      if (!btn) return;
      selectCategory(btn.dataset.target);
    });
  }

  let menuTabsDragScrollListenerBound = false;
  function bindMenuTabsDragScrollListener() {
    if (menuTabsDragScrollListenerBound || !menuTabs) return;
    menuTabsDragScrollListenerBound = true;

    const DRAG_MOVE_THRESHOLD = 6;
    let pointerDown = false;
    let activePointerId = null;
    let startX = 0;
    let startScrollLeft = 0;

    menuTabs.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pointerDown = true;
      menuTabsDragging = false;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startScrollLeft = menuTabs.scrollLeft;
    });

    menuTabs.addEventListener("pointermove", (e) => {
      if (!pointerDown || e.pointerId !== activePointerId) return;
      const dx = e.clientX - startX;
      if (!menuTabsDragging) {
        if (Math.abs(dx) <= DRAG_MOVE_THRESHOLD) return;
        menuTabsDragging = true;
        menuTabs.classList.add("dragging");
        try { menuTabs.setPointerCapture(activePointerId); } catch (err) { /* no-op */ }
      }
      e.preventDefault();
      menuTabs.scrollLeft = startScrollLeft - dx;
    });

    const endDrag = (e) => {
      if (!pointerDown || (e && e.pointerId !== undefined && e.pointerId !== activePointerId)) return;
      pointerDown = false;
      if (menuTabsDragging) {
        menuTabs.classList.remove("dragging");
        try { menuTabs.releasePointerCapture(activePointerId); } catch (err) { /* no-op */ }
      }
      activePointerId = null;
    };
    menuTabs.addEventListener("pointerup", endDrag);
    menuTabs.addEventListener("pointercancel", endDrag);
  }

  /* No description text for the Soft Drink category and for Red Bull items
     (they show only name + price, with no filler line either). */
  function hidesDescription(cat, item) {
    const catKey = String(cat.id || "");
    const catName = String(cat.__baseCategoryName || cat.name || "");
    if (catKey === "canned-soft-drinks" || /^soft\s*drink/i.test(catName.trim())) return true;
    const name = String(item.__baseName || item.name || "");
    return /red\s*bull|soft\s*drink|ريد\s*بول|سوفت\s*درينك/i.test(name);
  }

  /* Price with its currency next to the number ("55" → "55 EGP" / "55 جنيه").
     If the price already carries letters (e.g. "55 EGP") it's left alone. */
  function priceText(price) {
    const str = String(price ?? "").trim();
    if (!str) return "";
    if (/[A-Za-z\u0600-\u06FF]/.test(str)) return str;
    return str + " " + tt("menu.currency", "EGP");
  }

  /* First pictures load immediately (top priority for the first few); the
     rest stay lazy and are pre-fetched in the background (prefetchMenuImages). */
  let _menuImgIndex = 0;
  function menuImgAttrs() {
    const n = _menuImgIndex++;
    if (n < 4)  return 'loading="eager" fetchpriority="high" decoding="async"';
    if (n < 12) return 'loading="eager" decoding="async"';
    return 'loading="lazy" decoding="async"';
  }

  /* Background pre-fetch: after the page has loaded, quietly download every
     menu picture (4 at a time, in menu order) so swiping never waits on the
     network. Skipped on Data-Saver / 2G connections. */
  const _prefetchedImgs = new Set();
  function prefetchMenuImages() {
    const conn = navigator.connection || {};
    if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")) return;
    const urls = [];
    (menuSource || []).forEach((cat) => (cat.items || []).forEach((it) => {
      if (it.image && !/^data:/.test(it.image) && !_prefetchedImgs.has(it.image)) {
        _prefetchedImgs.add(it.image);
        urls.push(it.image);
      }
    }));
    if (!urls.length) return;
    let i = 0, active = 0;
    const MAX = 4;
    const pump = () => {
      while (active < MAX && i < urls.length) {
        const im = new Image();
        im.decoding = "async";
        active++;
        im.onload = im.onerror = () => { active--; pump(); };
        im.src = urls[i++];
      }
    };
    const start = () => (window.requestIdleCallback ? window.requestIdleCallback(pump, { timeout: 1200 }) : window.setTimeout(pump, 200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }

  /* Firebase often returns exactly the bundled menu. Comparing first lets us
     skip a full re-render, which used to throw away every <img> and reload it. */
  function menuSig(src) {
    try { return JSON.stringify(src, (k, v) => (typeof k === "string" && k.indexOf("__") === 0 ? undefined : v)); }
    catch (e) { return null; }
  }
  let _renderedSig = null;
  function menuChanged(src) {
    const s = menuSig(src);
    return s === null || s !== _renderedSig;
  }

  function renderMenu() {
    menuContainer.innerHTML = "";
    _menuImgIndex = 0;
    _renderedSig = menuSig(menuSource);
    menuSource.forEach((cat, catIndex) => {
      const catL10n = window.TYT_I18N ? window.TYT_I18N.translateCategory(cat) : cat;
      const countLabel = window.TYT_I18N
        ? window.TYT_I18N.itemCountLabel(cat.items.length)
        : `${cat.items.length} ${cat.items.length === 1 ? "item" : "items"}`;

      const section = document.createElement("div");
      section.className = "menu-category";
      section.id = `cat-${cat.id}`;
      section.dataset.categoryId = cat.id;
      section.setAttribute("data-reveal", "");

      section.innerHTML = `
        <div class="menu-category-head">
          <span class="menu-category-num" aria-hidden="true">${String(catIndex + 1).padStart(2, "0")}</span>
          <span class="menu-category-icon" aria-hidden="true">${iconSvg(cat.icon)}</span>
          <div class="menu-category-heading">
            <h3>${catL10n.name}</h3>
            ${catL10n.description ? `<p class="menu-category-note">${catL10n.description}</p>` : ""}
          </div>
          <span class="count">${countLabel}</span>
        </div>
        <div class="menu-row-wrap">
          <span class="menu-row-arrows" dir="ltr">
            <button type="button" class="menu-row-arrow" data-row-dir="-1" aria-label="${esc(tt("menu.prevPage", "Previous"))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <button type="button" class="menu-row-arrow" data-row-dir="1" aria-label="${esc(tt("menu.nextPage", "Next"))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
          </span>
        <div class="menu-list">
          ${cat.items
            .map((item) => {
              const itemL10n = window.TYT_I18N ? window.TYT_I18N.translateItem(cat.id, item) : item;
              const favKey = favKeyFor(cat, item);
              const noDesc = hidesDescription(cat, item);
              const descText = noDesc ? "" : (itemL10n.description || tt("modal.defaultDesc", "A TYT favorite, made fresh to order."));
              return `
            <button type="button" class="menu-item${isFavorite(favKey) ? " is-fav" : ""}"
              aria-label="${esc(itemL10n.name)}" title="${esc(itemL10n.name)}"
              data-name="${esc(searchNormalize(itemL10n.name))}"
              data-desc="${esc(searchNormalize(itemL10n.description || ""))}"
              data-item-name="${esc(itemL10n.name)}"
              data-item-desc="${esc(noDesc ? "" : (itemL10n.description || ""))}"
              data-item-price="${esc(priceText(item.price))}"
              data-item-category="${esc(catL10n.name)}"
              data-item-icon="${esc(cat.icon)}"
              data-item-image="${esc(item.image || "")}">
              <span class="menu-item-media">
                <span class="menu-item-icon">${item.image ? `<img src="${esc(item.image)}" alt="" ${menuImgAttrs()} draggable="false">` : iconSvg(cat.icon)}</span>
                ${badgeHtml(item)}
                <span class="menu-item-reveal" aria-hidden="true">
                  ${favButtonHtml(favKey)}
                  <span class="mir-cat">${catL10n.name}</span>
                  <span class="mir-name">${itemL10n.name}</span>
                  ${descText ? `<span class="mir-desc">${descText}</span>` : ""}
                  <span class="mir-price">${priceText(item.price)}</span>
                </span>
              </span>
              <span class="menu-item-body">
                <span class="menu-item-name">${itemL10n.name}</span>
                <span class="menu-item-foot">
                  <span class="menu-item-price">${priceText(item.price)}</span>
                </span>
              </span>
            </button>`;
            })
            .join("")}
        </div>
        </div>
      `;
      menuContainer.appendChild(section);
      revealObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------------------
     MENU ITEM QUICK VIEW MODAL
  --------------------------------------------------------------------- */
  const itemModalOverlay = document.getElementById("itemModalOverlay");
  const itemModalClose = document.getElementById("itemModalClose");
  const itemModalIcon = document.getElementById("itemModalIcon");
  const itemModalCategory = document.getElementById("itemModalCategory");
  const itemModalName = document.getElementById("itemModalName");
  const itemModalDesc = document.getElementById("itemModalDesc");
  const itemModalPrice = document.getElementById("itemModalPrice");
  const itemModalFav = document.getElementById("itemModalFav");
  let modalFavSource = null;
  let lastFocusedEl = null;

  function syncModalFav() {
    if (!itemModalFav) return;
    if (!modalFavSource) { itemModalFav.hidden = true; return; }
    const active = modalFavSource.classList.contains("is-fav");
    itemModalFav.hidden = false;
    itemModalFav.classList.toggle("is-fav", active);
    itemModalFav.setAttribute("aria-pressed", String(active));
    itemModalFav.setAttribute("aria-label", active ? tt("menu.favRemove", "Remove from favorites") : tt("menu.favAdd", "Add to favorites"));
  }
  if (itemModalFav) {
    itemModalFav.innerHTML = HEART_SVG;
    itemModalFav.addEventListener("click", () => {
      if (!modalFavSource) return;
      toggleFavorite(modalFavSource);
      syncModalFav();
    });
  }

  function openItemModal(btn) {
    const d = btn.dataset;
    itemModalIcon.innerHTML = d.itemImage ? `<img src="${d.itemImage}" alt="" draggable="false">` : iconSvg(d.itemIcon);
    itemModalCategory.textContent = d.itemCategory || "";
    itemModalName.textContent = d.itemName || "";
    itemModalDesc.textContent = d.itemDesc || tt("modal.defaultDesc", "A TYT favorite, made fresh to order.");
    itemModalPrice.textContent = d.itemPrice || "";
    modalFavSource = btn.querySelector(".menu-item-fav");
    syncModalFav();
    lastFocusedEl = btn;
    itemModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    itemModalClose.focus();
  }
  function closeItemModal() {
    itemModalOverlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus({ preventScroll: true });
  }

  if (menuContainer) {
    menuContainer.addEventListener("dragstart", (e) => e.preventDefault());
    menuContainer.addEventListener("contextmenu", (e) => { if (e.target.closest(".menu-item-media")) e.preventDefault(); });
    menuContainer.addEventListener("click", (e) => {
      const favEl = e.target.closest(".menu-item-fav");
      if (favEl) {
        e.stopPropagation();
        toggleFavorite(favEl);
        return;
      }
      const btn = e.target.closest(".menu-item");
      if (btn) toggleReveal(btn);
    });
    menuContainer.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("menu-item-fav")) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(e.target);
      }
    });
  }
  /* Tap a picture → its name, description, price and heart appear ON that
     picture (animated). The strip stays exactly where it is. Tap again /
     tap elsewhere / Esc closes it. */
  function closeReveals(except) {
    if (!menuContainer) return;
    menuContainer.querySelectorAll(".menu-item.is-open").forEach((el) => {
      if (el === except) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-expanded", "false");
      const rv = el.querySelector(".menu-item-reveal");
      if (rv) rv.setAttribute("aria-hidden", "true");
    });
  }
  function toggleReveal(btn) {
    const open = !btn.classList.contains("is-open");
    closeReveals(open ? btn : null);
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    const rv = btn.querySelector(".menu-item-reveal");
    if (rv) rv.setAttribute("aria-hidden", String(!open));
    scheduleScrollFx();
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu-item")) closeReveals(null);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeReveals(null); });

  if (itemModalClose) itemModalClose.addEventListener("click", closeItemModal);
  if (itemModalOverlay) {
    itemModalOverlay.addEventListener("click", (e) => {
      if (e.target === itemModalOverlay) closeItemModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && itemModalOverlay && itemModalOverlay.classList.contains("open")) {
      closeItemModal();
    }
  });

  /* ---------------------------------------------------------------------
     FILTER SWITCH ANIMATION + FILTER LOGIC
  --------------------------------------------------------------------- */
  function animateMenuFilterSwitch(applyFn) {
    if (!menuContainer || prefersReducedMotion) { applyFn(); return; }

    const currentlyVisible = Array.from(menuContainer.querySelectorAll(".menu-item"))
      .filter((el) => el.style.display !== "none");
    if (!currentlyVisible.length) { applyFn(); return; }

    currentlyVisible.forEach((el) => el.classList.add("menu-item-filter-out"));
    window.setTimeout(() => {
      applyFn();
      currentlyVisible.forEach((el) => el.classList.remove("menu-item-filter-out"));
      const newlyVisible = Array.from(menuContainer.querySelectorAll(".menu-item"))
        .filter((el) => el.style.display !== "none");
      newlyVisible.forEach((el, i) => {
        el.classList.add("menu-item-filter-in");
        el.style.animationDelay = Math.min(i, 8) * 12 + "ms";
        el.addEventListener("animationend", function handler() {
          el.classList.remove("menu-item-filter-in");
          el.style.animationDelay = "";
          el.removeEventListener("animationend", handler);
        });
      });
    }, 120);
  }

  /* ---------------------------------------------------------------------
     STRIP
     All the pictures sit one after another in a single horizontal line.
     Swipe (touch), drag (mouse), the side arrows or the left/right keys move
     along it. Each category's heading stays pinned while you're inside it.
  --------------------------------------------------------------------- */
  function isRtlDoc() { return document.documentElement.dir === "rtl"; }

  // Distance scrolled from the LEFT edge, in both directions of writing.
  // (In RTL, browsers report scrollLeft as 0 at the right edge and negative going left.)
  function stripFromLeft() {
    const max = menuContainer.scrollWidth - menuContainer.clientWidth;
    return isRtlDoc() ? max + menuContainer.scrollLeft : menuContainer.scrollLeft;
  }

  let stripTicking = false;
  function updateStripUi() {
    if (!menuPager || !menuContainer) return;
    const max = menuContainer.scrollWidth - menuContainer.clientWidth;
    const rtl = isRtlDoc();
    const canScroll = max > 2 && !isRowsMode();
    menuPager.classList.toggle("is-single", !canScroll);

    // The LEFT arrow always sits on the left: it goes back in English (LTR) and forward in Arabic (RTL).
    const fromLeft = stripFromLeft();
    menuArrowLeft.disabled = fromLeft <= 2;
    menuArrowRight.disabled = fromLeft >= max - 2;
    const prevLabel = tt("menu.prevPage", "Previous");
    const nextLabel = tt("menu.nextPage", "Next");
    menuArrowLeft.setAttribute("aria-label", rtl ? nextLabel : prevLabel);
    menuArrowRight.setAttribute("aria-label", rtl ? prevLabel : nextLabel);

    // Thin progress line under the strip: where you are along the whole menu.
    if (menuPagerStatus) {
      let thumb = menuPagerStatus.firstElementChild && menuPagerStatus.firstElementChild.firstElementChild;
      if (!thumb) {
        menuPagerStatus.innerHTML = '<span class="menu-strip-track"><span class="menu-strip-thumb"></span></span>';
        thumb = menuPagerStatus.firstElementChild.firstElementChild;
      }
      const total = menuContainer.scrollWidth || 1;
      thumb.style.width = Math.min(100, (menuContainer.clientWidth / total) * 100) + "%";
      thumb.style.left = Math.max(0, Math.min(100, (fromLeft / total) * 100)) + "%";
    }
  }
  function scheduleStripUi() {
    if (stripTicking) return;
    stripTicking = true;
    window.requestAnimationFrame(() => { stripTicking = false; updateStripUi(); });
  }

  // dir: -1 = towards the LEFT side of the screen, +1 = towards the RIGHT side.
  function scrollStrip(dir) {
    if (!menuContainer) return;
    const amount = Math.max(160, menuContainer.clientWidth * 0.8);
    menuContainer.scrollBy({ left: dir * amount, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  // Centre the side arrows on the row of pictures (the heading above it can vary in height).
  function syncArrowY() {
    if (!menuStage || !menuContainer) return;
    const stageRect = menuStage.getBoundingClientRect();
    if (!stageRect.height) return; // Menu page not open yet — the ResizeObserver re-runs this when it opens.
    const first = Array.from(menuContainer.querySelectorAll(".menu-item")).find((el) => el.style.display !== "none");
    const media = first ? first.querySelector(".menu-item-media") : null;
    if (!media || !media.offsetHeight) return;
    // (cards can be mid-entrance-animation, so use layout offsets rather than their on-screen box)
    const listEl = first.parentElement;
    const listTop = listEl.getBoundingClientRect().top + listEl.clientTop + (parseFloat(getComputedStyle(listEl).paddingTop) || 0);
    const y = listTop - stageRect.top + media.offsetTop + media.offsetHeight / 2;
    menuStage.style.setProperty("--arrow-y", y + "px");
  }

  /* ROWS MODE: in "All" (and "Favorites") every category gets its own
     horizontal line, stacked one under another, each swiping on its own.
     Picking a single category goes back to the one-line strip. */
  function isRowsMode() { return activeCategory === "all" || activeCategory === "favorites"; }

  function syncRowArrows(listEl) {
    const catEl = listEl.closest(".menu-category");
    if (!catEl) return;
    const arrows = catEl.querySelector(".menu-row-arrows");
    if (!arrows) return;
    const max = listEl.scrollWidth - listEl.clientWidth;
    arrows.hidden = max <= 2;
    if (max <= 2) return;
    const fromLeft = isRtlDoc() ? max + listEl.scrollLeft : listEl.scrollLeft;
    const btns = arrows.querySelectorAll(".menu-row-arrow");
    btns[0].disabled = fromLeft <= 2;
    btns[1].disabled = fromLeft >= max - 2;
  }
  function syncAllRowArrows() {
    if (!menuContainer || !menuContainer.classList.contains("is-rows")) return;
    menuContainer.querySelectorAll(".menu-category .menu-list").forEach(syncRowArrows);
  }

  /* SCROLL FX: while you flip through the pictures, the ones in the middle
     of the line stay full-size and the ones near the edges shrink, fade and
     sink a little — a smooth "wave" that follows your swipe/drag/arrows. */
  let fxTicking = false;
  function fxApplyTo(boxEl, itemsRoot) {
    const box = boxEl.getBoundingClientRect();
    if (!box.width || box.bottom < 0 || box.top > window.innerHeight) return;
    const half = box.width / 2;
    const cx = box.left + half;
    itemsRoot.querySelectorAll(".menu-item").forEach((item) => {
      if (item.style.display === "none") return;
      const r = item.getBoundingClientRect();
      if (!r.width) return;
      const d = Math.min(1.4, Math.abs((r.left + r.width / 2 - cx) / half));
      const a = Math.min(1, d);
      const media = item.firstElementChild;
      if (!media) return;
      const open = item.classList.contains("is-open");
      media.style.setProperty("--fx-s", open ? "1" : (1 - 0.14 * a * a).toFixed(3));
      media.style.setProperty("--fx-o", open ? "1" : (1 - 0.5 * a * a).toFixed(3));
      media.style.setProperty("--fx-y", open ? "0px" : (10 * a * a).toFixed(1) + "px");
    });
  }
  function applyScrollFx() {
    if (!menuContainer || prefersReducedMotion) return;
    if (menuContainer.classList.contains("is-rows")) {
      menuContainer.querySelectorAll(".menu-category").forEach((catEl) => {
        if (catEl.style.display === "none") return;
        const list = catEl.querySelector(".menu-list");
        if (list) fxApplyTo(list, list);
      });
    } else {
      fxApplyTo(menuContainer, menuContainer);
    }
  }
  function scheduleScrollFx() {
    if (fxTicking) return;
    fxTicking = true;
    window.requestAnimationFrame(() => { fxTicking = false; applyScrollFx(); });
  }

  let menuStripListenersBound = false;
  let suppressNextClick = false;
  function bindMenuStripListeners() {
    if (menuStripListenersBound || !menuPager || !menuContainer) return;
    menuStripListenersBound = true;

    menuArrowLeft.addEventListener("click", () => scrollStrip(-1));
    menuArrowRight.addEventListener("click", () => scrollStrip(1));
    menuContainer.addEventListener("scroll", () => { scheduleStripUi(); scheduleScrollFx(); }, { passive: true });

    // Mouse: click-and-drag the strip (touch already scrolls natively).
    const DRAG_THRESHOLD = 6;
    let down = false, dragging = false, pid = null, startX = 0, startScroll = 0;
    menuContainer.addEventListener("pointerdown", (e) => {
      if (isRowsMode()) return;
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; dragging = false; pid = e.pointerId;
      startX = e.clientX; startScroll = menuContainer.scrollLeft;
    });
    menuContainer.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== pid) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) <= DRAG_THRESHOLD) return;
        dragging = true;
        menuContainer.classList.add("dragging");
        try { menuContainer.setPointerCapture(pid); } catch (err) { /* no-op */ }
      }
      e.preventDefault();
      menuContainer.scrollLeft = startScroll - dx;
    });
    const endDrag = (e) => {
      if (!down || (e && e.pointerId !== undefined && e.pointerId !== pid)) return;
      down = false;
      if (dragging) {
        menuContainer.classList.remove("dragging");
        try { menuContainer.releasePointerCapture(pid); } catch (err) { /* no-op */ }
        // A drag must not also "click" the picture under the mouse.
        suppressNextClick = true;
        window.setTimeout(() => { suppressNextClick = false; }, 300);
      }
      dragging = false; pid = null;
    };
    menuContainer.addEventListener("pointerup", endDrag);
    menuContainer.addEventListener("pointercancel", endDrag);
    menuContainer.addEventListener("click", (e) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    // Left/Right arrow keys move along the strip while the Menu page is open.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (itemModalOverlay && itemModalOverlay.classList.contains("open")) return;
      if (isRowsMode()) return;
      const menuSec = document.getElementById("menu");
      if (!menuSec || !menuSec.classList.contains("is-active")) return;
      e.preventDefault(); // otherwise the browser's own 40px key-scroll cancels the smooth scroll
      scrollStrip(e.key === "ArrowRight" ? 1 : -1);
    });

    // ---- Rows mode: per-row arrows, mouse-drag and scroll state ----
    menuContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-row-arrow");
      if (!btn) return;
      e.stopPropagation();
      const listEl = btn.closest(".menu-category").querySelector(".menu-list");
      const amount = Math.max(160, listEl.clientWidth * 0.8);
      listEl.scrollBy({ left: Number(btn.dataset.rowDir) * amount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    menuContainer.addEventListener("scroll", (e) => {
      if (e.target !== menuContainer && e.target.classList && e.target.classList.contains("menu-list")) { syncRowArrows(e.target); scheduleScrollFx(); }
    }, { passive: true, capture: true });

    let rDown = false, rDragging = false, rPid = null, rStartX = 0, rStartScroll = 0, rList = null;
    menuContainer.addEventListener("pointerdown", (e) => {
      if (!isRowsMode() || e.pointerType !== "mouse" || e.button !== 0) return;
      const list = e.target.closest(".menu-list");
      if (!list) return;
      rDown = true; rDragging = false; rPid = e.pointerId; rList = list;
      rStartX = e.clientX; rStartScroll = list.scrollLeft;
    });
    menuContainer.addEventListener("pointermove", (e) => {
      if (!rDown || e.pointerId !== rPid) return;
      const dx = e.clientX - rStartX;
      if (!rDragging) {
        if (Math.abs(dx) <= DRAG_THRESHOLD) return;
        rDragging = true;
        rList.classList.add("dragging");
        try { rList.setPointerCapture(rPid); } catch (err) { /* no-op */ }
      }
      e.preventDefault();
      rList.scrollLeft = rStartScroll - dx;
    });
    const endRowDrag = (e) => {
      if (!rDown || (e && e.pointerId !== undefined && e.pointerId !== rPid)) return;
      rDown = false;
      if (rDragging) {
        rList.classList.remove("dragging");
        try { rList.releasePointerCapture(rPid); } catch (err) { /* no-op */ }
        suppressNextClick = true;
        window.setTimeout(() => { suppressNextClick = false; }, 300);
      }
      rDragging = false; rPid = null; rList = null;
    };
    menuContainer.addEventListener("pointerup", endRowDrag);
    menuContainer.addEventListener("pointercancel", endRowDrag);

    // Runs when the Menu page is first shown (it starts hidden) and whenever the size changes.
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => { syncArrowY(); updateStripUi(); syncAllRowArrows(); scheduleScrollFx(); }).observe(menuStage);
    }
    window.addEventListener("resize", () => { scheduleStripUi(); syncAllRowArrows(); scheduleScrollFx(); });
    window.addEventListener("scroll", scheduleScrollFx, { passive: true });
  }

  function filterMenu(query, opts) {
    if (!(opts && opts.keepPlace)) closeReveals(null);
    const q = searchNormalize(query.trim());
    const favMode = activeCategory === "favorites";
    let visibleCount = 0;

    document.querySelectorAll(".menu-category").forEach((catEl) => {
      const catMatches = favMode || activeCategory === "all" || catEl.dataset.categoryId === activeCategory;
      let catVisible = 0;
      catEl.querySelectorAll(".menu-item").forEach((item) => {
        const searchMatch = !q || item.dataset.name.includes(q);
        const favMatch = !favMode || item.classList.contains("is-fav");
        const show = catMatches && searchMatch && favMatch;
        item.style.display = show ? "" : "none";
        if (show) { catVisible++; visibleCount++; }
      });
      catEl.style.display = catVisible ? "" : "none";
    });

    // "All"/"Favorites": one line per category. A single category: one strip.
    if (menuContainer) {
      menuContainer.classList.toggle("is-rows", isRowsMode());
      if (!(opts && opts.keepPlace)) {
        menuContainer.querySelectorAll(".menu-list").forEach((l) => {
          const b = l.style.scrollBehavior;
          l.style.scrollBehavior = "auto";
          l.scrollLeft = 0;
          l.style.scrollBehavior = b;
        });
      }
    }

    // A new category / search starts from the beginning of the line; a background refresh keeps your place.
    if (!(opts && opts.keepPlace) && menuContainer) {
      const smooth = menuContainer.style.scrollBehavior;
      menuContainer.style.scrollBehavior = "auto";
      menuContainer.scrollLeft = 0;
      menuContainer.style.scrollBehavior = smooth;
    }
    syncArrowY();
    updateStripUi();
    syncAllRowArrows();
    scheduleScrollFx();

    if (menuEmpty) {
      menuEmpty.textContent = favMode
        ? tt("menu.favEmpty", "You haven't added any favorites yet — tap the heart on any item to save it here.")
        : tt("menu.empty", "No drinks or bites match your search — try a different word.");
      menuEmpty.classList.toggle("show", visibleCount === 0);
    }
  }

  /* ---------------------------------------------------------------------
     OFFERS: render cards from bundled OFFERS_DATA. The Offers section
     always stays visible — when there is no offer configured it shows an
     elegant "no offer" placeholder card instead of being hidden.
  --------------------------------------------------------------------- */
  const offersGrid = document.getElementById("offersGrid");
  const offersNote = document.getElementById("offersNote");
  const OFFER_TYPE_ICON = { food: "🍽️", dessert: "🍰", "hot-drink": "☕", "cold-drink": "🥤" };

  function renderOffers() {
    if (!offersGrid) return;
    // Offers are managed from the Admin Panel; they exist publicly only
    // when an active offer is saved in Firebase (mirrors the main site).
    const offersSource = Array.isArray(REMOTE_OFFERS) ? REMOTE_OFFERS : [];

    if (!offersSource.length) {
      const emptyTitle = tt("offers.emptyTitle", "No Offers Right Now");
      const emptyText = tt("offers.emptyText", "We don't have any active promotions at the moment — check back soon for new deals.");
      offersGrid.innerHTML = `
        <div class="offers-empty" data-reveal>
          <span class="offers-empty-icon">☕</span>
          <h3>${emptyTitle}</h3>
          <p>${emptyText}</p>
        </div>`;
      offersGrid.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
      if (offersNote) offersNote.textContent = "";
      return;
    }

    offersGrid.innerHTML = offersSource.map((offer) => {
      const badgeClass = offer.badgeStyle === "limited" ? "offer-badge limited" : "offer-badge";
      const media = offer.image
        ? `<img src="${offer.image}" alt="${esc(offer.name)}" loading="lazy" />`
        : `<span class="offer-icon">${offer.icon || OFFER_TYPE_ICON[offer.offerType] || "☕"}</span>`;
      const discount = offer.discount ? `<span class="offer-discount">${esc(offer.discount)}</span>` : "";
      const oldPrice = offer.oldPrice ? `<span class="offer-price-old">${offer.oldPrice} EGP</span>` : "";
      const mediaTypeClass = offer.offerType ? ` offer-media--${offer.offerType}` : "";
      const ctaText = offer.cta || "Order Now";
      return `
        <article class="offer-card" data-reveal>
          <div class="offer-media${mediaTypeClass}">
            ${media}
            ${offer.badge ? `<span class="${badgeClass}">${esc(offer.badge)}</span>` : ""}
            ${discount}
          </div>
          <div class="offer-body">
            <h3>${esc(offer.name)}</h3>
            <p>${esc(offer.description || "")}</p>
            <div class="offer-price-row">
              <span class="offer-price-new">${offer.newPrice} EGP</span>
              ${oldPrice}
            </div>
          </div>
        </article>`;
    }).join("");

    offersGrid.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
    if (offersNote) offersNote.textContent = tt("offers.note", "Offers shown are current promotions and may change without notice.");
  }

  /* ---------------------------------------------------------------------
     LANGUAGE SWITCH: re-render the dynamically-built menu on language change
  --------------------------------------------------------------------- */
  window.TYT_rerenderMenu = function () {
    if (!menuContainer) return;
    renderTabs();
    renderMenu();
    filterMenu(menuSearch.value, { keepPlace: true });
    renderOffers();
  };

  async function initDataDrivenSections() {
    /* Render local menu immediately so the page never starts blank. */
    if (menuContainer && typeof MENU_DATA !== "undefined") {
      menuSource = MENU_DATA;
      renderTabs();
      bindMenuTabsListener();
      bindMenuTabsDragScrollListener();
      bindMenuStripListeners();
      renderMenu();
      filterMenu(menuSearch ? menuSearch.value : "");
      if (menuSearch) {
        menuSearch.addEventListener("input", (e) => filterMenu(e.target.value));
      }
      prefetchMenuImages();
    }

    await loadRemoteData();

    /* Replace local data only when Firebase supplied a usable menu. */
    if (REMOTE_MENU && REMOTE_MENU.some(cat => Array.isArray(cat.items) && cat.items.length > 0)) {
      const changed = menuChanged(REMOTE_MENU);
      menuSource = REMOTE_MENU;
      if (menuContainer && changed) {
        renderTabs();
        renderMenu();
        filterMenu(menuSearch ? menuSearch.value : "", { keepPlace: true });
        prefetchMenuImages();
      }
    }

    renderOffers();
    startLiveMenuSync();
  }

  initDataDrivenSections();
})();
