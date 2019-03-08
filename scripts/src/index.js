// Declare variables
let colorChange1;
let colorChange2;
let introParagraphs;
let firstIntroParagraph;
let sidebar;
let downArrow;
let text;
let filmsSection;
let filmPreview;
let didScroll = false;

// Manage pausing and playing film previews
let playPreview = function () {
  let preview = $(this).children(".preview")[0];
  $(preview)
    .get(0)
    .play();
}
let pausePreview = function () {
  let preview = $(this).children(".preview")[0];
  $(preview)
    .get(0)
    .pause();
}

// Transition css opacity on scroll
let transitionOpacityOnScroll = function ({transitionObject, startFromTop, slowness, referenceObject}) {
  let scrollReferenceObject = referenceObject
    ? referenceObject
    : transitionObject;

  // Distance from scrollReferenceObject to top of window
  let distanceFromTop = scrollReferenceObject
    .offset()
    .top - window.scrollY;

  // Calculate new opacity as function of scroll distance and slowness coefficient
  let newOpacity = (startFromTop - distanceFromTop) / slowness;

  // Prevent function from overadjusting opacity
  if (newOpacity > 1) 
    newOpacity = 1;
  
  // Begin transition at startFromTop, reset opacity if scrolled backwards past
  // start point
  if (distanceFromTop <= startFromTop) {
    transitionObject.css("opacity", newOpacity);
  } else 
    transitionObject.css("opacity", 0);
  }

// Add class to element based on scroll position
let addClassOnScroll = function (className, {targetObject, startFromTop, config}) {
  let scrollReferenceObject = (config && config.reference)
    ? config.reference
    : targetObject;

  // Distance from scrollReferenceObject to top of window
  let distanceFromTop = scrollReferenceObject
    ? (scrollReferenceObject.offset().top - window.scrollY)
    : 0;

  // Determine if class should be removed on reverse scroll
  let removeOnReverse = (config && config.removeOnReverse)
    ? true
    : false;

  // At distanceFromTop, add class to target if target doesn't already have class
  if (distanceFromTop <= startFromTop && !targetObject[0].className.includes(className)) {
    targetObject.addClass(className);
  } else if (distanceFromTop > startFromTop && targetObject[0].className.includes(className) && removeOnReverse) {
    targetObject.removeClass(className);
  }
}

// Fade in paragraphs
let fadeInParagraphs = function () {
  let startFromTop = window.innerHeight * .8;

  for (let i = 0; i < introParagraphs.length; i++) {
    let paragraph = $(introParagraphs[i]);
    addClassOnScroll("show", {
      targetObject: paragraph,
      startFromTop
    });
  }

  addClassOnScroll("show", {
    targetObject: text,
    startFromTop
  });
  addClassOnScroll("shrink", {
    targetObject: sidebar,
    startFromTop,
    config: {
      reference: firstIntroParagraph,
      removeOnReverse: true
    }
  });
  addClassOnScroll("hide", {
    targetObject: downArrow,
    startFromTop,
    config: {
      reference: firstIntroParagraph,
      removeOnReverse: true
    }
  });
}

// Fade in color overlay
let fadeInOverlay1 = function () {
  let startFromTop = window.innerHeight;
  let slowness = 400;
  transitionOpacityOnScroll({transitionObject: colorChange1, startFromTop, slowness, referenceObject: firstIntroParagraph});
}

// Fade in second color overlay
let fadeInOverlay2 = function () {
  let startFromTop = window.innerHeight;
  let slowness = 400;
  transitionOpacityOnScroll({transitionObject: colorChange2, startFromTop, slowness, referenceObject: filmsSection});
}

// Fade in films
let fadeInFilms = function () {
  let startFromTop = window.innerHeight * .8;
  for (let i = 0; i < films.length; i++) {
    let film = $(films[i]);
    addClassOnScroll("show", {
      targetObject: film,
      startFromTop
    });
  }
}

// Scroll to target point
let moveTo = function ({targetObject, offset}) {
  console.log("moveTo", targetObject);
  let moveOffset = offset
    ? offset
    : 0;
  let destination = targetObject[0].offsetTop;
  console.log("destination", destination);
  window.scroll({
    top: destination - moveOffset,
    left: 0,
    behavior: "smooth"
  });
}

// Initial scroll when clicking arrow
let scrollArrow = function () {
  moveTo({targetObject: firstIntroParagraph, offset: -500});
  downArrow.addClass("hide");
}

// Toggle class for expanded sidebar (for mobile)
let mobileMenu = function () {
  if (!sidebar[0].className.includes("expanded")) 
    sidebar.addClass("expanded");
  else 
    sidebar.removeClass("expanded");
  }

// Show/hide video embed
let updateTheater = function (id, show) {
  let film = $("#" + id);
  let theater = film.children(".theater")[0];
  let iframe;
  // Show theater
  if (show) {
    if (!$(theater).hasClass("show")) 
      $(theater).addClass("show") // Hide theater;
    } else {
    if ($(theater).hasClass("show")) 
      $(theater).removeClass("show");
    
    // Reload iframe
    iframe = $(theater).children("iframe")[0];
    iframe.src = iframe.src;
  }
}

let videoLoaded = function (id) {
  let video = $("#" + id);
  video.addClass("loaded");
}

// Stagger updates made on scroll to reduce load
setInterval(() => {
  if (didScroll) {
    didScroll = false;
  }
}, 100);

// Perform scroll-dependent actions
$(window).scroll(() => {
  // Handle didScroll stagger
  if (!didScroll) {
    didScroll = true;
  }

  // Handle onScroll DOM updates
  addClassOnScroll("hide", {
    targetObject: backgroundVideo,
    startFromTop: 0,
    config: {
      reference: filmsSection,
      removeOnReverse: true
    }
  });
  fadeInOverlay1();
  fadeInParagraphs();

  if (window.scrollY > 1000) {
    fadeInOverlay2();
    fadeInFilms();
  }
});

$(document).ready(() => {
  backgroundVideo = $("#backgroundVideo");
  colorChange1 = $("#colorChange1");
  colorChange2 = $("#colorChange2");
  introParagraphs = $(".pGroup");
  firstIntroParagraph = $(introParagraphs[0]);
  sidebar = $("#sidebar");
  downArrow = $("#downArrow");
  text = $("#text");
  filmsSection = $("#films");
  films = $(".film");

  // Assign play and pause behavior to film previews
  filmPreview = $(".filmHeader").hover(playPreview, pausePreview);

  // Reset scroll position and handle navigation to films
  window.scroll(0, 0);
  if (window.location.search == "?films") 
    moveTo({targetObject: filmsSection, offset: 40});
  }
);
