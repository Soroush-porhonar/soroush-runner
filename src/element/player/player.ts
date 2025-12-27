//import './player.css'
import './Sprite-stand.css'
import $ from 'jquery'

let direction = null;

class Position {
    x: number;
    y: number;
}

const step: number = 10;
const width: number = 16;
const height: number = 32;
let position: Position = new Position();
let player: HTMLDivElement;

export function drawPlayer( parent: HTMLDivElement ): HTMLDivElement {
    position.x = 20;
    position.y = 600;
    let $player = $( '<div></div>' )
        .attr( 'id', 'player' )
        .addClass( 'pixel-stand' )
        .css( {
         'left': position.x + 'px',
         'bottom': position.y + 'px'
        } );
    $( parent ).append( $player );

    player = $player[0];
    return player;
}

export function returnPos(){
    return {position , width,height }
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
    direction = "left";


    if ( position.x < 0 ) {
        position.x = 0;
    }
}

export function goRight() {
    position.x += step;
    direction = "right";


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
    direction = "up";
    //debugger;
    if ( position.x + $( player ).outerWidth() > $( player ).parent().width() ) {
        position.x = $( player ).parent().width() - $( player ).outerWidth();
    }
}
export function goDown() {
    position.y -= 10;
    direction = "down";
    //debugger;
    if ( position.x + $( player ).outerWidth() > $( player ).parent().width() ) {
        position.x = $( player ).parent().width() - $( player ).outerWidth();
    }
}

export function updateAppearance() {
    const $p = $('#player');
    if (direction !== null ) {
        if (direction == "up" || direction == "down"){
            if (!$p.hasClass('pixel-behind')) {
                $p.addClass('pixel-behind').removeClass('pixel-walk').removeClass('pixel-stand');
            }
        } else {
            if (direction == "left"){
                if (!$p.hasClass('pixel-walk')) {
                    $p.addClass('pixel-walk').removeClass('pixel-stand').removeClass('pixel-behind').css('transform', 'scaleX(-1)');
                }
        } else {
            if (direction == "right"){
                if (!$p.hasClass('pixel-walk')) {
                    $p.addClass('pixel-walk').removeClass('pixel-stand').removeClass('pixel-behind').css('transform', 'scaleX(1)');
                }
            }
        }
    }

    } else {
        if (!$p.hasClass('pixel-stand')) {
            $p.addClass('pixel-stand').removeClass('pixel-walk').removeClass('pixel-behind');
        }
    }
    direction = null; // Reset for the next frame
}