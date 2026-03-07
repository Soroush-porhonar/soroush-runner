export class GameState {
  constructor(
    public score: number = 0,
    public life: number = 3,
    public gameOver: boolean = false,
    public lose: boolean = false,
    public win: boolean = false,
    public Wladder: boolean = false,
    public pause: boolean = false,
    public stageNumber: number = 1,
  ) {}

  public revive() {
    this.life--;
  }

  public changeWladder() {
    this.Wladder = true;
    //draw wladder
  }

  public resetDefault() {
    ((this.score = 0),
      (this.life = 3),
      (this.gameOver = false),
      (this.lose = false),
      (this.win = false),
      (this.Wladder = false),
      (this.stageNumber = 1));
  }

  public sameLevel() {
    ((this.score = 0),
      this.life--,
      (this.gameOver = false),
      (this.lose = false),
      (this.win = false),
      (this.Wladder = false));
  }
  public nextLevel() {
    ((this.life = 3),
      (this.gameOver = false),
      (this.lose = false),
      (this.win = false),
      (this.Wladder = false),
      this.stageNumber++);
  }

  public get number() {
    return this.stageNumber;
  }
  public get getlife() {
    return this.life;
  }
  public nextStageNumber() {
    this.stageNumber++;
  }
  public won() {
    this.win = true;
  }
  public hasLife() {
    if (this.life <= 0) return false;
    this.life--;
    return true;
  }
}
