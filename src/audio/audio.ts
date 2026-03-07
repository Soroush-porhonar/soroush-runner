export class Song {
  constructor(private containerSelector: string = "#app") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.attachAudio());
    } else {
      this.attachAudio();
    }
  }

  private attachAudio(): void {
    const audio = document.createElement("audio");
    audio.id = "backgroundMusic";
    audio.loop = true;

    const source = document.createElement("source");
    source.src = "src/audio/background.mp3";
    source.type = "audio/mp3";

    audio.appendChild(source);

    const container = document.querySelector(this.containerSelector);
    container?.appendChild(audio);
  }

  play(): void {
    const el = document.getElementById(
      "backgroundMusic",
    ) as HTMLAudioElement | null;
    el?.play();
  }

  pause(): void {
    const el = document.getElementById(
      "backgroundMusic",
    ) as HTMLAudioElement | null;
    if (el && !el.paused) el.pause();
  }
}
