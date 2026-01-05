import './soil.css'
import $ from 'jquery'
import { addObject } from './../ring/ring.ts'

const OBJECT_ID = 1;

export function draw_soil( row: number, col: number ) {
    const $soil = $( '<div></div>' )
        .addClass( 'soil' );

    addObject( $soil, row, col, OBJECT_ID );
}

export class Soil {
    col: number;
    row: number;
    count: number;
}

