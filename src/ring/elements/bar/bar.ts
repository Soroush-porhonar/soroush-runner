import "./bar.css";
import { ObjectId } from "../../ring";
import { Element } from "../../ring";
export class Bar extends Element {
  constructor(row: number, col: number) {
    super(row, col, ObjectId.Bar);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("div");
    div.id = `${this.row}-${this.col}`;
    div.classList.add(this.id);
    return div;
  }
}
