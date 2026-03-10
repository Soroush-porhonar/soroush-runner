import "./gold.css";
import { Element, ObjectId } from "../../ring";

export class Gold extends Element {
  constructor(row: number, col: number) {
    super(row, col, ObjectId.Gold);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("img");
    div.id = `${this.row}-${this.col}`;
    div.src = "images/elements/gold.png";
    div.classList.add(this.id);
    return div;
  }

  public changePos(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
