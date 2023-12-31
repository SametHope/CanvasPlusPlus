const Current = {
  brushColor: "black",
  brushSize: 1,
}

document.addEventListener("mouseupdate", () => handleMouseUpdate(activeMouse.current.state, activeMouse.current.relPosition.x, activeMouse.current.relPosition.y));

function handleMouseUpdate(state, x, y) {
  let shouldDraw = false;
  let drawArgs = {
    cells: activeGrid.cells,
    x: x,
    y: y,
    brushSize: Current.brushSize,
    gridMaxX: activeGrid.width,
    gridMaxY: activeGrid.height,
    color: null,
  }

  switch (state) {
    case Mouse.STATE.LEFT:
      shouldDraw = true;
      drawArgs.color = Current.brushColor;
      break;
    case Mouse.STATE.RIGHT:
      shouldDraw = true;
      drawArgs.color = CellBackgroundColorProp.value;
      break;
    default:
      break;
  }

  if (shouldDraw) {

    if (activeMouse.current.changedCell && activeMouse.current.state == activeMouse.last.state) {
      var targetPositions = getPositionsBetween({ x, y }, activeMouse.last.relPosition, Current.brushSize);
    } else {
      var targetPositions = getPositionsInArea(x, y, Current.brushSize)
    }

    targetPositions = targetPositions
      .filter(pos => (pos.x >= 0 && pos.y >= 0) && (pos.x < drawArgs.gridMaxX && pos.y < drawArgs.gridMaxY))
      .filter(pos => normalizeColor(drawArgs.cells[pos.x][pos.y].style.backgroundColor) !== normalizeColor(drawArgs.color))

    draw(drawArgs.cells, targetPositions, drawArgs.color)
  }
}

function draw(cells, positions, color, addToHistory = true) {
  if (addToHistory) {
    const previousColors = positions.map(pos => cells[pos.x][pos.y].style.backgroundColor);
    activeHistory.addRecord({ targetPositions: positions, previousColors: previousColors })
  }

  for (let i = 0; i < positions.length; i++) {
    cells[positions[i].x][positions[i].y].style.backgroundColor = color;
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'z') {
    takeBackAction(1);
  }
  else if (event.key === 'x') {
    takeBackAction(4);
  } else if (event.key === 'f') {
    let pos = { x: activeMouse.current.relPosition.x, y: activeMouse.current.relPosition.y }
    // implement bucket fill
  }
});


function takeBackAction(times) {
  for (let t = 0; t < times; t++) {
    let record = activeHistory.popLatest()
    if (!record) break;

    for (let i = 0; i < record.previousColors.length; i++) {

      draw(
        activeGrid.cells,
        [record.targetPositions[i]],
        record.previousColors[i],
        false
      );
    }
  }
}

//#region Options Menu Logic
document.addEventListener("toggleoptions", handleOptionsToggle);

function handleOptionsToggle(event) {
  if (event.detail.isOpen) return;

  applyOptionsMenu();
}

function applyOptionsMenu() {
  Current.brushSize = document.getElementById("brush-size-input").value;
  Current.brushColor = document.getElementById("color-input").value;

  CellBorderSizeProp.value = document.getElementById("cell-border-size").value;
  CellBorderColor.value = document.getElementById("cell-border-color").value;
}
//#endregion

const GridWidthProp = new Property("--grid-width", 128);
const GridHeightProp = new Property("--grid-height", 128);

const CellSizeProp = new Property("--cell-size", 5);
const CellBackgroundColorProp = new Property("--cell-background-color", "white");

const CellBorderSizeProp = new Property("--cell-border-size", 1);
const CellBorderColor = new Property("--cell-border-color", "black");

const activeGrid = new Grid("grid-container", GridWidthProp.value, GridHeightProp.value);
activeGrid.populate();

const activeMouse = new Mouse(activeGrid.element, GridWidthProp.value, GridHeightProp.value, CellSizeProp.value);
activeMouse.setupEvents()

const activeHistory = new ObjHistory(300);

const activeSaveLoadMaster = new SaveLoadMaster(() => { return activeGrid.cells }, GridWidthProp.value, GridHeightProp.value, getMetaData().version)

applyOptionsMenu();
