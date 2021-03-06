let questionsLength;
let page;

let hideIntro = function () {
  page.removeClass("intro");
};

let prepareFinishReviewButton = function (finishReviewButton) {
  finishReviewButton[0]
    .addEventListener("click", function () {
      finishReview();
    }, false);
}

let initiateQuestions = function () {
  $("#step1").addClass("show");
}

// Define qid for first question
let qid = "1";
let thisQ;

// Update question visibility each time question is changed
let updateQuestionView = function (dir) {
  // Define current question and make invisible
  thisQ = $("#step" + qid);
  thisQ.removeClass("show");

  // If Next is pressed and thisQ isn't last question
  if (dir == "next") {

    // If last question, go to review and return
    if (qid == questionsLength) {
      prepareReview();
      // If not last question, increment qid
      return;
    } else if (qid < questionsLength) {
      qid++ // If Prev is pressed and thisQ isn't first question, decrement qid;
    }
  } else if (dir == "prev" && qid > 1) 
    qid--;
  
  // If second to last question, update nextButton text, else use default text
  let nextButton = $("#nextButton")[0];
  if (qid == questionsLength) 
    nextButton.innerHTML = "Review";
  else 
    nextButton.innerHTML = "Next";
  
  let prevButton = $("#prevButton");
  if (qid == 1) 
    prevButton.addClass("hide");
  else if (prevButton.hasClass("hide")) 
    prevButton.removeClass("hide");
  
  // Make nextQ visible with delay to account for thisQ fadeOut
  setTimeout(() => {
    let nextQ = $("#step" + qid);
    nextQ.addClass("show");
  }, 600);
}

// Handle visibility transition for questions with AskFirst
let updateAskFirst = function (a) {
  thisQ = $("#step" + qid);

  // If yes, reveal question
  if (a == "yes") 
    thisQ.removeClass("showAskFirst");
  
  // If no, show ifNo text and go to next question;
  if (a == "no") {
    thisQ.addClass("noClicked");
    setTimeout(() => {
      thisQ.removeClass("noClicked");
      updateQuestionView("next");
    }, 3000);
  }
}

// Go to review page
let prepareReview = function () {
  page.addClass("finalReview");

  let answers = $(".answer");
  let reviewAnswers = $(".reviewA");
  let reviewQuestions = $(".reviewQ");
  let reviewSteps = $(".reviewStep");

  // Populate answer, or treat as skipped if unanswered
  for (let i = 0; i < reviewAnswers.length; i++) {
    if (answers[i].value && answers[i].value.length) 
      reviewAnswers[i].prepend(answers[i].value);
    else {
      reviewQuestions[i].innerHTML = "Skipped";
      $(reviewSteps[i]).addClass("skipped");
    }
  }
}

// Return to specific answer from review page
let returnToAnswer = function (id) {
  page.removeClass("finalReview");
  qid = id;
  updateQuestionView();
}

// Get healthcare agent info
let finishReview = function () {
  page.removeClass("finalReview");
  page.addClass("healthcareAgentReview");
}

$(document).ready(() => {
  page = $(".reflectionsPage");

  // Initiate form
  initiateQuestions();
  // Get total number of questions
  questionsLength = $(".question").length;

  let finishReviewButton = $("#finishReview");
  prepareFinishReviewButton(finishReviewButton);
});

window.onbeforeunload = function () {
  return "Are you sure? The information you've entered won't be saved.";
};