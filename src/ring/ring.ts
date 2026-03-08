import type { Bar } from "./elements/bar/bar";
import type { Conc } from "./elements/concrete/conc";
import type { Enemy } from "./elements/enemy/enemy";
import type { Gold } from "./elements/gold/gold";
import type { Hole } from "./elements/hole/hole";
import type { Ladder } from "./elements/ladder/ladder";
import type { Player } from "./elements/player/player";
import type { Soil } from "./elements/soil/soil";
import "./ring.css";
import $ from "jquery";

export type RingElement = Empty | Player | Enemy | Gold;
export type MapElement = Empty | Soil | Conc | Bar | Ladder | Hole;

export const enum ObjectId {
  Empty = "empty",
  Soil = "soil",
  Ladder = "ladder",
  Player = "player",
  Enemy = "enemy",
  Bar = "bar",
  Gold = "gold",
  Conc = "conc",
  Hole = "hole",
}

export abstract class Element {
  constructor(
    protected row: number,
    protected col: number,
    protected readonly id: ObjectId,
  ) {}

  abstract createDom(): HTMLDivElement;

  public toString(): string {
    return `${this.id} at (${this.row}, ${this.col})`;
  }

  public get findId(): string {
    const cssId = `${this.row}-${this.col}`;
    return cssId;
  }
  public get Id() {
    return this.id;
  }
  public get Row() {
    return this.row;
  }
  public get Col() {
    return this.col;
  }
}

export class Empty extends Element {
  constructor(row: number, col: number) {
    super(row, col, ObjectId.Empty);
  }

  createDom(): HTMLDivElement {
    const div = document.createElement("div");

    div.id = `${this.row}-${this.col}`;
    div.classList.add(this.id);
    return div;
  }
}

export class Ring {
  constructor(
    private _RingRow: number,
    private _RingCol: number,
    private _Ring: RingElement[][] = [],
    private _map: MapElement[][] = [],
  ) {
    this.createMatrix();
  }

  private createMatrix() {
    this._Ring = Array.from({ length: this._RingRow }, (_, rowIndex) => {
      return Array.from({ length: this._RingCol }, (_, colIndex) => {
        return new Empty(rowIndex, colIndex); // assuming `Empty` is the class you're using
      });
    });

    this._map = Array.from({ length: this._RingRow }, (_, rowIndex) => {
      return Array.from({ length: this._RingCol }, (_, colIndex) => {
        return new Empty(rowIndex, colIndex); // assuming `Empty` is the class you're using
      });
    });
  }

  public reset(): void {
    for (let row = 0; row < this._RingRow; row++) {
      for (let col = 0; col < this._RingCol; col++) {
        this._Ring[row][col] = new Empty(row, col);
        this._map[row][col] = new Empty(row, col);
      }
    }
  }

  public addRing(element: RingElement): void {
    this._Ring[element.Row][element.Col] = element;
  }

  public addMap(element: MapElement): void {
    this._map[element.Row][element.Col] = element;
  }

  public removeRing(element: RingElement): void {
    this._Ring[element.Row][element.Col] = new Empty(element.Row, element.Col);
  }

  public removeMap(element: MapElement) {
    this._map[element.Row][element.Col] = new Empty(element.Row, element.Col);
  }

  public RingElement(row: number, col: number): RingElement {
    return this._Ring[row][col];
  }

  public MapElement(row: number, col: number): MapElement {
    return this._map[row][col];
  }
}

export class VisualRing {
  constructor(
    private _RingRow: number,
    private _RingCol: number,
    private $_RING: JQuery<HTMLElement> = $("<div></div>")
      .attr("id", "ring")
      .addClass("ring")
      .css({}),
    private $_stage: JQuery<HTMLElement> = $("<div></div>")
      .attr("id", "stage")
      .addClass("stage")
      .css({}),
    private $_footer: JQuery<HTMLElement> = $("<footer></footer>")
      .attr("id", "footer")
      .addClass("footer")
      .css({}),
    private $_time: JQuery<HTMLElement> = $("<span></span>")
      .attr("id", "time")
      .addClass("footerSpan")
      .css({}),
    private $_life: JQuery<HTMLElement> = $("<span></span>")
      .attr("id", "life")
      .addClass("footerSpan")
      .css({}),
    private $_score: JQuery<HTMLElement> = $("<span></span>")
      .attr("id", "score")
      .addClass("footerSpan")
      .css({}),
  ) {
    this.reset();
  }
  public reset(): void {
    this.$_stage.empty();
  }
  public htmlElementInit() {
    this.ringObjectAdd();
    this.stageObjectAdd();
    this.footerObjectAdd();
    this.footerSpanObjectAdd();
  }
  private ringObjectAdd() {
    $("#app").prepend(this.$_RING[0]);
  }
  private footerObjectAdd() {
    $("#ring").append(this.$_footer[0]);
  }
  private stageObjectAdd() {
    $("#ring").append(this.$_stage[0]);
  }
  private footerSpanObjectAdd() {
    $("#footer").append(this.$_time[0]);
    $("#footer").append(this.$_life[0]);
    $("#footer").append(this.$_score[0]);
  }
  public draw(element: Element): void {
    // visual
    const dom = element.createDom();

    const visCol = (element.Col / this._RingCol) * 100;
    const visRow = (element.Row / this._RingRow) * 100;
    const visWidth = 100 / this._RingCol;
    const visHeight = 100 / this._RingRow;

    $(dom).css({
      width: visWidth + "%",
      left: visCol + "%",
      top: visRow + "%",
      height: visHeight + "%",
    });

    this.$_stage.append(dom);
  }

  public erase(element: Element): void {
    const id = element.findId;
    $(`#${id}.${element.Id}`).remove();
  }

  public updateVisTime(time: number) {
    this.$_time.text("time : " + time);
  }
  public updateVislife(life: number) {
    this.$_life.text(" life : " + life);
  }
  public updateVisScore(score: number) {
    this.$_score.text("score : " + score);
  }
}
