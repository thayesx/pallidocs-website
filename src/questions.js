let questionsLength;
let page;
let logoImgDataURL;

$(document).ready(function () {
  page = $(".questionsPage");
  page.addClass("intro");
  $('#sidebar').addClass("shrink");

  // Initiate form
  initiateQuestions();
  // Get total number of questions
  questionsLength = $(".question").length;

  let downloadButton = $("#download");
  prepareDownloadButton(downloadButton);
});

let startQuestions = function () {
  page.removeClass("intro");
};

let prepareDownloadButton = function (downloadButton) {

  // Setup download button functionality
  downloadButton[0]
    .addEventListener("click", function () {
      createPDF();
    }, false);
}

function toDataURL(src) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL();
    console.log("onLoad", dataURL);
    logoImgDataURL = dataURL;
  };
  img.src = src;
}

let createPDF = function () {

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
    if (!answers[i].value) 
      step.answer = "No answer";
    if (!questions[i].textContent) 
      break;
    steps.push(step);
  }

  // Create doc with parameters
  let doc = new jsPDF("p", "pt", "a4"),
    margin = 72,
    width = 595 - margin * 2,
    verticalOffset = margin,
    endMargin = 760,
    fontSize = 11,
    lineHeight = fontSize * 1.4;
  doc.setFont("georgia", "regular");
  doc.setFontSize(fontSize);

  // Add logo
  doc.addImage(logoImgDataURL, 'PNG', margin, margin, 146, 25);
  verticalOffset += 25 + lineHeight * 3;

  let date = "Date: XXXX";
  doc.text(date, margin, verticalOffset);
  verticalOffset += lineHeight * 2;

  let dearDoctor = "Dear Doctor XXXX"
  doc.text(dearDoctor, margin, verticalOffset);
  verticalOffset += lineHeight * 2;

  let headline = "The following are answers to the questions provided by pallidocs.com regarding X" +
      "XXX'sgoals and wishes during their journey with a serious illness.";
  let headlineLines = doc.splitTextToSize(headline, width);
  for (let i in headlineLines) {
    doc.text(headlineLines[i], margin, verticalOffset);
    verticalOffset += lineHeight;
  }
  verticalOffset += lineHeight;

  let healthcareAgent = "Healthcare agent:";
  let name = "Name: XXXX";
  let relationship = "Relationship: XXXX";
  let address = "Address: XXXX";
  let contact = "Contact number: XXXX";

  doc.text(healthcareAgent, margin, verticalOffset);
  verticalOffset += lineHeight * 2;
  doc.text(name, margin, verticalOffset);
  verticalOffset += lineHeight;
  doc.text(relationship, margin, verticalOffset);
  verticalOffset += lineHeight;
  doc.text(address, margin, verticalOffset);
  verticalOffset += lineHeight;
  doc.text(contact, margin, verticalOffset);
  verticalOffset += lineHeight * 2;

  let healthcareAgentNotice = "This Health Care Agent shall take effect in the event that a determination is ma" +
      "de by my doctor that I lack the capacity to make or to communicate my own health" +
      " care decisions."
  let healthcareAgentNoticeLines = doc
    .setFontStyle("italic")
    .setFontSize(9)
    .splitTextToSize(healthcareAgentNotice, width);
  doc.text(healthcareAgentNoticeLines, margin, verticalOffset);
  verticalOffset += lineHeight * 4;

  doc.setFontSize(fontSize);

  for (let i in steps) {
    let styleQ = "italic";
    let styleA = "regular";
    let lines;

    // Format question
    lines = doc
      .setFontStyle(styleQ)
      .splitTextToSize(steps[i].question, width);
    for (let i in lines) {
      // If line fits on page, but avoid widowed lines
      if (verticalOffset < endMargin || (i == lines.length - 1 && lines.length > 1)) {
        doc.text(lines[i], margin, verticalOffset // If page overflow
        );
      } else {
        verticalOffset = margin;
        doc.addPage();
        doc.text(lines[i], margin, verticalOffset);
      }

      if (i == lines.length - 1) {
        verticalOffset += 2 * lineHeight;
      } else 
        verticalOffset += lineHeight;
      }
    
    // Format answer
    lines = doc
      .setFontStyle(styleA)
      .splitTextToSize(steps[i].answer, width);
    for (let i in lines) {
      // If line fits on page, but avoid widowed lines
      if (verticalOffset < endMargin || (i == lines.length - 1 && lines.length > 1)) {
        doc.text(lines[i], margin, verticalOffset // If page overflow
        );
      } else {
        verticalOffset = margin;
        doc.addPage();
        doc.text(lines[i], margin, verticalOffset);
      }

      // If last line, add extra break before next Q
      if (i == lines.length - 1) {
        verticalOffset += 4 * lineHeight;
      } else 
        verticalOffset += lineHeight;
      }
    }

  doc.save('PallidocsForms.pdf');
}

let initiateQuestions = function () {
  $("#step1").addClass("show");
}

// Define qid for first question
let qid = "1";
let thisQ;

// Update question visibility each time question is changed
let updateQuestionView = function (a) {
  // Define current question and make invisible
  thisQ = $("#step" + qid);
  thisQ.removeClass("show");

  // If Next is pressed and thisQ isn't last question
  if (a == "next") {

    // If last question, go to review and return
    if (qid == questionsLength) {
      prepareReview();
      // If not last question, increment qid
      return;
    } else if (qid < questionsLength) {
      qid++ // If Prev is pressed and thisQ isn't first question, decrement qid;
    }
  } else if (a == "prev" && qid > 1) 
    qid--;
  
  // If second to last question, update nextButton text, else use default text
  let nextButton = $("#nextButton")[0];
  if (qid == questionsLength) 
    nextButton.innerHTML = "Review";
  else 
    nextButton.innerHTML = "Next";
  
  // Make nextQ visible with delay to account for thisQ fadeOut
  setTimeout(function () {
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
    setTimeout(function () {
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

  // Prepare logo file for pdf generating
  let logoImgUrl = "assets/logo_1_dark.png";
  toDataURL(logoImgUrl);
}

// Return to specific answer from review page
let returnToAnswer = function (id) {
  page.removeClass("finalReview");
  qid = id;
  updateQuestionView();
}