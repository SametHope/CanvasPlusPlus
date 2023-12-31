class Grid {
  element = null;
  rect = null;
  width = null;
  height = null;
  cells = null;

  constructor(elementId, width, height) {
    this.element = document.getElementById(elementId);
    this.rect = this.element.getBoundingClientRect();
    this.width = width;
    this.height = height;
  }

  populate() {
    this.cells = [...Array(this.height)].map(_ => Array(this.width).fill());

    for (let i = 0; i < this.height * this.width; i++) {
      let pos = Grid.calculatePosition(i, this.width);

      const cellElement = document.createElement("div");
      cellElement.className = "grid-cell";
      this.element.appendChild(cellElement);

      this.cells[pos.x][pos.y] = cellElement;
    }
  }

  getCellCount() {
    return this.height * this.width;
  }

  static calculatePosition(elementNumber, gridWidth) {
    const x = elementNumber % gridWidth;
    const y = Math.floor(elementNumber / gridWidth);
    return { x, y };
  }
}