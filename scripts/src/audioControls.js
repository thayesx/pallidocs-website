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
    audio.className = "isPlaying";
    player.play();
  } else {
    audio.className = "isPaused";
    player.pause();
  }
}