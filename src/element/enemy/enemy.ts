import $ from "jquery";
import "./enemy.css";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { player } from "./../player/player.ts";
import { removePath, addPath } from "./../enemy/pathfinding.ts";

export class Enemy {
  col: number;
  row: number;
  id: number;
  constructor(col: number, row: number, id: number) {
    this.col = col;
    this.row = row;
    this.id = id;
  }
}

export let enemies = [];
export let enemiesBehindId = [];

export function drawEnemy(row: number, col: number, id: number) {
  const OBJECT_ID: number = 4;
  const $enemy = $("<div></div>")
    .attr("id", "enemy" + id)
    .addClass("enemy");
  const enemy: object = { row, col, id };
  enemies[id] = enemy;
  enemiesBehindId[id] = getRingState(row, col);
  addObject($enemy, row, col, OBJECT_ID);
  //removePath(row, col);
}

export function resetEnemy(
  row: number,
  col: number,
  id: number,
  targetId: number
) {
  const $enemy = $("#enemy" + id).remove();

  removeObject($enemy, row, col, targetId);
  //addPath(row, col);
}

export function enemyFall() {
  enemies.forEach((enemy, index) => {
    let underboxId: number = getRingState(enemy.row + 1, enemy.col);
    if (underboxId == 0) {
      resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[index]);
      // removePath
      enemy.row++;
      drawEnemy(enemy.row, enemy.col, enemy.id);
    }
  });
}


export function moveEnemy(){
   const enemy: Pos = {
       row: enemies[0].row,
       col: enemies[0].col
   };

    //const next = findEnemyNextMove(enemy, player);
    //console.log(next);
   // enemies.foreach(function (item: enemy) {
   //     draw_player(item.row, item.col);
   /* if (next) {
      resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[enemy.id]);
      enemy.row = next.row;
      enemy.col = next.col;
      drawEnemy(enemy.row, enemy.col, enemy.id);
    }*/
    }













