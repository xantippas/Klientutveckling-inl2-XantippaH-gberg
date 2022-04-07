let category = "";
let questions = [];
let correctAnswers = [];
let choices = [];
let questionCounter = 0;
let playerScore = 0;
let choiceContainer = document.querySelector(".choiceContainer");
let main = document.querySelector("main");
let questionContainer = document.querySelector(".container");
let type;
let amount;
let title;

document.querySelector("#startGame").addEventListener("click", () => {
  renderGame();
});

let getData = async (url) => {
  let difficulty = document.querySelector("[name='difficulty']:checked").value;
  let categoryQuery = document.querySelector("#inputCategory").value;
  amount = document.querySelector("#numQ").value;
  type = document.querySelector("[name='type']:checked").value;

  let sel = document.getElementById("inputCategory");
  category = sel.options[sel.selectedIndex].text;

  let parameters = {
    category: categoryQuery,
    type: type,
    amount: amount,
    difficulty: difficulty,
  };

  let response = await axios.get(url, {
    params: parameters,
  });

  return response.data;
};

let renderGame = async () => {
  let render = await getData("https://opentdb.com/api.php?amount=10&");

  if(render.results.length < amount){
    alert("There are not enough questions for your chosen difficulty in selected category, please try again");
  }

  for (let i = 0; i < amount; i++) {
    questions[i] = render.results[i].question;
    correctAnswers[i] = render.results[i].correct_answer;
    choices[i] = render.results[i].incorrect_answers;
  }

  playGame();
};

let playGame = () => {
  choiceContainer.remove();
  title = document.querySelector("#chosenCategory");
  title.innerText = `Chosen Category: ${category}`;

  if (type === "multiple") {
    main.append(questionContainer);
    multiple();
  } else {
    let trueBtn = document.createElement("button");
    trueBtn.value = "True";
    trueBtn.className = "answerText";
    trueBtn.textContent = "True";
    let falseBtn = document.createElement("button");
    falseBtn.value = "False";
    falseBtn.className = "answerText";
    falseBtn.textContent = "False";

    let myButtons = [trueBtn, falseBtn];

    myButtons.forEach((item) => {
      item.addEventListener("click", (e) => {
        let correctAnswer = correctAnswers[questionCounter];
        if (e.target.value === correctAnswer) {
          result.style.color = "green";
          result.innerText = "Correct";
          playerScore++;
        } else {
          result.style.color = "red";
          result.innerText = "Incorrect";
        }
        questionCounter++;

        trueOrFalse();
      });
    });

    main.append(questionContainer);
    document.querySelector(".trueorfalseContainer").append(trueBtn, falseBtn);

    trueOrFalse();
  }
};

function newQuestion() {
  document.querySelector("#result").innerText = "";
  let question = questions[questionCounter];
  document.querySelector("#question").innerHTML = `<p>${question}</p>`;
}

function trueOrFalse() {
  if (questionCounter < amount) {
    setTimeout(function () {
      newQuestion();
    }, 1000);
  } else {
    title.innerText = "";
    document.querySelector(".trueorfalseContainer").innerHTML = "";
    displayFinalResults();
  }
}

function multiple() {
  if (questionCounter < amount) {
    setTimeout(function () {
      newQuestion();
      getNewChoices();
    }, 1000);
  } else {
    title.innerText = "";
    displayFinalResults();
  }
}

function getNewChoices() {
  let gameChoices = [];
  let contain = document.querySelector(".answerContainer");

  for (let i = 0; i < choices[questionCounter].length; i++) {
    gameChoices.push(choices[questionCounter][i]);
  }
  gameChoices.push(correctAnswers[questionCounter]);

  shuffleArray(gameChoices);

  gameChoices.forEach((type) => {
    let option = document.createElement("button");
    let span = document.createElement("span");
    option.value = type;
    span.innerHTML = type;
    span.className = "spanM";
    span.value = type;
    option.className = "multipleText";

    option.append(span);
    contain.append(option);

    option.addEventListener("click", () => {
      let correctAnswer = correctAnswers[questionCounter];

      if (option.value === correctAnswer) {
        result.style.color = "green";
        result.innerText = "Correct";
        playerScore++;
      } else {
        result.style.color = "red";
        result.innerText = "Incorrect";
      }
      questionCounter++;
      contain.innerHTML = "";
      multiple();
    });
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayFinalResults() {
  let divFinal = document.querySelector(".finalScores");

  let viewResults = document.createElement("button");
  viewResults.textContent = "Results";
  viewResults.className = "resultButton";
  divFinal.append(viewResults);

  viewResults.addEventListener("click", () => {
    viewResults.remove();

    let scores = document.createElement("p");
    scores.textContent = `Your Score: ${playerScore} / ${amount}`;

    let scoreGrade = document.createElement("p");

    let newGameBtn = document.createElement("button");
    newGameBtn.textContent = "New Game";
    newGameBtn.className = "newGameBtn";

    playerScorePercentage(divFinal, scoreGrade);
    divFinal.append(scores, scoreGrade, newGameBtn);

    newGameBtn.addEventListener("click", () => {
      playerScore = 0;
      questionCounter = 0;
      divFinal.innerHTML = "";
      divFinal.style.background = "";

      document.querySelector("#question").innerText = "";
      document.querySelector("#result").innerText = "";

      questionContainer.remove();
      main.append(choiceContainer);
      $("#numQ").val("");
      $('input[name="difficulty"]').prop("checked", false);
      $('input[name="type"]').prop("checked", false);
    });
  });
}

function playerScorePercentage(divFinal, scoreGrade) {
  let total = Math.round((100 / amount) * playerScore);

  if (total < 50) {
    divFinal.style.background = "red";
    scoreGrade.textContent += "Failed!";
  } else if (total >= 50 && total < 75) {
    divFinal.style.background = "orange";
    scoreGrade.textContent += "Passed!";
  } else if (total >= 75) {
    divFinal.style.background = "green";
    scoreGrade.textContent += "Excellent!";
  }
}

questionContainer.remove();

$(".change").on("click", function () {
  if ($("body").hasClass("dark")) {
    $("body").removeClass("dark");
    $(".material-icons-outlined").text("dark_mode");
  } else {
    $("body").addClass("dark");
    $(".material-icons-outlined").text("light_mode");
  }
});
