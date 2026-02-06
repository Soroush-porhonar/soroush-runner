import "./conc.css";
import $ from "jquery";
import { addObject, removeObject } from "./../ring/ring.ts";

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
  addObject($conc, row, col, OBJECT_ID);

}