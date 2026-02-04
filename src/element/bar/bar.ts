import "./bar.css";
import $ from "jquery";
import { addObject, removeObject } from "./../ring/ring.ts";
import { removePath, addPath } from "./../enemy/pathfinding.ts";

export class Bar {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;

  }
}

export function drawBar(row: number, col: number) {
  const OBJECT_ID = 5;
  const id: string = row + "-" + col;
  const $soil = $("<div></div>")
    .attr("id", "bar" + id)
    .addClass("bar");
  addObject($soil, row, col, OBJECT_ID);
  addPath(row ,col )
}