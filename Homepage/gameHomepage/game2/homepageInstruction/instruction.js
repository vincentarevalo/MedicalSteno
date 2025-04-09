document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-nav button");
  const prevBtn = document.querySelector(".arrow-left");
  const nextBtn = document.querySelector(".arrow-right");
  const slideNumbers = document.querySelectorAll(".slide-number");

  let currentIndex = 0;

  function showSlide(index) {
    // Reset all slides
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show current slide
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentIndex = index;

    // Update slide numbers
    slideNumbers.forEach((num, i) => {
      num.textContent = `${i + 1}/${slides.length}`;
    });
  }

  function nextSlide() {
    let newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    let newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  // Initialize slider
  showSlide(0);

  // Event listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const slider = document.querySelector(".slider-container");
  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }
});

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

// Function to go to the main menu (this redirects to another HTML file)
function goToMainMenu() {
  window.location.href = "/Homepage/gameHomepage/gameHomepage.html"; // Use an absolute path
}

function toggleSettingsMenu() {
  const settingsMenu = document.getElementById("settings-menu");
  settingsMenu.style.display =
    settingsMenu.style.display === "block" ? "none" : "block";
}
