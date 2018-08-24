// Declare variables
let colorChange;
let p1;
let p2;
let p3;
let p4;
let p5;
let didScroll = false;

// Transition css property on scroll
let transitionOnScroll = function(target, startFromTop, slowness, cssProperty, reference) {

  let scrollReference = (reference? reference : target);
  let distanceFromTop = scrollReference[0].offsetTop - window.scrollY;

  // Begin transition at startFromTop
  if (distanceFromTop <= startFromTop)
    // Set cssProperty as function of distance from top of screen
    target.css(cssProperty, (startFromTop - distanceFromTop) / slowness);
}

// Fade in paragraphs
let fadeInParagraphs = function() {

  let startFromTop = window.innerHeight * .15;
  let slowness = 150;

  transitionOnScroll(p1, startFromTop, slowness, "opacity");
  transitionOnScroll(p2, startFromTop, slowness, "opacity");
  transitionOnScroll(p3, startFromTop, slowness, "opacity");
  transitionOnScroll(p4, startFromTop, slowness, "opacity");
  transitionOnScroll(p5, startFromTop, slowness, "opacity");
}

// Fade in color overlay over video
let fadeInOverlay = function() {

  let startFromTop = window.innerHeight * .4;
  let slowness = 400;

  transitionOnScroll(colorChange, startFromTop, slowness, "opacity", p1);
}

// Stagger updates made on scroll to conserve computing
setInterval(function() {
  if(didScroll) {
    fadeInOverlay();
    didScroll = false;
  }
}, 100);

$( window ).scroll(function() {
  if (!didScroll){
    didScroll = true;
  }
  // fadeInOverlay();
  fadeInParagraphs();
});

$( document ).ready(function() {
  colorChange = $("#colorChange");
  p1 = $("#p1");
  p2 = $("#p2");
  p3 = $("#p3");
  p4 = $("#p4");
  p5 = $("#p5");
});

