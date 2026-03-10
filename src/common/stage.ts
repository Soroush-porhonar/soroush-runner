import { Enemy } from "./../ring/elements/enemy/enemy.ts";
import { Bar } from "./../ring/elements/bar/bar.ts";
import { Player } from "./../ring/elements/player/player.ts";
import { Gold } from "./../ring/elements/gold/gold.ts";
import {
  Alert,
  Ring,
  type MapElement,
  type RingElement,
} from "./../ring/ring.ts";
import { Soil } from "../ring/elements/soil/soil.ts";
import { Conc } from "../ring/elements/concrete/conc.ts";
import { Ladder } from "../ring/elements/ladder/ladder.ts";
import { VisualRing, Element } from "./../ring/ring.ts";
import $ from "jquery";

export interface blueprint {
  row: number;
  col: number;
  count: number;
}

interface StageDict {
  [key: number]: StageList; // Allows for dynamic stage names
}

interface StageList {
  Soil: blueprint[];
  Ladder: blueprint[];
  Player: blueprint[];
  Enemy: blueprint[];
  Bar: blueprint[];
  Gold: blueprint[];
  Conc: blueprint[];
  WLadder: blueprint[];
}

export class Stage {
  constructor(
    protected _stageRow: number = 30,
    protected _stageCol: number = 60,
    private enemies: Enemy[] = [],
    private golds: Gold[] = [],
    private player: Player = new Player(0, 0),
    private ring: Ring = new Ring(_stageRow, _stageCol),
    private visualRing: VisualRing = new VisualRing(_stageRow, _stageCol),
    private stageDict: StageDict = this.Dictionary,
  ) {}

  public reset() {
    this.ring.reset();
    this.visualRing.reset();
    this.enemies = [];
    this.golds = [];
  }

  private goldAddList(gold: Gold) {
    this.golds.push(gold);
  }

  private enemyAddList(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  public goldRemoveList(gold: Gold) {
    this.golds = this.golds.filter((item: Gold) => item !== gold);
  }

  private playerChange(player: Player) {
    this.player = player;
  }

  public get getPlayer() {
    return this.player;
  }

  public get getEnemies() {
    return this.enemies;
  }

  public get getGolds() {
    return this.golds;
  }

  public get getVisualRing() {
    return this.visualRing;
  }

  public get get_RingRow() {
    return this._stageRow;
  }

  public get get_RingCol() {
    return this._stageCol;
  }

  public ringObjectAdd() {
    $("#app").prepend(this.visualRing.ringObject);
  }
  public alertObjectAdd() {
    $("#ring").append(this.visualRing.alertObject);
  }
  public headerObjectAdd() {
    $("#ring").append(this.visualRing.headerObject);
  }
  public stageObjectAdd() {
    $("#ring").append(this.visualRing.stageObject);
  }
  public footerObjectAdd() {
    $("#ring").prepend(this.visualRing.footerObject);
  }
  public headerSpanObjectAdd() {
    $("#header").append(this.visualRing.stageNObject);
    $("#header").append(this.visualRing.musicObject);
  }
  public footerSpanObjectAdd() {
    $("#footer").append(this.visualRing.timeObject);
    $("#footer").append(this.visualRing.lifeObject);
    $("#footer").append(this.visualRing.scoreObject);
  }

  public alertObjectdraw(alert: Alert) {
    let message = "";
    switch (alert) {
      case Alert.Pause:
        message = "Paused";
        break;
      case Alert.Won:
        message = " ╰(*°▽°*)╯ You Won ╰(*°▽°*)╯";
        break;
      case Alert.Lose:
        message = "(っ °Д °;)っ You Died (っ °Д °;)っ";
        break;
      case Alert.GameOver:
        message = "(╬▔皿▔)╯ Game Over (╬▔皿▔)╯";
        break;
      case Alert.Tutorial:
        message =
          "[WASD] or [Arrow Keys] => Move, [Q,E] or [J,K] => Digging, [Esc] => Pause , [M] => mute music";
        break;
      case Alert.Champion:
        message = "(～o￣3￣)～ You are the Champion (～o￣3￣)～";
        break;
    }
    this.visualRing.updateVisAlert(message);
    this.visualRing.alertAddClass(alert);
    this.visualRing.alertVisible();
  }
  public alertObjecterase() {
    this.visualRing.updateVisAlert("");
    this.visualRing.alertResetClass();
    this.visualRing.alerthidden();
  }

  private drawSoil(stageNumber: number) {
    this.stageDict[stageNumber]["Soil"].forEach((item: blueprint) => {
      for (let index = 0; index < item.count; index++) {
        const soil = new Soil(item.row, item.col + index);
        this.drawAndAddMap(soil);
      }
    });
  }

  private drawConc(stageNumber: number) {
    this.stageDict[stageNumber]["Conc"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const conc = new Conc(item.row, item.col + index);
        this.drawAndAddMap(conc);
      }
    });
  }

  private drawBar(stageNumber: number) {
    this.stageDict[stageNumber]["Bar"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const bar = new Bar(item.row, item.col + index);
        this.drawAndAddMap(bar);
      }
    });
  }

  private drawLadder(stageNumber: number) {
    this.stageDict[stageNumber]["Ladder"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const ladder = new Ladder(item.row + index, item.col);
        this.drawAndAddMap(ladder);
      }
    });
  }

  private drawGold(stageNumber: number) {
    this.stageDict[stageNumber]["Gold"].forEach((item: blueprint): void => {
      const gold = new Gold(item.row, item.col);
      this.goldAddList(gold);
      this.drawAndAddRing(gold);
    });
  }

  private drawPlayer(stageNumber: number) {
    this.stageDict[stageNumber]["Player"].forEach((item: blueprint): void => {
      const player = new Player(item.row, item.col);
      this.playerChange(player);
      this.drawAndAddRing(player);
    });
  }

  private drawEnemy(stageNumber: number) {
    this.stageDict[stageNumber]["Enemy"].forEach((item: blueprint): void => {
      const enemy = new Enemy(item.row, item.col);
      this.enemyAddList(enemy);
      this.drawAndAddRing(enemy);
    });
  }

  public drawWLadder(stageNumber: number) {
    this.stageDict[stageNumber]["WLadder"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const ladder = new Ladder(item.row + index, item.col);
        this.drawAndAddMap(ladder);
      }
    });
  }

  private initMap(stageNumber: number) {
    this.drawSoil(stageNumber);
    this.drawConc(stageNumber);
    this.drawLadder(stageNumber);
    this.drawBar(stageNumber);
  }

  private initRing(stageNumber: number) {
    this.drawPlayer(stageNumber);
    this.drawEnemy(stageNumber);
    this.drawGold(stageNumber);
  }

  public stageInitCondtion(stageNumber: number) {
    if (this.stageDict[stageNumber]) return true;
    return false;
  }

  public stageInit(stageNumber: number) {
    if (this.stageInitCondtion(stageNumber)) {
      this.initMap(stageNumber);
      this.initRing(stageNumber);
    }
  }

  public eraseAndRemoveRing(element: RingElement) {
    if (this.checkBorders(element.Row, element.Col)) {
      this.visualRing.erase(element);
      this.ring.removeRing(element);
    }
  }

  public eraseAndRemoveMap(element: MapElement) {
    if (this.checkBorders(element.Row, element.Col)) {
      this.visualRing.erase(element);
      this.ring.removeMap(element);
    }
  }

  public drawAndAddRing(element: RingElement) {
    if (this.checkBorders(element.Row, element.Col)) {
      this.ring.addRing(element);
      this.visualRing.draw(element);
    }
  }

  public eraseAndDraw(element: Element) {
    if (this.checkBorders(element.Row, element.Col)) {
      this.visualRing.erase(element);
      this.visualRing.draw(element);
    }
  }

  public drawAndAddMap(element: MapElement) {
    if (this.checkBorders(element.Row, element.Col)) {
      this.ring.addMap(element);
      this.visualRing.draw(element);
    }
  }

  public getRingElement(row: number, col: number): RingElement | undefined {
    if (this.checkBorders(row, col)) {
      return this.ring.RingElement(row, col);
    }
    return undefined;
  }

  public getMapElement(row: number, col: number): MapElement | undefined {
    if (this.checkBorders(row, col)) {
      return this.ring.MapElement(row, col);
    }
    return undefined;
  }

  public checkBorders(row: number, col: number): boolean {
    if (row < 0 || row >= this._stageRow) {
      /*console.error(
        "Invalid Object request: " + row + " is more than " + this._RingRow,
      );*/
      return false;
    }
    if (col < 0 || col >= this._stageCol) {
      /*console.error(
        "Invalid Object request: " + col + " is more than " + this._RingCol,
      );*/
      return false;
    }
    return true;
  }

  public updateTime(time: number) {
    if (time % 10 === 0) this.getVisualRing.updateVisTime(time / 10);
  }
  public updateLife(life: number) {
    this.getVisualRing.updateVislife(life);
  }
  public updateScore(score: number) {
    this.getVisualRing.updateVisScore(score);
  }
  public updateStageN(StageN: number) {
    this.getVisualRing.updateVisStageN(StageN);
  }
  private get Dictionary() {
    return {
      1: {
        Soil: [
          { row: 2, col: 5, count: 7 } as blueprint,
          { row: 20, col: 5, count: 17 } as blueprint,
          { row: 28, col: 0, count: 60 } as blueprint,
          { row: 17, col: 25, count: 31 } as blueprint,
          { row: 5, col: 25, count: 20 } as blueprint,
          { row: 11, col: 20, count: 5 } as blueprint,
          { row: 5, col: 50, count: 5 } as blueprint,
        ],
        Ladder: [
          { row: 20, col: 14, count: 8 } as blueprint,
          { row: 2, col: 10, count: 18 } as blueprint,
          { row: 17, col: 50, count: 11 } as blueprint,
          { row: 5, col: 40, count: 12 } as blueprint,
        ],
        Player: [{ row: 10, col: 17, count: 1 } as blueprint],
        Enemy: [
          { row: 25, col: 10, count: 1 } as blueprint,
          { row: 23, col: 55, count: 1 } as blueprint,
          { row: 2, col: 40, count: 1 } as blueprint,
        ],
        Bar: [
          { row: 8, col: 11, count: 29 } as blueprint,
          { row: 16, col: 11, count: 15 } as blueprint,
          { row: 4, col: 45, count: 7 } as blueprint,
        ],
        Gold: [
          { row: 27, col: 40, count: 1 } as blueprint,
          { row: 19, col: 20, count: 1 } as blueprint,
          { row: 1, col: 6, count: 1 } as blueprint,
          { row: 10, col: 22, count: 1 } as blueprint,
          { row: 4, col: 54, count: 1 } as blueprint,
        ],
        Conc: [{ row: 29, col: 0, count: 60 } as blueprint],
        WLadder: [{ row: 0, col: 30, count: 5 } as blueprint],
      },

      2: {
        Soil: [
          { row: 28, col: 0, count: 60 } as blueprint,
          { row: 4, col: 2, count: 10 } as blueprint,
          { row: 2, col: 54, count: 5 } as blueprint,

          { row: 12, col: 33, count: 10 } as blueprint,
          { row: 12, col: 10, count: 10 } as blueprint,
          { row: 10, col: 42, count: 1 } as blueprint,
          { row: 11, col: 42, count: 1 } as blueprint,
          { row: 1, col: 58, count: 1 } as blueprint,
          { row: 5, col: 22, count: 16 } as blueprint,
          { row: 4, col: 22, count: 1 } as blueprint,
          { row: 10, col: 48, count: 10 } as blueprint,
          { row: 18, col: 48, count: 10 } as blueprint,

          { row: 22, col: 5, count: 5 } as blueprint,

          { row: 22, col: 37, count: 15 } as blueprint,
          { row: 22, col: 15, count: 5 } as blueprint,

          { row: 15, col: 26, count: 6 } as blueprint,
          { row: 16, col: 26, count: 6 } as blueprint,
          { row: 17, col: 26, count: 1 } as blueprint,
          { row: 17, col: 31, count: 1 } as blueprint,
          { row: 18, col: 26, count: 6 } as blueprint,
          { row: 19, col: 26, count: 6 } as blueprint,
          { row: 17, col: 56, count: 1 } as blueprint,
        ],
        Ladder: [
          { row: 22, col: 37, count: 6 } as blueprint,
          { row: 4, col: 1, count: 24 } as blueprint,
          { row: 12, col: 17, count: 10 } as blueprint,
          { row: 4, col: 10, count: 8 } as blueprint,
          { row: 22, col: 6, count: 6 } as blueprint,
          { row: 18, col: 50, count: 4 } as blueprint,
          { row: 2, col: 55, count: 8 } as blueprint,
          { row: 10, col: 53, count: 8 } as blueprint,
        ],
        Player: [{ row: 10, col: 17, count: 1 } as blueprint],
        Enemy: [
          { row: 25, col: 10, count: 1 } as blueprint,
          { row: 23, col: 55, count: 1 } as blueprint,
          { row: 2, col: 40, count: 1 } as blueprint,
          { row: 1, col: 11, count: 1 } as blueprint,
        ],
        Bar: [
          { row: 11, col: 20, count: 13 } as blueprint,
          { row: 21, col: 10, count: 5 } as blueprint,
          { row: 21, col: 20, count: 17 } as blueprint,
          { row: 9, col: 42, count: 7 } as blueprint,
          { row: 3, col: 12, count: 11 } as blueprint,
        ],
        Gold: [
          { row: 17, col: 28, count: 1 } as blueprint,
          { row: 17, col: 57, count: 1 } as blueprint,
          { row: 1, col: 54, count: 1 } as blueprint,
          { row: 27, col: 53, count: 1 } as blueprint,
          { row: 3, col: 11, count: 1 } as blueprint,
          { row: 3, col: 5, count: 1 } as blueprint,
          { row: 9, col: 42, count: 1 } as blueprint,
        ],
        Conc: [{ row: 29, col: 0, count: 60 } as blueprint],
        WLadder: [{ row: 0, col: 25, count: 5 } as blueprint],
      },
      3: {
        Soil: [
          { row: 2, col: 5, count: 10 } as blueprint,
          { row: 22, col: 5, count: 17 } as blueprint,
          { row: 2, col: 50, count: 10 } as blueprint,
          { row: 11, col: 24, count: 10 } as blueprint,
          { row: 14, col: 1, count: 7 } as blueprint,
          { row: 15, col: 3, count: 1 } as blueprint,
          { row: 16, col: 1, count: 1 } as blueprint,
          { row: 16, col: 7, count: 1 } as blueprint,
          { row: 17, col: 1, count: 7 } as blueprint,
          { row: 18, col: 1, count: 7 } as blueprint,
          { row: 17, col: 52, count: 5 } as blueprint,
          { row: 17, col: 51, count: 6 } as blueprint,
          { row: 18, col: 53, count: 1 } as blueprint,
          { row: 19, col: 51, count: 1 } as blueprint,
          { row: 19, col: 56, count: 1 } as blueprint,
          { row: 20, col: 51, count: 6 } as blueprint,
          { row: 21, col: 51, count: 6 } as blueprint,
          { row: 28, col: 0, count: 60 } as blueprint,
        ],
        Ladder: [
          { row: 22, col: 8, count: 6 } as blueprint,
          { row: 16, col: 14, count: 6 } as blueprint,
          { row: 2, col: 7, count: 7 } as blueprint,
          { row: 13, col: 40, count: 15 } as blueprint,
          { row: 2, col: 50, count: 5 } as blueprint,
          { row: 11, col: 25, count: 5 } as blueprint,
          { row: 2, col: 59, count: 26 } as blueprint,
          { row: 5, col: 30, count: 6 } as blueprint,
        ],
        Player: [{ row: 10, col: 17, count: 1 } as blueprint],
        Enemy: [
          { row: 25, col: 12, count: 1 } as blueprint,
          { row: 23, col: 55, count: 1 } as blueprint,
          { row: 1, col: 58, count: 1 } as blueprint,
          { row: 1, col: 11, count: 1 } as blueprint,
          { row: 1, col: 17, count: 1 } as blueprint,
        ],
        Bar: [
          { row: 5, col: 8, count: 42 } as blueprint,
          { row: 13, col: 26, count: 26 } as blueprint,
        ],
        Gold: [
          { row: 12, col: 30, count: 1 } as blueprint,
          { row: 16, col: 3, count: 1 } as blueprint,
          { row: 1, col: 54, count: 1 } as blueprint,
          { row: 19, col: 55, count: 1 } as blueprint,
          { row: 4, col: 13, count: 1 } as blueprint,
          { row: 26, col: 30, count: 1 } as blueprint,
          { row: 27, col: 11, count: 1 } as blueprint,
          { row: 27, col: 55, count: 1 } as blueprint,
          { row: 1, col: 13, count: 1 } as blueprint,
        ],
        Conc: [
          { row: 29, col: 0, count: 60 } as blueprint,
          { row: 27, col: 30, count: 1 } as blueprint,
          { row: 18, col: 51, count: 2 } as blueprint,
          { row: 18, col: 54, count: 3 } as blueprint,
          { row: 15, col: 1, count: 2 } as blueprint,
          { row: 15, col: 4, count: 4 } as blueprint,
          { row: 16, col: 14, count: 15 } as blueprint,
          { row: 9, col: 3, count: 10 } as blueprint,
          { row: 7, col: 40, count: 11 } as blueprint,
        ],
        WLadder: [{ row: 0, col: 9, count: 3 } as blueprint],
      },
    };
  }
}
