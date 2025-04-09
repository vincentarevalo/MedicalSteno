const terms = [
  "ABDOMINAL",
  "ABSCESS",
  "ADRENALINE",
  "ALLERGIC",
  "ANESTHESIA",
  "ARTHRITIS",
  "ASTHMA",
  "BACTERIA",
  "BIOPSY",
  "BRONCHELE",
  "BRONCHITIS",
  "BRONCHOCEPHALITIS",
  "BRONCHOPNEUMONIA",
  "BRONCHUS",
  "CARDIAC",
  "CATARACT",
  "CORNEA",
  "DIABETES",
  "ECZEMA",
  "ESOPHAGUS",
  "GALLBLADDER",
  "HEMORRHAGE",
  "HEPATITIS",
  "LARYNGITIS",
  "LARYNGOPLEGIA",
  "LARYNGOSTASIS",
  "LARYNX",
  "LEUKEMIA",
  "MASTITIS",
  "MASTOPATHY",
  "MASTOSIS",
  "METABOLISM",
  "MUCUS",
  "PNEUMOCARDIA",
  "PNEUMOCENTESIS",
  "PNEUMONECTOMY",
  "PNEUMONIA",
  "PNEUMOTHORAX",
  "SARCOBLAST",
  "SARCOID",
  "SARCOLYSIS",
  "SARCOMA",
  "THORACODYNIA",
  "THORACOSCOPE",
  "THORACOSCOPY",
  "THORACOSTOMY",
  "TRACHEA",
  "TRACHEOTOME",
  "TRACHEOTOMY",
];

let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];
let correctAnswers = [];
let timeLeft = 10;
let timerInterval;
let hintsUsed = 0;

let soundOn = true; // Keep track of sound state
const audio = document.getElementById("background-audio");

// Function to toggle the sound on and off
function toggleSound() {
  const soundButton = document.getElementById("sound-btn");
  const soundIcon = document.getElementById("sound-icon");

  if (soundOn) {
    soundButton.classList.add("sound-off");
    soundButton.classList.remove("sound-on");
    soundIcon.src = "./images/soundOn.png"; // Change icon to sound off
    audio.play(); // Play audio when turned on
  } else {
    soundButton.classList.add("sound-on");
    soundButton.classList.remove("sound-off");
    soundIcon.src = "./images/soundOff.png"; // Change icon to sound on
    audio.pause(); // Pause audio when turned off
  }

  soundOn = !soundOn; // Toggle the state of sound
}



function toggleSettingsMenu() {
  const settingsMenu = document.getElementById("settings-menu");
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";
}

function getRandomQuestions() {
  selectedQuestions = [...terms].sort(() => 0.5 - Math.random()).slice(0, 10);
}

function startGame() {
  getRandomQuestions();
  currentQuestionIndex = 0;
  score = 0;
  hintsUsed = 0;
  correctAnswers = [];
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("hintBtn").style.display = "none";
  document.getElementById("reviewBtn").style.display = "none";
  loadQuestion();
  startTimer();
}
function loadQuestion() {
  if (currentQuestionIndex >= selectedQuestions.length) {
    endGame();
    return;
  }

  // Reset the timer for the new question
  timeLeft = 10; // Reset timer to 10 seconds
  document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`; // Update timer display
  startTimer(); // Start the timer

  document.getElementById("remaining").textContent = `Remaining Questions: ${
    selectedQuestions.length - currentQuestionIndex
  }`;
  document.getElementById("score").textContent = `Score: ${score}/10`;

  let questionText = selectedQuestions[currentQuestionIndex];
  document.getElementById("question").textContent = questionText;

  // Filter choices to only include terms that start with the same letter as the correct answer
  const correctLetter = questionText[0];
  let filteredOptions = terms.filter((term) => term[0] === correctLetter);

  if (!filteredOptions.includes(questionText)) {
    filteredOptions.push(questionText);
  }

  let shuffledOptions = filteredOptions
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (shuffledOptions.length < 4) {
    const remainingTerms = terms.filter(
      (term) => !shuffledOptions.includes(term)
    );
    const additionalTerms = remainingTerms
      .sort(() => 0.5 - Math.random())
      .slice(0, 4 - shuffledOptions.length);
    shuffledOptions = [...shuffledOptions, ...additionalTerms];
  }

  shuffledOptions = shuffledOptions.sort(() => 0.5 - Math.random());

  let optionElements = document.querySelectorAll(".option");
  optionElements.forEach((option, index) => {
    let term = shuffledOptions[index];
    option.dataset.correct = term === questionText;
    option.style.backgroundImage = `url('images/${term.toLowerCase()}.jpg'), url('images/${term.toLowerCase()}.png')`;
    option.onclick = () => checkAnswer(option);
    option.classList.remove("correct", "wrong");
    option.style.pointerEvents = "auto"; // Enable pointer events
    option.style.border = ""; // Reset the border before each question
  });
}

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswer(null); // Call checkAnswer with null to handle timeout
      disableOptions(); // Disable all options when time runs out
    }
  }, 1000);
}
function checkAnswer(option) {
  disableOptions(); // Disable options after click

  if (option) {
    if (option.dataset.correct === "true") {
      score++;
      option.classList.add("correct");
    } else {
      option.classList.add("wrong");
      document.getElementById("startBtn").style.display = "none"; // Hide start button if incorrect
    }
  }

  // Always add green border to the correct option immediately after selecting an answer
  const correctOption = document.querySelector(".option[data-correct='true']");
  if (correctOption) {
    correctOption.style.border = "10px solid green"; // Apply green border to correct answer
  }

  correctAnswers.push({
    question: selectedQuestions[currentQuestionIndex],
    selected: option
      ? option.dataset.correct === "true"
        ? "Correct"
        : "Incorrect"
      : "Timed Out",
  });

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 2000);
}

function useHint() {
  if (hintsUsed >= 3) {
    alert("No hints left!");
    return;
  }

  hintsUsed++;
  document.getElementById("hintBtn").textContent = `Use Hint (${
    3 - hintsUsed
  } left)`;
  let correctOption = document.querySelector(".option[data-correct='true']");
  correctOption.classList.add("correct");
}

function reviewAnswers() {
  // Hide quiz container
  document.querySelector(".quiz-container").style.display = "none";

  // Show review section with animation
  const reviewSection = document.querySelector(".reviewSection");
  reviewSection.style.display = "flex";
  setTimeout(() => {
    reviewSection.classList.add("show");
  }, 10);

  // Clear previous review content
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  // Create review items for each question
  correctAnswers.forEach((answer, index) => {
    const reviewItem = document.createElement("li");
    reviewItem.className = `review-item ${
      answer.selected === "Correct" ? "correct" : "incorrect"
    }`;
    reviewItem.style.setProperty("--item-index", index);

    // Get image with multiple fallbacks
    const imageHTML = getImageHTML(answer.question);

    reviewItem.innerHTML = `
      <div class="review-question">
        <h3>Question ${index + 1}</h3>
        <div class="image-container">
          ${imageHTML}
        </div>
        <div class="answer-details">
          <p><strong>Term:</strong> ${answer.question}</p>
          <p class="user-answer ${
            answer.selected === "Correct" ? "correct" : "incorrect"
          }">
            <strong>Your Answer:</strong> ${answer.selected}
          </p>
        </div>
      </div>
    `;

    reviewList.appendChild(reviewItem);
  });

  // Add event listener for restart button
  document.getElementById("restartFromReview").onclick = function () {
    closeReview();
    restartGame();
  };
}

function getImageHTML(question) {
  const baseName = question.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const extensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  const basePath = "images/";

  // Create all possible image tags with different extensions
  let imagesHTML = "";
  extensions.forEach((ext) => {
    imagesHTML += `
      <img src="${basePath}${baseName}${ext}" 
           alt="${question}" 
           style="display:none" 
           onload="this.style.display='block'" 
           onerror="this.remove()">
    `;
  });

  // Add a fallback message that will show if all images fail
  imagesHTML += `
    <div class="image-fallback" style="display:none">
      Image not available
    </div>
    <script>
      setTimeout(() => {
        const container = document.currentScript.parentNode;
        if (container.querySelector('img[style=\"display:block\"]') === null) {
          container.querySelector('.image-fallback').style.display = 'block';
        }
      }, 100);
    </script>
  `;

  return imagesHTML;
}

function closeReview() {
  const reviewSection = document.querySelector(".reviewSection");
  reviewSection.classList.remove("show");

  setTimeout(() => {
    reviewSection.style.display = "none";
    document.querySelector(".quiz-container").style.display = "block";
  }, 300);
}

// Function to restart the game from review section
function restartGame() {
  // Reset all the necessary variables when restarting
  score = 0;
  currentQuestionIndex = 0;
  hintsUsed = 0;
  correctAnswers = [];
  timeLeft = 10;

  // Reset the quiz container to its original state
  document.querySelector(".quiz-container").innerHTML = `
    <h1 id="score">Score: 0/10</h1>
    <h2 id="remaining">Remaining Questions: 10</h2>
    <h2 id="timer">Time Left: 10s</h2>
    <div class="question-box">
      <span id="question"></span>
    </div>
    <div class="options">
      <div class="option"></div>
      <div class="option"></div>
      <div class="option"></div>
      <div class="option"></div>
    </div>
    <div class="buttonContainer">
      <div id="result" hidden></div>
      <button id="startBtn" onclick="startGame()">Start Game</button>
      <button id="restartBtn" onclick="restartGame()" style="display: none">
        Restart Game
      </button>
      <button id="hintBtn" onclick="useHint()" style="display: none">
        Use Hint (3 left)
      </button>
      <button id="reviewBtn" onclick="reviewAnswers()" style="display: none">
        Review Answers
      </button>
    </div>
  `;

  // Get random questions and load the first question
  getRandomQuestions();
  loadQuestion();

  // Start the timer
  startTimer();
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("restartBtn").style.display = "inline-block"; // Show restart button after the game ends
  document.getElementById("reviewBtn").style.display = "inline-block"; // Show review button after the game ends
  document.getElementById("hintBtn").style.display = "none"; // Hide the hint button after the game ends
  document.querySelector(
    ".quiz-container"
  ).innerHTML += `<h1>Quiz Complete! Final Score: ${score}/10</h1>`;
}

function disableOptions() {
  document.querySelectorAll(".option").forEach((opt) => {
    opt.style.pointerEvents = "none"; // Disable pointer events
  });
  document.getElementById("restartBtn").style.display = "none"; // Show restart button
}

function restartGameFromReview() {
  restartGame();
}
