/* Customize page — live selection + dynamic price */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector("[data-customize]");
    if (!root) return;

    const state = {
      base: null,
      size: null,
      sweetness: null,
      ice: null,
      toppings: new Set(),
      qty: 1
    };

    // default single-select groups: pick first option
    root.querySelectorAll("[data-group]").forEach(group => {
      const key = group.dataset.group;
      const multi = group.dataset.multi === "true";
      const cards = group.querySelectorAll(".opt-card");
      cards.forEach((card, idx) => {
        if (!multi && idx === 0) {
          card.classList.add("selected");
          state[key] = { name: card.dataset.name, price: parseFloat(card.dataset.price || 0) };
        }
        card.addEventListener("click", () => {
          if (multi) {
            const id = card.dataset.name;
            if (state.toppings.has(id)) {
              state.toppings.delete(id);
              card.classList.remove("selected");
            } else {
              state.toppings.add(id);
              card.classList.add("selected");
            }
          } else {
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            state[key] = { name: card.dataset.name, price: parseFloat(card.dataset.price || 0) };
          }
          render();
        });
      });
    });

    const qtyVal = root.querySelector("[data-qty-val]");
    root.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
      state.qty = Math.max(1, state.qty - 1);
      render();
    });
    root.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
      state.qty = Math.min(9, state.qty + 1);
      render();
    });

    const toppingPrice = 20;
    function computeTotal() {
      const basePrice = state.base ? state.base.price : 0;
      const sizePrice = state.size ? state.size.price : 0;
      const toppingsPrice = state.toppings.size * toppingPrice;
      return (basePrice + sizePrice + toppingsPrice) * state.qty;
    }

    function render() {
      if (qtyVal) qtyVal.textContent = state.qty;
      const totalEl = root.querySelector("[data-total]");
      if (totalEl) totalEl.textContent = "₹" + computeTotal();

      const setLine = (sel, val) => { const el = root.querySelector(sel); if (el) el.textContent = val; };
      setLine("[data-preview-base]", state.base ? state.base.name : "—");
      setLine("[data-preview-size]", state.size ? state.size.name : "—");
      setLine("[data-preview-sweet]", state.sweetness ? state.sweetness.name : "—");
      setLine("[data-preview-ice]", state.ice ? state.ice.name : "—");
      setLine("[data-preview-toppings]", state.toppings.size ? Array.from(state.toppings).join(", ") : "None");
      setLine("[data-preview-qty]", state.qty);
    }

    root.querySelector("[data-add-cart]")?.addEventListener("click", () => {
      const name = "Custom · " + (state.base ? state.base.name : "Drink");
      window.bbCart?.add("custom-" + Date.now(), name, computeTotal() / state.qty);
      // Removed to prevent double toast
    });

    render();
  });
})();
