let dropdownSelected;
let textVariable = "";
let questionArray = [];
let answerArray = [];
let textArray;
function initConstruct(){
    answerArray = [];
    questionArray = [];
    textVariable = document.getElementById("forminput").value;
    textArray = textVariable.split("\n");
    dropdownSelected = document.getElementById("defaultdropdown").value
    console.log(textArray)
    console.log(dropdownSelected)
    if (dropdownSelected === "english"){
        dropdownEnglish();
        constructBlooket();
    } else if (dropdownSelected === "none") {
        dropdownNone();
        constructBlooket();
    }
}

function dropdownNone(){
    console.log("We are in dropdown none")
    //fills the question and answer arrays
    for (i=0; i<textArray.length; i++){
        if(i%2 === 0){
            questionArray.push(textArray[i]);
        } else {
            answerArray.push(textArray[i])
        }
    }
    console.log(questionArray)
    console.log(answerArray)
}

function dropdownEnglish(){
    console.log("We are in english")
    let apiCall;
    let apiResponse;
    for (i=0; i<textArray.length; i++){
        questionArray.push(textArray[i])
        apiCall = fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + textArray[i])
        apiCall.then(response => apiResponse = response);
        console.log(apiCall)
        let defineArray = [];
        defineArray = [];
        let definition;
        getDefinitions();
        function getDefinitions(){
            for (let i = 0; i<apiCall[0]["meanings"].length; i++){
                defineArray.push(apiResponse[0]["meanings"][i]["definitions"][0]["definition"])
            }
            definition = defineArray[0]
            answerArray.push(definition);
            console.log(questionArray)
            console.log(answerArray)
        }
    }
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
    finalQuestionAnswer.unshift('"Blooket' +"<br>" + 'Import Template",,,,,,,' + "<br>" +  'Question #,Question Text,Answer 1,Answer 2,"Answer 3' + "<br>" + '(Optional)","Answer 4' + "<br>" + '(Optional)","Time Limit (sec)' + "<br>" + '(Max: 300 seconds)","Correct Answer(s)' + "<br>" + '(Only include Answer #)"' + "<br>")
    finalQuestionAnswer = finalQuestionAnswer.join("")
    document.getElementById("outputarea").innerText = finalQuestionAnswer;
    const csvBlob = new Blob([finalQuestionAnswer], {type:"text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = "myCSVFile.csv";
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
        finalQA = questionNumber + comma + questionText + comma + correctAnswer + comma + wrongOne + comma + wrongTwo + comma + wrongThree + comma + "20,1" + "<br>"
    }
    function randNum() {
        return Math.floor(Math.random() * questionArray.length)
    }
}