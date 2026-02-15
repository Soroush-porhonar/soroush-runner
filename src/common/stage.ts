import $ from "jquery";
import { draw_soil } from "./../element/soil/soil.ts";
import { draw_ladder } from "./../element/ladder/ladder.ts";
import { drawEnemy, Enemy, enemyInit } from "./../element/enemy/enemy.ts";
import { drawBar } from "./../element/bar/bar.ts";
import { draw_player, Player } from "./../element/player/player.ts";
import { drawGold, Gold, goldInit } from "./../element/gold/gold.ts";
import { drawConc } from "./../element/concrete/conc.ts";
import { Ring, createZeroRing, removeObject, getRingState } from "./../element/ring/ring.ts";
import { getStageName } from "./Conditions.ts";

interface SoilRow {
  row: number;
  col: number;
  count: number;
}

interface LadderCol {
  row: number;
  col: number;
  count: number;
}

interface BarRow {
  row: number;
  col: number;
  count: number;
}

interface ConcRow {
  row: number;
  col: number;
  count: number;
}

interface Stage {
  Soil: SoilRow[];
  Ladder: LadderCol[];
  Player: Player;
  Enemy: Enemy[];
  Bar: BarRow[];
  Gold: Gold[];
  Conc: ConcRow[];
  WLadder: LadderCol[];
}

interface GameState {
  score: number;
  life: number;
  gameOver: boolean;
  lose: boolean;
  win: boolean;
  Wladder: boolean;
  stageName: string;
}

interface GameElement {
  ring: Ring,
  enemies: Enemy[];
}

interface StageDict {
  [key: string]: Stage; // Allows for dynamic stage names
}

let gameElement = { 
  ring: new Ring(),
  enemies: [],
} as GameElement;

const stageDict: StageDict = {
  "stage-1": {
    Soil: [
      { row: 2, col: 5, count: 7 } as SoilRow,
      { row: 20, col: 5, count: 17 } as SoilRow,
      { row: 28, col: 0, count: 60 } as SoilRow,
      { row: 17, col: 25, count: 31 } as SoilRow,
      { row: 5, col: 25, count: 20 } as SoilRow,
      { row: 11, col: 20, count: 5 } as SoilRow,
      { row: 5, col: 50, count: 5 } as SoilRow,
    ],
    Ladder: [
      { row: 20, col: 14, count: 8 } as LadderCol,
      { row: 2, col: 10, count: 18 } as LadderCol,
      { row: 17, col: 50, count: 11 } as LadderCol,
      { row: 5, col: 40, count: 12 } as LadderCol,
    ],
    Player: new Player( 10, 20, undefined ),
    Enemy: [
      new Enemy( 25, 10, 0 ),
      { row: 23, col: 55, id: 1 } as Enemy,
      { row: 2, col: 40, id: 2 } as Enemy,
      { row: 1, col: 11, id: 3 } as Enemy,
    ],
    Bar: [
      { row: 8, col: 11, count: 29 } as BarRow,
      { row: 16, col: 11, count: 15 } as BarRow,
      { row: 4, col: 45, count: 7 } as BarRow,
    ],
    Gold: [
      { row: 4, col: 35, id: 0 } as Gold,
      { row: 27, col: 40, id: 1 } as Gold,
      { row: 19, col: 20, id: 2 } as Gold,
      { row: 1, col: 6, id: 3 } as Gold,
      { row: 10, col: 22, id: 4 } as Gold,
      { row: 4, col: 54, id: 5 } as Gold,
      { row: 27, col: 11, id: 6 } as Gold,
    ],
    Conc: [{ row: 29, col: 0, count: 90 } as ConcRow],
    WLadder: [{ row: 0, col: 30, count: 5 } as LadderCol],
  },
};

export function drawStage( stageName: string ): void {
  stageDict[stageName]["Soil"].forEach(function (item: SoilRow): void {
    for (let index = 0; index < item.count; index++) {
      draw_soil(item.row, item.col + index);
    }
  });

  stageDict[stageName]["Conc"].forEach(function (item: ConcRow): void {
    for (let index = 0; index < item.count; index++) {
      drawConc(item.row, item.col + index);
    }
  });

  stageDict[stageName]["Ladder"].forEach(function (item: LadderCol): void {
    for (let index = 0; index < item.count; index++) {
      draw_ladder(item.row + index, item.col);
    }
  });

  stageDict[stageName]["Bar"].forEach(function (item: BarRow): void {
    for (let index = 0; index < item.count; index++) {
      drawBar(item.row, item.col + index);
    }
  });

  stageDict[stageName]["Gold"].forEach(function (item: Gold): void {
    drawGold(item.row, item.col, item.id);
  });

  const player = stageDict[stageName]["Player"];
  draw_player(player.row, player.col);

  stageDict[stageName]["Enemy"].forEach(function (item: Enemy): void {
    drawEnemy(item.row, item.col, item.id);
  });
}

export function drawWLadder(): void {
  const stageName = getStageName();
  stageDict[stageName]["WLadder"].forEach(function (item: LadderCol): void {
    for (let index = 0; index < item.count; index++) {
      draw_ladder(item.row + index, item.col);
    }
  });
}

export function LevelInit( ring: Ring | undefined = undefined ): void {
  if ( ring !== undefined ) {
    gameElement.ring = ring;
  } 
  
  const stageName = getStageName();
  gameElement.ring.reset();
  enemyInit( stageDict[stageName]["Enemy"] );
  goldInit();
  drawStage(stageName);
}

function createStageObject( stageName: string) {

}

export function enemyInit( initEnemies: Enemy[] ) {
  enemies = initEnemies;
}

export function enemyRepeat() {
  moveEnemy();
}

//for each enemy calculate path to player, check if it should move
function moveEnemy(): void {
  gameElement.enemies.forEach((enemy) => {
    if (
      notOccupied(enemy.row + 1, enemy.col) &&
      getRingState(enemy.row + 1, enemy.col) === 8
    ) {
      resetEnemy(
        enemy.row,
        enemy.col,
        enemy.id,
        getMapId(enemy.row, enemy.col),
        enemy.getDrawObjectId()
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

//check and  restore and draw enemy from hole
export function enemyRestoreHole(row: number, col: number) {
  if (getRingState(row, col) === 4) {
    const id = findEnemyId(row, col);
    resetEnemy(row, col, id, 0);
    drawEnemy(row - 1, col, id);
  }
}

export function resetEnemy(
  row: number,
  col: number,
  targetId: number,
  elementId: string,
) {
  const $enemy = $(elementId).remove();
  const enemyElement: HTMLDivElement = $enemy.get(0) as HTMLDivElement;
  removeObject(enemyElement, row, col, targetId);
}