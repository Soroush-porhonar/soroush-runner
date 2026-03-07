import "./enemy.css";
import { Element, ObjectId } from "../../ring";
import type { Gold } from "../gold/gold";
import type { Stage } from "../../../common/stage";

export class Enemy extends Element {
  constructor(
    row: number,
    col: number,
    private goldSlot: Gold | undefined = undefined,
  ) {
    super(row, col, ObjectId.Enemy);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("img");
    div.id = `${this.row}-${this.col}`;
    div.src = "./src/ring/elements/enemy/enemy-standing.png";
    div.classList.add(this.id);
    return div;
  }

  public get GoldSlot() {
    return this.goldSlot;
  }
  public fallCondition(stage: Stage) {
    return stage.getMapElement(this.Row + 1, this.Col)?.Id === ObjectId.Hole;
  }
  public goDown() {
    this.row++;
  }
  public changePos(row: number = this.row, col: number = this.col) {
    this.row = row;
    this.col = col;
  }

  public PickupGold(gold: Gold) {
    if (this.goldSlot === undefined) this.goldSlot = gold;
  }
  public goldResetSlot() {
    this.goldSlot = undefined;
  }
}
