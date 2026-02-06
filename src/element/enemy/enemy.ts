import $ from "jquery";
import "./enemy.css";
import { addObject, removeObject, getRingState, checkBorders } from "./../ring/ring.ts";
import { player } from "./../player/player.ts";
import { removePath, addPath } from "./../enemy/pathfinding.ts";
import { searchHole } from "./../soil/soil.ts";

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
export let enemiesBehindId = [];




export function drawEnemy(row: number, col: number, id: number) {
  const OBJECT_ID: number = 4;
  const $enemy = $("<img>")
    .attr("id", "enemy" + id)
    .attr("src", "src/element/enemy/enemy-standing.png") // Set the source of the image
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



export function findEnemyId(row, col){
    let id : number;
     enemies.forEach((enemy, index) => {
         if (enemy.row === row && enemy.col === col){
             id = enemy.id
         }
     });
    return id
}

export function enemyRestoreHole(row , col){
    if (getRingState(row, col) === 4){
        const id = findEnemyId(row, col);
        resetEnemy(row, col, id, 0 )
        drawEnemy(row - 1, col, id);
        }
}


export function isFalling(row, col, index){
    const underboxId: number = getRingState(row + 1, col);
    let result : boolean
    if (underboxId === 0){
        result = true;
        };
    if (searchHole(row , col)){
        result = false;

        };
    if (enemiesBehindId[index] === 5){
        result = false;
        };

    return result;
}

export function enemyFall() {
  enemies.forEach((enemy, index) => {
    if (checkBorders(enemy.row + 1, enemy.col)){
        if (isFalling(enemy.row, enemy.col, index) ) {
          //console.log(enemiesBehindId[index]);
          //console.log(getRingState(enemy.row +1, enemy.col));
          resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[index]);
          enemy.row = enemy.row + 1 ;
          drawEnemy(enemy.row, enemy.col, enemy.id);
        }
    }

  });

}















