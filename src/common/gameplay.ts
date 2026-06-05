import { Enemy } from "../ring/elements/enemy/enemy";
import { Gold } from "../ring/elements/gold/gold";
import { Hole } from "../ring/elements/hole/hole";
import { Input } from "../ring/elements/player/player";
import { GameState } from "./conditions";
import { Soil } from "../ring/elements/soil/soil";
import { Bfs, type Pos } from "../ring/elements/enemy/pathfinding";
import { Stage } from "./stage";
import { Alert } from "../ring/ring";

export class Gameplay {
  constructor(
    private stats: GameState = new GameState(),
    private stage: Stage = new Stage(),
    private bfs: Bfs = new Bfs(stage),
    private lastMove: Input = Input.Still,
  ) {
    this.LevelInit();
  }
  public goldRemove(gold: Gold) {
    this.stage.eraseAndRemoveRing(gold);
    this.stage.goldRemoveList(gold);
    this.stage.getEnemies.forEach((enemy) => {
      if (enemy.GoldSlot === gold) {
        enemy.goldResetSlot();
      }
    });
  }
  public alertSkip() {
    if (this.getState.getPause) {
      this.getStage.alertObjecterase();
      this.getState.unpauseNow();
    }
  }

  public alertPause() {
    if (!this.getState.getPause) {
      this.getStage.alertObjectdraw(Alert.Pause);
      this.getState.pauseNow();
    }
  }
  public overWriteLastMove(keyCode: Input) {
    this.lastMove = keyCode;
  }
  public get getLastMove() {
    return this.lastMove;
  }
  public get getState() {
    return this.stats;
  }
  public get getStage() {
    return this.stage;
  }

  public gameObjectInit() {
    this.stage.ringObjectAdd();
    this.stage.stageObjectAdd();
    this.stage.headerObjectAdd();
    this.stage.footerObjectAdd();
    this.stage.footerSpanObjectAdd();
    this.stage.headerSpanObjectAdd();
    this.stage.alertObjectAdd();
  }

  public goldCheck() {
    this.stage.getGolds.forEach((gold: Gold) => {
      if (this.goldClaimCondition(gold)) {
        this.goldClaim(gold);
      }
      this.stage.getEnemies.forEach((enemy: Enemy) => {
        if (this.goldPickupCondition(gold, enemy)) this.goldPickup(gold, enemy);
        if (this.goldCarryCondition(enemy)) this.goldCarry(enemy);
      });
    });
  }

  private goldClaim(gold: Gold): void {
    this.goldRemove(gold);
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
  private goldCarry(enemy: Enemy) {
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
    //this.overWriteLastMove(Input.Still);
    //this.playerStandStill();
  }

  public playerFalling() {
    if (this.stage.getPlayer.fallCondition()) {
      this.stage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goDown();
      this.stage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerGoLeft() {
    if (
      !this.stage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col - 1,
      )
    )
      return;
    if (this.stage.getPlayer.goLeftCondition(this.stage)) {
      this.stage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goLeft();
      this.stage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerGoUp() {
    if (
      !this.stage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col - 1,
      )
    )
      return;
    if (this.stage.getPlayer.goUpCondition()) {
      this.stage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goUp();
      this.stage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerGoRight() {
    if (
      !this.stage.checkBorders(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col + 1,
      )
    )
      return;
    if (this.stage.getPlayer.goRightCondition(this.stage)) {
      this.stage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goRight();
      this.stage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerGoDown() {
    if (
      !this.stage.checkBorders(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col,
      )
    )
      return;
    if (this.stage.getPlayer.goDownCondition(this.stage)) {
      this.stage.eraseAndRemoveRing(this.stage.getPlayer);
      this.stage.getPlayer.goDown();
      this.stage.drawAndAddRing(this.stage.getPlayer);
    }
  }

  private playerDigRight() {
    if (this.stage.getPlayer.digRightCondition(this.stage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col + 1,
      );
  }

  private playerDigLeft() {
    if (this.stage.getPlayer.digLeftCondition(this.stage))
      this.holeHandle(
        this.stage.getPlayer.Row + 1,
        this.stage.getPlayer.Col - 1,
      );
  }

  private playerGoStill() {
    this.stage.getPlayer.updLogState(this.stage);
    this.stage.getPlayer.goStill();
    this.stage.eraseAndDraw(this.stage.getPlayer);
  }

  public holeHandle(row: number, col: number) {
    this.soilTohole(row, col);
    setTimeout(() => {
      const hole = this.stage.getMapElement(row, col);
      if (hole instanceof Hole) {
        const enemy = this.stage.getRingElement(row, col);
        if (enemy instanceof Enemy) {
          this.enemyRespawn(enemy);
        }
        this.holeToSoil(row, col);
      }
    }, 5000);
  }

  private soilTohole(row: number, col: number) {
    const soil = this.stage.getMapElement(row, col);
    if (soil instanceof Soil) {
      this.stage.eraseAndRemoveMap(soil);
      const hole: Hole = new Hole(row, col);
      this.stage.drawAndAddMap(hole);
    }
  }

  private async holeToSoil(row: number, col: number): Promise<void> {
    const soil: Soil = new Soil(row, col);
    const hole: Hole | undefined = this.stage.getMapElement(row, col);
    if (hole instanceof Hole) {
      const enemy = this.stage.getRingElement(row, col);
      const enemyInHole = enemy instanceof Enemy;
      if (enemyInHole) {
        await this.waitUntilNotOccupied(() => this.notOccupied(row - 1, col));
      }
      this.stage.eraseAndRemoveMap(hole);
      this.stage.drawAndAddMap(soil);
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
    const enemyOnLeft: boolean = this.bfs.notGoingToFall(
      this.stage.getPlayer.Row,
      this.stage.getPlayer.Col - 1,
    );
    if (enemyOnLeft) {
      return true;
    }
    const enemyOnRight: boolean = this.bfs.notGoingToFall(
      this.stage.getPlayer.Row,
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

  private winAlert() {
    this.stage.alertObjectdraw(Alert.Won);
    this.stats.pauseNow();
  }
  private loseAlert() {
    this.stage.alertObjectdraw(Alert.Lose);
    this.stats.pauseNow();
  }
  public tutorialAlert() {
    this.stage.alertObjectdraw(Alert.Tutorial);
    this.stats.pauseNow();
  }
  public championAlert() {
    this.stage.alertObjectdraw(Alert.Champion);
    this.stats.pauseNow();
  }
  private gameOverAlert() {
    this.stage.alertObjectdraw(Alert.GameOver);
    this.stats.pauseNow();
  }

  private WLadderCondition() {
    const Wladder = this.stats.getWLadder();
    const noGold = this.stage.getGolds.length === 0;
    return noGold && !Wladder;
  }
  private WinningCondition() {
    const toGod = this.stage.getPlayer.Row === -1;
    const Wladder = this.stats.getWLadder();
    return toGod && Wladder;
  }
  private losingConditon() {
    const enemyStuck =
      this.stage.getMapElement(
        this.stage.getPlayer.Row,
        this.stage.getPlayer.Col,
      ) instanceof Soil;
    return enemyStuck || this.enemytouch();
  }

  private champtionCondition() {
    if (this.stage.stageInitCondtion(this.stats.getStageNumber)) return false;
    return true;
  }
  private WLadderRule() {
    if (this.WLadderCondition()) {
      this.stage.drawWLadder(this.stats.getStageNumber);
      this.stats.WLadderOn();
    }
  }
  private winingRule(): void {
    if (this.WinningCondition()) {
      this.winAlert();
      this.Levelnext();
    }
  }
  private championRule() {
    if (this.champtionCondition()) {
      this.championAlert();
      this.LevelInit();
    }
  }
  private losingRule(): void {
    if (this.losingConditon()) {
      if (this.stats.lifeHas()) {
        this.loseAlert();
        this.Levelreset();
      } else {
        this.gameOverAlert();
        this.LevelInit();
      }
    }
  }

  public Rules() {
    this.losingRule();
    this.WLadderRule();
    this.winingRule();
    this.championRule();
  }

  public updateFooter() {
    this.stage.updateTime(this.stats.getTime);
    this.stage.updateLife(this.stats.getlife);
    this.stage.updateScore(this.stats.getScore);
    this.stage.updateStageN(this.stats.getStageNumber);
  }

  private LevelInit(): void {
    this.stats.resetDefault();
    this.stage.reset();
    this.stage.stageInit(this.stats.getStageNumber);
  }

  private Levelreset() {
    this.stats.sameLevel();
    this.stage.reset();
    this.stage.stageInit(this.stats.getStageNumber);
  }

  private Levelnext() {
    this.stats.nextLevel();
    this.stage.reset();
    this.stage.stageInit(this.stats.getStageNumber);
  }
}
