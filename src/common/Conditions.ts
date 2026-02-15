import { golds } from "./../element/gold/gold.ts";
import { drawWLadder, LevelInit } from "./stage.ts";
import { getMapId } from "./../element/enemy/pathfinding.ts";
import { player } from "./../element/player/player.ts";
import { getRingState } from "./../element/ring/ring.ts";
import type { Enemy } from "../element/enemy/enemy.ts";

export function Rules(): void {
  winingRule();
  losingRule();
}


let gameState: GameState;
let gameElement: GameElement;

export function getStageName(): string {
  return gameState.stageName;
}

function resetStateToDefault(): void {
  gameState = {
    score: 0,
    life: 3,
    gameOver: false,
    lose: false,
    win: false,
    Wladder: false,
    stageName: "stage-1",   // TODO: change later based on the level
  };
}

resetStateToDefault();
function winingRule(): void {
  if (!gameState.Wladder) {
    if (golds.length === 0) {
      drawWLadder();
      gameState.Wladder = true;
    }
  } else {
    if (player.row === -1) {
      alert("╰(*°▽°*)╯ You won ╰(*°▽°*)╯");
      resetStateToDefault();
    }
  }
}

function enemytouch(row: number, col: number): boolean {
  const enemyOnLeft: boolean =
    getRingState(row, col - 1) === 4 && getRingState(row + 1, col - 1) !== 8;
  if (enemyOnLeft) {
    return true;
  }

  const enemyOnRight: boolean =
    getRingState(row, col + 1) === 4 && getRingState(row + 1, col + 1) !== 8;
  if (enemyOnRight) {
    return true;
  }

  const enemyOnup: boolean = getRingState(row - 1, col) === 4;
  if (enemyOnup) {
    return true;
  }

  const enemyOnDown: boolean =
    getRingState(row + 1, col) === 4 && getMapId(row + 1, col) !== 1;
  if (enemyOnDown) {
    return true;
  }
  return false;
}

function losingRule(): void {
  const playerInHole: boolean = getMapId(player.row, player.col) === 1;
  const playerInTouch: boolean = enemytouch(player.row, player.col);

  if (playerInHole || playerInTouch) {
    if (gameState.life === 0) {
      alert(";_; Game Over ;_;");
      resetStateToDefault();
      LevelInit();
    } else {
      gameState.life--;
      setTimeout((): void => {
        alert("O_O You died O_O");
        LevelInit();
      }, 150);
    }
  }
}
