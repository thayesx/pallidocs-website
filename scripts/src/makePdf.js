const margin = 72;
const endMargin = 760;
const width = 595 - margin * 2;
let verticalOffset = margin;
let fontSize = 11;
const lineHeight = fontSize * 1.4;
const logoImgPath = "assets/logo1_dark_print.png";
let logoImgDataUrl;

let createPDF = function () {
  // Create doc with parameters
  let doc = new jsPDF("p", "pt", "a4");
  doc.setFont("georgia", "regular");
  doc.setFontSize(fontSize);

  // Prepare logo file for pdf generating, add logo
  printLogoImg(doc);
  skipLine(3);

  // Print intro content
  let date = "Date: " + getDate();
  doc.text(date, margin, verticalOffset);
  skipLine(2);

  let doctorName = $("#doctorName")[0].value;
  let dearDoctor = "Dear " + doctorName + ",";
  doc.text(dearDoctor, margin, verticalOffset);
  skipLine(2);

  printHeadline(doc);
  skipLine(2);

  // Print healthcare agent info
  printHealthcareAgentInfo(doc);
  skipLine(4);

  // Print questions an answers
  doc.setFontSize(fontSize);
  printResponses(doc);
  skipLine(4);

  /* Add signing and dating area. Start new page if too far down current page */
  if (verticalOffset > 400) {
    doc.addPage();
    verticalOffset = margin;
  }
  printSigningArea(doc);

  // Prompt user to download
  doc.save('PallidocsForms.pdf');
}

function printLogoImg(doc) {
  let logoHeight = 30;
  let logoWidth = 140;
  let logoTopMargin = margin;
  let logoLeftMargin = (595 - logoWidth) / 2;
  doc.addImage(logoImgDataUrl, 'PNG', logoLeftMargin, logoTopMargin, logoWidth, logoHeight);
  verticalOffset += logoHeight;
}

function printHeadline(doc) {
  let yourName = $("#yourName")[0].value;

  let headline = "The following are answers to the questions provided by pallidocs.com regarding " + yourName + "'s goals and wishes during their journey with a serious illness.";
  let headlineLines = doc.splitTextToSize(headline, width);

  for (let i in headlineLines) {
    doc.text(headlineLines[i], margin, verticalOffset);
    skipLine();
  }
}

function printHealthcareAgentInfo(doc) {
  let healthcareAgentInput = $(".healthcareAgentInfo");

  doc
    .setFontStyle("bold")
    .text("Healthcare Agent:", margin, verticalOffset);
  skipLine();

  doc.setFontStyle("regular");
  for (let i = 0; i < healthcareAgentInput.length; i++) {
    let input = healthcareAgentInput[i];
    let toPrint = input.id + ": " + input.value;
    doc.text(toPrint, margin, verticalOffset);
    skipLine();
  }
  skipLine();

  let healthcareAgentNotice = "This Health Care Agent shall take effect in the event that a determination is ma" +
    "de by my doctor that I lack the capacity to make or to communicate my own health" +
    " care decisions."
  let healthcareAgentNoticeLines = doc
    .setFontStyle("italic")
    .setFontSize(9)
    .splitTextToSize(healthcareAgentNotice, width);

  doc.text(healthcareAgentNoticeLines, margin, verticalOffset);
}

// Get and format question and answer content
function printResponses(doc) {
  let questions = $(".question");
  let answers = $(".answer");
  let responses = formatResponses(questions, answers);
  
  for (let i in responses) {
    const styleQ = "italic";
    const styleA = "regular";
    let lines;

    // Format question
    lines = doc
      .setFontStyle(styleQ)
      .splitTextToSize(responses[i].question, width);
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

      // Put two lines between answer and next question
      if (i == lines.length - 1) {
        skipLine(2);
      } else
        skipLine();
    }

    // Format answer
    lines = doc
      .setFontStyle(styleA)
      .splitTextToSize(responses[i].answer, width);
    for (let i in lines) {
      /* Add line if it fits on page, or if last line (to avoid widowed line on next
      page) */
      let isLastLine = i == lines.length - 1 && lines.length > 1;
      if (verticalOffset < endMargin || isLastLine) {
        doc.text(lines[i], margin, verticalOffset // If page overflow
        );
      } else {
        verticalOffset = margin;
        doc.addPage();
        doc.text(lines[i], margin, verticalOffset);
      }

      // If last line, add extra break before next Q
      if (i == lines.length - 1) {
        skipLine(4);
      } else
        skipLine();
    }
  }
}

function printSigningArea(doc) {
  let yourName = $("#yourName")[0].value;

  doc.text("Please upload this letter into my medical records to have as a guide throughout " +
    "my journey.",
    margin, verticalOffset);
  skipLine(2);
  doc.text("Sincerely,", margin, verticalOffset);
  skipLine();
  doc.text(yourName, margin, verticalOffset);
  skipLine(3);
  doc.text("Signature ______________________________________          Date _________________" +
    "________",
    margin, verticalOffset);
}

function getDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) 
    dd = "0" + dd;
  if (mm < 10) 
    mm = "0" + mm;
  
  return mm + "/" + dd + "/" + yyyy;
}

function skipLine(amount) {
  verticalOffset += (lineHeight * (amount
    ? amount
    : 1));
}

// Convert logo image file to dataUrl and assign to logoImgDataUrl
function createLogoDataUrl(src) {
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext('2d');
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    logoImgDataUrl = canvas.toDataURL();
  };
  img.src = src;
}

// Format question and answer content
function formatResponses(questions, answers) {
  let formattedContent = [];
  let q = 1;

  for (let i in questions) {
    let step = {
      "question": q + ". " + questions[i].innerText,
      "answer": answers[i].value
    }
    q++;
    if (!answers[i].value) 
      step.answer = "No answer";
    if (!questions[i].innerText) 
      break;
    formattedContent.push(step);
  }

  return formattedContent;
}

$(document).ready(() => {
  /* dataUrl returns asynchronously so just do this pre-emptively to avoid lag at
  download time */
  createLogoDataUrl(logoImgPath);
});