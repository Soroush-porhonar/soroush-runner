import "./player.css";
import { Element, ObjectId } from "../../ring";
import type { Stage } from "../../../common/stage.ts";

const START_IMAGE_URI: string =
  "src/ring/elements/player/player-images/player-standing.png";

const enum PlayerState {
  Falling = "falling",
  Standing = "standing",
  Climbing = "climbing",
  Hanging = "hanging",
}

export const enum Input {
  Still = "still",
  Up = "up",
  Down = "down",
  Right = "right",
  Left = "left",
}

export class Player extends Element {
  constructor(
    row: number,
    col: number,
    id: ObjectId = ObjectId.Player,
    public imageUri: string = START_IMAGE_URI,
    public state: PlayerState = PlayerState.Standing,
  ) {
    super(row, col, id);
  }

  public createDom(): HTMLDivElement {
    const div = document.createElement("img");
    div.id = `${this.row}-${this.col}`;
    div.src = this.imageUri;
    div.classList.add(this.id);
    return div;
  }

  public fallCondition() {
    if (this.state === PlayerState.Falling) {
      return true;
    }
    return false;
  }

  public goDownCondition(stage: Stage) {
    const underboxId: ObjectId | undefined = stage.getMapElement(
      this.row + 1,
      this.col,
    )?.Id;
    if (
      underboxId === ObjectId.Ladder ||
      (this.state === PlayerState.Hanging && underboxId !== ObjectId.Soil)
    ) {
      return true;
    }
    return false;
  }

  public goUpCondition() {
    if (this.state === PlayerState.Climbing) {
      return true;
    }
    return false;
  }

  public goLeftCondition(stage: Stage) {
    const leftboxId: ObjectId | undefined = stage.getMapElement(
      this.row,
      this.col - 1,
    )?.Id;
    if (
      (this.state === PlayerState.Standing ||
        this.state === PlayerState.Climbing ||
        this.state === PlayerState.Hanging) &&
      (leftboxId === ObjectId.Empty ||
        leftboxId === ObjectId.Ladder ||
        leftboxId === ObjectId.Bar)
    ) {
      return true;
    }
    return false;
  }

  public goRightCondition(stage: Stage) {
    const leftboxId: ObjectId | undefined = stage.getMapElement(
      this.row,
      this.col + 1,
    )?.Id;
    if (
      (this.state === PlayerState.Standing ||
        this.state === PlayerState.Climbing ||
        this.state === PlayerState.Hanging) &&
      (leftboxId == ObjectId.Empty ||
        leftboxId == ObjectId.Ladder ||
        leftboxId == ObjectId.Bar)
    ) {
      return true;
    }
    return false;
  }

  public digRightCondition(stage: Stage) {
    const rightAxeId: ObjectId | undefined = stage.getMapElement(
      this.row + 1,
      this.col + 1,
    )?.Id;
    if (this.state === PlayerState.Standing && rightAxeId === ObjectId.Soil) {
      return true;
    }
    return false;
  }

  public digLeftCondition(stage: Stage) {
    const lefttAxeId: ObjectId | undefined = stage.getMapElement(
      this.row + 1,
      this.col - 1,
    )?.Id;
    if (this.state === PlayerState.Standing && lefttAxeId === ObjectId.Soil) {
      return true;
    }
    return false;
  }

  public goLeft() {
    this.logicleft();
    this.Visleft();
  }

  private logicleft() {
    this.col--;
  }

  private Visleft() {
    this.updVisState(Input.Left);
  }

  public goRight() {
    this.logicRigh();
    this.VisRight();
  }

  private logicRigh() {
    this.col++;
  }

  private VisRight() {
    this.updVisState(Input.Right);
  }

  public goUp() {
    this.logicUp();
    this.VisUp();
  }

  private logicUp() {
    this.row--;
  }

  private VisUp() {
    this.updVisState(Input.Up);
  }

  public goDown() {
    this.logicDown();
    this.VisDown();
  }
  private logicDown() {
    this.row++;
  }
  private VisDown() {
    this.updVisState(Input.Down);
  }

  public digLeft() {
    //handleHoleChar(rightAxe.row, rightAxe.col);
  }

  public digRight() {
    //handleHoleChar(rightAxe.row, rightAxe.col);
  }

  public updVisState(input: Input) {
    this.imageUri = this.getPlayerImageUri(input) ?? this.imageUri;
  }

  public updLogState(stage: Stage): void {
    let current = this.getPlayerStateByPlayerPosition(stage);
    if (current !== undefined) {
      this.state = current;
      return;
    }

    this.state = this.getPlayerStateByUnderboxPosition(stage);
  }

  private getPlayerStateByUnderboxPosition(stage: Stage): PlayerState {
    const underElementMap: ObjectId | undefined = stage.getMapElement(
      this.row + 1,
      this.col,
    )?.Id;
    const underElementRing: ObjectId | undefined = stage.getRingElement(
      this.row + 1,
      this.col,
    )?.Id;

    let isFallingCondition =
      underElementMap === ObjectId.Empty ||
      underElementMap === ObjectId.Bar ||
      (underElementMap === ObjectId.Hole &&
        underElementRing !== ObjectId.Enemy);
    return isFallingCondition ? PlayerState.Falling : PlayerState.Standing;
  }

  private getPlayerStateByPlayerPosition(
    stage: Stage,
  ): PlayerState | undefined {
    const playerMapId = stage.getMapElement(this.row, this.col)?.Id;
    switch (playerMapId) {
      case ObjectId.Ladder:
        return PlayerState.Climbing;
      case ObjectId.Bar:
        return PlayerState.Hanging;
    }
  }

  private getPlayerImageUri(input: Input): string | undefined {
    if (this.state === PlayerState.Falling) {
      return "src/ring/elements/player/player-images/player-hanging-still.png";
    }
    if (input === Input.Still) {
      if (this.state === PlayerState.Hanging) {
        return "src/ring/elements/player/player-images/player-hanging-still.png";
      }
      if (this.state === PlayerState.Standing) {
        return "src/ring/elements/player/player-images/player-standing.png";
      }
      if (this.state === PlayerState.Climbing) {
        return "src/ring/elements/player/player-images/player-climbing.png";
      }
    }

    if (input === Input.Left) {
      if (this.state === PlayerState.Hanging) {
        return "src/ring/elements/player/player-images/player-hanging-left.png";
      }
      if (this.state === PlayerState.Standing) {
        return "src/ring/elements/player/player-images/player-walk-left.png";
      }
    }

    if (input === Input.Right) {
      if (this.state === PlayerState.Hanging) {
        return "src/ring/elements/player/player-images/player-hanging-right.png";
      }
      if (this.state === PlayerState.Standing) {
        return "src/ring/elements/player/player-images/player-walk-right.png";
      }
    }
    return undefined;
  }
}
