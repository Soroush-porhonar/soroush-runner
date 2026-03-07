import "./ladder.css";

import { Element, ObjectId } from "../../ring";

export class Ladder extends Element {
  constructor(row: number, col: number) {
    super(row, col, ObjectId.Ladder);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("div");
    div.id = `${this.row}-${this.col}`;
    div.classList.add(this.id);
    return div;
  }
}
