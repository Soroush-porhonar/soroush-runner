import $ from "jquery";
import "./enemy.css";
import {
  addObject,
  removeObject,
  getRingState,
  checkBorders,
} from "./../ring/ring.ts";
import { findNextStepBFS, notOccupied } from "./../enemy/pathfinding.ts";
import { searchHole } from "./../soil/soil.ts";
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

export let enemies = [];
let enemiesBehindId = [];


export function enemyInit() {
  enemyFall();
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
  enemiesBehindId[id] = getRingState(row, col);
  addObject($enemy, row, col, OBJECT_ID);
}

export function resetEnemy(
  row: number,
  col: number,
  id: number,
  targetId: number
) {
  const $enemy = $("#enemy" + id).remove();
  removeObject($enemy, row, col, targetId);
}
//find enemy id by position
export function findEnemyId(row, col) {
  let id: number;
  enemies.forEach((enemy, index) => {
    if (enemy.row === row && enemy.col === col) {
      id = enemy.id;
    }
  });
  return id;
}

//check and  restore and draw enemy from hole
export function enemyRestoreHole(row, col) {
  if (getRingState(row, col) === 4) {
    const id = findEnemyId(row, col);
    resetEnemy(row, col, id, 0);
    drawEnemy(row - 1, col, id);
  }
}



export function enemyFall() {
  enemies.forEach((enemy, eId) => {

    if (checkBorders(enemy.row + 1, enemy.col)) {

      const isFalling = getRingState(enemy.row + 1, enemy.col) === 0 &&
       !searchHole(enemy.row, enemy.col) &&
        enemiesBehindId[enemy.id] !== 5;

      if (isFalling) {
        resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[eId]);
        enemy.row = enemy.row + 1;
        drawEnemy(enemy.row, enemy.col, enemy.id);
      }
    }
  });
}

//for each enemy calculate path to player, check if it should move
function moveEnemy() {
  enemies.forEach((enemy, index) => {
     const next = findNextStepBFS(
      { row: enemy.row, col: enemy.col },
      { row: player.row, col: player.col }
    );
    if (!next) return;

    const canMove = notOccupied(next.row, next.col) &&
                      getRingState(enemy.row, enemy.col) !== 0 &&
                      !searchHole(enemy.row, enemy.col)
    if (canMove) {
      resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[index]);
      enemy.row = next.row;
      enemy.col = next.col;
      drawEnemy(enemy.row, enemy.col, enemy.id);
    }
  });
}


