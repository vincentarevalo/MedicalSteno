const questions = [
  { images: ["Adenotomy.jpg", "Adenotomy.png"], answer: "Adenotomy" },
  {
    images: ["Adenotonsillectomy.jpg", "Adenotonsillectomy.png"],
    answer: "Adenotonsillectomy",
  },
  { images: ["Amygdala.jpg", "Amygdala.png"], answer: "Amygdala" },
  { images: ["Angiectasis.jpg", "Angiectasis.png"], answer: "Angiectasis" },
  { images: ["Anococcygeal.jpg", "Anococcygeal.png"], answer: "Anococcygeal" },
  {
    images: ["Arteriorposterior.jpg", "Arteriorposterior.png"],
    answer: "Arteriorposterior",
  },
  {
    images: ["Arteriosclerosis.jpg", "Arteriosclerosis.png"],
    answer: "Arteriosclerosis",
  },
  {
    images: ["bloodpressure.jpg", "bloodpressure.png"],
    answer: "Blood Pressure",
  },
  { images: ["Cardiology.jpg", "Cardiology.png"], answer: "Cardiology" },
  { images: ["Cystitis.jpg", "Cystitis.png"], answer: "Cystitis" },
];

let soundOn = true; // Keep track of sound state
const audio = document.getElementById("background-audio");

// Function to toggle the sound on and off
function toggleSound() {
  const soundButton = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");

  if (soundOn) {
    soundButton.classList.add("sound-off");
    soundButton.classList.remove("sound-on");
    soundIcon.src = "./images/soundOff.png"; // Change icon to sound off
    audio.play(); // Play audio when turned on
  } else {
    soundButton.classList.add("sound-on");
    soundButton.classList.remove("sound-off");
    soundIcon.src = "./images/soundOn.png"; // Change icon to sound on
    audio.pause(); // Pause audio when turned off
  }

  soundOn = !soundOn; // Toggle the state of sound
}

function toggleSettingsMenu() {
  const settingsMenu = document.getElementById("settings-menu");
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";
}


// Your existing functions for game logic remain unchanged...

function getRandomQuestions() {
  selectedQuestions = [...terms].sort(() => 0.5 - Math.random()).slice(0, 10);
}

let gameStarted = false;
let currentQuestion = 0;
let score = 0;
let lives = 3;
let guessedWord = [];
let hintsUsed = 0;
let timeLeft = 120;
let timerInterval;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const letterButtons = document.getElementById("letterButtons");
const resultElement = document.getElementById("result");
const livesElement = document.getElementById("lives");
const wordDisplay = document.getElementById("wordDisplay");
const imageContainer = document.getElementById("imageContainer");
const reviewBtn = document.getElementById("reviewBtn");
const hintBtn = document.getElementById("hintBtn");
const remainingQuestionsElement = document.getElementById(
  "remaining-questions"
);
const scoreElement = document.getElementById("score");

let timerElement = document.createElement("div");
timerElement.setAttribute("id", "timer");
document.querySelector(".quiz-container").appendChild(timerElement);

restartBtn.classList.add("hidden");
reviewBtn.classList.add("hidden");

// Shuffle the questions array
function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

window.onload = () => {
  shuffleQuestions();

  // Hide all elements except the start button

  restartBtn.style.display = "none";
  hintBtn.style.display = "none";
  timerElement.style.display = "none";
  wordDisplay.style.display = "none";
  imageContainer.style.display = "none";
  letterButtons.style.display = "none";
  resultElement.style.display = "none";
  livesElement.style.display = "none";
  scoreElement.style.display = "none";
  remainingQuestionsElement.style.display = "none";

  // ✅ Explicitly show the start button
  startBtn.style.display = "block";

  // Add event listeners
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", restartGame);
  hintBtn.addEventListener("click", provideHint);
};

function startGame() {
  gameStarted = true;

  // Hide the start button
  startBtn.style.display = "none";

  // ✅ Show all game-related elements
  document.querySelector(".quiz-container").style.display = "flex";

  hintBtn.style.display = "block";
  timerElement.style.display = "block";
  wordDisplay.style.display = "block";
  imageContainer.style.display = "block";
  letterButtons.style.display = "grid";
  resultElement.style.display = "block";
  livesElement.style.display = "inline-block";
  scoreElement.style.display = "inline-block";
  remainingQuestionsElement.style.display = "block";

  // Reset hint button
  hintBtn.disabled = false;
  hintBtn.textContent = "Hint (3 left)";
  hintsUsed = 0;

  // Shuffle questions and reset game state
  shuffleQuestions();
  currentQuestion = 0;
  score = 0;
  lives = 3;
  timeLeft = 120;

  updateScoreDisplay();
  updateLivesDisplay();
  enableLetterButtons();
  displayQuestion();
  startTimer(); // Start the timer
}

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timerInterval = setInterval(() => {
    if (timeLeft <= 0 || lives <= 0) {
      endGame(true); // Ends the game if time runs out
      return;
    }
    timeLeft--;
    timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:${(
      timeLeft % 60
    )
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function displayQuestion() {
  if (currentQuestion >= questions.length || lives <= 0 || timeLeft <= 0) {
    endGame();
    return;
  }

  timeLeft = 120; // Reset the timer for each new question
  startTimer(); // Restart the timer for each new question

  remainingQuestionsElement.textContent = `Remaining Questions: ${
    questions.length - currentQuestion
  }`;

  let question = questions[currentQuestion];
  let images = question.images;
  imageContainer.innerHTML = "";

  images.forEach((image) => {
    let img = document.createElement("img");
    img.src = `./images/${image}`;
    img.onerror = function () {
      this.style.display = "none";
    };
    img.alt = `Image for ${question.answer}`;
    imageContainer.appendChild(img);
  });

  guessedWord = question.answer
    .replace(/\s/g, "")
    .split("")
    .map(() => "");
  updateWordDisplay();

  updateScoreDisplay();
  updateLivesDisplay();
  generateLetterButtons();
}

function updateWordDisplay() {
  wordDisplay.innerHTML = "";
  guessedWord.forEach((letter) => {
    let box = document.createElement("span");
    box.classList.add("letter-box");
    box.textContent = letter;
    wordDisplay.appendChild(box);
  });
}

function checkLetter(letter, button) {
  if (lives <= 0) return;

  let answer = questions[currentQuestion].answer
    .replace(/\s/g, "")
    .toLowerCase();
  let found = false;

  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === letter) {
      guessedWord[i] = letter.toUpperCase();
      found = true;
    }
  }

  button.disabled = true;

  if (found) {
    updateWordDisplay();
    if (!guessedWord.includes("")) {
      score += 10;
      currentQuestion++;
      setTimeout(() => {
        generateLetterButtons();
        displayQuestion();
      }, 1500);
    }
  } else {
    button.classList.add("incorrect");
    lives--;
    updateLivesDisplay();
    if (lives === 0) {
      endGame();
    }
  }
}

function updateScoreDisplay() {
  scoreElement.textContent = `Score: ${score}`;
}

function updateLivesDisplay() {
  livesElement.textContent = `Lives: ${lives}`;
  if (lives <= 0) {
    endGame();
  }
}
function endGame(timeUp = false) {
  clearInterval(timerInterval);
  disableLetterButtons();

  // Display result message based on the game status
  if (lives <= 0) {
    resultElement.textContent = "Game Over! Try again."; // 🛑 Only show if lives are zero
  } else if (timeUp) {
    resultElement.textContent = "Time's up! Try again."; // ⏳ Show only if time runs out
  } else {
    resultElement.textContent = "You completed the quiz! 🎉";
  }

  // Hide the start button and show the restart button
  startBtn.style.display = "none";
  restartBtn.style.display = "block";

  // Hide the hint button
  hintBtn.style.display = "none";

  // Show the review button if game ends due to lives = 0 or timer = 0
  reviewBtn.style.display = "block"; // Show review button
}

function restartGame() {
  // Remove review container if it exists
  const reviewContainer = document.getElementById("reviewContainer");
  if (reviewContainer) {
    reviewContainer.remove();
  }

  gameStarted = false;

  // Clear the game over or time up message
  resultElement.textContent = "";

  // Hide all game elements except the start button
  restartBtn.style.display = "none";
  hintBtn.style.display = "none";
  timerElement.style.display = "none";
  wordDisplay.style.display = "none";
  imageContainer.style.display = "none";
  letterButtons.style.display = "none";
  resultElement.style.display = "none";
  livesElement.style.display = "none";
  scoreElement.style.display = "none";
  remainingQuestionsElement.style.display = "none";
  reviewBtn.style.display = "none";

  // Show only the start button
  startBtn.style.display = "block";

  // Reset game state
  currentQuestion = 0;
  score = 0;
  lives = 3;
  timeLeft = 120;
  hintsUsed = 0;

  // Clear letter buttons and shuffle questions
  letterButtons.innerHTML = "";
  shuffleQuestions();

  // Make sure quiz container is visible
  document.querySelector(".quiz-container").style.display = "flex";
}

function reviewAnswers() {
  // Create a review container if it doesn't already exist
  let reviewContainer = document.getElementById("reviewContainer");

  if (!reviewContainer) {
    reviewContainer = document.createElement("div");
    reviewContainer.setAttribute("id", "reviewContainer");
    reviewContainer.classList.add("review-container");
    document.querySelector(".gameContainer").appendChild(reviewContainer);
  }

  // Clear the review container
  reviewContainer.innerHTML = "";

  // Add a heading for the review section
  let reviewHeading = document.createElement("h2");
  reviewHeading.textContent = "Review Your Answers";
  reviewContainer.appendChild(reviewHeading);

  // Only show questions up to the current question
  const questionsToShow = questions.slice(0, currentQuestion + 1);

  // Loop through the relevant questions
  questionsToShow.forEach((question, index) => {
    let questionContainer = document.createElement("div");
    questionContainer.classList.add("review-question");

    // Add the question number
    let questionNumber = document.createElement("h3");
    questionNumber.textContent = `Question ${index + 1}`;
    questionContainer.appendChild(questionNumber);

    // Add the question image(s)
    let imagesContainer = document.createElement("div");
    imagesContainer.classList.add("review-images");
    question.images.forEach((image) => {
      let questionImage = document.createElement("img");
      questionImage.src = `./images/${image}`;
      questionImage.onerror = function () {
        this.style.display = "none"; // Hide if image fails to load
      };
      questionImage.alt = `Image for ${question.answer}`;
      imagesContainer.appendChild(questionImage);
    });
    questionContainer.appendChild(imagesContainer);

    // Add the question text (correct answer)
    let answerText = document.createElement("p");
    answerText.textContent = `Correct Answer: ${question.answer}`;
    questionContainer.appendChild(answerText);

    // Add the container to the review container
    reviewContainer.appendChild(questionContainer);
  });

  // Create button container
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("review-buttons");

  // Add a Restart Game button
  let restartBtnInReview = document.createElement("button");
  restartBtnInReview.textContent = "Restart Game";
  restartBtnInReview.addEventListener("click", () => {
    // Remove the review container
    reviewContainer.remove();

    // Restart the game
    restartGame();
  });

  // Add a Close Review button
  let closeBtn = document.createElement("button");
  closeBtn.textContent = "Close Review";
  closeBtn.addEventListener("click", () => {
    reviewContainer.remove();
    document.querySelector(".quiz-container").style.display = "flex";
  });

  // Add buttons to the container
  buttonContainer.appendChild(restartBtnInReview);
  buttonContainer.appendChild(closeBtn);

  // Add the button container to the review container
  reviewContainer.appendChild(buttonContainer);

  // Hide the quiz container and show the review container
  document.querySelector(".quiz-container").style.display = "none";
  reviewContainer.style.display = "block";
}

function disableLetterButtons() {
  const buttons = document.querySelectorAll("#letterButtons button");
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function enableLetterButtons() {
  letterButtons.innerHTML = "";
}

function generateLetterButtons() {
  letterButtons.innerHTML = "";

  let availableLetters = "";
  let answerLetters = questions[currentQuestion].answer
    .replace(/\s/g, "")
    .split("");
  let allLetters = "abcdefghijklmnopqrstuvwxyz";

  answerLetters.forEach((letter) => {
    if (!availableLetters.includes(letter.toLowerCase())) {
      availableLetters += letter.toLowerCase();
    }
  });

  while (availableLetters.length < 12) {
    let randomLetter =
      allLetters[Math.floor(Math.random() * allLetters.length)];
    if (!availableLetters.includes(randomLetter)) {
      availableLetters += randomLetter;
    }
  }

  availableLetters = availableLetters
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  availableLetters.split("").forEach((letter) => {
    let button = document.createElement("button");
    button.textContent = letter.toUpperCase();
    button.addEventListener("click", () => checkLetter(letter, button));
    letterButtons.appendChild(button);
  });
}

function provideHint() {
  if (hintsUsed >= 3) {
    alert("You have used all your hints!");
    return;
  }

  let answer = questions[currentQuestion].answer
    .replace(/\s/g, "")
    .toLowerCase();
  let hiddenIndices = [];

  for (let i = 0; i < answer.length; i++) {
    if (guessedWord[i] === "") {
      hiddenIndices.push(i);
    }
  }

  if (hiddenIndices.length === 0) {
    alert("No hints needed! All letters are already revealed.");
    return;
  }

  let randomIndex =
    hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
  guessedWord[randomIndex] = answer[randomIndex].toUpperCase();
  updateWordDisplay();

  hintsUsed++;
  hintBtn.textContent = `Hint (${3 - hintsUsed} left)`;
  if (hintsUsed >= 3) {
    hintBtn.disabled = true;
  }
}
