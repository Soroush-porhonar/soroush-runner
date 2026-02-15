import "./player.css";
import $ from "jquery";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { handleHoleChar } from "./../hole/hole.ts";
import { Soil } from "./../soil/soil.ts";
import { getMapId } from "./../enemy/pathfinding.ts";

const START_IMAGE_URI: string = "src/element/player/player-images/player-standing.png";

export class Player {
  row: number;
  col: number;
  imageUri: string;
  
  constructor(row: number, col: number, imageUri: string | undefined) {
    this.row = row;
    this.col = col;
    this.imageUri = ( imageUri === undefined )
      ? START_IMAGE_URI
      : imageUri;
  }
}

export let player: Player;

enum PlayerState {
  Falling,
  Standing,
  Climbing,
  Hanging,
}

enum Input {
  Still,
  Up,
  Down,
  Right,
  Left,
}

export function playerRepeat() {
  playerFall();
}

// change state of player effecting logic of game only
function changeState() {
  let state = getPlayerStateByPlayerPosition( player );
  if ( state !== undefined ) {
    return state;
  }
  
  return getPlayerStateByUnderboxPosition( player );
}

function getPlayerStateByUnderboxPosition( player: Player ): PlayerState {
  const underboxId: number = getRingState(player.row + 1, player.col);

  if ( underboxId == 3 ) {
    throw new Error("Player cannot be under Player!!");
  }

  let isFallingCondition = underboxId === 0 ||
    underboxId === 5 ||
    underboxId === 6 ||
    underboxId === 8;

  return isFallingCondition 
    ? PlayerState.Falling
    : PlayerState.Standing;
}

function getPlayerStateByPlayerPosition( player: Player ): PlayerState | undefined {
  const playerMapId = getMapId(player.row, player.col);

  const MAPPER: Record<number, PlayerState> = {
    1: PlayerState.Standing,
    2: PlayerState.Climbing,
    5: PlayerState.Hanging,
  }

  return MAPPER[ playerMapId ];
}

//updating image based on keydown and up for player visual
export function visState(input: Input) {
  const state = changeState();

  const playerImageUri = getPlayerImageUri( input, state );
   //forcing a redraw to update the image on spot not after a move
  const mapId = getMapId(player.row, player.col);
  resetPlayer(player.row, player.col, mapId);
  draw_player(player.row, player.col, playerImageUri);
}

function getPlayerImageUri( input: Input, state: PlayerState ): string | undefined {
   if (input === Input.Still) {
    if (state === PlayerState.Hanging) {
      return "./src/element/player/player-images/player-hanging-still.png";
    }
    if (state === PlayerState.Standing) {
      return "./src/element/player/player-images/player-standing.png";
    }
  }
  if (input === Input.Left) {
    if (state === PlayerState.Hanging) {
      return "./src/element/player/player-images/player-hanging-left.png";
    }
    if (state === PlayerState.Standing) {
      return "./src/element/player/player-images/player-walk-left.png";
    }
  }
  if (input === Input.Right) {
    if (state === PlayerState.Hanging) {
      return "./src/element/player/player-images/player-hanging-right.png";
    }
    if (state === PlayerState.Standing) {
      return "./src/element/player/player-images/player-walk-right.png";
    }
  }
  if ((input === Input.Up || input === Input.Down) && state === PlayerState.Climbing) {
    return "./src/element/player/player-images/player-climbing.png";
  }
  if (state === PlayerState.Falling) {
    return "./src/element/player/player-images/player-hanging-still.png";
  }

  return undefined;
}

// removing the player box, making it empty
export function resetPlayer(row: number, col: number, targetId: number) {
  const $player = $("#player").remove();
  removeObject($player, row, col, targetId);
}


export function draw_player(row: number, col: number, playerImageUri: string | undefined = undefined) {
  const OBJECT_ID: number = 3;

  player.col = col;
  player.row = row;
  if ( playerImageUri !== undefined ) {
    player.imageUri = playerImageUri;
  }

  const $player = $("<img>")
    .attr("id", "player")
    .attr("src", player.imageUri) // Set the source of the image
    .addClass("player");
  // save id of Box which player is in now, to restore it after player moved
  addObject($player, row, col, OBJECT_ID);
}

export function playerFall() {
  if (changeState() == PlayerState.Falling) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row++;
    draw_player(player.row, player.col);
  }
}

export function goLeft() {
  const leftboxId: number = getRingState(player.row, player.col - 1);
  if (
    (changeState() === PlayerState.Standing ||
      changeState() === PlayerState.Climbing ||
      changeState() === PlayerState.Hanging) &&
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
    (changeState() === PlayerState.Standing ||
      changeState() === PlayerState.Climbing ||
      changeState() === PlayerState.Hanging) &&
    (rightboxId == 0 || rightboxId == 2 || rightboxId == 5 || rightboxId == 6)
  ) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.col++;
    draw_player(player.row, player.col);
  }
}

export function goUp() {
  if (changeState() === PlayerState.Climbing) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row--;
    draw_player(player.row, player.col);
  }
}

export function goDown() {
  const underboxId: number = getRingState(player.row + 1, player.col);
  if (underboxId === 2 || (changeState() === PlayerState.Hanging) && (underboxId !== 1)) {
    resetPlayer(player.row, player.col, getMapId(player.row, player.col));
    player.row++;
    draw_player(player.row, player.col);
  }
}

export function digLeft() {
  const leftAxe: Soil = new Soil(player.row + 1, player.col - 1);
  const leftAxeId: number = getRingState(leftAxe.row, leftAxe.col);
  if ((changeState() === PlayerState.Standing) && (leftAxeId === 1)) {
    handleHoleChar(leftAxe.row, leftAxe.col);
  }
}

export function digRight() {
  const rightAxe: Soil = new Soil(player.row + 1, player.col + 1);
  const rightAxeId: number = getRingState(rightAxe.row, rightAxe.col);
  if ((changeState() === PlayerState.Standing) && (rightAxeId === 1)) {
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
