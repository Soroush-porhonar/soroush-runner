import { Gameplay } from "./common/gameplay";
import { Song } from "./audio/audio";
import { Input } from "./ring/elements/player/player";

class Game {
  private touchMoveInput: Input = Input.Still;

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
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
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
    this.createTouchControls();
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

  private createTouchControls(): void {
    if (document.getElementById("mobile-controls")) return;

    const controls = document.createElement("div");
    controls.id = "mobile-controls";

    const dpad = document.createElement("div");
    dpad.className = "touch-dpad";
    dpad.append(
      this.createTouchButton("^", "Move up", Input.Up, "move up"),
      this.createTouchButton("<", "Move left", Input.Left, "move left"),
      this.createTouchButton(">", "Move right", Input.Right, "move right"),
      this.createTouchButton("v", "Move down", Input.Down, "move down"),
    );

    const actions = document.createElement("div");
    actions.className = "touch-actions";
    actions.append(
      this.createTouchButton("Q", "Dig left", Input.DigLeft, "action"),
      this.createTouchButton("E", "Dig right", Input.DigRight, "action"),
    );

    const pause = document.createElement("button");
    pause.type = "button";
    pause.textContent = "II";
    pause.ariaLabel = "Pause game";
    pause.className = "touch-button touch-pause";
    pause.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.musicInit();
      this.touchMoveInput = Input.Still;
      this.gameplay.overWriteLastMove(Input.Still);
      this.EscButtonAction();
      pause.classList.add("pressed");
    });
    pause.addEventListener("pointerup", (event) => {
      event.preventDefault();
      pause.classList.remove("pressed");
    });
    pause.addEventListener("pointercancel", (event) => {
      event.preventDefault();
      pause.classList.remove("pressed");
    });

    controls.append(dpad, actions, pause);
    document.getElementById("app")?.append(controls);
  }

  private createTouchButton(
    label: string,
    ariaLabel: string,
    input: Input,
    className: string,
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.ariaLabel = ariaLabel;
    button.className = `touch-button ${className}`;

    button.addEventListener("pointerdown", (event) => {
      this.touchInputStart(event, button, input);
    });
    button.addEventListener("pointerup", (event) => {
      this.touchInputEnd(event, button, input);
    });
    button.addEventListener("pointercancel", (event) => {
      this.touchInputEnd(event, button, input);
    });
    button.addEventListener("lostpointercapture", (event) => {
      this.touchInputEnd(event, button, input);
    });

    return button;
  }

  private touchInputStart(
    event: PointerEvent,
    button: HTMLButtonElement,
    input: Input,
  ): void {
    event.preventDefault();
    this.musicInit();
    this.gameplay.alertSkip();
    button.setPointerCapture(event.pointerId);
    button.classList.add("pressed");

    if (input === Input.DigLeft || input === Input.DigRight) {
      this.gameplay.overWriteLastMove(input);
      window.setTimeout(() => {
        if (this.gameplay.getLastMove === input) {
          this.gameplay.overWriteLastMove(this.touchMoveInput);
        }
      }, 250);
      return;
    }

    this.touchMoveInput = input;
    this.gameplay.overWriteLastMove(input);
  }

  private touchInputEnd(
    event: PointerEvent,
    button: HTMLButtonElement,
    input: Input,
  ): void {
    event.preventDefault();
    button.classList.remove("pressed");

    if (this.touchMoveInput === input) {
      this.touchMoveInput = Input.Still;
      this.gameplay.overWriteLastMove(Input.Still);
    }
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
