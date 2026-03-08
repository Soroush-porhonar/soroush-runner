import $ from "jquery";
import { Gameplay } from "./common/gameplay";
import { Song } from "./audio/audio";
import { Input } from "./ring/elements/player/player";

class Game {
  constructor(
    private gameplay: Gameplay = new Gameplay(),
    private song: Song = new Song(),

    //menu
    //..
  ) {
    this.htmlReady();
    this.keydownAdd();
    this.song.play();
    this.checkRotate();
    this.intervalStart();
  }

  public get getGameplay() {
    return this.gameplay;
  }
  private htmlReady() {
    this.gameplay.GameElementInit();
  }
  private keydownAdd() {
    //document.body.tabIndex = 0;
    window.addEventListener("load", () => document.body.focus());
    document.body.addEventListener("keydown", (event) => {
      this.body_keydown(event);
    });
  }
  private checkRotate() {
    window.addEventListener("resize", () => {
      if (window.innerHeight > window.innerWidth)
        alert("Please rotate your device to play in landscape mode.");
    });
  }

  private intervalStart() {
    setInterval(() => this.repeat(), 100);
  }
  private body_keydown(e: KeyboardEvent): void {
    console.log(e);
    // if (e.repeat) return;
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        this.gameplay.overWriteLastMove(Input.Left);
        break;
      case "ArrowRight":
      case "KeyD":
        this.gameplay.overWriteLastMove(Input.Right);
        break;
      case "ArrowUp":
      case "KeyW":
        this.gameplay.overWriteLastMove(Input.Up);
        break;
      case "ArrowDown":
      case "KeyS":
        this.gameplay.overWriteLastMove(Input.Down);
        break;
      case "KeyE":
      case "KeyK":
        this.gameplay.overWriteLastMove(Input.DigRight);
        break;
      case "KeyQ":
      case "KeyJ":
        this.gameplay.overWriteLastMove(Input.DigLeft);
        break;
      case "Escape":
        this.gameplay.getState.pauseChange();
        break;
    }
  }

  public repeat(): void {
    this.gameplay.checkpause();
    if (this.gameplay.getState.getPause) return;

    this.gameplay.updateFooter();
    this.gameplay.Rules();
    this.gameplay.getStage.getPlayer.updLogState(this.gameplay.getStage);

    if (this.gameplay.getState.getTime % 2 === 0) {
      this.gameplay.playerFalling();
      this.gameplay.playerAction();
    }
    if (this.gameplay.getState.getTime % 3 === 0) this.gameplay.enemyMove();
    this.gameplay.goldCheck();
    this.gameplay.getState.addTime();
  }
}

$(document).ready(function () {
  new Game();
});
