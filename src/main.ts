import $ from "jquery";
import {
  body_keydown,
  body_keyup,
  repeatTouchInput,
} from "./element/player/movement.ts";
import { Ring } from "./element/ring/ring.ts";
import { LevelInit } from "./../src/common/stage.ts";
import { playerRepeat } from "./element/player/player.ts";
import { goldRepeat } from "./element/gold/gold.ts";
import { enemyRepeat } from "./element/enemy/enemy.ts";
import { Rules } from "./../src/common/Conditions.ts";
import { addSong } from "./../src/audio/audio.ts";

function checkOrientation(): void {
  if (window.innerHeight > window.innerWidth) {
    alert("Please rotate your device to play in landscape mode.");
  }
}

$(document).ready(function() {
    window.addEventListener("resize", checkOrientation);
    
    const $parent = $("#app");
    const ring = new Ring();
    $parent.prepend(ring.getRingObject());

    $("body").on("keydown", body_keydown);
    $("body").on("keyup", body_keyup);
    addSong();
    ($("#backgroundMusic")[0] as HTMLAudioElement).play();

    LevelInit( ring );

    setInterval(repeat, 200);
})

function repeat(): void {
  repeatTouchInput();
  playerRepeat();
  enemyRepeat();
  goldRepeat();
  Rules();
}
