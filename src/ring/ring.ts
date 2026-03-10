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

export const enum Alert {
  Pause = "pause",
  Lose = "lose",
  GameOver = "gameOver",
  Won = "won",
  Tutorial = "tutorial",
  Champion = "champion",
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
    private $_alert: JQuery<HTMLElement> = $("<div></div>")
      .attr("id", "alert")
      .addClass("alert")
      .css({}),
    private $_header: JQuery<HTMLElement> = $("<header></header>")
      .attr("id", "header")
      .addClass("header")
      .css({}),
    private $_stageN: JQuery<HTMLElement> = $("<span></span>")
      .attr("id", "stageN")
      .addClass("headerSpan")
      .css({}),
    private $_music: JQuery<HTMLElement> = $("<button></button>")
      .attr("id", "music")
      .addClass("headerSpan")
      .css({}),
  ) {
    this.reset();
  }
  public reset(): void {
    this.$_stage.empty();
  }
  public get ringObject() {
    return this.$_RING[0];
  }
  public get stageObject() {
    return this.$_stage[0];
  }
  public get footerObject() {
    return this.$_footer[0];
  }
  public get timeObject() {
    return this.$_time[0];
  }
  public get lifeObject() {
    return this.$_life[0];
  }
  public get scoreObject() {
    return this.$_score[0];
  }
  public get alertObject() {
    return this.$_alert[0];
  }
  public get headerObject() {
    return this.$_header[0];
  }
  public get stageNObject() {
    return this.$_stageN[0];
  }
  public get musicObject() {
    this.$_music.append(
      `<svg  class="musicSVG"><path d="M19.45 4.71001C19.2657 4.51773 19.0125 4.40655 18.7462 4.40092C18.4799 4.39529 18.2223 4.49569 18.03 4.68001C17.8377 4.86434 17.7265 5.1175 17.7209 5.3838C17.7153 5.6501 17.8157 5.90773 18 6.10001C19.5217 7.68329 20.3715 9.79404 20.3715 11.99C20.3715 14.186 19.5217 16.2967 18 17.88C17.8618 18.021 17.7684 18.1997 17.7316 18.3937C17.6948 18.5877 17.7163 18.7882 17.7933 18.97C17.8703 19.1518 17.9994 19.3068 18.1643 19.4153C18.3292 19.5239 18.5226 19.5812 18.72 19.58C18.8547 19.5795 18.9879 19.5518 19.1116 19.4985C19.2354 19.4452 19.347 19.3675 19.44 19.27C21.3198 17.3126 22.3696 14.7039 22.3696 11.99C22.3696 9.27611 21.3198 6.66741 19.44 4.71001H19.45ZM11.38 4.79002C11.1962 4.79127 11.0163 4.84317 10.86 4.94002L5.88 8.00002H3.38C2.84957 8.00002 2.34086 8.21073 1.96579 8.5858C1.59072 8.96088 1.38 9.46958 1.38 10V14C1.38 14.5304 1.59072 15.0392 1.96579 15.4142C2.34086 15.7893 2.84957 16 3.38 16H5.9L10.9 19.06C11.0573 19.1534 11.2371 19.2018 11.42 19.2C11.6852 19.2 11.9396 19.0947 12.1271 18.9071C12.3146 18.7196 12.42 18.4652 12.42 18.2V5.78002C12.4188 5.6461 12.3907 5.5138 12.3373 5.39096C12.284 5.26812 12.2065 5.15725 12.1095 5.06491C12.0125 4.97258 11.898 4.90067 11.7727 4.85345C11.6473 4.80622 11.5138 4.78465 11.38 4.79002ZM15.9895 7.29371C16.2538 7.30683 16.5021 7.42417 16.68 7.62001L16.71 7.60001C17.8006 8.7941 18.4053 10.3528 18.4053 11.97C18.4053 13.5872 17.8006 15.1459 16.71 16.34C16.6165 16.4436 16.5024 16.5265 16.3749 16.5833C16.2475 16.6401 16.1096 16.6697 15.97 16.67C15.7222 16.6694 15.4834 16.5767 15.3 16.41C15.1042 16.2321 14.9868 15.9838 14.9737 15.7195C14.9606 15.4552 15.0528 15.1965 15.23 15C15.9722 14.1766 16.3852 13.1086 16.39 12C16.3845 10.8879 15.9636 9.81791 15.21 9.00001C15.1154 8.90258 15.0417 8.78691 14.9933 8.66005C14.9448 8.53318 14.9228 8.39779 14.9284 8.26211C14.934 8.12644 14.9672 7.99333 15.0259 7.8709C15.0846 7.74848 15.1677 7.63929 15.27 7.55001C15.4665 7.37275 15.7252 7.28059 15.9895 7.29371Z"></path></svg>`,
    );
    return this.$_music[0];
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
  public updateVisAlert(alert: string) {
    this.$_alert.text(alert);
  }
  public alertResetClass() {
    this.$_alert.removeClass();
  }
  public alertAddClass(clName: Alert) {
    this.$_alert.addClass(clName);
  }
  public alertVisible() {
    this.$_alert.css("visibility", "visible");
  }
  public alerthidden() {
    this.$_alert.css("visibility", "hidden");
  }
  public updateVisStageN(stageNumber: number) {
    this.$_stageN.text("Level:" + stageNumber);
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
}
