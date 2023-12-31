class Mouse {
  static STATE = { NONE: 0, LEFT: 1, RIGHT: 2, OTHER: -1 };

  gridElement = null;
  gridWidth = null;
  gridHeight = null;
  gridCellSize = null;

  current = {
    absPosition: { x: null, y: null },
    relPosition: { x: null, y: null },
    state: null,
    changedCell: null,
  };

  last = {
    absPosition: { x: null, y: null },
    relPosition: { x: null, y: null },
    state: null,
    changedCell: null,
  };

  constructor(gridElement, gridWidth, gridHeight, gridCellSize) {
    this.gridElement = gridElement;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.gridCellSize = gridCellSize;
  }

  setupEvents() {
    // If we don't invoke the function here 'this' will refer to whole document inside the update method.
    this.gridElement.addEventListener("mousedown", (event) => this.#update(event));
    this.gridElement.addEventListener("mousemove", (event) => this.#update(event));
    this.gridElement.addEventListener("mouseup", (event) => this.#update(event));
  }

  #update(event) {
    this.last = structuredClone(this.current)
    this.current.absPosition.x = event.clientX;
    this.current.absPosition.y = event.clientY;
    this.current.relPosition =
      getRelativePosition(
        this.gridElement.getBoundingClientRect(),
        this.current.absPosition,
        this.gridCellSize
      );
    this.current.state = event.buttons !== undefined ? event.buttons : event.which;
    this.current.changedCell = this.current.relPosition.x !== this.last.relPosition.x || this.current.relPosition.y !== this.last.relPosition.y;

    if (this.current.state === this.last.state && !this.current.changedCell) {
      // If neither the state or cells have changed there haven't been a noticeable change to trigger the event.
      // Notice that we don't really care for the absPosition
      return;
    }

    let customEvent = new CustomEvent("mouseupdate")
    document.dispatchEvent(customEvent);
  }
}

