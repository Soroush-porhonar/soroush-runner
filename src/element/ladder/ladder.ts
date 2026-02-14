import "./ladder.css";
import $ from "jquery";
import { addObject } from "./../ring/ring.ts";
import { addMap } from "./../enemy/pathfinding.ts";

export class Ladder {
  col: number;
  row: number;
  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}

export function draw_ladder(row: number, col: number) {
  const OBJECT_ID = 2;
  const $ladder = $("<div></div>").addClass("ladder");
  const ladderElement: HTMLDivElement = $ladder.get(0) as HTMLDivElement;
  addObject(ladderElement, row, col, OBJECT_ID);
  addMap(row, col, OBJECT_ID);
}
