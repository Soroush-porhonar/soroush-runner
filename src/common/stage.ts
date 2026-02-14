import $ from "jquery";
import { draw_soil } from "./../element/soil/soil.ts";
import { draw_ladder } from "./../element/ladder/ladder.ts";
import { drawEnemy, Enemy, enemyInit } from "./../element/enemy/enemy.ts";
import { drawBar } from "./../element/bar/bar.ts";
import { draw_player, Player } from "./../element/player/player.ts";
import { drawGold, Gold, goldInit } from "./../element/gold/gold.ts";
import { drawConc } from "./../element/concrete/conc.ts";
import { createZeroRing } from "./../element/ring/ring.ts";

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
  Player: Player[];
  Enemy: Enemy[];
  Bar: BarRow[];
  Gold: Gold[];
  Conc: ConcRow[];
  WLadder: LadderCol[];
}
interface StageDict {
  [key: string]: Stage; // Allows for dynamic stage names
}

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
    Player: [{ row: 10, col: 25 } as Player],
    Enemy: [
      { row: 25, col: 10, id: 0 } as Enemy,
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

export function drawStage(): void {
  stageDict["stage-1"]["Soil"].forEach(function (item: SoilRow): void {
    for (let index = 0; index < item.count; index++) {
      draw_soil(item.row, item.col + index);
    }
  });

  stageDict["stage-1"]["Conc"].forEach(function (item: ConcRow): void {
    for (let index = 0; index < item.count; index++) {
      drawConc(item.row, item.col + index);
    }
  });

  stageDict["stage-1"]["Ladder"].forEach(function (item: LadderCol): void {
    for (let index = 0; index < item.count; index++) {
      draw_ladder(item.row + index, item.col);
    }
  });

  stageDict["stage-1"]["Bar"].forEach(function (item: BarRow): void {
    for (let index = 0; index < item.count; index++) {
      drawBar(item.row, item.col + index);
    }
  });

  stageDict["stage-1"]["Gold"].forEach(function (item: Gold): void {
    drawGold(item.row, item.col, item.id);
  });

  stageDict["stage-1"]["Player"].forEach(function (item: Player): void {
    draw_player(item.row, item.col);
  });

  stageDict["stage-1"]["Enemy"].forEach(function (item: Enemy): void {
    drawEnemy(item.row, item.col, item.id);
  });
}

export function drawWLadder(): void {
  stageDict["stage-1"]["WLadder"].forEach(function (item: LadderCol): void {
    for (let index = 0; index < item.count; index++) {
      draw_ladder(item.row + index, item.col);
    }
  });
}
export function LevelInit(): void {
  $("#ring").empty();
  createZeroRing();
  enemyInit();
  goldInit();
  drawStage();
}
