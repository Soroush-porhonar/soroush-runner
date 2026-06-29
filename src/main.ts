import { Gameplay } from "./common/gameplay";
import { Song } from "./audio/audio";
import { Input } from "./ring/elements/player/player";

class Game {
  constructor(
    private gameplay: Gameplay = new Gameplay(),
    private song: Song = new Song(),
    private firstKey: boolean = false,

    //menu
    //..
  ) {
    this.gameplay.gameObjectInit();
    this.eventListenerAdds();
    this.intervalStart();
    this.gameplay.tutorialAlert();
  }

  private eventListenerAdds() {
    window.addEventListener("load", () => document.body.focus());
    document.body.addEventListener("keydown", (event) => {
      this.body_keydown(event);
    });
    document.body.addEventListener("keyup", (event) => {
      this.body_keyup(event);
    });
    document.getElementById("music")?.addEventListener("click", () => {
      this.song.PlayPause();
    });
    window.addEventListener("resize", () => {
      this.checkRotate();
    });
  }

  private musicInit() {
    const musicInitCondition = !this.firstKey;
    if (musicInitCondition) {
      this.firstKey = true;
      this.song.PlayPause();
    }
  }

  private checkRotate() {
    if (window.innerHeight > window.innerWidth)
      alert("Please rotate your device to play in landscape mode.");
  }

  private intervalStart() {
    setInterval(() => this.repeat(), 100);
  }

  private EscButtonAction() {
    if (!this.gameplay.getState.getPause) {
      this.gameplay.alertPause();
    } else {
      this.gameplay.alertSkip();
    }
  }

  private alertSkipButtonCondition(e: KeyboardEvent) {
    const SkipableKey = e.code !== "Escape" && e.code !== "KeyM";
    const notRepeat = !e.repeat;
    return SkipableKey && notRepeat;
  }

  private body_keydown(e: KeyboardEvent): void {
    this.musicInit();
    if (this.alertSkipButtonCondition(e)) this.gameplay.alertSkip();

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
        if (e.repeat) return;
        this.gameplay.overWriteLastMove(Input.DigRight);
        break;
      case "KeyQ":
      case "KeyJ":
        if (e.repeat) return;
        this.gameplay.overWriteLastMove(Input.DigLeft);
        break;
      case "KeyM":
        this.song.PlayPause();
        break;
      case "Escape":
        this.EscButtonAction();
        break;
    }
  }
  private body_keyup(e: KeyboardEvent): void {
    // if (e.repeat) return;
    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        this.gameplay.overWriteLastMove(Input.Still);
        break;
      case "ArrowRight":
      case "KeyD":
        this.gameplay.overWriteLastMove(Input.Still);
        break;
      case "ArrowUp":
      case "KeyW":
        this.gameplay.overWriteLastMove(Input.Still);
        break;
      case "ArrowDown":
      case "KeyS":
        this.gameplay.overWriteLastMove(Input.Still);
        break;
      case "KeyE":
      case "KeyK":
      case "KeyQ":
      case "KeyJ":
        this.gameplay.overWriteLastMove(Input.Still);
        break;
    }
  }

  public repeat(): void {
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
window.addEventListener("load", () => new Game());
