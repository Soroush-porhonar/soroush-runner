import './ring.css'
import $ from 'jquery'

const ROWS = 20;
const COLS = 50;
const RING: number[][] = Array.from({ length: ROWS }, () => Array( COLS ).fill( 0 ));

let $RING;


export function draw_ring( parent: HTMLDivElement ): HTMLDivElement {
    let $ring = $( '<div></div>' )
        .attr( 'id', 'ring' )
        .addClass( 'ring' )
        .css( { } );
    $( parent ).prepend( $ring );

    $RING = $ring;

    return $ring[0];
}

export function addObject( object: HTMLDivElement, row: number, col: number, objId: number ) {
    if ( row < 0 || row >= ROWS ) {
        console.error( 'Invalid Object request: ' + row + ' is more than ' + ROWS );
        return;
    }
    if ( col < 0 || col >= COLS ) {
        console.error( 'Invalid Object request: ' + col + ' is more than ' + COLS );
        return;
    }

    // logic
    RING[row][col] = objId;

    // visual
    const visCol = col / COLS * 100;
    const visRow = row / ROWS * 100;
    const visWidth = 100 / COLS;
    const $object = $( object ).css( {
                width: visWidth + '%',
                left: visCol + '%',
                top: visRow + '%'
            } );
    $RING.append( $object );
}

export function getRingState( row: number, col: number ) {
    return RING[row][col];
}