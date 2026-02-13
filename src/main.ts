import $ from "jquery";
import {body_keydown, body_keyup, repeatTouchInput } from "./element/player/movement.ts";
import { draw_ring, createZeroRing } from "./element/ring/ring.ts";
import { drawStage, LevelInit } from "./../src/common/stage.ts";
import { playerInit } from "./element/player/player.ts";
import { goldRepeat } from "./element/gold/gold.ts";
import { enemyrepeat } from "./element/enemy/enemy.ts";
import { Rules } from "./../src/common/Conditions.ts";

window.addEventListener('resize', checkOrientation);
checkOrientation(); // Check on page load
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert("Please rotate your device to play in landscape mode.");
    } else {
        // Start or continue the game
    }
}




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


LevelInit();


function execute() {
  repeatTouchInput();
  playerInit();
  enemyrepeat();
  goldRepeat();
  Rules();
}
let interval = setInterval(execute, 200);
