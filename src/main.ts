
import $ from 'jquery'
import { drawPlayer, goLeft, goRight ,goUp ,goDown, redrawPlayer, fall , returnPos, updateAppearance} from './element/player/player.ts'
import { draw_soil, Soil} from './element/soil/soil.ts'
import { draw_ring, getRingState } from './element/ring/ring.ts'
import { draw_ladder, Ladder } from './element/ladder/ladder.ts'


$('#app').html( `
  <div class="app">

  </div>
`);
let ascending
let descending
let falling

function body_keydown( e ) {

    switch ( e.which ) {
        case 37:    // LEFT
        if(!falling){
                goLeft();
                redrawPlayer();
            }
            break;
        case 38:    // UP
            if(ascending){
                goUp();
                redrawPlayer();
            }
            break;
        case 39:    // RIGHT
            if(!falling){
                goRight();
                redrawPlayer();
            }
            break;
        case 40:// DOWN
            if(descending){
                goDown();
                redrawPlayer();
            }
            break;
    }
}

$( 'body' ).on( 'keydown', body_keydown );


let stageDict = {
    'stage-1': {
        'Soil': [
            { row:  2, col:  5, count: 10 } as Soil,
            { row: 15, col: 10, count: 27 } as Soil,
            { row: 19, col:  0, count: 50 } as Soil
        ],
        'Ladder': [
            { row:  40, col: 250, count: 300 } as Ladder,
            { row: 340, col: 500, count: 200 } as Ladder
        ]
    }
};


let ring = draw_ring( $('#app')[0] );
stageDict['stage-1']['Soil'].forEach( function( item: Soil ) {
    for ( let index = 0; index < item.count; index++ ) {
        draw_soil( item.row, item.col + index );
    }
} );
stageDict['stage-1']['Ladder'].forEach( function( item: Ladder ) {
    for ( let index = 0; index < item.count; index++ ) {
        draw_ladder( item.row + index, item.col );
    }
} );

drawPlayer( ring );

let moveladder = function(){
    ascending = false;
    descending = false;
    stageDict['stage-1']['Ladder'].forEach( function( item: Ladder ){
        let leftLadder = item.left;
        let rightLadder = item.left + 30;//width 30
        let bottomLadder = item.bottom ;
        let topLadder = item.height + item.bottom;
        let pos = returnPos();
        let bottomPlayer = pos['position']['y'] - 30 ;
        let middlePlayer = pos['position']['x'] + (pos['width']/2);



        if (middlePlayer >= leftLadder && middlePlayer <= rightLadder &&  bottomPlayer <= topLadder && bottomPlayer >= bottomLadder ){
            ascending = true;
            descending = true;

            if (bottomPlayer == bottomLadder){
                descending = false;
            }
        }
   }

) }
let playerFall = function() {
    falling = true;

    // ASK RING STATE
    // TODO: calculate ROW, COL
    // returnPos(); --> PLAYER-ROW, PLAYER-COL
    // RING -> Convert X, Y -> ROW, COL
    const PLAYER_ROW = 0;
    const PLAYER_COL = 0;
    const state = getRingState( PLAYER_ROW + 1, PLAYER_COL );
    if ( state === 0 ) {
        // FALL
    } else {
        // NOT-FALL
    }


    stageDict['stage-1']['Soil'].forEach( function( item: Soil ){
        let leftPlatform = item.left;
        let rightPlatform = item.width + item.left;
        let topPlatform = item.bottom + 40;
        let pos = returnPos();
        let bottomPlayer = pos['position']['y'] - 30;
        let middlePlayer = pos['position']['x'] + (pos['width']/2);
        if (leftPlatform <= middlePlayer && rightPlatform >= middlePlayer && topPlatform >= (bottomPlayer-4) && topPlatform <= (bottomPlayer + 4)){

            // falling on soil
            falling = false;
            //console.debug(rightPlatform);
            //console.debug(middlePlayer);
        } else if (ascending || descending){
            falling = false;
        }



    });

    if (falling){
        fall();
        redrawPlayer();
    }

};
function execute() {
    moveladder();
    playerFall();
    updateAppearance();
}
let interval = setInterval( execute , 50 );


// fallilng on ladder with speed
