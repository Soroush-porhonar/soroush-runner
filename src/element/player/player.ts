import "./player.css";
import $ from "jquery";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { Soil, draw_soil, resetSoil } from "./../soil/soil.ts";

export class Player {
  col: number;
  row: number;

  constructor(col: number, row: number) {
    this.col = col;
    this.row = row;
  }
}

let player: object;
export let playerState: string = "falling";
let BehindPlayerId: number;

export function resetPlayer(row: number, col: number, targetId: number) {
  const $player = $("#player").remove();

  removeObject($player, row, col, targetId);
}

export function draw_player(row: number, col: number) {
  player = { row, col };
  const OBJECT_ID: number = 3;
  const $player = $("<div></div>").attr("id", "player").addClass("player");
  BehindPlayerId = getRingState(row, col);
  addObject($player, row, col, OBJECT_ID);
}

export function playerFall() {
  let underboxId: number = getRingState(player.row + 1, player.col);
  if (underboxId == 0) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row = player.row + 1;
    draw_player(player.row, player.col);
    playerState = "falling";
  } else {
    if (playerState != "climbing") {
      playerState = "standing";
    }
  }
}

export function goLeft() {
  //playerState = "walking-left";
  let leftboxId: number = getRingState(player.row, player.col - 1);
  if ((playerState == "standing") & (leftboxId == 0 || leftboxId == 2)) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.col = player.col - 1;
    draw_player(player.row, player.col);
  }
  //playerState = "standing";
}

export function goRight() {
  //playerState = "walking-right";
  let rightboxId: number = getRingState(player.row, player.col + 1);
  if ((playerState == "standing") & (rightboxId == 0 || rightboxId == 2)) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.col = player.col + 1;
    draw_player(player.row, player.col);
  }
  //playerState = "standing";
}

export function goUp() {
  let upperboxId: number = getRingState(player.row - 1, player.col);
  if (BehindPlayerId == 2) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row = player.row - 1;
    draw_player(player.row, player.col);
    playerState = "climbing";
    if (!(upperboxId == 2)) {
      playerState = "standing";
    }
  }
}

export function goDown() {
  let underboxId: number = getRingState(player.row + 1, player.col);
  if (underboxId == 2) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row = player.row + 1;
    draw_player(player.row, player.col);
    playerState = "climbing";
    if (!(getRingState(player.row + 1, player.col) == 2)) {
      playerState = "standing";
    }
  }
}

export function digLeft() {
  //playerState = "walking-left";
  const leftAxe: object = new Soil(player.row + 1, player.col - 1);
  const leftAxeId: number = getRingState(leftAxe.col, leftAxe.row);
  if ((playerState == "standing") & (leftAxeId == 1)) {
    resetSoil(leftAxe.col, leftAxe.row, 0);
    setTimeout(() => {
      draw_soil(leftAxe.col, leftAxe.row);
    }, 2000);
  }
  //playerState = "standing";
}

export function digRight() {
  //playerState = "walking-left";
  const rightAxe: object = new Soil(player.row + 1, player.col + 1);
  const rightAxeId: number = getRingState(rightAxe.col, rightAxe.row);

  if ((playerState == "standing") & (rightAxeId == 1)) {
    resetSoil(rightAxe.col, rightAxe.row, 0);
    setTimeout(() => {
      draw_soil(rightAxe.col, rightAxe.row);
    }, 2000);
  }
  //playerState = "standing";
}
/*






export function updateAppearance() {
  const $p = $("#player");
  if (direction !== "") {
    if (direction == "up" || direction == "down") {
      if (!$p.hasClass("pixel-behind")) {
        $p.addClass("pixel-behind")
          .removeClass("pixel-walk")
          .removeClass("pixel-stand");
      }
    } else {
      if (direction == "left") {
        if (!$p.hasClass("pixel-walk")) {
          $p.addClass("pixel-walk")
            .removeClass("pixel-stand")
            .removeClass("pixel-behind")
            .css("transform", "scaleX(-1)");
        }
      } else {
        if (direction == "right") {
          if (!$p.hasClass("pixel-walk")) {
            $p.addClass("pixel-walk")
              .removeClass("pixel-stand")
              .removeClass("pixel-behind")
              .css("transform", "scaleX(1)");
          }
        }
      }
    }
  } /* else {
    if (!$p.hasClass("pixel-stand")) {
      $p.addClass("pixel-stand")
        .removeClass("pixel-walk")
        .removeClass("pixel-behind");
    }
  }
  direction = ""; // Reset for the next frame
}
*/
