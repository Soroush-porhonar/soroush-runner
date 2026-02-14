import $ from "jquery";
export function addSong(): void {
  $("<audio>", {
    id: "backgroundMusic", // Set id
    loop: true, // Set the loop attribute
  })
    .append(
      $("<source>", {
        src: "src/audio/background.mp3", // Set the audio source
        type: "audio/mp3", // Specify the type
      }),
    )
    .appendTo("#app"); // Append to the body
}
