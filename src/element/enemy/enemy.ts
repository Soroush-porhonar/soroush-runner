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
}

export let enemies: Enemy[];
export function enemyInit() {
  enemies = [];
}

export function enemyRepeat() {
  moveEnemy();
}

export function drawEnemy(row: number, col: number, id: number) {
  const OBJECT_ID: number = 4;
  const $enemy = $("<img>")
    .attr("id", "enemy" + id)
    .attr("src", "src/element/enemy/enemy-standing.png") // Set the source of the image
    .addClass("enemy");
  const enemy: Enemy = new Enemy(row, col, id);
  //update enemy new pos in array of enemies
  enemies[id] = enemy;
  const enemyElement: HTMLDivElement = $enemy.get(0) as HTMLDivElement;
  addObject(enemyElement, row, col, OBJECT_ID);
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
//find enemy id by position
export function findEnemyId(row: number, col: number): number {
  const enemy = enemies.find((enemy) => enemy.row === row && enemy.col === col);
  return enemy ? enemy.id : -1; // Return id if found, else -1
}

//check and  restore and draw enemy from hole
export function enemyRestoreHole(row: number, col: number) {
  if (getRingState(row, col) === 4) {
    const id = findEnemyId(row, col);
    resetEnemy(row, col, id, 0);
    drawEnemy(row - 1, col, id);
  }
}

//for each enemy calculate path to player, check if it should move
function moveEnemy(): void {
  enemies.forEach((enemy) => {
    if (
      notOccupied(enemy.row + 1, enemy.col) &&
      getRingState(enemy.row + 1, enemy.col) === 8
    ) {
      resetEnemy(
        enemy.row,
        enemy.col,
        enemy.id,
        getMapId(enemy.row, enemy.col),
      );
      enemy.row++;
      drawEnemy(enemy.row, enemy.col, enemy.id);
      return;
    } else {
      const next = findNextStepBFS(
        { row: enemy.row, col: enemy.col },
        { row: player.row, col: player.col },
      );

      if (!next) return;

      if (
        notOccupied(next.row, next.col) &&
        getMapId(enemy.row, enemy.col) !== 1
      ) {
        resetEnemy(
          enemy.row,
          enemy.col,
          enemy.id,
          getMapId(enemy.row, enemy.col),
        );
        enemy.row = next.row;
        enemy.col = next.col;
        drawEnemy(enemy.row, enemy.col, enemy.id);
      }
    }
  });
}
