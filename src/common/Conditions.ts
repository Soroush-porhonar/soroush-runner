export class GameState {
  constructor(
    private time: number = 0,
    private score: number = 0,
    private life: number = 3,
    private Wladder: boolean = false,
    private pause: boolean = false,
    private stageNumber: number = 1,
  ) {}
  public resetDefault() {
    ((this.time = 0),
      (this.score = 0),
      (this.life = 3),
      (this.Wladder = false),
      (this.stageNumber = 1));
  }
  public ScoreAdd() {
    this.score = this.score + 100;
  }
  public WLadderOn() {
    this.Wladder = true;
  }
  public getWLadder() {
    return this.Wladder;
  }
  public addTime() {
    this.time++;
  }
  public get getTime() {
    return this.time;
  }

  public sameLevel() {
    ((this.time = 0), (this.score = 0), this.life--, (this.Wladder = false));
  }
  public nextLevel() {
    ((this.time = 0),
      (this.life = 3),
      (this.Wladder = false),
      this.stageNumber++);
  }
  public get getPause() {
    return this.pause;
  }
  public continue() {
    this.pause = false;
  }
  public pauseChange() {
    this.pause = !this.pause;
  }
  public get getStageNumber() {
    return this.stageNumber;
  }
  public get getlife() {
    return this.life;
  }
  public nextStageNumber() {
    this.stageNumber++;
  }
  public hasLife() {
    if (this.life > 1) return true;
    return false;
  }
  public get getScore() {
    return this.score;
  }
}
