import { Enemy } from "../ring/elements/enemy/enemy";
import { Gold } from "../ring/elements/gold/gold";
import { Hole } from "../ring/elements/hole/hole";
import { Player, Input } from "../ring/elements/player/player";
import { ObjectId } from "../ring/ring";
import { GameState } from "./conditions";
import { Soil } from "../ring/elements/soil/soil";
import { Bfs, type Pos } from "../ring/elements/enemy/pathfinding";
import { Stage } from "./stage";

export class Gameplay {
  constructor(
    private stats: GameState = new GameState(),
    private stage: Stage = new Stage(this),
    private enemies: Enemy[] = [],
    private golds: Gold[] = [],
    private player: Player = new Player(0, 0),
    private bfs: Bfs = new Bfs(stage),
  ) {
    this.reset();
  }

  public reset() {
    this.enemies = [];
    this.golds = [];
  }

  public addGoldList(gold: Gold) {
    this.golds.push(gold);
  }

  public addEnemyList(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  public removeGoldList(gold: Gold) {
    this.golds = this.golds.filter((item: Gold) => item !== gold);
  }

  private goldRemove(gold: Gold) {
    this.getStage.eraseAndRemoveRing(gold);
    this.removeGoldList(gold);
    this.enemies.forEach((enemy) => {
      if (enemy.GoldSlot === gold) {
        enemy.goldResetSlot();
      }
    });
  }

  public playerChange(player: Player) {
    this.player = player;
  }

  public get getPlayer() {
    return this.player;
  }

  public get getRing() {
    return this.getStage.getRing;
  }

  public get getState() {
    return this.stats;
  }
  public get getStage() {
    return this.stage;
  }

  private goldClaim(gold: Gold): void {
    this.goldRemove(gold);

    //state+++
  }

  private goldClaimCondition(gold: Gold): boolean {
    return gold.Row === this.player.Row && gold.Col === this.player.Col;
  }

  private goldPickupCondition(gold: Gold, enemy: Enemy) {
    const emptySlot = enemy.GoldSlot === undefined;
    if (emptySlot) return gold.Row === enemy.Row && gold.Col === enemy.Col;
    return false;
  }
  private goldCarryCondition(enemy: Enemy) {
    if (enemy.GoldSlot !== undefined) {
      return true;
    }
    return false;
  }
  private goldPickup(gold: Gold, enemy: Enemy) {
    enemy.PickupGold(gold);
    this.getStage.eraseAndRemoveRing(gold);
    gold.changePos(enemy.Row - 1, enemy.Col);
    this.getStage.drawAndAddRing(gold);
  }
  private carryGold(enemy: Enemy) {
    const gold = enemy.GoldSlot;
    if (gold !== undefined) {
      this.getStage.eraseAndRemoveRing(gold);
      gold.changePos(enemy.Row - 1, enemy.Col);
      this.getStage.drawAndAddRing(gold);
    }
  }

  public goldCheck() {
    this.golds.forEach((gold: Gold) => {
      if (this.goldClaimCondition(gold)) {
        this.goldClaim(gold);
      }
      this.enemies.forEach((enemy: Enemy) => {
        if (this.goldPickupCondition(gold, enemy)) this.goldPickup(gold, enemy);
        if (this.goldCarryCondition(enemy)) this.carryGold(enemy);
      });
    });
  }

  private notOccupied(row: number, col: number): boolean {
    const isPlayer: boolean =
      this.player.Row === row && this.player.Col === col;
    const isEnemy: boolean = this.enemies.some(
      (enemy: Enemy) => enemy.Row === row && enemy.Col === col,
    );
    const notOccupied: boolean = !(isPlayer || isEnemy);

    return notOccupied;
  }

  private enemyMoveCondition(next: Pos, enemy: Enemy) {
    if (this.notOccupied(next.row, next.col)) return true;
    return false;
  }

  private EnemyGoNext(enemy: Enemy) {
    const nextStep = this.bfs.findNextStepBFS(enemy, this.player);
    if (!nextStep) return;
    if (this.enemyMoveCondition(nextStep, enemy)) {
      this.getStage.eraseAndRemoveRing(enemy);
      enemy.changePos(nextStep.row, nextStep.col);
      this.getStage.drawAndAddRing(enemy);
    }
  }

  private enemyStuckCondition(enemy: Enemy) {
    if (this.getStage.getMapElement(enemy.Row, enemy.Col) instanceof Hole)
      return true;

    return false;
  }

  public enemyMove(): void {
    this.enemies.forEach((enemy) => {
      if (this.enemyStuckCondition(enemy)) {
        setTimeout(async (en: Enemy = enemy) => {
          if (this.enemyStuckCondition(enemy)) {
            this.EnemyGoNext(enemy);
            this.holeToSoil(enemy.Row + 1, enemy.Col);
          }
        }, 2500);
      } else {
        this.EnemyGoNext(enemy);
      }
    });
  }

  public playerFalling() {
    if (this.player.fallCondition()) {
      this.getStage.eraseAndRemoveRing(this.player);
      this.player.goDown();
      this.getStage.drawAndAddRing(this.player);
    }
  }
  public playerGoLeft() {
    if (!this.getStage.checkBorders(this.player.Row, this.player.Col - 1))
      return;
    if (this.player.goLeftCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.player);
      this.player.goLeft();
      this.getStage.drawAndAddRing(this.player);
    }
  }
  public playerGoUp() {
    if (!this.getStage.checkBorders(this.player.Row, this.player.Col - 1))
      return;
    if (this.player.goUpCondition()) {
      this.getStage.eraseAndRemoveRing(this.player);
      this.player.goUp();
      this.getStage.drawAndAddRing(this.player);
    }
  }
  public playerGoRight() {
    if (!this.getStage.checkBorders(this.player.Row, this.player.Col + 1))
      return;
    if (this.player.goRightCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.player);
      this.player.goRight();
      this.getStage.drawAndAddRing(this.player);
    }
  }
  public playerGoDown() {
    if (!this.getStage.checkBorders(this.player.Row + 1, this.player.Col))
      return;
    if (this.player.goDownCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.player);
      this.player.goDown();
      this.getStage.drawAndAddRing(this.player);
    }
  }
  public playerDigRight() {
    if (this.player.digRightCondition(this.getStage))
      this.holeHandle(this.player.Row + 1, this.player.Col + 1);
  }
  public playerDigLeft() {
    if (this.player.digLeftCondition(this.getStage))
      this.holeHandle(this.player.Row + 1, this.player.Col - 1);
  }
  public playerStandStill() {
    this.player.updLogState(this.getStage);
    this.player.updVisState(Input.Still);
    this.getStage.eraseAndDraw(this.player);
  }

  public holeHandle(row: number, col: number) {
    this.soilTohole(row, col);
    setTimeout(() => {
      const hole = this.getStage.getMapElement(row, col);
      if (hole instanceof Hole) {
        const enemy = this.getStage.getRingElement(row, col);
        if (enemy instanceof Enemy) {
          this.EnemyGoNext(enemy);
        }
        this.holeToSoil(row, col);
      }
    }, 5000);
  }

  public soilTohole(row: number, col: number) {
    const soil = this.getStage.getMapElement(row, col);
    if (soil instanceof Soil) {
      this.getStage.eraseAndRemoveMap(soil);
      const hole: Hole = new Hole(row, col);
      this.getStage.drawAndAddMap(hole);
    }
  }

  public async holeToSoil(row: number, col: number): Promise<void> {
    const soil: Soil = new Soil(row, col);
    const hole: Hole | undefined = this.getStage.getMapElement(row, col);
    if (hole instanceof Hole) {
      await this.waitUntilNotOccupied(() => this.notOccupied(row - 1, col));
      this.getStage.eraseAndRemoveMap(hole);
      this.getStage.drawAndAddMap(soil);
    }
  }

  private waitUntilNotOccupied(
    conditionFn: () => boolean,
    checkEveryMs: number = 100,
  ): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (conditionFn()) {
          clearInterval(interval);
          resolve();
        }
      }, checkEveryMs);
    });
  }
  private isEnemy(row: number, col: number) {
    if (this.getStage.getRingElement(row, col) instanceof Enemy) return true;
    return false;
  }
  private isHole(row: number, col: number) {
    if (this.getStage.getMapElement(row, col) instanceof Hole) return true;
    return false;
  }
  private enemytouch(): boolean {
    const enemyOnLeft: boolean =
      this.isEnemy(this.player.Row, this.player.Col - 1) &&
      !this.isHole(this.player.Row + 1, this.player.Col - 1);
    if (enemyOnLeft) {
      return true;
    }

    const enemyOnRight: boolean =
      this.isEnemy(this.player.Row, this.player.Col + 1) &&
      !this.isHole(this.player.Row + 1, this.player.Col + 1);
    if (enemyOnRight) {
      return true;
    }

    const enemyOnup: boolean = this.isEnemy(
      this.player.Row - 1,
      this.player.Col,
    );
    if (enemyOnup) {
      return true;
    }

    const enemyOnDown: boolean =
      this.isEnemy(this.player.Row + 1, this.player.Col) &&
      !this.isHole(this.player.Row + 1, this.player.Col);
    if (enemyOnDown) {
      return true;
    }
    return false;
  }
  private WLadderCondition() {
    const Wladder = this.stats.getWLadder();
    const noGold = this.golds.length === 0;
    return noGold && Wladder;
  }

  private winingRule(): void {
    if (this.WLadderCondition()) {
      this.stage.drawWLadder();
      this.stats.WLadderOn();
    }
    if (this.player.Row === -1) {
      alert("╰(*°▽°*)╯ You won ╰(*°▽°*)╯");
      this.stats.nextLevel();
    }
  }
  losingConditon() {
    return this.enemytouch();
  }
  private losingRule(): void {
    if (this.losingConditon()) {
      if (this.stats.hasLife()) {
        alert("O_O You died O_O");
        this.resetLevel();
      } else {
        alert(";_; Game Over ;_;");
        this.LevelInit();
      }
    }
  }

  public Rules() {
    this.losingRule();
    this.winingRule();
  }

  public LevelInit(): void {
    this.reset();
    this.getState.resetDefault();
    this.getStage.reset();
    this.getStage.drawInitStage();
    this.Rules();
  }
  private resetLevel() {
    this.reset();
    this.stats.sameLevel();
    this.getStage.reset();
    this.getStage.drawInitStage();
  }
}
