import "./conc.css";
import $ from "jquery";
import { addObject } from "./../ring/ring.ts";
import { addMap } from "./../enemy/pathfinding.ts";

export class Conc {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}

export function drawConc(row: number, col: number) {
  const OBJECT_ID = 7;
  const id: string = row + "-" + col;
  const $conc = $("<div></div>")
    .attr("id", "conc" + id)
    .addClass("conc");
  const concElement: HTMLDivElement = $conc.get(0) as HTMLDivElement;
  addObject(concElement, row, col, OBJECT_ID);
  addMap(row, col, OBJECT_ID);
}
