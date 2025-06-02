import './soil.css'
import $ from 'jquery'

export function draw_soil( parent: HTMLDivElement, left: number, bottom: number ,right: number) {
    $( parent ).append(
        $( '<div></div>' )
            .attr( 'id', 'ground' )
            .addClass( 'soil' )
            .css( {
                left: left,
                bottom: bottom,
                 right:  right
            } )
    );
}

export class Soil {
    left: number;
    bottom: number;
    right: right;
}