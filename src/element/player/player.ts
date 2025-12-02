import './player.css'
import $ from 'jquery'

class Position {
    x: number;
    y: number;
}

const step: number = 10;
let position: Position = new Position();
let player: HTMLDivElement;

export function drawPlayer( parent: HTMLDivElement ): HTMLDivElement {
    position.x = 20;
    position.y = 600;
    let $player = $( '<div></div>' )
        .attr( 'id', 'player' )
        .addClass( 'character' )
        .css( {
         'left': position.x + 'px',
         'bottom': position.y + 'px'
        } );
    $( parent ).append( $player );

    player = $player[0];
    return player;
}

export function redrawPlayer() {
    $( '#player' )
        .css( {
            'left': position.x + 'px',
            'bottom': position.y + 'px'
         } )
}

export function goLeft() {
    position.x -= step;

    if ( position.x < 0 ) {
        position.x = 0;
    }
}

export function goRight() {
    position.x += step;

    //debugger;
    if ( position.x + $( player ).outerWidth() > $( player ).parent().width() ) {
        position.x = $( player ).parent().width() - $( player ).outerWidth();
    }
}

export function fall() {
    position.y -= 10;   // TODO: use const

    // TODO: check conflict / contact with platform!
    if ( position.y + $( player ).outerHeight() > $( player ).parent().height() ) {
        position.y = $( player ).parent().height() - $( player ).outerHeight();
    }

}

export function goUp() {
    position.y += 10;

    //debugger;
    if ( position.x + $( player ).outerWidth() > $( player ).parent().width() ) {
        position.x = $( player ).parent().width() - $( player ).outerWidth();
    }
}