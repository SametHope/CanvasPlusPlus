function getMetaData() {
  return {
    version: "0.3",
    gridWidth: GridWidthProp.value,
    gridHeight: GridHeightProp.value,
  }
}

function log(...data) {
  console.log(...data);
}

function isPointInsideRect(rect, point) {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPositionsInArea(x, y, brushSize) {
  const selectedCells = [];
  const isBrushEven = brushSize % 2 === 0;
  const halfSize = Math.floor(brushSize / 2);

  if (isBrushEven) {
    var startX = x - halfSize + 1;
    var endX = x + halfSize;

    var startY = y - halfSize;
    var endY = y + halfSize - 1;
  } else {
    var startX = x - halfSize;
    var endX = x + halfSize;

    var startY = y - halfSize;
    var endY = y + halfSize;
  }

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      selectedCells.push({ x: i, y: j });
    }
  }

  return selectedCells;
}

function getRelativePosition(relRect, pos, rectCellSize) {
  // For some reason without this offset applied, the cell x y detection is slightly inaccurate
  // Do NOT modify it
  const MAGIC_OFFSET = -1.125;

  const relativeOffset = { x: pos.x - relRect.left, y: pos.y - relRect.top };
  const x = Math.floor((relativeOffset.x + MAGIC_OFFSET) / rectCellSize);
  const y = Math.floor((relativeOffset.y + MAGIC_OFFSET) / rectCellSize);

  return { x: x, y: y };
}

function getPositionsBetween(startPos, endPos, width = 1) {
  let points = [];

  // Calculate differences and determine the direction of movement
  const dx = Math.abs(endPos.x - startPos.x);
  const dy = Math.abs(endPos.y - startPos.y);
  const sx = startPos.x < endPos.x ? 1 : -1;
  const sy = startPos.y < endPos.y ? 1 : -1;

  // Bresenham's Line Algorithm
  let err = dx - dy;
  let currentX = startPos.x;
  let currentY = startPos.y;


  while (true) {
    // Add points for the current position along the width
    for (let yOffset = -Math.floor(width / 2); yOffset <= Math.floor(width / 2); yOffset++) {

      // Duplicated items are not a concern
      points = mergeSets(points, getPositionsInArea(currentX, currentY, width))
      // points.push({ x: currentX, y: currentY });
    }

    // Break if reached the end position
    if (currentX === endPos.x && currentY === endPos.y) {
      break;
    }

    // Update error and current position based on Bresenham's algorithm
    const err2 = 2 * err;

    if (err2 > -dy) {
      err -= dy;
      currentX += sx;
    }

    if (err2 < dx) {
      err += dx;
      currentY += sy;
    }
  }

  return points;
}


function normalizeColor(color) {
  if (/^#[0-9A-F]{6}$/i.test(color)) {
    // HEX format, e.g., #RRGGBB
    return color.toUpperCase();
  } else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test(color)) {
    // RGB format, e.g., rgb(R, G, B)
    const rgbValues = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbValues) {
      const hex = rgbValues.slice(1).map(value => parseInt(value, 10).toString(16).padStart(2, '0')).join('');
      return `#${hex.toUpperCase()}`;
    }
  }

  // If the color is not in HEX or RGB format, return it as is
  return color;
}

function mergeSets(set1, set2) {
  return [].concat.apply([], [set1, set2])
}