import $ from "jquery";
import "./gold.css";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";

export class Gold {
  row: number;
  col: number;
  id: number;
  constructor(row: number, col: number, id: number) {
    this.row = row;
    this.col = col;
    this.id = id;
  }
}

export let golds = [];
export let goldsBehindId = [];

export function drawGold(row: number, col: number, id: number) {
  const OBJECT_ID = 6;
  const $gold = $("<img>")
    .attr("id", "gold" + id)
    .attr("src", "./src/element/gold/gold.png") // Set the source of the image
    .addClass("gold");
  const gold: Gold = new Gold(row, col, id);
  golds[id] = gold;
  goldsBehindId[id] = getRingState(row, col);
  addObject($gold, row, col, OBJECT_ID);
}

export function resetGold(
  row: number,
  col: number,
  id: number,
  targetId: number
) {
  const $gold = $("#gold" + id).remove();
  removeObject($gold, row, col, targetId);
}

export function deleteGold(id) {
  golds = golds.filter((gold) => gold.id !== id);
}