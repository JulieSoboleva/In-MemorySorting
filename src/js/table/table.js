export default class Table {
  constructor(element, data) {
    this._data = data;
    this._element = element;
    this.headers = Array.from(document.querySelectorAll("th"));
    console.log(this.headers);
  }

  draw() {
    for (const item of this._data) {
      const row = document.createElement("tr");
      row.dataset.id = item["id"];
      row.dataset.title = item["title"];
      row.dataset.year = item["year"];
      row.dataset.imdb = item["imdb"];
      this._element.insertAdjacentElement("beforeend", row);

      let column = document.createElement("td");
      const digits = String(item["imdb"]).split(".");
      digits[1] = digits[1] ? digits[1].padEnd(2, "0") : "00";
      column.textContent = `imdb: ${digits.join(".")}`;
      row.insertAdjacentElement("afterbegin", column);

      column = document.createElement("td");
      column.textContent = `(${item["year"]})`;
      row.insertAdjacentElement("afterbegin", column);

      column = document.createElement("td");
      column.textContent = item["title"];
      row.insertAdjacentElement("afterbegin", column);

      column = document.createElement("td");
      column.textContent = `${item["id"]}`;
      row.insertAdjacentElement("afterbegin", column);
    }
    this.prepareComparator();
  }

  prepareComparator() {
    this.rows = Array.from(this._element.rows);
    this.comparators = [];
    this.headers.forEach((tHeader, index) => {
      const dataName = tHeader.textContent;
      const { type } = tHeader.dataset;
      let comparator;

      switch (type) {
        case "number":
          comparator = (rowA, rowB) =>
            rowA.dataset[dataName] - rowB.dataset[dataName];
          this.comparators.push({
            tHeaderIndex: index,
            order: " ↑",
            comparator,
          });
          comparator = (rowA, rowB) =>
            rowB.dataset[dataName] - rowA.dataset[dataName];
          this.comparators.push({
            tHeaderIndex: index,
            order: " ↓",
            comparator,
          });
          break;
        case "string":
          comparator = (rowA, rowB) => {
            if (rowA.dataset[dataName] > rowB.dataset[dataName]) {
              return 1;
            }
            return -1;
          };
          this.comparators.push({
            tHeaderIndex: index,
            order: " ↑",
            comparator,
          });
          comparator = (rowA, rowB) => {
            if (rowB.dataset[dataName] > rowA.dataset[dataName]) {
              return 1;
            }
            return -1;
          };
          this.comparators.push({
            tHeaderIndex: index,
            order: " ↓",
            comparator,
          });
          break;
        default:
          throw new Error(`Unknown data type: ${type}.`);
      }
    });
  }

  sort() {
    let currentIndex = 0;
    let lastTHIndex = 0;
    setInterval(() => {
      currentIndex %= this.comparators.length;
      this.rows.sort(this.comparators[currentIndex].comparator);
      this.rows.forEach((tRow, refNodeIndex) => {
        const newNodeIndex = Array.prototype.indexOf.call(
          this._element.rows,
          tRow,
        );
        this._element.insertBefore(
          this._element.rows[newNodeIndex],
          this._element.rows[refNodeIndex],
        );
      });
      this.headers[lastTHIndex].textContent = this.headers[
        lastTHIndex
      ].textContent.replace(/ \S+/, "");
      this.headers[this.comparators[currentIndex].tHeaderIndex].textContent +=
        this.comparators[currentIndex].order;
      lastTHIndex = this.comparators[currentIndex].tHeaderIndex;
      currentIndex += 1;
    }, 2000);
  }
}
