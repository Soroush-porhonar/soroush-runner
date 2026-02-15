import $ from "jquery";
import "./enemy.css";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import {
  findNextStepBFS,
  notOccupied,
  getMapId,
} from "./../enemy/pathfinding.ts";
import { player } from "./../player/player.ts";

export class Enemy {
  row: number;
  col: number;
  id: number;

  constructor(row: number, col: number, id: number) {
    this.row = row;
    this.col = col;
    this.id = id;
  }

  public createDrawObject(): HTMLDivElement {
      const OBJECT_ID: number = 4;
      const $enemy = $("<img>")
        .attr("id", "enemy" + id)
        .attr("src", "src/element/enemy/enemy-standing.png") // Set the source of the image
        .addClass("enemy");
      return HTMLDivElement = $enemy.get(0) as HTMLDivElement;
      //addObject(enemyElement, row, col, OBJECT_ID);
  };

  public getDrawObjectId(): string {
    return "enemy" + this.id; 
  }
}

//export let enemies: Enemy[];

export function drawEnemy(row: number, col: number, id: number) {
}

export function resetEnemy(
  row: number,
  col: number,
  id: number,
  targetId: number,
) {
  const $enemy = $("#enemy" + id).remove();
  const enemyElement: HTMLDivElement = $enemy.get(0) as HTMLDivElement;
  removeObject(enemyElement, row, col, targetId);
}
