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
      visState("walking-left");
      goLeft();
      break;
    case 38: // UP
      goUp();
      break;
    case 39: // RIGHT
      visState("walking-right");
      goRight();
      break;
    case 40: // DOWN
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
      visState("standing");
      break;
    case 39: // RIGHT
      visState("standing");
      break;
  }
}