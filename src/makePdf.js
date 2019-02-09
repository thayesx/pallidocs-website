let margin = 72;
let endMargin = 760;
let width = 595 - margin * 2;
let verticalOffset = margin;
let fontSize = 11;
let lineHeight = fontSize * 1.4;

let createPDF = function () {

  let questions = $(".question");
  let answers = $(".answer");
  let yourName = $("#yourName")[0].value;
  let healthcareAgentInput = $(".healthcareAgentInfo");

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
  let doc = new jsPDF("p", "pt", "a4");
  doc.setFont("georgia", "regular");
  doc.setFontSize(fontSize);

  // Add logo
  let logoHeight = 25;
  let logoWidth = 146;
  doc.addImage(logoImgDataURL, 'PNG', margin, margin, logoWidth, logoHeight);
  verticalOffset += logoHeight;
  skipLine(3);

  let date = "Date: " + getDate();
  doc.text(date, margin, verticalOffset);
  skipLine(2);

  let dearDoctor = "Dear Doctor _________________________________,";
  doc.text(dearDoctor, margin, verticalOffset);
  skipLine(2);

  let headline = "The following are answers to the questions provided by pallidocs.com regarding " + yourName + "'s goals and wishes during their journey with a serious illness.";
  let headlineLines = doc.splitTextToSize(headline, width);
  for (let i in headlineLines) {
    doc.text(headlineLines[i], margin, verticalOffset);
    skipLine();
  }
  skipLine(2);

  // Print healthcare agent info
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
  skipLine(4);

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
        skipLine(2);
      } else 
        skipLine();
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
        skipLine(4);
      } else 
        skipLine();
      }
    }
  skipLine(4);

  if (verticalOffset > 400) {
    doc.addPage();
    verticalOffset = margin;
  }
  doc.text("Please upload this letter into my medical records to have as a guide throughout " +
      "my journey.",
  margin, verticalOffset);
  skipLine(2);
  doc.text("Sincerely,", margin, verticalOffset);
  skipLine();
  doc.text(yourName, margin, verticalOffset);
  skipLine(3);
  doc.text("Signature ______________________________________          Date _________________________", margin, verticalOffset);

  doc.save('PallidocsForms.pdf');
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

function skipLine(lines) {
  verticalOffset += (lineHeight * (lines
    ? lines
    : 1));
}
