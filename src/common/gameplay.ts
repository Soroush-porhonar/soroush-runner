import { Enemy } from "../ring/elements/enemy/enemy";
import { Gold } from "../ring/elements/gold/gold";
import { Hole } from "../ring/elements/hole/hole";
import { Input } from "../ring/elements/player/player";
import { GameState } from "./conditions";
import { Soil } from "../ring/elements/soil/soil";
import { Bfs, type Pos } from "../ring/elements/enemy/pathfinding";
import { Stage } from "./stage";

export class Gameplay {
  constructor(
    private stats: GameState = new GameState(),
    private stage: Stage = new Stage(),
    private bfs: Bfs = new Bfs(stage),
    private lastMove: Input = Input.Still,
  ) {
    this.LevelInit();
  }

  public overWriteLastMove(keyCode: Input) {
    this.lastMove = keyCode;
  }
  public get getLastMove() {
    return this.lastMove;
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

  public GameElementInit() {
    this.stage.ringObjectAdd();
    this.stage.stageObjectAdd();
    this.stage.footerObjectAdd();
    this.stage.footerSpanObjectAdd();
    this.stage.menuObjectAdd();
  }

  public checkpause() {
    if (this.stats.getPause === true) {
      this.stage.menuObjectdraw();
      return;
    }
    this.stage.menuObjecterase();
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

  private goldClaim(gold: Gold): void {
    this.stage.goldRemove(gold);
    this.stats.ScoreAdd();
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

  private notOccupied(row: number, col: number): boolean {
    const isPlayer: boolean =
      this.stage.getPlayer.Row === row && this.stage.getPlayer.Col === col;
    const isEnemy: boolean = this.stage.getEnemies.some(
      (enemy: Enemy) => enemy.Row === row && enemy.Col === col,
    );
    const notOccupied: boolean = !(isPlayer || isEnemy);

    return notOccupied;
  }

  public enemyMove(): void {
    this.stage.getEnemies.forEach((enemy) => {
      if (this.enemyStuckCondition(enemy)) {
        setTimeout(() => {
          this.enemyGetupHole(enemy);
        }, 2500);
      } else {
        this.EnemyGoNext(enemy);
      }
    });
  }
  private enemyMoveCondition(next: Pos) {
    if (this.notOccupied(next.row, next.col)) return true;
    return false;
  }

  private EnemyGoNext(enemy: Enemy) {
    const nextStep = this.bfs.findNextStepBFS(enemy, this.stage.getPlayer);
    if (!nextStep) return;
    if (this.enemyMoveCondition(nextStep)) {
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

  private enemyRespawn(enemy: Enemy) {
    this.getStage.eraseAndRemoveRing(enemy);
    enemy.changePos(0, enemy.Col);
    this.getStage.drawAndAddRing(enemy);
    this.stats.ScoreAdd();
  }

  private enemyGetupHole(enemy: Enemy) {
    if (this.enemyStuckCondition(enemy)) {
      this.EnemyGoNext(enemy);
      this.holeToSoil(enemy.Row + 1, enemy.Col);
    }
  }

  public playerAction() {
    switch (this.lastMove) {
      case Input.Still:
        this.playerGoStill();
        break;
      case Input.Left: // LEFT
        this.playerGoLeft();
        break;
      case Input.Up: // UP
        this.playerGoUp();
        break;
      case Input.Right: // RIGHT
        this.playerGoRight();
        break;
      case Input.Down: // DOWN
        this.playerGoDown();
        break;
      case Input.DigRight: // dig right
        this.playerDigRight();
        break;
      case Input.DigLeft: // dig left
        this.playerDigLeft();
        break;
    }
    this.overWriteLastMove(Input.Still);
    //this.playerStandStill();
  }

  public playerFalling() {
    if (this.stage.getPlayer.fallCondition()) {
      this.getStage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goDown();
      this.getStage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerGoLeft() {
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

  private playerGoUp() {
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

  private playerGoRight() {
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

  private playerGoDown() {
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

  private playerDigRight() {
    if (this.stage.getPlayer.digRightCondition(this.getStage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col + 1,
      );
  }

  private playerDigLeft() {
    if (this.stage.getPlayer.digLeftCondition(this.getStage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col - 1,
      );
  }

  private playerGoStill() {
    this.stage.getPlayer.updLogState(this.getStage);
    this.stage.getPlayer.goStill();
    this.getStage.eraseAndDraw(this.stage.getPlayer);
  }

  public holeHandle(row: number, col: number) {
    this.soilTohole(row, col);
    setTimeout(() => {
      const hole = this.getStage.getMapElement(row, col);
      if (hole instanceof Hole) {
        const enemy = this.getStage.getRingElement(row, col);
        if (enemy instanceof Enemy) {
          this.enemyRespawn(enemy);
        }
        this.holeToSoil(row, col);
      }
    }, 5000);
  }

  private soilTohole(row: number, col: number) {
    const soil = this.getStage.getMapElement(row, col);
    if (soil instanceof Soil) {
      this.getStage.eraseAndRemoveMap(soil);
      const hole: Hole = new Hole(row, col);
      this.getStage.drawAndAddMap(hole);
    }
  }

  private async holeToSoil(row: number, col: number): Promise<void> {
    const soil: Soil = new Soil(row, col);
    const hole: Hole | undefined = this.getStage.getMapElement(row, col);
    if (hole instanceof Hole) {
      const enemy = this.getStage.getRingElement(row, col);
      const enemyInHole = enemy instanceof Enemy;
      if (enemyInHole) {
        await this.waitUntilNotOccupied(() => this.notOccupied(row - 1, col));
      }
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

  private WLadderRule() {
    if (this.WLadderCondition()) {
      this.stage.drawWLadder(this.stats.getStageNumber);
      this.stats.WLadderOn();
    }
  }

  private WLadderCondition() {
    const Wladder = this.stats.getWLadder();
    const noGold = this.stage.getGolds.length === 0;
    return noGold && !Wladder;
  }

  private winingRule(): void {
    if (this.WinningCondition()) {
      alert("╰(*°▽°*)╯ YOU WON ╰(*°▽°*)╯");
      this.Levelnext();
    }
  }
  private WinningCondition() {
    const toGod = this.stage.getPlayer.Row === -1;
    const Wladder = this.stats.getWLadder();
    return toGod && Wladder;
  }

  private losingRule(): void {
    if (this.losingConditon()) {
      if (this.stats.lifeHas()) {
        alert("O_O YOU DIED O_O");
        this.Levelreset();
      } else {
        alert(";_; GAME OVER ;_;");
        this.LevelInit();
      }
    }
  }
  private losingConditon() {
    const enemyStuck = this.stage.getPlayer.Row >= 28;
    return enemyStuck || this.enemytouch();
  }
  public Rules() {
    this.losingRule();
    this.WLadderRule();
    this.winingRule();
  }
  public updateFooter() {
    if (this.stats.getTime % 10 === 0)
      this.stage.getVisualRing.updateVisTime(this.stats.getTime / 10);
    this.stage.getVisualRing.updateVislife(this.stats.getlife);
    this.stage.getVisualRing.updateVisScore(this.stats.scoreGet);
  }

  private LevelInit(): void {
    this.stats.resetDefault();
    this.stage.reset();
    this.stage.drawInitStage(this.stats.getStageNumber);
    this.Rules();
  }
  private Levelreset() {
    this.stats.sameLevel();
    this.stage.reset();
    this.stage.drawInitStage(this.stats.getStageNumber);
  }
  private Levelnext() {
    this.stats.nextLevel();
    this.stage.reset();
    this.stage.drawInitStage(this.stats.getStageNumber);
  }
}
