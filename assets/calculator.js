/* MycoWise price-per-gram calculator. Vanilla JS, no dependencies.
   Compares supplements on price per gram of extract, and (if a beta-glucan
   percentage is given) price per gram of beta-glucans. Runs entirely client-side.
   Dutch UI strings; English code (house rule). */
(function () {
  "use strict";
  const root = document.querySelector("[data-calc]");
  if (!root) return;

  const tbody = root.querySelector("[data-calc-rows]");
  const addBtn = root.querySelector("[data-calc-add]");

  const num = (el) => {
    const v = parseFloat(String(el.value).replace(",", "."));
    return isFinite(v) && v > 0 ? v : null;
  };

  // "EUR 0,33" with a Dutch decimal comma.
  const money = (n) => "EUR " + n.toFixed(2).replace(".", ",");

  function rowEl() {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td data-th="Product"><input type="text" data-f="name" placeholder="Merk / product" aria-label="Productnaam"></td>' +
      '<td data-th="Prijs (EUR)"><input type="number" data-f="price" min="0" step="0.01" inputmode="decimal" placeholder="0,00" aria-label="Prijs in euro"></td>' +
      '<td data-th="Gram extract"><input type="number" data-f="grams" min="0" step="0.1" inputmode="decimal" placeholder="0" aria-label="Gram extract"></td>' +
      '<td data-th="Beta-glucanen %"><input type="number" data-f="bg" min="0" max="100" step="1" inputmode="numeric" placeholder="%" aria-label="Beta-glucanen percentage"></td>' +
      '<td class="calc-out" data-o="ppg">-</td>' +
      '<td class="calc-out" data-o="ppgbg">-</td>' +
      '<td><button type="button" class="calc-del" aria-label="Rij verwijderen" title="Verwijderen">&times;</button></td>';
    return tr;
  }

  function addRow() {
    tbody.appendChild(rowEl());
  }

  function compute() {
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const ppgVals = [], ppgbgVals = [];

    rows.forEach((tr) => {
      const price = num(tr.querySelector('[data-f="price"]'));
      const grams = num(tr.querySelector('[data-f="grams"]'));
      const bg = num(tr.querySelector('[data-f="bg"]'));
      const ppgCell = tr.querySelector('[data-o="ppg"]');
      const ppgbgCell = tr.querySelector('[data-o="ppgbg"]');
      ppgCell.classList.remove("calc-best");
      ppgbgCell.classList.remove("calc-best");

      let ppg = null, ppgbg = null;
      if (price && grams) {
        ppg = price / grams;
        ppgCell.textContent = money(ppg);
        if (bg && bg <= 100) {
          ppgbg = price / (grams * (bg / 100));
          ppgbgCell.textContent = money(ppgbg);
        } else {
          ppgbgCell.textContent = "-";
        }
      } else {
        ppgCell.textContent = "-";
        ppgbgCell.textContent = "-";
      }
      ppgVals.push({ cell: ppgCell, v: ppg });
      ppgbgVals.push({ cell: ppgbgCell, v: ppgbg });
    });

    markBest(ppgVals);
    markBest(ppgbgVals);
  }

  // Highlight the cheapest cell, but only when there are >= 2 comparable values.
  function markBest(list) {
    const valid = list.filter((x) => x.v != null);
    if (valid.length < 2) return;
    const min = Math.min.apply(null, valid.map((x) => x.v));
    valid.forEach((x) => { if (x.v === min) x.cell.classList.add("calc-best"); });
  }

  tbody.addEventListener("input", compute);
  tbody.addEventListener("click", (e) => {
    const del = e.target.closest(".calc-del");
    if (!del) return;
    if (tbody.querySelectorAll("tr").length > 1) del.closest("tr").remove();
    else del.closest("tr").querySelectorAll("input").forEach((i) => (i.value = ""));
    compute();
  });
  if (addBtn) addBtn.addEventListener("click", () => { addRow(); });

  // Start with three empty rows so a comparison is possible immediately.
  addRow(); addRow(); addRow();
  compute();
})();
