let audio;
let player;
let btnPlayPause;

$(document).ready(() => {
  audio = $("#audio")[0];
  player = $("#player")[0];

  player.addEventListener('play', function () {
    audio.className = "isPlaying";
  }, false);
  player.addEventListener('pause', function () {
    audio.className = "isPaused";
  }, false);
  player.addEventListener('ended', function () {
    this.pause();
  }, false);
});

function playPauseAudio() {
  if (player.paused || player.ended) {
    console.log("play");
    audio.className = "isPlaying";
    player.play();
  } else {
  console.log("pause");
    audio.className = "isPaused";
    player.pause();
  }
}