/* =========================================================
   BOBA BLISS — main.js
   Shared behaviour across every page.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- storage helpers ---------- */
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch (e) { return fallback; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  };

  /* ---------- theme (dark / light) ---------- */
  function initTheme() {
    const saved = localStorage.getItem("bb-theme");
    if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
      updateThemeIcon(btn);
      btn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
          document.documentElement.removeAttribute("data-theme");
          localStorage.setItem("bb-theme", "light");
        } else {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("bb-theme", "dark");
        }
        document.querySelectorAll("[data-theme-toggle]").forEach(updateThemeIcon);
      });
    });
  }
  function updateThemeIcon(btn) {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☀️" : "🌙";
  }

  /* ---------- RTL toggle ---------- */
  function initRTL() {
    const saved = localStorage.getItem("bb-rtl");
    if (saved === "rtl") document.documentElement.setAttribute("dir", "rtl");
    document.querySelectorAll("#rtl-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const isRTL = document.documentElement.getAttribute("dir") === "rtl";
        if (isRTL) {
          document.documentElement.removeAttribute("dir");
          localStorage.setItem("bb-rtl", "ltr");
        } else {
          document.documentElement.setAttribute("dir", "rtl");
          localStorage.setItem("bb-rtl", "rtl");
        }
      });
    });
  }

  /* ---------- sticky header shadow ---------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  function initDrawer() {
    const drawer = document.querySelector(".mobile-drawer");
    const openBtn = document.querySelector(".nav-toggle");
    if (!drawer || !openBtn) return;
    const close = () => drawer.classList.remove("open");
    openBtn.addEventListener("click", () => drawer.classList.add("open"));
    drawer.querySelector(".backdrop").addEventListener("click", close);
    drawer.querySelector(".close-drawer").addEventListener("click", close);
    drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(i => io.observe(i));
  }

  /* ---------- number counters ---------- */
  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = el.dataset.count.includes(".") ? 1 : 0;
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------- toasts ---------- */
  function toast(msg) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<div class="toast-tick"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div> <div class="toast-msg">${msg}</div>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 350);
    }, 2400);
  }
  window.bbToast = toast;

  /* ---------- cart ---------- */
  const CART_KEY = "bb-cart";
  function getCart() { return store.get(CART_KEY, []); }
  function saveCart(cart) { store.set(CART_KEY, cart); updateCartBadge(); }
  function addToCart(id, name, price, img, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, name, price, img, qty: qty });
    saveCart(cart);
    toast(name + " added to cart");
  }
  function updateCartBadge() {
    const count = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? "flex" : "none";
    });
  }
    window.bbCart = { 
    get: getCart, 
    add: addToCart,
    remove: function(id) {
      let cart = getCart().filter(i => i.id !== id);
      saveCart(cart);
      return cart;
    },
    updateQty: function(id, delta) {
      let cart = getCart();
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty += delta;
        if (existing.qty <= 0) {
          cart = cart.filter(i => i.id !== id);
        }
        saveCart(cart);
      }
      return cart;
    }
  };

  /* ---------- favorites ---------- */
  const FAV_KEY = "bb-favorites";
  function getFavs() { return store.get(FAV_KEY, []); }
  function toggleFav(id) {
    let favs = getFavs();
    if (favs.includes(id)) favs = favs.filter(f => f !== id);
    else favs.push(id);
    store.set(FAV_KEY, favs);
    updateFavBadge();
    return favs.includes(id);
  }
  function updateFavBadge() {
    const count = getFavs().length;
    document.querySelectorAll("[data-fav-count]").forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? "flex" : "none";
    });
  }
  window.bbFavs = { get: getFavs, toggle: toggleFav };
  window.bbRefresh = function () { initProductActions(); initReveal(); };

  /* ---------- heart burst animation ---------- */
  function burstHearts(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.textContent = "♥";
      const size = 10 + Math.random() * 10;
      const angle = (360 / count) * i + Math.random() * 20;
      const dist = 40 + Math.random() * 30;
      const rad = (angle * Math.PI) / 180;
      const tx = Math.cos(rad) * dist;
      const ty = Math.sin(rad) * dist;
      Object.assign(h.style, {
        position: "fixed", left: cx + "px", top: cy + "px",
        transform: "translate(-50%,-50%)", fontSize: size + "px",
        color: "#e74c3c", pointerEvents: "none", zIndex: 9999,
        transition: "none", opacity: "1", userSelect: "none"
      });
      document.body.appendChild(h);
      requestAnimationFrame(() => {
        h.style.transition = "transform 0.7s cubic-bezier(.17,.67,.47,1.3), opacity 0.7s ease";
        h.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
        h.style.opacity = "0";
      });
      setTimeout(() => h.remove(), 750);
    }
    /* ripple ring */
    const ring = document.createElement("span");
    Object.assign(ring.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: "40px", height: "40px", borderRadius: "50%",
      border: "2px solid #e74c3c",
      transform: "translate(-50%,-50%) scale(1)",
      pointerEvents: "none", zIndex: 9998, opacity: "0.8", transition: "none"
    });
    document.body.appendChild(ring);
    requestAnimationFrame(() => {
      ring.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
      ring.style.transform = "translate(-50%,-50%) scale(3)";
      ring.style.opacity = "0";
    });
    setTimeout(() => ring.remove(), 550);
  }

  function initProductActions() {
    document.querySelectorAll(".fav-btn:not([data-bound])").forEach(btn => {
      btn.setAttribute("data-bound", "1");
      const id = btn.dataset.id;
      if (getFavs().includes(id)) btn.classList.add("active");
      btn.addEventListener("click", () => {
        const active = toggleFav(id);
        btn.classList.toggle("active", active);
        if (active) {
          burstHearts(btn);
          btn.classList.add("pop");
          btn.addEventListener("animationend", () => btn.classList.remove("pop"), { once: true });
          if(window.bbToast) window.bbToast("Added to Wishlist ♥");
        } else {
          if(window.bbToast) window.bbToast("Removed from Wishlist");
          if(window.bbRefreshWishlist) window.bbRefreshWishlist();
        }
      });
    });
    document.querySelectorAll(".add-cart-btn:not([data-bound])").forEach(btn => {
      btn.setAttribute("data-bound", "1");
      btn.addEventListener("click", () => {
        addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price), btn.dataset.img);
      });
    });
  }

  /* ---------- testimonial carousel controls ---------- */
  function initTestiControls() {
    const track = document.querySelector(".testi-track");
    const prev = document.querySelector("[data-testi-prev]");
    const next = document.querySelector("[data-testi-next]");
    if (!track || !prev || !next) return;
    const scrollAmt = () => track.querySelector(".testi-card").offsetWidth + 22;
    prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmt(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: scrollAmt(), behavior: "smooth" }));
  }

  /* ---------- newsletter form ---------- */
  function initNewsletter() {
    document.querySelectorAll(".newsletter-form").forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input[type=email]");
        const msg = form.parentElement.querySelector(".form-msg");
        if (!input.value || !input.checkValidity()) {
          if (msg) { msg.style.color = "#C0453A"; msg.textContent = "Please enter a valid email."; }
          return;
        }
        if (msg) { msg.style.color = "var(--matcha)"; msg.textContent = "You're on the list — thanks for subscribing!"; }
        input.value = "";
      });
    });
  }

  /* ---------- contact form validation ---------- */
  function initForms() {
    const forms = document.querySelectorAll("#contact-form, #login-form, #register-form, #checkout-form");
    forms.forEach(form => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll("[required]").forEach(input => {
          const field = input.closest(".field");
          let ok = input.value.trim().length > 0;
          if (input.type === "email") ok = input.checkValidity();
          if (input.type === "password") ok = input.value.trim().length >= 6;
          if (input.type === "tel") ok = /^\d{10}$/.test(input.value.trim());
          
          field.classList.toggle("error", !ok);
          if (!ok) valid = false;
        });
        const successEl = form.querySelector(".form-success");
        if (valid) {
          form.reset();
          if (successEl) successEl.style.display = "block";
          if (form.id === 'contact-form') toast("Message sent - we'll reply within a day.");
          else if (form.id === 'checkout-form') {
            toast("Order placed!");
            store.set("bb-cart", []);
            updateCartBadge();
          }
          else toast("Success!");
        } else if (successEl) {
          successEl.style.display = "none";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initRTL();
    initHeaderScroll();
    initDrawer();
    initReveal();
    initCounters();
    initProductActions();
    initTestiControls();
    initNewsletter();
    initForms();
    updateCartBadge();
    updateFavBadge();

    const year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
