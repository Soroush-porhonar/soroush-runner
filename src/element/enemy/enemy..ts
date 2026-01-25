import $ from "jquery";
import "./enemy.css";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";

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

let enemies = [];
let enemiesBehindId = [];

export function drawEnemy(row: number, col: number, id: number) {
  const OBJECT_ID: number = 4;
  const $enemy = $("<div></div>")
    .attr("id", "enemy" + id)
    .addClass("enemy");
  const enemy: object = { row, col, id };
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

export function enemyFall() {
  for (let index = 0; index < enemies.length; index++) {
    const enemy = enemies[index];

    let underboxId: number = getRingState(enemy.row + 1, enemy.col);
    if (underboxId == 0) {
      resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[index]);
      enemy.row++;
      drawEnemy(enemy.row, enemy.col, enemy.id);
    }
  }
}




function isSoil(row: number, col: number) {
  return getRingState(row, col) === 1;
}

function isLadder(row: number, col: number) {
  return getRingState(row, col) === 2;
}

function isEmpty(row: number, col: number) {
  return getRingState(row, col) === 0 || getRingState(row, col) === 3;
}

type Pos = { row: number; col: number };
type Node = Pos & {
  g: number;
  h: number;
  f: number;
  parent: Node | null;};
/*


function getPlatformerNeighbors(node: Pos): Pos[] {
  const { row, col } = node;
  const neighbors: Pos[] = [];

  const under = getRingState(row + 1, col);
  const onSoil = under === 1;
  const onLadder = isLadder(row, col);

  // 1️⃣ gravity (اگه زیرش خاک نیست، فقط سقوط)
  if (under !== 1 && row + 1 < 30) {
    neighbors.push({ row: row + 1, col });
    return neighbors; // هیچ حرکت دیگه‌ای مجاز نیست
  }

  // 2️⃣ حرکت افقی فقط روی خاک
  if (onSoil) {
    if (isEmpty(row, col - 1))
      neighbors.push({ row, col: col - 1 });

    if (isEmpty(row, col + 1))
      neighbors.push({ row, col: col + 1 });
  }

  // 3️⃣ حرکت عمودی فقط روی نردبون
  if (onLadder) {
    if (isEmpty(row - 1, col))
      neighbors.push({ row: row - 1, col });

    if (isEmpty(row + 1, col))
      neighbors.push({ row: row + 1, col });
  }

  return neighbors;
}


export function findEnemyNextMove(
  enemy: Enemy,
  player: Pos
): Pos | null {

  const open: Node[] = [];
  const closed = new Set<string>();

  const hash = (p: Pos) => `${p.row},${p.col}`;
  const h = (a: Pos, b: Pos) =>
    Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

  open.push({
    row: enemy.row,
    col: enemy.col,
    g: 0,
    h: h(enemy, player),
    f: 0,
    parent: null
  });

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;

    if (current.row === player.row && current.col === player.col) {
      let n: Node | null = current;
      const path: Pos[] = [];

      while (n) {
        path.push({ row: n.row, col: n.col });
        n = n.parent;
      }

      return path.reverse()[1] ?? null;
    }

    closed.add(hash(current));

    for (const nb of getPlatformerNeighbors(current)) {
      if (closed.has(hash(nb))) continue;

      const gScore = current.g + 1;
      let node = open.find(n => n.row === nb.row && n.col === nb.col);

      if (!node) {
        const hn = h(nb, player);
        node = {
          ...nb,
          g: gScore,
          h: hn,
          f: gScore + hn,
          parent: current
        };
        open.push(node);
      } else if (gScore < node.g) {
        node.g = gScore;
        node.f = node.g + node.h;
        node.parent = current;
      }
    }
  }

  return null;
}



const next = findEnemyNextMove(enemy, playerPos);

if (next) {
  resetEnemy(enemy.row, enemy.col, enemy.id, enemiesBehindId[enemy.id]);
  enemy.row = next.row;
  enemy.col = next.col;
  drawEnemy(enemy.row, enemy.col, enemy.id);
}
*/