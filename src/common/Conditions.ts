import { golds } from "./../element/gold/gold.ts";
import { drawWLadder } from "./stage.ts";
import { searchHole } from "./../element/soil/soil.ts";
import { player } from "./../element/player/player.ts";
import { getRingState } from "./../element/ring/ring.ts";

export function Rules(){
    winingRule();
    losingRule();
    }
let Wladder = false;
function winingRule(){
    if(!Wladder){
        if(golds.length === 0 ){
            drawWLadder();
            Wladder = true;
        }
    }
    else{
        if(player.row === -1){
            alert("You won")
            }
        }


    }

function enemytouch(row, col){
        if(getRingState(row , col-1) === 4){
                return true;
        }
        if(getRingState(row , col+1) === 4){
                return true;
        }
        if(getRingState(row -1, col) === 4){
                return true;
        }
        if(getRingState(row + 1, col) === 4 && !searchHole(row + 1, col)){
                return true;
        }
    return false;
        }

function losingRule(){
    const playerInHole = searchHole(player.row, player.col);
    const playerInTouch = enemytouch(player.row, player.col);

    if(playerInHole || playerInTouch){
        setTimeout(() => {
            alert("you lost");

          }, 500);
        }
    }
