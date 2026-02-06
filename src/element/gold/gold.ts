import $ from "jquery";
import "./gold.css";
import { addObject, removeObject } from "./../ring/ring.ts";

export function drawGold(row: number, col: number) {
  const OBJECT_ID = 6;
  const id: string = row + "-" + col;
  const $gold = $("<img>")
    .attr("id", "gold" + id)
    .attr("src", "./src/element/gold/gold.png") // Set the source of the image
    .addClass("gold");
  addObject($gold, row, col, OBJECT_ID);

}


export function resetGold(row: number, col: number, targetId: number) {
  const id: string = row + "-" + col;
  const $gold = $("#gold" + id).remove();
  removeObject($gold, row, col, targetId);
}