const medicalTerms = [
  { image: "images/admission.png", term: "admission" },
  { image: "images/bloodpressure.png", term: "bloodpressure" },
  { image: "images/cardiac.png", term: "cardiac" },
  { image: "images/cardiogram.png", term: "cardiogram" },
  { image: "images/cardiograph.png", term: "cardiograph" },
  { image: "images/cardiology.png", term: "cardiology" },
  { image: "images/diagnosis.png", term: "diagnosis" },
  { image: "images/discharge.png", term: "discharge" },
  { image: "images/electrocardiogram.png", term: "electrocardiogram" },
  { image: "images/hospital.png", term: "hospital" },
  { image: "images/millimeter.png", term: "millimeter" },
  { image: "images/nitroglycerin.png", term: "nitroglycerin" },
  { image: "images/phlebitis.png", term: "phlebitis" },
  { image: "images/phleboclysis.png", term: "phleboclysis" },
  { image: "images/phleborrhagia.png", term: "phleborrhagia" },
  { image: "images/phlebotomy.png", term: "phlebotomy" },
  { image: "images/sedimentationrate.png", term: "sedimentationrate" },
  { image: "images/temperature.png", term: "temperature" },
  { image: "images/treatment.png", term: "treatment" },
  { image: "images/x-ray.png", term: "x-ray" },
];

// DOM Elements
const termImage = document.getElementById("term-image");
const answerInput = document.getElementById("answer-input");
const timerDisplay = document.querySelector(".timer");
const popup = document.getElementById("popup");
const scoreDisplay = document.getElementById("score");
const totalDisplay = document.getElementById("total");
const remainingDisplay = document.getElementById("remaining");
const hintButton = document.getElementById("hint-button");
const playButton = document.getElementById("play-button");
const reviewButton = document.getElementById("review-button");
const playAgainButton = document.getElementById("play-again-button");
const scoreContainer = document.querySelector(".scoreContainer");
const reviewSection = document.querySelector(".reviewSection");
const reviewContainer = document.querySelector(".reviewAnswers");
const closeReviewButton = document.getElementById("close-review-button");
const reviewAction = document.querySelector(".review-actions");

// Game State Variables
let shuffledTerms = [];
let currentTermIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;
let userAnswers = [];
let soundOn = true;
const audio = document.getElementById("background-audio");

// Initialize Game
function initGame() {
  termImage.style.display = "none";
  answerInput.style.display = "none";
  hintButton.style.display = "none";
  reviewButton.style.display = "none";
  playAgainButton.style.display = "none";
  scoreContainer.style.display = "none";
  answerInput.disabled = true;
  hintButton.disabled = true;
  totalDisplay.textContent = "10";
  remainingDisplay.textContent = "10";
  timerDisplay.textContent = "15";
}

// Shuffle Array Function
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Start Game Function
function startGame() {
  shuffledTerms = shuffleArray([...medicalTerms]).slice(0, 10);
  currentTermIndex = 0;
  score = 0;
  userAnswers = [];
  timeLeft = 15;

  scoreDisplay.textContent = score;
  remainingDisplay.textContent = "10";
  scoreContainer.style.display = "flex";
  playButton.style.display = "none";
  hintButton.style.display = "block";
  termImage.style.display = "block";
  answerInput.style.display = "block";
  answerInput.disabled = false;
  hintButton.disabled = false;
  timerDisplay.style.display = "flex";
  timerDisplay.textContent = "15";
  timerDisplay.classList.remove("low-time");

  showTerm();
  startTimer();
}

// Timer Functions
function startTimer() {
  timeLeft = 15;
  updateTimerDisplay();
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 5) {
      timerDisplay.classList.add("low-time");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeLeft;
}

function handleTimeOut() {
  userAnswers.push({
    term: shuffledTerms[currentTermIndex].term,
    userAnswer: "",
    correct: false,
  });
  showPopup("Time's up!", "incorrect");
  setTimeout(nextTerm, 2000);
}

// Game Flow Functions
function showTerm() {
  termImage.src = shuffledTerms[currentTermIndex].image;
  answerInput.value = "";
  answerInput.focus();
  updateRemainingQuestions();
  playPronunciation(shuffledTerms[currentTermIndex].term);
}

function updateRemainingQuestions() {
  remainingDisplay.textContent = shuffledTerms.length - currentTermIndex;
}

function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = shuffledTerms[currentTermIndex].term.toLowerCase();
  const isCorrect = userAnswer === correctAnswer;

  clearInterval(timerInterval);

  if (isCorrect) {
    score++;
    scoreDisplay.textContent = score;
    showPopup("Correct!", "correct");
  } else {
    showPopup("Incorrect! Try again.", "incorrect");
  }

  userAnswers.push({
    term: shuffledTerms[currentTermIndex].term,
    userAnswer,
    correct: isCorrect,
  });

  setTimeout(() => {
    if (isCorrect) {
      nextTerm();
    } else {
      startTimer();
    }
  }, 1000);
}

function nextTerm() {
  currentTermIndex++;
  if (currentTermIndex < shuffledTerms.length) {
    showTerm();
    startTimer();
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timerInterval);
  termImage.style.display = "none";
  answerInput.style.display = "none";
  hintButton.style.display = "none";
  reviewButton.style.display = "block";
  playAgainButton.style.display = "block";
}

// Review Section Functions
function showReview() {
  reviewContainer.innerHTML = "";
  reviewSection.style.display = "flex";

  // Add header with score
  const header = document.createElement("div");
  header.className = "review-header";
  header.innerHTML = `
    <h2>Review Answers</h2>
    <p class="score-display">Your Score: ${score}/${shuffledTerms.length}</p>
  `;
  reviewContainer.appendChild(header);

  // Add each answer
  userAnswers.forEach((answer, index) => {
    const answerDiv = document.createElement("div");
    answerDiv.className = `review-item ${answer.correct ? "correct" : "incorrect"}`;
    answerDiv.style.animationDelay = `${index * 0.1}s`;

    // Handle missing images
    const imageHTML = shuffledTerms[index] && shuffledTerms[index].image
      ? `<img src="${shuffledTerms[index].image}" alt="${answer.term}" onerror="this.style.display='none'">`
      : `<div class="no-image">No image available</div>`;

    answerDiv.innerHTML = `
      <div class="question-number">Question ${index + 1}</div>
      ${imageHTML}
      <div class="answer-details">
        <p><strong>Your Answer:</strong> <span class="user-answer ${answer.correct ? "correct" : "incorrect"}">
          ${answer.userAnswer || "No answer"}
        </span></p>
        <p><strong>Correct Answer:</strong> ${answer.term}</p>
      </div>
    `;

    reviewContainer.appendChild(answerDiv);
  });

  reviewAction.style.display = "none";

  // Add action buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "review-buttons";
  buttonContainer.innerHTML = `
    <button id="restart-game" class="review-btn">Play Again</button>
    <button id="close-review" class="review-btn">Close Review</button>
  `;
  reviewContainer.appendChild(buttonContainer);

  // Add event listeners
  document.getElementById("restart-game").addEventListener("click", () => {
    closeReview();
    resetGame();
  });

  document.getElementById("close-review").addEventListener("click", closeReview);

  // Trigger animation
  setTimeout(() => {
    reviewSection.classList.add("show");
  }, 10);
}

function closeReview() {
  reviewSection.classList.remove("show");
  setTimeout(() => {
    reviewSection.style.display = "none";
  }, 300);
}

// Reset Game
function resetGame() {
  currentTermIndex = 0;
  score = 0;
  userAnswers = [];
  timeLeft = 15;

  scoreDisplay.textContent = score;
  remainingDisplay.textContent = "10";
  answerInput.value = "";
  answerInput.disabled = true;
  hintButton.disabled = true;

  reviewButton.style.display = "none";
  playAgainButton.style.display = "none";
  playButton.style.display = "inline-block";
  termImage.style.display = "none";
  answerInput.style.display = "none";
  hintButton.style.display = "none";
  scoreContainer.style.display = "none";

  clearInterval(timerInterval);
  timerDisplay.textContent = timeLeft;
  timerDisplay.classList.remove("low-time");
}

// Helper Functions
function showPopup(message, type) {
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1000);
}

function playPronunciation(term) {
  if (!soundOn) return;

  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Sound Controls
function toggleSound() {
  const soundIcon = document.getElementById("sound-icon");
  soundOn = !soundOn;

  if (soundOn) {
    soundIcon.src = "./images/soundOn.png";
    audio.play();
  } else {
    soundIcon.src = "./images/soundOff.png";
    audio.pause();
  }
}

// Settings Menu
function toggleSettingsMenu() {
  const settingsMenu = document.getElementById("settings-menu");
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";
}

// Event Listeners
playButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", resetGame);
reviewButton.addEventListener("click", showReview);
closeReviewButton.addEventListener("click", closeReview);
hintButton.addEventListener("click", () => {
  const firstLetter = shuffledTerms[currentTermIndex].term[0];
  showPopup(`Hint: The term starts with "${firstLetter}"`, "hint");
});

answerInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Initialize the game when the page loads
window.addEventListener("DOMContentLoaded", initGame);F