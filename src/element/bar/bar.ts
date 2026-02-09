import "./bar.css";
import $ from "jquery";
import { addObject, removeObject } from "./../ring/ring.ts";
import { addMap } from "./../enemy/pathfinding.ts";


export class Bar {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
// draw bar , add object id, add path
export function drawBar(row: number, col: number) {
  const OBJECT_ID = 5;
  const id: string = row + "-" + col;
  const $bar = $("<div></div>")
    .attr("id", "bar" + id)
    .addClass("bar");
  addObject($bar, row, col, OBJECT_ID);
  addMap(row, col, OBJECT_ID);
}
