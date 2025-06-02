import './ring.css'
import $ from 'jquery'

export function draw_ring( parent: HTMLDivElement ): HTMLDivElement {
    let $ring = $( '<div></div>' )
        .attr( 'id', 'ring' )
        .addClass( 'ring' )
        .css( { } );
    $( parent ).prepend( $ring );

    return $ring[0];
}