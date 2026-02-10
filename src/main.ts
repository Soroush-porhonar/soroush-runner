import $ from "jquery";
import {body_keydown, body_keyup } from "./element/player/movement.ts";
import { draw_ring, createZeroRing } from "./element/ring/ring.ts";
import { drawStage, LevelInit } from "./../src/common/stage.ts";
import { playerInit } from "./element/player/player.ts";
import { goldRepeat } from "./element/gold/gold.ts";
import { enemyrepeat } from "./element/enemy/enemy.ts";
import { Rules } from "./../src/common/Conditions.ts";

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert("Please rotate your device to play in landscape mode.");
    } else {
        // Start or continue the game
    }
}

window.addEventListener('resize', checkOrientation);
checkOrientation(); // Check on page load

checkOrientation();
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


// Declare a global object to manage game controls
window.gameControls = {
    heldKeys: {},

    repeatTouchInput: function () {
        for (const code in this.heldKeys) {
            if (this.heldKeys[code]) {
                body_keydown(fakeEvent(Number(code)));
            }
        }
    }
};

$(document).ready(function () {
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!isMobile) return;

    const $root = $('#app').length ? $('#app') : $('body');
    const $controls = $('<div>', { id: 'mobile-controls' });

    const btn = (label, keyCode) =>
        $('<button>', { text: label, 'data-keycode': keyCode });

    const $dpad = $('<div>', { class: 'dpad' }).append(
        $('<div class="row center">').append(btn('▲', 38)),
        $('<div class="row">').append(
            btn('◀', 37),
            $('<div class="spacer">'),
            btn('▶', 39)
        ),
        $('<div class="row center">').append(btn('▼', 40))
    );

    const $actions = $('<div>', { class: 'actions' })
        .append(btn('Q', 81))
        .append(btn('E', 69));

    $controls.append($dpad, $actions);
    $root.append($controls);

    function fakeEvent(code) {
        return { which: code };
    }

    $controls.find('button').on('touchstart', function (e) {
        e.preventDefault();
        const code = Number($(this).data('keycode'));
        window.gameControls.heldKeys[code] = true; // Use the global object
        $(this).addClass('pressed');
        body_keydown(fakeEvent(code));
    });

    $controls.find('button').on('touchend touchcancel', function (e) {
        e.preventDefault();
        const code = Number($(this).data('keycode'));
        window.gameControls.heldKeys[code] = false; // Use the global object
        $(this).removeClass('pressed');
        body_keyup(fakeEvent(code));
    });
});

// Initialize
LevelInit();

function execute() {
    window.gameControls.repeatTouchInput(); // Corrected reference
    playerInit();
    enemyrepeat();
    goldRepeat();
    Rules();
}

let interval = setInterval(execute, 200);
