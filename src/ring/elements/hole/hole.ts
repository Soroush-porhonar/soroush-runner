import { Element, ObjectId } from "../../ring";
import "./hole.css";

export class Hole extends Element {
  constructor(row: number, col: number) {
    super(row, col, ObjectId.Hole);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("div");
    div.id = `${this.row}-${this.col}`;
    div.classList.add(this.id);
    return div;
  }
}
