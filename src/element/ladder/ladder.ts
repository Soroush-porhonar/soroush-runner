import './ladder.css'
import $ from 'jquery'

export function draw_ladder( row: number, col: number ) {
    // TODO: re-implement...

    $( parent ).append(
        $( '<div></div>' )
            .attr( 'id', 'ladder' )
            .addClass( 'ladder' )
            .css( {
                left: left,
                bottom: bottom,
                height:  height
            } )
    );
}

export class Ladder {
    row: number;
    col: number;
    count: number;
}