import $ from "jquery";
import {body_keydown, body_keyup } from "./element/player/movement.ts";
import { draw_ring } from "./element/ring/ring.ts";
import { drawStage } from "./../src/common/stage.ts";
import { playerInit } from "./element/player/player.ts";
import { goldInit } from "./element/gold/gold.ts";
import { enemyInit } from "./element/enemy/enemy.ts";
import { Rules } from "./../src/common/Conditions.ts";

$("#app").html(`
  <div class="app">
  </div>
`);

$('<audio>', {
    id: 'backgroundMusic', // Set id
    loop: true, // Set the loop attribute
}).append($('<source>', {
    src: 'src/audio/background.mp3', // Set the audio source
    type: 'audio/mp3' // Specify the type
})).appendTo('#app'); // Append to the body

$("body").on("keydown", body_keydown);
$("body").on("keyup", body_keyup);
$('#backgroundMusic')[0].play();
draw_ring($("#app")[0]);

drawStage();

function execute() {
  playerInit();
  enemyInit();
  goldInit();
  Rules();
}
let interval = setInterval(execute, 200);
