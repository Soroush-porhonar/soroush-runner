import $ from "jquery";
import { resetSoil, draw_soil } from "./../soil/soil.ts";
import { addObject, removeObject } from "./../ring/ring.ts";
import { notOccupied } from "./../enemy/pathfinding.ts";
import { enemyRestoreHole } from "./../enemy/enemy.ts";

export function drawHole(row: number, col: number) {
  const OBJECT_ID = 8;
  const id: string = row + "-" + col;
  const $hole = $("<div></div>")
    .attr("id", "hole" + id)
    .addClass("hole");
  const holeElement: HTMLDivElement = $hole.get(0) as HTMLDivElement;
  addObject(holeElement, row, col, OBJECT_ID);
  //addMap(row, col, OBJECT_ID);
}

export function resetHole(row: number, col: number, targetId: number) {
  const id: string = row + "-" + col;
  const $hole = $("#soil" + id).remove();
  const holeElement: HTMLDivElement = $hole.get(0) as HTMLDivElement;
  removeObject(holeElement, row, col, targetId);
}

export async function handleHoleChar(row: number, col: number): Promise<void> {
  resetSoil(row, col, 0);
  drawHole(row, col);
  setTimeout(() => {
    waiting(row, col);
  }, 3000);
}
async function waiting(row: number, col: number): Promise<void> {
  await waitUntil(() => notOccupied(row - 1, col));
  enemyRestoreHole(row, col);
  resetHole(row, col, 1);
  draw_soil(row, col);
}

function waitUntil(
  conditionFn: () => boolean,
  checkEveryMs: number = 100,
): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval);
        resolve();
      }
    }, checkEveryMs);
  });
}
