/* Menu page — category filter, search, price sort */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("[data-menu-grid]");
    if (!grid) return;
    const cards = Array.from(grid.children);
    const pills = document.querySelectorAll(".filter-pill");
    const search = document.querySelector("[data-menu-search]");
    const sort = document.querySelector("[data-menu-sort]");
    let activeCat = new URLSearchParams(window.location.search).get("cat") || "all";

    function render() {
      const term = (search?.value || "").toLowerCase().trim();
      let visible = cards.filter(card => {
        const cat = card.dataset.cat;
        const name = card.dataset.name.toLowerCase();
        const matchesCat = activeCat === "all" || cat === activeCat;
        const matchesTerm = !term || name.includes(term);
        return matchesCat && matchesTerm;
      });

      if (sort && sort.value !== "default") {
        visible = visible.slice().sort((a, b) => {
          const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
          return sort.value === "low" ? pa - pb : pb - pa;
        });
      }

      cards.forEach(c => (c.style.display = "none"));
      visible.forEach(c => {
        c.style.display = "";
        grid.appendChild(c);
      });

      let empty = grid.querySelector(".empty-state");
      if (!visible.length) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "empty-state";
          empty.textContent = "No drinks match your search — try another flavor or category.";
          grid.appendChild(empty);
        }
      } else if (empty) {
        empty.remove();
      }
    }

    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeCat = pill.dataset.cat;
        render();
      });
    });
    search?.addEventListener("input", render);
    sort?.addEventListener("change", render);
    // Highlight the correct pill if a ?cat= param is present
    if (activeCat !== "all") {
      pills.forEach(p => {
        p.classList.remove("active");
        if (p.dataset.cat === activeCat) p.classList.add("active");
      });
    }
    render();
  });
})();
