import "./player.css";
import $ from "jquery";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { handleHoleChar } from "./../hole/hole.ts";
import {
  Soil,
  draw_soil,
  resetSoil
} from "./../soil/soil.ts";
import {getMapId} from "./../enemy/pathfinding.ts";
import {
  drawEnemy,
  enemies,
  resetEnemy,
} from "./../enemy/enemy.ts";

export class Player {
  row: number;
  col: number;
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}

export let player: Player;

//current image for player
let playerImg: string = "src/element/player/player-images/player-standing.png";

export function playerInit() {
  playerFall();

}

// change state of player effecting logic of game only
function changeState() {
  let state: string;
  const underboxId: number = getRingState(player.row + 1, player.col);

  if (underboxId === 0 || underboxId === 5 || underboxId === 6 || underboxId === 8 ) {
    state = "falling";
  }
  //check player not be in hole
  if (getMapId(player.row, player.col) === 1) {
    state = "standing";
  }
  if (underboxId === 1 || underboxId === 2 || underboxId === 4) {
    state = "standing";
  }
  if (getMapId(player.row, player.col) === 2) {
    state = "climbing";
  }
  if (getMapId(player.row, player.col) === 5) {
    state = "hanging";
  }

  return state;
}

//updating image based on keydown and up for player visual
export function visState(input) {
    const state = changeState()

  if (input === "still" ) {
      if (state === "hanging"){
          playerImg = "./src/element/player/player-images/player-hanging-still.png";
          }
      if(state === "standing"){
          playerImg = "./src/element/player/player-images/player-standing.png";
          }
      //return;
  }
  if (input === "left" ) {
      if (state === "hanging"){
          playerImg = "./src/element/player/player-images/player-hanging-left.png";
          }
      if (state === "standing"){
          playerImg = "./src/element/player/player-images/player-walk-left.png";
          }
      //return;
  }
  if (input === "right") {
      if (state === "hanging"){
          playerImg = "./src/element/player/player-images/player-hanging-right.png";
          }
      if (state === "standing"){
          playerImg = "./src/element/player/player-images/player-walk-right.png";
          }
      //return;
  }
  if ((input === "up" || input === "down") && state === "climbing") {
      playerImg = "./src/element/player/player-images/player-climbing.png";
  }
  if(state === "falling"){
      playerImg = "./src/element/player/player-images/player-hanging-still.png";
      }

  //forcing a redraw to update the image on spot not after a move
  resetPlayer(player.row, player.col, getMapId(player.row, player.col));
  draw_player(player.row, player.col);
}

// removing the player box, making it empty
export function resetPlayer(row: number, col: number, targetId: number) {
  const $player = $("#player").remove();
  removeObject($player, row, col, targetId);
}

export function draw_player(row: number, col: number) {
  player = { row, col };
  const OBJECT_ID: number = 3;
  const $player = $("<img>")
    .attr("id", "player")
    .attr("src", playerImg) // Set the source of the image
    .addClass("player");
  // save id of Box which player is in now, to restore it after player moved
  addObject($player, row, col, OBJECT_ID);
}

export function playerFall() {
  if (changeState() == "falling") {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row++;
    draw_player(player.row, player.col);
  }
}

export function goLeft() {
  const leftboxId: number = getRingState(player.row, player.col - 1);
  if (
    (changeState() === "standing" ||
      changeState() === "climbing" ||
      changeState() === "hanging") &
    (leftboxId == 0 || leftboxId == 2 || leftboxId == 5 || leftboxId == 6)
  ) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.col--;
    draw_player(player.row, player.col);
  }
}

export function goRight() {
  const rightboxId: number = getRingState(player.row, player.col + 1);
  if (
    (changeState() == "standing" ||
      changeState() == "climbing" ||
      changeState() === "hanging") &
    (rightboxId == 0 || rightboxId == 2 || rightboxId == 5 || rightboxId == 6)
  ) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.col++;
    draw_player(player.row, player.col);
  }
}

export function goUp() {
  if (changeState() == "climbing") {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row--;
    draw_player(player.row, player.col);
  }
}

export function goDown() {
  const underboxId: number = getRingState(player.row + 1, player.col);
  if (underboxId == 2 || changeState() === "hanging") {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row++;
    draw_player(player.row, player.col);
  }
}

export function digLeft() {
  const leftAxe: Soil = new Soil(player.row + 1, player.col - 1);
  const leftAxeId: number = getRingState(leftAxe.row, leftAxe.col);
  if ((changeState() == "standing") & (leftAxeId == 1)) {
    handleHoleChar(leftAxe.row, leftAxe.col);
  }
}

export function digRight() {
  const rightAxe: Soil = new Soil(player.row + 1, player.col + 1);
  const rightAxeId: number = getRingState(rightAxe.row, rightAxe.col);
  if ((changeState() == "standing") & (rightAxeId == 1)) {
    handleHoleChar(rightAxe.row, rightAxe.col);
  }
}

//checking if player is in hole and pushing it upward on surface again
/*export function playerRestoreHole(row, col) {
  if (getRingState(row, col) === 3) {
    resetPlayer(row, col, 0);
    draw_player(row - 1, col);
    removePath(row, col);
  }
}*/



