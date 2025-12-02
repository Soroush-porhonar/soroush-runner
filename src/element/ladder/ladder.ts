import './ladder.css'
import $ from 'jquery'

export function draw_ladder( parent: HTMLDivElement, left: number, bottom: number, height: number) {
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

export class ladder {
    left: number;
    bottom: number;
    height: number;
}