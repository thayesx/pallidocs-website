$( document ).ready(function() {
  let button = document.getElementById("dwn-btn");

  let answer1 = document.getElementById("text-val");

  button.addEventListener("click", function(){

    let doc = new jsPDF();

    doc.text(20, 20, 'Hello world!');
    doc.text(20, 30, answer1.value);
    // doc.addPage();
    // doc.text(20, 20, 'Do you like that?');

    doc.save('Test.pdf');
    
  }, false);
});