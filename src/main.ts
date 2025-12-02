
import $ from 'jquery'
import { drawPlayer, goLeft, goRight ,goUp , redrawPlayer, fall } from './element/player/player.ts'
import { draw_soil, Soil} from './element/soil/soil.ts'
import { draw_ring } from './element/ring/ring.ts'
import {draw_ladder} from './element/ladder/ladder.ts'


$('#app').html( `
  <div class="app">

  </div>
`);
let inLadder ;

function body_keydown( e ) {

    switch ( e.which ) {
        case 37:    // LEFT
            goLeft();
            redrawPlayer();
            break;
        case 38:    // UP
            if(inLadder){
                goUp();
                redrawPlayer();
            }
            break;
        case 39:    // RIGHT
            goRight();
            redrawPlayer();
            break;
        case 40:    // DOWN
            break;
    }
}

$( 'body' ).on( 'keydown', body_keydown );


let stageDict = {
    'stage-1': {
        'Soil': [
            { left: 0, bottom: 0, width: 5000 } as Soil,
            { left: 50, bottom: 300, width: 500 } as Soil,
        ],
        'Ladder': [
            {left: 250, bottom: 50, height: 247} as Ladder
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
    inLadder = false;
    stageDict['stage-1']['Ladder'].forEach( function( item: Ladder ){
        let leftLadder = item.left;
        let rightLadder = item.left + 30;//width 30
        let bottomLadder = item.bottom ;
        let topLadder = item.height + item.bottom;
        let bottomPlayer = parseFloat(window.getComputedStyle($('#player')[0]).bottom) ;
        let middlePlayer = (parseFloat(window.getComputedStyle($('#player')[0]).left) + parseFloat(window.getComputedStyle($('#player')[0]).width))/2;
        //console.debug("middlePlayer",middlePlayer)
        //console.debug("leftLadder",leftLadder)
        //console.debug("rightLadder",rightLadder)
        //console.debug(parseFloat(window.getComputedStyle($('#ladder')[0]).left))
        if (middlePlayer >= leftLadder && middlePlayer <= rightLadder && bottomPlayer >= bottomLadder && bottomPlayer <= topLadder){
            inLadder = true;

        }
   }

) }
let playerFall = function() {
    let falling = true;
    stageDict['stage-1']['Soil'].forEach( function( item: Soil ){
        let leftPlatform = item.left;
        let rightPlatform = item.width + item.left;
        let topPlatform = item.bottom + 50;
        let bottomPlayer = parseFloat(window.getComputedStyle($('#player')[0]).bottom) ;
        let middlePlayer = (parseFloat(window.getComputedStyle($('#player')[0]).left) + parseFloat(window.getComputedStyle($('#player')[0]).width))/2;

        if (leftPlatform <= middlePlayer && rightPlatform >= middlePlayer && topPlatform >= (bottomPlayer - 5) && topPlatform <= (bottomPlayer + 5)){

            // falling on soil
            falling = false;
            //console.debug(rightPlatform);
            //console.debug(middlePlayer);
        } else if (inLadder){
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

}
let interval = setInterval( execute , 100 );


//left of platform can go down, ruling 550 but visual 300
