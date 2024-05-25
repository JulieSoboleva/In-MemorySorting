import data from "./rsc/data.json";
import Table from "./table/table.js";

document.addEventListener("DOMContentLoaded", () => {
  const table = new Table(document.querySelector("tbody"), data);

  window.table = table;

  table.draw();
  table.sort();
});
