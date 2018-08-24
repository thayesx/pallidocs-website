// Declare variables
let colorChange;
let p1;
let p2;
let p3;
let p4;
let p5;
let sidebar;
let videos;
let video1;
let video2;
let didScroll = false;

// Transition css property on scroll
let transitionOpacityOnScroll = function(target, startFromTop, slowness, reference) {

  let scrollReference = (reference? reference : target);
  let distanceFromTop = scrollReference.offset().top - window.scrollY;
  let value = (startFromTop - distanceFromTop) / slowness;

  // Prevent function from running when opacity is being overadjusted
  // .2 buffer to avoid accidental cutoff before value is 1
  if (value > 1.2) return;

  // Begin transition at startFromTop
  if (distanceFromTop <= startFromTop)
    // Set cssProperty as function of distance from top of screen
    target.css("opacity", value);

  
}

// Add class to element based on scroll position
let addClassOnScroll = function(target, startFromTop, className, reference) {

  let scrollReference = (reference? reference : target);
  let distanceFromTop = scrollReference.offset().top - window.scrollY;

  // Add class at startFromTop if target doesn't already have class
  if (distanceFromTop <= startFromTop && !target[0].className.includes(className))
    target.addClass(className);
}

// Fade in paragraphs
let fadeInParagraphs = function() {

  let startFromTop = window.innerHeight * .8;

  addClassOnScroll(p1, startFromTop, "show");
  addClassOnScroll(p2, startFromTop, "show");
  addClassOnScroll(p3, startFromTop, "show");
  addClassOnScroll(p4, startFromTop, "show");
  addClassOnScroll(p5, startFromTop, "show");

  addClassOnScroll(sidebar, startFromTop, "shrink", p1);
}

// Fade in color overlay over video
let fadeInOverlay1 = function() {

  let startFromTop = window.innerHeight;
  let slowness = 400;

  transitionOpacityOnScroll(colorChange, startFromTop, slowness, p1);
}

// Fade in color overlay over background video
let fadeInOverlay2 = function() {

  let startFromTop = window.innerHeight;
  let slowness = 400;

  transitionOpacityOnScroll(colorChange2, startFromTop, slowness, videos);
}

// Fade in videos
let fadeInVideos = function() {
  
  let startFromTop = window.innerHeight * .7;

  addClassOnScroll(video1, startFromTop, "show");
  addClassOnScroll(video2, startFromTop, "show");
}

// Stagger updates made on scroll to conserve computing
setInterval(function() {
  if(didScroll) {
    didScroll = false;
  }
}, 100);

$( window ).scroll(function() {
  if (!didScroll){
    didScroll = true;
  }
  fadeInOverlay1();
  fadeInParagraphs();

  // Delay buffer
  console.log(window.scrollY);
  if (window.scrollY > 1000) {
    fadeInOverlay2();
    fadeInVideos();
  }
});

$( document ).ready(function() {
  colorChange = $("#colorChange");
  colorChange2 = $("#colorChange2");
  p1 = $("#p1");
  p2 = $("#p2");
  p3 = $("#p3");
  p4 = $("#p4");
  p5 = $("#p5");
  sidebar = $("#sidebar");
  videos = $("#videos");
  video1 = $("#video1");
  video2 = $("#video2");

  window.scroll(0, 0);
});

