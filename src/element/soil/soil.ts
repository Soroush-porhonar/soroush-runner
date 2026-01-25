import "./soil.css";
import $ from "jquery";
import { addObject, removeObject } from "./../ring/ring.ts";

export class Soil {
  col: number;
  row: number;

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}

export function draw_soil(row: number, col: number) {
  const OBJECT_ID = 1;
  const id: string = col + "-" + row;
  const $soil = $("<div></div>")
    .attr("id", "soil" + id)
    .addClass("soil");
  addObject($soil, row, col, OBJECT_ID);
}

export function resetSoil(row: number, col: number, targetId: number) {
  const id: string = col + "-" + row;
  const $soil = $("#soil" + id).remove();
  removeObject($soil, row, col, targetId);
}
