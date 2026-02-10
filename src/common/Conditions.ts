import $ from "jquery";
import { golds } from "./../element/gold/gold.ts";
import { drawWLadder , drawStage, LevelInit} from "./stage.ts";
import { getMapId} from "./../element/enemy/pathfinding.ts";
import { player } from "./../element/player/player.ts";
import { getRingState, createZeroRing, RING } from "./../element/ring/ring.ts";
import { enemies } from "./../element/enemy/enemy.ts";


export function Rules(){
    winingRule();
    losingRule();
    }


let initialState;
let gameState;


function StatsDefault() {
  initialState = {
    score: 0,
    life: 3,
    gameOver: false,
    lose: false,
    win: false,
    Wladder : false
  };
  //gameState = structuredClone(initialState);
}
StatsDefault()
function winingRule(){
    if(!initialState.Wladder){
        if(golds.length === 0 ){
            drawWLadder();
            initialState.Wladder = true;
        }
    }
    else{
        if(player.row === -1){
            alert("╰(*°▽°*)╯ You won ╰(*°▽°*)╯")
            StatsDefault();
            }
        }


    }

function enemytouch(row, col){
        if(getRingState(row , col-1 ) === 4 && getRingState(row + 1, col -1 )!==8){
                return true;
        }
        if(getRingState(row , col+1 ) === 4 && getRingState(row + 1, col +1 )!==8){
                return true;
        }
        if(getRingState(row -1, col) === 4 ){
                return true;
        }
        if(getRingState(row + 1, col) === 4 && getMapId(row + 1, col)!==1){
                return true;
        }
    return false;
}

function losingRule(){
    const playerInHole = getMapId(player.row, player.col) === 1;
    const playerInTouch = enemytouch(player.row, player.col);

    if(playerInHole || playerInTouch){


        if(initialState.life === 0){
            alert(";_; Game Over ;_;")
            StatsDefault();
            LevelInit();

            }
        else{
            initialState.life --
            setTimeout(() => {
                alert("O_O You died O_O");
                LevelInit();
            }, 150);
            }



        }
    }

