import $ from "jquery";
import {draw_player, Player, playerInit } from "./element/player/player.ts";
import {body_keydown, body_keyup } from "./element/player/movement.ts";
import { drawEnemy, Enemy, enemyInit } from "./element/enemy/enemy.ts";
import { draw_soil, Soil } from "./element/soil/soil.ts";
import { draw_ring } from "./element/ring/ring.ts";
import { draw_ladder, Ladder } from "./element/ladder/ladder.ts";
import { drawBar, Bar } from "./element/bar/bar.ts";
import { drawGold, Gold, goldInit } from "./element/gold/gold.ts";
import { drawConc, Conc } from "./element/concrete/conc.ts";

$("#app").html(`
  <div class="app">

  </div>
`);

$("body").on("keydown", body_keydown);
$("body").on("keyup", body_keyup);

let stageDict = {
  "stage-1": {
    Soil: [
      { row: 2, col: 5, count: 7 } as Soil,
      { row: 15, col: 5, count: 13 } as Soil,
      { row: 28, col: 0, count: 60 } as Soil,
      { row: 13, col: 25, count: 30 } as Soil,
    ],
    Ladder: [
      { row: 15, col: 14, count: 13 } as Ladder,
      { row: 2, col: 10, count: 13 } as Ladder,
      { row: 2, col: 50, count: 11 } as Ladder,
    ],
    Player: [{ row: 10, col: 15 } as Player],
    Enemy: [
      { row: 25, col: 12, id: 0 } as Enemy,
      { row: 11, col: 18, id: 1 } as Enemy,
      { row: 27, col: 16, id: 2 } as Enemy,
    ],
    Bar: [{ row: 8, col: 11, count: 39 } as Bar],
    Gold: [
      { row: 12, col: 40, id: 0 } as Gold,
      { row: 27, col: 40, id: 1 } as Gold,
    ],
    Conc: [{ row: 29, col: 0, count: 90 } as Conc],
  },
};

let ring = draw_ring($("#app")[0]);

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

function execute() {
  playerInit();
  enemyInit();
  goldInit();
}
let interval = setInterval(execute, 200);
