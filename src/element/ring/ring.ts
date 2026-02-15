import "./ring.css";
import $ from "jquery";

const ROWS = 30;
const COLS = 60;
export let RING: number[][];      // TODO: remove it...


export class Ring {
  private map: number[][];
  private $RING: JQuery<HTMLElement>;


  constructor() {
    this.map = [];
    this.$RING = $("<div></div>")
      .attr("id", "ring")
      .addClass("ring")
      .css({});
    this.reset()
  }

  public reset() {
    this.map = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    this.$RING.empty();
  }

  public addObject(
    object: HTMLDivElement,
    row: number,
    col: number,
    objId: number,
  ) {
    if (!checkBorders(row, col)) return;

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

    this.$RING.append($object);
  }

  public getRingObject(): HTMLDivElement {
    return this.$RING[0] as HTMLDivElement;
  }
}


export function checkBorders(row: number, col: number) {
  if (row < 0 || row >= ROWS) {
    //console.error("Invalid Object request: " + row + " is more than " + ROWS);
    return false;
  }
  if (col < 0 || col >= COLS) {
    //console.error("Invalid Object request: " + col + " is more than " + COLS);
    return false;
  }
  return true;
}

export function removeObject(
  object: HTMLDivElement,
  row: number,
  col: number,
  objId: number,
) {
  checkBorders(row, col);

  RING[row][col] = objId;
}

export function addObject(
  object: HTMLDivElement,
  row: number,
  col: number,
  objId: number,
) {
  if (!checkBorders(row, col)) return;

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

export function getRingState(row: number, col: number): number | undefined {
  if (checkBorders(row, col)) {
    return RING[row][col];
  }
  
  throw new Error(`Invalid Position: { row, col }` );
}
