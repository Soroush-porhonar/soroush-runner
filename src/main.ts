
import $ from 'jquery'
import { drawPlayer, goLeft, goRight ,goUp ,goDown, redrawPlayer, fall , returnPos, updateAppearance} from './element/player/player.ts'
import { draw_soil, Soil} from './element/soil/soil.ts'
import { draw_ring } from './element/ring/ring.ts'
import {draw_ladder} from './element/ladder/ladder.ts'


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
            { left: 0, bottom: 0, width: 5000 } as Soil,
            { left: 50, bottom: 300, width: 500 } as Soil,
            {left: 450, bottom: 500, width: 600} as Soil
        ],
        'Ladder': [
            {left: 250, bottom: 40, height: 300} as Ladder,
            {left: 500, bottom: 340, height: 200} as Ladder
        ]
    }
};


let ring = draw_ring( $('#app')[0] );
stageDict['stage-1']['Soil'].forEach( function( item: Soil ) {
    draw_soil( ring, item.left, item.bottom, item.width );
} );
stageDict['stage-1']['Ladder'].forEach( function( item: Ladder ) {
    draw_ladder( ring, item.left, item.bottom, item.height );
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
