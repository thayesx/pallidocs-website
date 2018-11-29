// Declare variables
let colorChange1;
let colorChange2;
let p1;
let p2;
let p3;
let p4;
let p5;
let sidebar;
let downArrow;
let text;
let films;
let video1;
let video2;
let videoPreview;
let didScroll = false;

// Manage pausing and playing film previews
let playPreview = function() {
  $(this).get(0).play();
}
let pausePreview = function() {
  $(this).get(0).pause();
}

// Transition css property on scroll
let transitionOpacityOnScroll = function(target, startFromTop, slowness, reference) {
  let scrollReference = (reference? reference : target);
  let distanceFromTop = scrollReference.offset().top - window.scrollY;
  let value = (startFromTop - distanceFromTop) / slowness;

  // Prevent function from running when opacity is being overadjusted 
  // .2 buffer to avoid accidental cutoff before value is 1
  if (parseFloat(target.css("opacity")) >= 1 && value >= 1 || value < 0) return;
  // Begin transition at startFromTop
  if (distanceFromTop <= startFromTop)
    // Set cssProperty as function of distance from top of screen
    target.css("opacity", value);
}

// Add class to element based on scroll position
let addClassOnScroll = function(target, startFromTop, className, config) {

  // Define object used for definition: distance from object to top
  // If no reference defined, target is used
  let scrollReference = target;
  if (config && config.reference) scrollReference = config.reference;
  let distanceFromTop = scrollReference.offset().top - window.scrollY;

  // Determine if class should be removed on reverse scroll
  let remove = false;
  if (config && config.remove) remove = true;
  
  // At distanceFromTop, add class to target if target doesn't already have class
  if (distanceFromTop <= startFromTop && !target[0].className.includes(className))
    target.addClass(className);
  else if (distanceFromTop > startFromTop && target[0].className.includes(className) && remove)
    target.removeClass(className);
}

// Fade in paragraphs
let fadeInParagraphs = function() {
  let startFromTop = window.innerHeight * .8;
  addClassOnScroll(p1, startFromTop, "show");
  addClassOnScroll(p2, startFromTop, "show");
  addClassOnScroll(p3, startFromTop, "show");
  addClassOnScroll(p4, startFromTop, "show");
  addClassOnScroll(p5, startFromTop, "show");
  addClassOnScroll(text, startFromTop, "show");
  addClassOnScroll(sidebar, startFromTop, "shrink", {reference: p1, remove: true});
  addClassOnScroll(downArrow, startFromTop, "hide", {reference: p1, remove: true});
}

// Fade in color overlay over video
let fadeInOverlay1 = function() {
  let startFromTop = window.innerHeight;
  let slowness = 400;
  transitionOpacityOnScroll(colorChange1, startFromTop, slowness, p1);
}

// Fade in color overlay over background video
let fadeInOverlay2 = function() {
  let startFromTop = window.innerHeight;
  let slowness = 400;
  transitionOpacityOnScroll(colorChange2, startFromTop, slowness, films);
}

// Fade in films
let fadeInFilms = function() {
  let startFromTop = window.innerHeight * .8;
  addClassOnScroll(video1, startFromTop, "show");
  addClassOnScroll(video2, startFromTop, "show");
}

// Scroll to target point
let moveTo = function(target, offset) {
  console.log("moveTo", target);
  let moveOffset = offset? offset : 0;
  let object = "#" + target;
  let destination = $(object)[0].offsetTop;
  window.scroll({
    top: destination - moveOffset,
    left: 0,
    behavior: "smooth"
  });
}

// Initial scroll when clicking arrow
let scrollArrow = function() {
  moveTo("p1", -500);
  downArrow.addClass("hide");
}

// Toggle class for expanded sidebar (for mobile)
let mobileMenu = function() {
  if (!sidebar[0].className.includes("expanded")) sidebar.addClass("expanded");
  else sidebar.removeClass("expanded");
}

// Show/hide video embed
let updateTheater = function(id, show) {
  let video = $("#" + id);
  let theater = video.children(".theater")[0];
  let iframe;
  // Show theater
  if (show) {
    if (!$(theater).hasClass("show")) $(theater).addClass(" show");
  } else {
    if ($(theater).hasClass("show")) $(theater).removeClass("show");
    iframe = $(theater).children("iframe")[0];
    // Reload iframe
    iframe.src = iframe.src;
  }
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
  if (window.scrollY > 1000) {
    fadeInOverlay2();
    fadeInFilms();
  }
});

$( document ).ready(function() {
  colorChange1 = $("#colorChange1");
  colorChange2 = $("#colorChange2");
  p1 = $("#p1");
  p2 = $("#p2");
  p3 = $("#p3");
  p4 = $("#p4");
  p5 = $("#p5");
  sidebar = $("#sidebar");
  downArrow = $("#downArrow");
  text = $("#text");
  films = $("#films");
  video1 = $("#video1");
  video2 = $("#video2");

  // Assign play and pause behavior to film previews
  videoPreview = $(".preview").hover(playPreview, pausePreview);

  window.scroll(0, 0);
  if (window.location.search == "?films") {
    console.log("go");
    moveTo("films", 40);
  }
});

