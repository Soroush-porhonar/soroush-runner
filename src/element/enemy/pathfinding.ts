import { enemies, enemiesBehindId, drawEnemy, resetEnemy, findEnemyId, isFalling} from "./enemy.ts";
import { player} from "./../player/player.ts";
import { getRingState, checkBorders} from "./../ring/ring.ts";
import { searchHole } from "./../soil/soil.ts";

const ROWS = 30;
const COLS = 90;
const PATHS: number[][] = Array.from({ length: ROWS }, () =>
  Array(COLS).fill(false)
);





export function removePath(
  row: number,
  col: number
) {
  checkBorders(row,col);
  // logic
  PATHS[row][col] = false;
}




export function addPath(
  row: number,
  col: number
) {
  checkBorders(row,col);
  // logic
  PATHS[row][col] = true;
}


function isWalkable(row: number, col: number) {
    if (checkBorders(row,col)){
        return PATHS[row][col] === true;
    }
    return false;
}


//check if box is not filled with player or enemies
function notOccupied(row: number, col: number) {
    const isPlayer = (row === player.row && col === player.col)
    if (isPlayer){
        return false
        }
    for (let index = 0; index < enemies.length; index++) {
        const enemy = enemies[index];
        let isEnemy = (row === enemy.row && col === enemy.col);
        if(isEnemy){
            return false
            }
        };
    return true;
}






//for each enemy caculate path to player, check if it should move
export function moveEnemy() {

    enemies.forEach((enemy, index) => {

        const next = findNextStepBFS(
          { row: enemy.row, col: enemy.col },
          { row: player.row, col: player.col }
        );


        if (!next) return;

        if (notOccupied(next.row,next.col) && (!(isFalling( enemy.row, enemy.col, index )))) {

            resetEnemy(
            enemy.row,
            enemy.col,
            enemy.id,
            enemiesBehindId[index]
            );

            enemy.row = next.row;
            enemy.col = next.col;

            drawEnemy(enemy.row, enemy.col, enemy.id);}

      });
}




type Pos = { row: number; col: number };
type Node = Pos & { parent: Node | null };


function findNextStepBFS(
  start: Pos,
  goal: Pos
): Pos | null {
  const queue: Node[] = [];
  const visited = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );

  queue.push({ ...start, parent: null });
  visited[start.row][start.col] = true;

  const directions = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: -1, col: 0 },
  ];

  let endNode: Node | null = null;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (
      current.row === goal.row &&
      current.col === goal.col
    ) {
      endNode = current;
      break;
    }

    for (const d of directions) {
      const nr = current.row + d.row;
      const nc = current.col + d.col;

      if (!isWalkable(nr, nc)) continue;
      if (visited[nr][nc]) continue;

      visited[nr][nc] = true;
      queue.push({
        row: nr,
        col: nc,
        parent: current,
      });
    }
  }

  if (!endNode) return null;

  // Backtrack to find first step
  let cur = endNode;
  while (cur.parent && cur.parent.parent) {
    cur = cur.parent;
  }
  return { row: cur.row, col: cur.col };

}

