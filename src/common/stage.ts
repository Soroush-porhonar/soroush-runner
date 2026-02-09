import { draw_soil, Soil } from "./../element/soil/soil.ts";
import { draw_ladder, Ladder } from "./../element/ladder/ladder.ts";
import { drawEnemy, Enemy, enemyInit } from "./../element/enemy/enemy.ts";
import { drawBar, Bar } from "./../element/bar/bar.ts";
import {draw_player, Player, playerInit } from "./../element/player/player.ts";
import { drawGold, Gold, goldInit } from "./../element/gold/gold.ts";
import { drawConc, Conc } from "./../element/concrete/conc.ts";
let stageDict = {
  "stage-1": {
    Soil: [
      { row: 2, col: 5, count: 7 } as Soil,
      { row: 20, col: 5, count: 17 } as Soil,
      { row: 28, col: 0, count: 60 } as Soil,
      { row: 17, col: 25, count: 31 } as Soil,
      { row: 5, col: 25, count: 20 } as Soil,
      { row: 11, col: 20, count: 5 } as Soil,
      { row: 5, col: 50, count: 5 } as Soil,
    ],
    Ladder: [
      { row: 20, col: 14, count: 8 } as Ladder,
      { row: 2, col: 10, count: 18 } as Ladder,
      { row: 17, col: 50, count: 11 } as Ladder,
      { row: 5, col: 40, count: 12 } as Ladder,
    ],
    Player: [{ row: 10, col: 25 } as Player],
    Enemy: [
      { row: 25, col: 10, id: 0 } as Enemy,
      { row: 23, col: 55, id: 1 } as Enemy,
      { row: 2, col: 40, id: 2 } as Enemy,
      { row: 1, col: 11, id: 3 } as Enemy,
    ],
    Bar: [
        { row: 8, col: 11, count: 29 } as Bar,
        { row: 16, col: 11, count: 15 } as Bar,
        { row: 4, col: 45, count: 7 } as Bar
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
    Conc: [{ row: 29, col: 0, count: 90 } as Conc],
    WLadder: [{ row: 0, col: 30, count: 5 } as Ladder],
  },
};


export function drawStage(){
    stageDict["stage-1"]["Soil"].forEach(function (item: Soil) {
      for (let index = 0; index < item.count; index++) {
        draw_soil(item.row, item.col + index);
      }
    });

    stageDict["stage-1"]["Conc"].forEach(function (item: Conc) {
      for (let index = 0; index < item.count; index++) {
        drawConc(item.row, item.col + index);
      }
    });

    stageDict["stage-1"]["Ladder"].forEach(function (item: Ladder) {
      for (let index = 0; index < item.count; index++) {
        draw_ladder(item.row + index, item.col);
      }
    });

    stageDict["stage-1"]["Bar"].forEach(function (item: Bar) {
      for (let index = 0; index < item.count; index++) {
        drawBar(item.row, item.col + index);
      }
    });

    stageDict["stage-1"]["Gold"].forEach(function (item: Gold) {
      drawGold(item.row, item.col, item.id);
    });

    stageDict["stage-1"]["Player"].forEach(function (item: Player) {
      draw_player(item.row, item.col);
    });

    stageDict["stage-1"]["Enemy"].forEach(function (item: Enemy) {
      drawEnemy(item.row, item.col, item.id);
    });
}

export function drawWLadder(){
    stageDict["stage-1"]["WLadder"].forEach(function (item: Ladder) {
          for (let index = 0; index < item.count; index++) {
            draw_ladder(item.row + index, item.col);
          }
        });

    }