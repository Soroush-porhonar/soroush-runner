export class Song {
  constructor(
    private containerSelector: string = "#app",
    private playing: boolean = false,
  ) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.attachAudio());
    } else {
      this.attachAudio();
    }
  }
  public get playingState() {
    return this.playing;
  }
  private attachAudio(): void {
    const audio = document.createElement("audio");
    audio.id = "backgroundMusic";
    audio.loop = true;

    const source = document.createElement("source");
    source.src = "audio/background.mp3";
    source.type = "audio/mp3";

    audio.appendChild(source);

    const container = document.querySelector(this.containerSelector);
    container?.appendChild(audio);
  }

  public play(): void {
    this.playing = true;
    const el = document.getElementById(
      "backgroundMusic",
    ) as HTMLAudioElement | null;
    el?.play();
  }

  public pause(): void {
    this.playing = false;
    const el = document.getElementById(
      "backgroundMusic",
    ) as HTMLAudioElement | null;
    if (el && !el.paused) el.pause();
  }
  public PlayPause() {
    if (this.playingState) {
      this.pause();
    } else {
      this.play();
    }
  }
}
