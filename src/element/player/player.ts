import "./player.css";
import $ from "jquery";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { Soil, draw_soil, resetSoil, handleHoleChar ,searchHole} from "./../soil/soil.ts";
import { removePath, addPath } from "./../enemy/pathfinding.ts";
import { drawEnemy , enemies, findEnemyId, resetEnemy} from "./../enemy/enemy.ts";


export class Player {
  row: number;
  col: number;
  constructor(row: number,col: number)  {
    this.row = row;
    this.col = col;
  }
}


export let player: Player;
let BehindPlayerId: number;
//current image for player
let playerImg:string = "./src/element/player/player-standing.png";


// change state of player effecting logic of game only
function changeState(){
    let state : string;
    const underboxId: number = getRingState(player.row + 1, player.col);

        if (underboxId === 0 || underboxId === 5) {
            state = "falling";
            }
        //check player not be in hole
        if (searchHole(player.row , player.col)){
            state = "standing"
            }
        if (underboxId === 1 || underboxId===2 || underboxId===4){
            state = "standing"
            }
        if(BehindPlayerId === 2 ){
            state = "climbing";
            }
        if(BehindPlayerId === 5 ){
            state = "hanging";
            }

    return state
};


//updating image based on keydown and up for player visual
export function visState(input){
    if (input === "standing"){
        playerImg =  "./src/element/player/player-standing.png"
        }
    if (input === "walking-left"){
        playerImg =  "./src/element/player/player-walk-left.png"
        }
    if (input === "walking-right"){
        playerImg =  "./src/element/player/player-walk-right.png"
        }
    //forcing a redraw to update the image on spot not after a move
    resetPlayer(player.row, player.col, BehindPlayerId);
    draw_player(player.row, player.col);
}

// removing the player box, making it empty
export function resetPlayer(row: number, col: number, targetId: number) {
  const $player = $("#player").remove();
  removeObject($player, row, col, targetId);
  //addPath(row, col);

}

export function draw_player(row: number, col: number) {

  player = { row, col };
  const OBJECT_ID: number = 3;
  const $player = $("<img>")
      .attr("id", "player")
      .attr("src", playerImg) // Set the source of the image
      .addClass("player");

  // save id of Box which player is in now, to restore it after player moved
  BehindPlayerId = getRingState(row, col);
  addObject($player, row, col, OBJECT_ID);
  //removePath(row, col);

}

export function playerFall() {
    if (changeState() == "falling") {

    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row++;
    draw_player(player.row, player.col);

    // add player Pos to path to continue enemy search
    if(searchHole(player.row , player.col)){addPath(player.row, player.col);};
    }
}


export function goLeft() {
  const leftboxId: number = getRingState(player.row, player.col - 1);
  if ((changeState() === "standing" ||changeState() === "climbing" || changeState() === "hanging") & (leftboxId == 0 || leftboxId == 2 || leftboxId == 5 || leftboxId == 6 )) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.col = player.col - 1;
    draw_player(player.row, player.col);
  }
}

export function goRight() {
  const rightboxId: number = getRingState(player.row, player.col + 1);
  if ((changeState() == "standing" || changeState() == "climbing" || changeState() === "hanging") & (rightboxId == 0 || rightboxId == 2 || rightboxId == 5 || rightboxId == 6)) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.col = player.col + 1;
    draw_player(player.row, player.col);
  }
}

export function goUp() {
  if (changeState() == "climbing") {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row --;
    draw_player(player.row, player.col);

  }
}

export function goDown() {
  const underboxId: number = getRingState(player.row + 1, player.col);
  if (underboxId == 2 || changeState() === "hanging" ) {
    resetPlayer(player.row, player.col, BehindPlayerId);
    player.row ++;
    draw_player(player.row, player.col);
  }
}

export function digLeft() {
  const leftAxe: object = new Soil(player.row + 1, player.col - 1);
  const leftAxeId: number = getRingState(leftAxe.row, leftAxe.col);
  if ((changeState() == "standing") & (leftAxeId == 1)) {
    handleHoleChar(leftAxe.row, leftAxe.col);
  };

}


export function digRight() {

  const rightAxe: Soil = new Soil(player.row + 1, player.col + 1);
  const rightAxeId: number = getRingState(rightAxe.row, rightAxe.col);
  if ((changeState() == "standing") & (rightAxeId == 1)) {
    handleHoleChar(rightAxe.row, rightAxe.col);

  }
}
//checking if player is in hole and pushing it upward on surface again
export function playerRestoreHole(row, col){
    if (getRingState(row, col) === 3){
        resetPlayer(row, col, 0 );
        draw_player(row - 1, col);
        removePath(row, col);

    };

}
