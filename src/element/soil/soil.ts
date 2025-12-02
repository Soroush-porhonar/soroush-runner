import './soil.css'
import $ from 'jquery'

export function draw_soil( parent: HTMLDivElement, left: number, bottom: number ,width: number) {
    $( parent ).append(
        $( '<div></div>' )
            .attr( 'id', 'ground' )
            .addClass( 'soil' )
            .css( {
                left: left,
                bottom: bottom,
                width:  width
            } )
    );
}

export class Soil {
    left: number;
    bottom: number;
    width: number;
}

