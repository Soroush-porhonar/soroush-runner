import $ from "jquery";
import {
  draw_player,
  Player,
  playerFall,
  goLeft,
  goRight,
  goDown,
  goUp,
  playerState,
  digRight,
  digLeft,
  //updateAppearance,
} from "./element/player/player.ts";
import { drawEnemy, Enemy, enemyFall } from "./element/enemy/enemy..ts";
import { draw_soil, Soil } from "./element/soil/soil.ts";
import { draw_ring } from "./element/ring/ring.ts";
import { draw_ladder, Ladder } from "./element/ladder/ladder.ts";

$("#app").html(`
  <div class="app">

  </div>
`);

let gametime: number = 0;
function body_keydown(e) {
  switch (e.which) {
    case 37: // LEFT
      goLeft();
      break;
    case 38: // UP
      goUp();
      break;
    case 39: // RIGHT
      goRight();
      break;
    case 40: // DOWN
      goDown();
      break;
    case 69: // dig right
      digRight();
      break;
    case 81: // dig left
      digLeft();
      break;
  }
}

$("body").on("keydown", body_keydown);

let stageDict = {
  "stage-1": {
    Soil: [
      { row: 2, col: 5, count: 10 } as Soil,
      { row: 15, col: 10, count: 27 } as Soil,
      { row: 29, col: 0, count: 90 } as Soil,
    ],
    Ladder: [
      { row: 15, col: 25, count: 14 } as Ladder,
      { row: 2, col: 12, count: 13 } as Ladder,
    ],
    Player: [{ row: 10, col: 15 } as Player],
    Enemy: [
      { row: 17, col: 12, id: 0 } as Enemy,
      { row: 12, col: 18, id: 1 } as Enemy,
      { row: 14, col: 20, id: 2 } as Enemy,
      { row: 20, col: 15, id: 3 } as Enemy,
    ],
  },
};

let ring = draw_ring($("#app")[0]);

stageDict["stage-1"]["Soil"].forEach(function (item: Soil) {
  for (let index = 0; index < item.count; index++) {
    draw_soil(item.row, item.col + index);
  }
});

stageDict["stage-1"]["Ladder"].forEach(function (item: Ladder) {
  for (let index = 0; index < item.count; index++) {
    draw_ladder(item.row + index, item.col);
  }
});

stageDict["stage-1"]["Player"].forEach(function (item: Player) {
  draw_player(item.row, item.col);
});

stageDict["stage-1"]["Enemy"].forEach(function (item: Enemy) {
  drawEnemy(item.row, item.col, item.id);
});

function execute() {
  playerFall();
  enemyFall();
  console.log(playerState);
  gametime;
}
let interval = setInterval(execute, 200);
