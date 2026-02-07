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
import {drawGold,  golds, resetGold, goldsBehindId } from "./../gold/gold.ts";
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
export let enemiesBehindId = [];
let nextMoves = [];

export function enemyInit() {
  enemyFall();
  moveEnemy();
  checkGold();
}

export function drawEnemy(row: number, col: number, id: number) {
  const OBJECT_ID: number = 4;
  const $enemy = $("<img>")
    .attr("id", "enemy" + id)
    .attr("src", "src/element/enemy/enemy-standing.png") // Set the source of the image
    .addClass("enemy");
  const enemy: Enemy = new Enemy(row, col, id);
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

export function findEnemyId(row, col) {
  let id: number;
  enemies.forEach((enemy, index) => {
    if (enemy.row === row && enemy.col === col) {
      id = enemy.id;
    }
  });
  return id;
}

export function enemyRestoreHole(row, col) {
  if (getRingState(row, col) === 4) {
    const id = findEnemyId(row, col);
    resetEnemy(row, col, id, 0);
    drawEnemy(row - 1, col, id);
  }
}

function isFalling(row, col, index) {
  const underboxId: number = getRingState(row + 1, col);
  let result: boolean;
  if (underboxId === 0) {
    result = true;
  }
  if (searchHole(row, col)) {
    result = false;
  }
  if (enemiesBehindId[index] === 5) {
    result = false;
  }
  return result;
}

export function enemyFall() {
  enemies.forEach((enemy, eId) => {
    if (checkBorders(enemy.row + 1, enemy.col)) {
      if (isFalling(enemy.row, enemy.col, eId)) {
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


function checkGold(next) {
  enemies.forEach((enemy, eId) => {
    golds.forEach((gold, gId) => {
        if(enemy.row -1 === gold.row && enemy.col === gold.col){
            carryGold(enemy, gold);
            };

            if (enemy.row === gold.row && enemy.col === gold.col){
                pickupGold(enemy, gold);
                };

        });
  });
}

function pickupGold(enemy,gold){
    resetGold(gold.row, gold.col, gold.id, 4);
    enemiesBehindId[enemy.Id]= 0;
    golds[gold.id].row --;
    drawGold(golds[gold.id].row, golds[gold.id].col)
    }

function carryGold(enemy, gold){
    resetGold(gold.row, gold.col, gold.id, goldsBehindId[gold.id]);

    golds[gold.id].row = enemies[enemy.id].row - 1;
    golds[gold.id].col = enemies[enemy.id].col;
    drawGold(golds[gold.id].row, golds[gold.id].col)
    }