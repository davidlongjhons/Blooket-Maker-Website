
function initConstruct(){
    let badArray = [];
    let fileNameInput;
    fileNameInput = document.getElementById("filenameinput").value
    let dropdownSelected;
    let textVariable = "";
    let questionArray = [];
    let answerArray = [];
    let textArray;
    const forminput = document.getElementById("forminput"); 
    answerArray = [];
    questionArray = [];
    textVariable = forminput.value;
    textArray = textVariable.split("\n");
    for (let i = 0; i<textArray.length; i++){
        if (textArray[i].trim()  === ""){
            badArray.push(textArray.splice(i,1)[0]);
            i--;
        }
    }
    console.log(badArray)
    dropdownSelected = document.getElementById("defaultdropdown").value
    if (dropdownSelected === "english"){
        dropdownEnglish();
    } else if (dropdownSelected === "none") {
        dropdownNone();
        constructBlooket();
    }


function dropdownNone(){
    let question;
    let answer;
    //fills the question and answer arrays
    for (i=0; i<textArray.length; i++){
        if(i%2 === 0){
            question = '"'.concat(textArray[i], '"')
            questionArray.push(textArray[i]);
        } else {
            answer = '"'.concat(textArray[i], '"')
            answerArray.push(textArray[i])
        }
    }
}

async function dropdownEnglish() {
    let question;
    let answer;
    for (i=0; i<textArray.length;i++){
        question = '"'.concat(textArray[i], '"')
        questionArray.push(question)
    }
    const apiCalls = textArray.map((text) =>
      fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + text)
    );
    try {
      const apiResponses = await Promise.all(apiCalls);
      const data = await Promise.all(apiResponses.map((response) => response.json()));
      for (let i = 0; i < data.length; i++) {
        answer = null;
        let defineArray = [];
        for (let j = 0; j < data[i][0]["meanings"].length; j++) {
          defineArray.push(data[i][0]["meanings"][j]["definitions"][0]["definition"]);
        }
        if (typeof defineArray[0].indexOf('"') !== number){
            answer = '"'.concat(defineArray[0], '"')
        } else {
            for(i = 0; i < defineArray.length; i++){
                if (typeof defineArray[i].indexOf('"') !== number){
                    answer = '"'.concat(defineArray[i], '"')
                }
            }
        }
        if (!answer){
            new Error("There was an issue, these words cannot be computed")
        }
        answerArray.push(answer);
      }
    } catch (error) {
      console.error(error);
    }
    constructBlooket();
  }

function constructBlooket(){
    let currentQuestion;
    let currentAnswer;
    let wrongOne;
    let wrongTwo;
    let wrongThree;
    let finalQA = [];
    const comma = ","
    let questionNumber = 0;
    let finalQuestionAnswer = [];
    for (var i = 0; i < questionArray.length; i++){
        currentQuestion = questionArray[i]
        currentAnswer = answerArray[i]
        do {rerollWrongs()
        } while (checkWrongs())
        makeQuestion(currentQuestion, currentAnswer, wrongOne, wrongTwo, wrongThree)
        finalQuestionAnswer.push(finalQA)
    }
    //where we put the csv on the screen
    finalQuestionAnswer.unshift('"Blooket' +"\n" + 'Import Template",,,,,,,' + "\n" +  'Question #,Question Text,Answer 1,Answer 2,"Answer 3' + "\n" + '(Optional)","Answer 4' + "\n" + '(Optional)","Time Limit (sec)' + "\n" + '(Max: 300 seconds)","Correct Answer(s)' + "\n" + '(Only include Answer #)"' + "\n")
    finalQuestionAnswer = finalQuestionAnswer.join("")
    document.getElementById("outputarea").innerText = finalQuestionAnswer;
    const csvBlob = new Blob([finalQuestionAnswer], {type:"text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameInput + ".csv";
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.dataset.downloadurl = ["text/csv", downloadLink.download, downloadLink.href].join(":");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    //function to make wrong answers
    function checkWrongs() {
        if (wrongOne == wrongTwo || wrongTwo == wrongThree || wrongOne == wrongThree || currentAnswer == wrongOne || currentAnswer == wrongTwo || currentAnswer == wrongThree) {
            return true
        } else {
          return false
        }
    }
    //reroll wrongs function
    function rerollWrongs() {
        wrongOne = answerArray[randNum()]
        wrongTwo = answerArray[randNum()]
        wrongThree = answerArray[randNum()]
    }
    //function to add a new question
    function makeQuestion(questionText, correctAnswer, wrongOne, wrongTwo, wrongThree){
        questionNumber += 1;
        finalQA = questionNumber + comma + questionText + comma + correctAnswer + comma + wrongOne + comma + wrongTwo + comma + wrongThree + comma + "20,1" + "\n"
    }
    function randNum() {
        return Math.floor(Math.random() * questionArray.length)
    }
}
}