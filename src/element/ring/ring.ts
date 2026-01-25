import "./ring.css";
import $ from "jquery";

const ROWS = 30;
const COLS = 90;
const RING: number[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(0)
);

let $RING;

export function draw_ring(parent: HTMLDivElement): HTMLDivElement {
  let $ring = $("<div></div>").attr("id", "ring").addClass("ring").css({});
  $(parent).prepend($ring);

  $RING = $ring;

  return $ring[0];
}

export function removeObject(
  object: HTMLDivElement,
  row: number,
  col: number,
  objId: number
) {
  if (row < 0 || row >= ROWS) {
    console.error("Invalid Object request: " + row + " is more than " + ROWS);
    return;
  }
  if (col < 0 || col >= COLS) {
    console.error("Invalid Object request: " + col + " is more than " + COLS);
    return;
  }

  RING[row][col] = objId;
}

export function addObject(
  object: HTMLDivElement,
  row: number,
  col: number,
  objId: number
) {
  if (row < 0 || row >= ROWS) {
    console.error("Invalid Object request: " + row + " is more than " + ROWS);
    return false;
  }
  if (col < 0 || col >= COLS) {
    console.error("Invalid Object request: " + col + " is more than " + COLS);
    return false;
  }

  // logic
  RING[row][col] = objId;

  // visual
  const visCol = (col / COLS) * 100;
  const visRow = (row / ROWS) * 100;
  const visWidth = 100 / COLS;
  const visHeight = 100 / ROWS;

  const $object = $(object).css({
    width: visWidth + "%",
    left: visCol + "%",
    top: visRow + "%",
    height: visHeight + "%",
  });

  $RING.append($object);
}

export function getRingState(row: number, col: number) {
  return RING[row][col];
}
