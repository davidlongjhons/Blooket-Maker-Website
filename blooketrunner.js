function constructBlooket(){
    let questionArray = [];
    let answerArray = [];
    let textVariable = "";
    textVariable = document.getElementById("forminput").innerHTML;
    console.log(textVariable)
    textVariable.replace(" ", "");
    let textArray = textVariable.split("\n")
    console.log(textArray)
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
    //creates the questions using wrongs
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
    console.log(finalQuestionAnswer)
    //where we put the csv on the screen
    finalQuestionAnswer = finalQuestionAnswer.join("")
    console.log(finalQuestionAnswer)
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
        finalQuestionAnswer[0] = '"Blooket' +"\n" + 'Import Template",,,,,,,' + "\n" +  'Question #,Question Text,Answer 1,Answer 2,"Answer 3' + "\n" + '(Optional)","Answer 4' + "\n" + '(Optional)","Time Limit (sec)' + "\n" + '(Max: 300 seconds)","Correct Answer(s)' + "\n" + '(Only include Answer #)"' + "\n"
        finalQA = questionNumber + comma + questionText + comma + correctAnswer + comma + wrongOne + comma + wrongTwo + comma + wrongThree + comma + "20,1" + "\n"
    }
    function randNum() {
        return Math.floor(Math.random() * questionArray.length)
    }
}