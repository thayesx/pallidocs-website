let questionsLength;
let page;

$( document ).ready(function() {
  page = $(".questionsPage");

  // Initiate form
  initiateQuestions();
  // Get total number of questions
  questionsLength = $(".question").length;

  let button = $("#download");
  prepareDownload(button);

});

// Handle page download and doc formatting
let prepareDownload = function(button) {
  
    // Setup download button functionality
    button[0].addEventListener("click", function(){
      let questions = $(".question");
      let answers = $(".answer");
  
      // Combine question and answer strings into single text body
      let steps = [];
      let q = 1;
      for (let i in questions) {
        let step = {
          "question": q + ". " + questions[i].textContent,
          "answer": answers[i].value
        }
        q++;
        if (!answers[i].value) step.answer = "No answer";
        if (!questions[i].textContent) break;
        steps.push(step);
      }
  
      // Create doc with parameters
      let doc = new jsPDF("p", "pt", "a4"),
        margin = 72,
        width = 595 - margin * 2,
        verticalOffset = margin,
        endMargin = 760,
        fontSize = 12,
        lineHeight = fontSize * 1.1;
      doc.setFont("georgia", "regular");
      doc.setFontSize(fontSize);

      // Write headline
      let headlineText = "These are your answers to the question on the Pallidocs website. May they be of use to you in your personal journey, or to your healthcare provider as you see fit.";
      headline = doc.setFontStyle("italic").splitTextToSize(headlineText, width);
      doc.text(headline, 595/2, verticalOffset, "center");
      verticalOffset += (headline.length + 4) * fontSize;
  
      for (let i in steps) {
        let styleQ = "bold";
        let styleA = "regular";
        let linesToPrint = [];
  
        // Format question
        lines = doc.setFontStyle(styleQ).splitTextToSize(steps[i].question, width);
        linesToPrint = [];
        for (let i in lines) {
          // If room left on page
          if ((verticalOffset + i * lineHeight) < endMargin){
            linesToPrint.push(lines[i]);
            // If all lines fit
            if (i == lines.length - 1) {
              doc.text(linesToPrint, margin, verticalOffset + lineHeight);
              verticalOffset += (lines.length + 1) * lineHeight;
            }
          }
          // If page overflow
          else {
            doc.text(linesToPrint, margin, verticalOffset + fontSize);
            doc.addPage();
            verticalOffset = margin;
          }
        }
  
        // Format answer
        lines = doc.setFontStyle(styleA).splitTextToSize(steps[i].answer, width);
        linesToPrint = [];
        for (let i in lines) {
          // If room left on page
          if ((verticalOffset + i * lineHeight) < endMargin){
            linesToPrint.push(lines[i]);
            // If all lines fit
            if (i == lines.length - 1) {
              doc.text(linesToPrint, margin, verticalOffset + lineHeight);
              verticalOffset += (lines.length + 4) * lineHeight;
            }
          }
          // If page overflow
          else {
            doc.text(linesToPrint, margin, verticalOffset + lineHeight);
            doc.addPage();
            verticalOffset = margin;
          }
        }
      }
  
      doc.save('PallidocsForms.pdf');
    }, false);
}

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
  console.log("this", thisQ);
  thisQ.removeClass("show");

  // If Next is pressed and thisQ isn't last question
  if (a == "next") {

    // If last question, go to review and return
    if (qid == questionsLength) {
      prepareReview();
      return;
    }
    // If not last question, increment qid
    else if (qid < questionsLength) {
      qid++;
    }
  }

  // If Prev is pressed and thisQ isn't first question, decrement qid
  else if (a == "prev" && qid > 1) qid --;

  // If second to last question, update nextButton text, else use default text
  let nextButton = $("#nextButton")[0];
  if (qid == questionsLength) nextButton.innerHTML = "Review";
  else nextButton.innerHTML = "Next";
  
  // Make nextQ visible with delay to account for thisQ fadeOut
  setTimeout( function() {
    let nextQ = $("#step" + qid);
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