let colorOverlay;
let p1;
let p2;
let p3;
let p4;
let p5;
let didScroll = false;

let updateOpacity = function(scrollPosition) {
  let opacity = scrollPosition / 500 - .2;
  if (colorOverlay.css("opacity") <= 1)
  colorOverlay.css("opacity", opacity);
}

setInterval(function() {
  if(didScroll) {
    updateOpacity(window.scrollY);
    didScroll = false;
  }
}, 100);

$( window ).scroll(function() {
  if (!didScroll){
    didScroll = true;
  }

  if (window.scrollY >= 700) {
    p2.css("opacity", "1");
  }
  if (window.scrollY >= 900) {
    p3.css("opacity", "1");
  }
  if (window.scrollY >= 1100) {
    p4.css("opacity", "1");
  }
  if (window.scrollY >= 1300) {
    p5.css("opacity", "1");
  }

});

$( document ).ready(function() {
  colorOverlay = $("#colorChange");
  p1 = $("#p1");
  p2 = $("#p2");
  p3 = $("#p3");
  p4 = $("#p4");
  p5 = $("#p5");
});

