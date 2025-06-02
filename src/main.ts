
import $ from 'jquery'
import { drawPlayer, goLeft, goRight, redrawPlayer, fall } from './element/player/player.ts'
import { draw_soil, Soil } from './element/soil/soil.ts'
import { draw_ring } from './element/ring/ring.ts'



$('#app').html( `
  <div class="app">

  </div>
`);

function body_keydown( e ) {

    switch ( e.which ) {
        case 37:    // LEFT
            goLeft();
            redrawPlayer();
            break;
        case 38:    // UP
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
    'stage-1': [
        { left: 0, bottom: 0, right: 0 } as Soil,
        { left: 50, bottom: 300 , right: 500 } as Soil,
    ],
    'stage-2': [
        { left: 0, bottom: 0 , right: 100 } as Soil,
        { left: 70, bottom: 200 , right: 100 } as Soil,
    ]
};


let ring = draw_ring( $('#app')[0] );
drawPlayer( ring );

stageDict['stage-1'].forEach( function( item: Soil ) {
    draw_soil( ring, item.left, item.bottom, item.right );
} );

let playerFall = function() {

    stageDict['stage-1'].forEach( function( item: Soil ){
        let rightPlatform = item.right
        let leftPlatform = item.left
        let topPlatform = item.bottom + 50
        let bottomPlayer = parseFloat(window.getComputedStyle($('#player')[0]).bottom) - 20;
        let middlePlayer = (parseFloat(window.getComputedStyle($('#player')[0]).left) + parseFloat(window.getComputedStyle($('#player')[0]).width))/2;
        console.log(topPlatform)
        //console.debug( 'loop!' );
        if (leftPlatform <= middlePlayer && rightPlatform <= middlePlayer && topPlatform >= bottomPlayer){

            //console.debug( );
            stop(playerFall)
            clearInterval(interval);

        }else{
        fall();
        redrawPlayer();
        };
    });

};

let interval = setInterval( playerFall , 100 );

