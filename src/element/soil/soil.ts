import "./soil.css";
import $ from "jquery";
import { addObject, removeObject } from "./../ring/ring.ts";
import { removePath, addPath } from "./../enemy/pathfinding.ts";
import { enemyRestoreHole} from "./../enemy/enemy.ts";
import { playerRestoreHole} from "./../player/player.ts";


export class Soil {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;

  }
}

export function draw_soil(row: number, col: number) {
  const OBJECT_ID = 1;
  const id: string = row + "-" + col;
  const $soil = $("<div></div>")
    .attr("id", "soil" + id)
    .addClass("soil");
  addObject($soil, row, col, OBJECT_ID);
  addPath(row - 1,col )
}


export function resetSoil(row: number, col: number, targetId: number) {
  const id: string = row + "-" + col;
  const $soil = $("#soil" + id).remove();
  removeObject($soil, row, col, targetId);
  removePath(row, col);
}







export const Holes: Soil[] =[];

export function addHole(row, col){
    Holes.push(new Soil(row, col));
    }


export function removeHole(row, col){
    const index = Holes.findIndex(soil => soil.row === row && soil.col === col);
    if (index !== -1) {
        Holes.splice(index, 1); // Remove the Soil object at the found index

    }
}
export function searchHole(row, col){
    const index = Holes.findIndex(soil => soil.row === row && soil.col === col);
    if (index !== -1) {
        return true;
    } else {
        return false;
        }
    }
// restoring a holed soil and the path to continue player search  checking if enemy or player is in it to restore them as well
export function handleHoleChar(row, col){
    resetSoil(row, col, 0);
    addHole(row, col);

    setTimeout(() => {
      enemyRestoreHole(row, col);
      playerRestoreHole(row, col);
      removeHole(row, col);
      draw_soil(row, col);
    }, 3000);
}