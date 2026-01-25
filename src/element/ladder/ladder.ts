import "./ladder.css";
import $ from "jquery";
import { addObject } from "./../ring/ring.ts";

const OBJECT_ID = 2;

export function draw_ladder(row: number, col: number) {
  const $ladder = $("<div></div>").addClass("ladder");

  addObject($ladder, row, col, OBJECT_ID);
}

export class Ladder {
  col: number;
  row: number;
  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}
