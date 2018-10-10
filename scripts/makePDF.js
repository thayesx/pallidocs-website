let questionsLength;
let page;

$( document ).ready(function() {
  page = $(".questionsPage");

  // Initiate form
  initiateQuestions();
  // Get total number of questions
  questionsLength = $(".question").length;

  let button = $("#download");

  button[0].addEventListener("click", function(){

    let questions = $(".question");
    let answers = $(".answer");

    let doc = new jsPDF();

    let vert = 20;
    for (let i = 0; i < answers.length; i++) {
      doc.text(20, vert, questions[i].textContent);
      doc.text(20, (vert + 10), answers[i].value);
      vert += 30;
    }

    doc.save('PallidocsForms.pdf');
    
  }, false);
});

let initiateQuestions = function() {
  $("#step1").addClass("show");
}

// Define qid for first question
let qid = "1";
let thisQ;

// Update question visibility each time question is changed
let updateQuestionView = function(a) {
  // Define current question and make invisible
  thisQ = $("#step" + qid);
  thisQ.removeClass("show");

  // If Next is pressed and thisQ isn't last question
  if (a == "next") {
    let nextButton = $("#nextButton")[0];

    // If last question, go to review and return
    if (qid == questionsLength) {
      prepareReview();
      return;
    }
    // If not last question, increment qid and update nextButton text as necessary
    else if (qid < questionsLength) {

      // Increment qid
      qid++;
    }
  }

  // If Prev is pressed and thisQ isn't first question, decrement qid
  else if (a == "prev" && qid > 1) qid --;

  // If second to last question, update nextButton text, else use default text
  if (qid == questionsLength) nextButton.innerHTML = "Review";
  else nextButton.innerHTML = "Next";
  
  // Make next question visible
  let nextQ = $("#step" + qid);
  setTimeout( function() {
    nextQ.addClass("show");
  }, 600);
}

// Handle visibility transition for questions with AskFirst
let updateAskFirst = function(a) {
  thisQ = $("#step" + qid);

  // If yes, reveal question
  if (a == "yes") thisQ.removeClass("showAskFirst");

  // If no, show ifNo text and go to next question;
  if (a == "no") {
    thisQ.addClass("noClicked");
    setTimeout( function() {
      thisQ.removeClass("noClicked");
      updateQuestionView("next");
    }, 3000);
  }
}

// Go to review page
let prepareReview = function() {
  page.addClass("finalReview");
  
  let answers = $(".answer");
  let reviewAnswers = $(".reviewA");
  let reviewQuestions = $(".reviewQ");
  let reviewSteps = $(".reviewStep");

  // Populate user answers, hide questions that are unanswered
  for (let i = 0; i < reviewAnswers.length; i++) {
    // Populate answer, or treat as skipped if unanswered
    if (answers[i].value && answers[i].value.length) reviewAnswers[i].innerHTML = answers[i].value;
    else {
      reviewQuestions[i].innerHTML = "Skipped";
      $(reviewSteps[i]).addClass("skipped");
    }
  }
}

// Return to specific answer from review page
let returnToAnswer = function(id) {
  page.removeClass("finalReview");
  qid = id;
  updateQuestionView();
}