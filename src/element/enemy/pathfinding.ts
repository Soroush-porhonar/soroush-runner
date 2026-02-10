import { enemies } from "./enemy.ts";
import { player } from "./../player/player.ts";
import { getRingState, checkBorders } from "./../ring/ring.ts";
import {  } from "./../soil/soil.ts";

const ROWS = 30;
const COLS = 60;
const Map: number[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(0)
);
export function addMap(row: number, col: number, objId: number){
    if (checkBorders(row, col)){
       // logic
       Map[row][col] = objId; }
}
export function getMapId (row: number, col: number){
    if(checkBorders(row, col)){
        return Map[row][col];
        }
    }


export function removeMap(
  row: number,
  col: number,
  objId: number
) {
  checkBorders(row, col);

  Map[row][col] = objId;
}

function isEmpty(r: number, c: number): boolean {
  return Map[r][c] === 0;
}
function isSolid(r: number, c: number): boolean {
  return Map[r][c] === 1 || Map[r][c] === 7 || Map[r - 1][c] === 5 || Map[r][c] === 2 ;
}
function isLadder(r: number, c: number): boolean {
  return Map[r][c] === 2;
}
function isBar(r: number, c: number): boolean {
  return Map[r][c] === 5; // your bar matrix
}

//check if Pos in RIng is not filled with player or enemies
export function notOccupied(row: number, col: number) {
    const isPlayer = (player.row === row && player.col === col);
    const isEnemy = enemies.some(enemy => enemy.row === row && enemy.col === col)
    const notOccupied = !(isPlayer || isEnemy);
    //console.log(isEnemy)
  return notOccupied;
}



type Pos = { row: number; col: number };
type Node = Pos & { parent: Node | null };

function getNeighbors(node: Pos): Pos[] {
  const r = node.row;
  const c = node.col;
  const neighbors: Pos[] = [];

  if(!checkBorders(r,c)) return;
  /* ========= FORCED FALL (not ladder, not bar) ========= */
  if (
    (isEmpty(r + 1,c) || isBar(r + 1,c)) &&
    getRingState(r, c)!==1 &&
    !isLadder(r,c) &&
    !isBar(r,c)
  ) {
    neighbors.push({ row: r + 1, col: c });
    return neighbors;
  }

  /* ========= BAR MOVEMENT ========= */
  if (isBar(r, c)) {
    // left / right on bar
    if (isEmpty(r, c - 1) || isBar(r, c - 1) || isLadder(r, c - 1)) neighbors.push({ row: r, col: c - 1 });
    if (isEmpty(r, c + 1) || isBar(r, c + 1) || isLadder(r, c + 1)) neighbors.push({ row: r, col: c + 1 });

    // drop from bar
    if (isEmpty(r + 1, c)) {
      neighbors.push({ row: r + 1, col: c });
    }

    return neighbors; // bar blocks other logic
  }

  /* ========= NORMAL GROUND / LADDER ========= */
  const grounded = isSolid(r + 1, c) || isLadder(r, c);
  if (grounded) {
    if (isEmpty(r, c - 1) || isLadder(r, c - 1) || isBar(r, c - 1)) neighbors.push({ row: r, col: c - 1 });
    if (isEmpty(r, c + 1) || isLadder(r, c + 1) || isBar(r, c + 1)) neighbors.push({ row: r, col: c + 1 });
  }

  /* ========= UP (ladder only) ========= */

  if (isLadder(r, c) || isLadder(r + 1, c) ) {
    neighbors.push({ row: r - 1, col: c });
  }

  return neighbors;
}



export function findNextStepBFS(start: Pos, goal: Pos): Pos | null {
  const queue: Node[] = [];
  const visited = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );


  queue.push({ ...start, parent: null });
  visited[start.row][start.col] = true;

  let endNode: Node | null = null;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === goal.row && current.col === goal.col) {
      endNode = current;
      break;
    }

    const neighbors = getNeighbors(current);

    for (const n of neighbors) {
      if(!checkBorders(n.row, n.col)) continue;
      if (visited[n.row][n.col]) continue;

      visited[n.row][n.col] = true;
      queue.push({
        row: n.row,
        col: n.col,
        parent: current,
      });
    }
  }

  if (!endNode) return null;

  /* ===== backtrack to first step ===== */
  let cur = endNode;
  while (cur.parent && cur.parent.parent) {
    cur = cur.parent;
  }
  return { row: cur.row, col: cur.col };
}
