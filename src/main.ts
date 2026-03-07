import $ from "jquery";
import { Gameplay } from "./common/gameplay";
import { Song } from "./audio/audio";
export class Game {
  constructor(
    private gameplay: Gameplay = new Gameplay(),
    private song: Song = new Song(),

    //menu
    //..
  ) {
    this.song.play();
  }

  public get getGameplay() {
    return this.gameplay;
  }
  public gameInit() {}

  public body_keydown(e: JQuery.Event): void {
    switch (e.which) {
      case 37: // LEFT
        this.gameplay.playerGoLeft();
        break;
      case 38: // UP
        this.gameplay.playerGoUp();
        break;
      case 39: // RIGHT
        this.gameplay.playerGoRight();
        break;
      case 40: // DOWN
        this.gameplay.playerGoDown();
        break;
      case 69: // dig right
        this.gameplay.playerDigRight();
        break;
      case 81: // dig left
        this.gameplay.playerDigLeft();
        break;
    }
  }
  public body_keyup(e: JQuery.Event) {
    this.gameplay.playerStandStill();
  }
}

function checkOrientation(): void {
  if (window.innerHeight > window.innerWidth) {
    alert("Please rotate your device to play in landscape mode.");
  }
}

$(document).ready(function () {
  window.addEventListener("resize", checkOrientation);

  const game = new Game();
  $("#app").prepend(game.getGameplay.getStage.getVisualRing.ringObject);
  $("body").on("keydown", (event) => {
    game.body_keydown(event);
  });
  $("body").on("keyup", (event) => {
    game.body_keyup(event);
  });

  game.getGameplay.LevelInit();

  function repeat(): void {
    game.getGameplay.Rules();
    game.getGameplay.getPlayer.updLogState(game.getGameplay.getStage);
    game.getGameplay.playerFalling();
    game.getGameplay.enemyMove();
    game.getGameplay.goldCheck();

    //repeatTouchInput();
  }

  setInterval(repeat, 200);
});
