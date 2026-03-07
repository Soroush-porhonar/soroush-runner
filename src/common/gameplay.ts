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
    private stage: Stage = new Stage(),
    private bfs: Bfs = new Bfs(stage),
  ) {}

  private goldRemove(gold: Gold) {
    this.stage.eraseAndRemoveRing(gold);
    this.stage.goldRemoveList(gold);
    this.stage.getEnemies.forEach((enemy) => {
      if (enemy.GoldSlot === gold) {
        enemy.goldResetSlot();
      }
    });
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
    return (
      gold.Row === this.stage.getPlayer.Row &&
      gold.Col === this.stage.getPlayer.Col
    );
  }

  private goldPickupCondition(gold: Gold, enemy: Enemy) {
    const emptySlot = enemy.GoldSlot === undefined;
    const samePos = gold.Row === enemy.Row && gold.Col === enemy.Col;
    return samePos && emptySlot;
  }
  private goldCarryCondition(enemy: Enemy) {
    const fullGoldSlot = enemy.GoldSlot !== undefined;
    return fullGoldSlot;
  }
  private goldPickup(gold: Gold, enemy: Enemy) {
    enemy.PickupGold(gold);
    this.getStage.eraseAndRemoveRing(gold);
    gold.changePos(enemy.Row - 1, enemy.Col);
    this.getStage.drawAndAddRing(gold);
  }
  private carryGold(enemy: Enemy) {
    const gold = enemy.GoldSlot;
    if (gold === undefined) return;
    this.getStage.eraseAndRemoveRing(gold);
    gold.changePos(enemy.Row - 1, enemy.Col);
    this.getStage.drawAndAddRing(gold);
  }

  public goldCheck() {
    this.stage.getGolds.forEach((gold: Gold) => {
      if (this.goldClaimCondition(gold)) {
        this.goldClaim(gold);
      }
      this.stage.getEnemies.forEach((enemy: Enemy) => {
        if (this.goldPickupCondition(gold, enemy)) this.goldPickup(gold, enemy);
        if (this.goldCarryCondition(enemy)) this.carryGold(enemy);
      });
    });
  }

  private notOccupied(row: number, col: number): boolean {
    const isPlayer: boolean =
      this.stage.getPlayer.Row === row && this.stage.getPlayer.Col === col;
    const isEnemy: boolean = this.stage.getEnemies.some(
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
    const nextStep = this.bfs.findNextStepBFS(enemy, this.stage.getPlayer);
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
    this.stage.getEnemies.forEach((enemy) => {
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
    if (this.stage.getPlayer.fallCondition()) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goDown();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }
  public playerGoLeft() {
    if (
      !this.getStage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col - 1,
      )
    )
      return;
    if (this.stage.getPlayer.goLeftCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goLeft();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }
  public playerGoUp() {
    if (
      !this.getStage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col - 1,
      )
    )
      return;
    if (this.stage.getPlayer.goUpCondition()) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goUp();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }
  public playerGoRight() {
    if (
      !this.getStage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col + 1,
      )
    )
      return;
    if (this.stage.getPlayer.goRightCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goRight();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }
  public playerGoDown() {
    if (
      !this.getStage.checkBorders(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col,
      )
    )
      return;
    if (this.stage.getPlayer.goDownCondition(this.getStage)) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goDown();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }
  public playerDigRight() {
    if (this.stage.getPlayer.digRightCondition(this.getStage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col + 1,
      );
  }
  public playerDigLeft() {
    if (this.stage.getPlayer.digLeftCondition(this.getStage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col - 1,
      );
  }
  public playerStandStill() {
    this.stage.getPlayer.updLogState(this.getStage);
    this.stage.getPlayer.updVisState(Input.Still);
    this.getStage.eraseAndDraw(this.stage.getPlayer);
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

  private enemytouch(): boolean {
    const enemyOnLeft: boolean =
      this.bfs.isEnemy(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col - 1,
      ) &&
      !this.bfs.isHole(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col - 1,
      );
    if (enemyOnLeft) {
      return true;
    }

    const enemyOnRight: boolean =
      this.bfs.isEnemy(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col + 1,
      ) &&
      !this.bfs.isHole(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col + 1,
      );
    if (enemyOnRight) {
      return true;
    }

    const enemyOnup: boolean = this.bfs.isEnemy(
      this.stage.getPlayer.Row - 1,
      this.stage.getPlayer.Col,
    );
    if (enemyOnup) {
      return true;
    }

    const enemyOnDown: boolean =
      this.bfs.isEnemy(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col,
      ) &&
      !this.bfs.isHole(this.stage.getPlayer.Row + 1, this.stage.getPlayer.Col);
    if (enemyOnDown) {
      return true;
    }
    return false;
  }
  private WLadderCondition() {
    const Wladder = this.stats.getWLadder();
    const noGold = this.stage.getGolds.length === 0;
    return noGold && Wladder;
  }

  private WinningCondition() {
    const toGod = this.stage.getPlayer.Row === -1;
    const Wladder = this.stats.getWLadder();
    return toGod && Wladder;
  }
  private winingRule(): void {
    if (this.WLadderCondition()) {
      this.stage.drawWLadder(this.stats.getStageNumber);
      this.stats.WLadderOn();
    }
    if (this.WinningCondition()) {
      alert("╰(*°▽°*)╯ YOU WON ╰(*°▽°*)╯");
      this.Levelnext();
    }
  }
  losingConditon() {
    return this.enemytouch();
  }
  private losingRule(): void {
    if (this.losingConditon()) {
      if (this.stats.hasLife()) {
        alert("O_O YOU DIED O_O");
        this.Levelreset();
      } else {
        alert(";_; GAME OVER ;_;");
        this.LevelInit();
      }
    }
  }

  public Rules() {
    this.losingRule();
    this.winingRule();
  }

  public LevelInit(): void {
    this.getState.resetDefault();
    this.getStage.reset();
    this.getStage.drawInitStage(this.stats.getStageNumber);
    this.Rules();
  }
  private Levelreset() {
    this.stats.sameLevel();
    this.getStage.reset();
    this.getStage.drawInitStage(this.stats.getStageNumber);
  }
  private Levelnext() {
    this.stats.nextLevel();
    this.getStage.reset();
    this.getStage.drawInitStage(this.stats.getStageNumber);
  }
}
