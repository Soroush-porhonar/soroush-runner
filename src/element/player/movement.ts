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