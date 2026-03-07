import { Enemy } from "./../ring/elements/enemy/enemy.ts";
import { Bar } from "./../ring/elements/bar/bar.ts";
import { Player } from "./../ring/elements/player/player.ts";
import { Gold } from "./../ring/elements/gold/gold.ts";
import { Ring, type MapElement, type RingElement } from "./../ring/ring.ts";
import { Soil } from "../ring/elements/soil/soil.ts";
import { Conc } from "../ring/elements/concrete/conc.ts";
import { Ladder } from "../ring/elements/ladder/ladder.ts";
import { Gameplay } from "./gameplay.ts";
import { VisualRing, Element } from "./../ring/ring.ts";

export interface blueprint {
  row: number;
  col: number;
  count: number;
}

interface StageDrawDict {
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
    private _RingRow: number = 30,
    private _RingCol: number = 60,
    private enemies: Enemy[] = [],
    private golds: Gold[] = [],
    private player: Player = new Player(0, 0),
    private ring: Ring = new Ring(_RingRow, _RingCol),
    private visualRing: VisualRing = new VisualRing(_RingRow, _RingCol),
  ) {}

  public reset() {
    this.ring.reset();
    this.visualRing.reset();
    this.enemies = [];
    this.golds = [];
  }
  public goldAddList(gold: Gold) {
    this.golds.push(gold);
  }

  public enemyAddList(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  public goldRemoveList(gold: Gold) {
    this.golds = this.golds.filter((item: Gold) => item !== gold);
  }
  public playerChange(player: Player) {
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

  public get getRing() {
    return this.ring;
  }

  public get getVisualRing() {
    return this.visualRing;
  }
  public get get_RingRow() {
    return this._RingRow;
  }
  public get get_RingCol() {
    return this._RingCol;
  }

  private drawSoil(stageNumber: number) {
    stageDrawDict[stageNumber]["Soil"].forEach((item: blueprint) => {
      for (let index = 0; index < item.count; index++) {
        const soil = new Soil(item.row, item.col + index);
        this.drawAndAddMap(soil);
      }
    });
  }

  private drawConc(stageNumber: number) {
    stageDrawDict[stageNumber]["Conc"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const conc = new Conc(item.row, item.col + index);
        this.drawAndAddMap(conc);
      }
    });
  }

  private drawLadder(stageNumber: number) {
    stageDrawDict[stageNumber]["Ladder"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const ladder = new Ladder(item.row + index, item.col);
        this.drawAndAddMap(ladder);
      }
    });
  }

  private drawBar(stageNumber: number) {
    stageDrawDict[stageNumber]["Bar"].forEach((item: blueprint): void => {
      for (let index = 0; index < item.count; index++) {
        const bar = new Bar(item.row, item.col + index);
        this.drawAndAddMap(bar);
      }
    });
  }

  private drawGold(stageNumber: number) {
    stageDrawDict[stageNumber]["Gold"].forEach((item: blueprint): void => {
      const gold = new Gold(item.row, item.col);
      this.goldAddList(gold);
      this.drawAndAddRing(gold);
    });
  }

  private drawPlayer(stageNumber: number) {
    stageDrawDict[stageNumber]["Player"].forEach((item: blueprint): void => {
      const player = new Player(item.row, item.col);
      this.playerChange(player);
      this.drawAndAddRing(player);
    });
  }

  private drawEnemy(stageNumber: number) {
    stageDrawDict[stageNumber]["Enemy"].forEach((item: blueprint): void => {
      const enemy = new Enemy(item.row, item.col);
      this.enemyAddList(enemy);
      this.drawAndAddRing(enemy);
    });
  }

  public drawWLadder(stageNumber: number) {
    stageDrawDict[stageNumber]["WLadder"].forEach((item: blueprint): void => {
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

  public drawInitStage(stageNumber: number) {
    this.initMap(stageNumber);
    this.initRing(stageNumber);
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
    if (row < 0 || row >= this._RingRow) {
      /*console.error(
        "Invalid Object request: " + row + " is more than " + this._RingRow,
      );*/
      return false;
    }
    if (col < 0 || col >= this._RingCol) {
      /*console.error(
        "Invalid Object request: " + col + " is more than " + this._RingCol,
      );*/
      return false;
    }
    return true;
  }
}

export const stageDrawDict: StageDrawDict = {
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
      { row: 1, col: 11, count: 1 } as blueprint,
    ],
    Bar: [
      { row: 8, col: 11, count: 29 } as blueprint,
      { row: 16, col: 11, count: 15 } as blueprint,
      { row: 4, col: 45, count: 7 } as blueprint,
    ],
    Gold: [
      { row: 4, col: 35, count: 1 } as blueprint,
      { row: 27, col: 40, count: 1 } as blueprint,
      { row: 19, col: 20, count: 1 } as blueprint,
      { row: 1, col: 6, count: 1 } as blueprint,
      { row: 10, col: 22, count: 1 } as blueprint,
      { row: 4, col: 54, count: 1 } as blueprint,
      { row: 27, col: 11, count: 1 } as blueprint,
    ],
    Conc: [{ row: 29, col: 0, count: 60 } as blueprint],
    WLadder: [{ row: 0, col: 30, count: 5 } as blueprint],
  },
};
