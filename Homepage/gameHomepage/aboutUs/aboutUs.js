let currentIndex = 0; // Start with the first image

// Function to change slides
function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Remove active class from the current slide
    slides[currentIndex].classList.remove('active');
    
    // Calculate the next index based on direction
    currentIndex += direction;

    // If we reach the end, loop back to the first slide
    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    
    // If we are at the start, go to the last slide
    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }

    // Add active class to the next slide
    slides[currentIndex].classList.add('active');
    
    // Move the slider to the correct position
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentIndex * 50}%)`; // Move the slider by 50% for each image
}

// Optional: Automatically change slides every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 5000);
