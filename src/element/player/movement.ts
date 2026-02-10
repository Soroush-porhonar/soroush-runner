import $ from "jquery";
import {
  goLeft,
  goRight,
  goDown,
  goUp,
  digRight,
  digLeft,
  visState,
} from "./player.ts";

export function body_keydown(e) {
  switch (e.which) {
    case 37: // LEFT
      visState("left");
      goLeft();
      break;
    case 38: // UP
    visState("up");
      goUp();
      break;
    case 39: // RIGHT
      visState("right");
      goRight();
      break;
    case 40: // DOWN
    visState("down");
      goDown();
      break;
    case 69: // dig right
      digRight();
      break;
    case 81: // dig left
      digLeft();
      break;
  }
}

export function body_keyup(e) {
  switch (e.which) {
    case 37: // LEFT
      visState("still");
      break;
    case 39: // RIGHT
      visState("still");
      break;
    case 40: // DOWN
      visState("down");
      break;
    case 38: // DOWN
      visState("up");
      break;
  }
}


$(document).ready(function () {

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  //if (!isMobile) return;

  const $root = $('#app').length ? $('#app') : $('body');
  const $controls = $('<div>', { id: 'mobile-controls' });
  const heldKeys = {};

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
    heldKeys[code] = true;
    $(this).addClass('pressed');
    body_keydown(fakeEvent(code));
  });

  $controls.find('button').on('touchend touchcancel', function (e) {
    e.preventDefault();
    const code = Number($(this).data('keycode'));
    heldKeys[code] = false;
    $(this).removeClass('pressed');
    body_keyup(fakeEvent(code));
  });

  window.repeatTouchInput = function () {
    for (const code in heldKeys) {
      if (heldKeys[code]) {
        body_keydown(fakeEvent(Number(code)));
      }
    }
  };

});