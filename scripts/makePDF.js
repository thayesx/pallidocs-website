let questionsLength;

$( document ).ready(function() {
  // Initiate form
  initiateQuestions();
  questionsLength = $(".question").length;

  let button = $("#download");

  button[0].addEventListener("click", function(){

    let questions = $(".qname");
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
  $("#q1").addClass("visible");
}

// Get number of all questions
let qid = "q1";
let updateQuestionView = function(a) {
  // Make current question invisible
  $("#" + qid).removeClass("visible");


  // Increment or decrement id substring
  let id = parseInt(qid.substring(1));
  if (a == "next" && id < questionsLength) id++;
  else if (a == "prev" && id > 1) id --;

  // Make new question visible
  qid = "q" + id;
  $("#" + qid).addClass("visible");

  // Show download button if all questions have content
  // let allAnswered = true;
  // allAnswered = $(".answer").map(answer => {
  //   if (!answer.value) return false;
  // })
  // if (allAnswered) {
  //   $("#download").addClass("visible");
  // }

  if (id == questionsLength) {
    $("#download").addClass("visible");
  }
}