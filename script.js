// Carousel functionality
    const track = document.getElementById('carousel-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const items = track.children;
    const totalItems = items.length;
    let currentIndex = 0;

    // Number of visible items depends on screen width
    function getVisibleCount() {
      let w = window.innerWidth;
      if(w < 400) return 1;
      if(w < 640) return 2;
      if(w < 1024) return 3;
      return 4;
    }

    // Update carousel position
    function updateCarousel() {
      const visibleCount = getVisibleCount();
      const maxIndex = totalItems - visibleCount;
      if(currentIndex < 0) currentIndex = 0;
      if(currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = -(currentIndex * (100 / visibleCount));
      track.style.transform = `translateX(${translateX}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCarousel();
    });

    // Update on resize to reset position if necessary
    window.addEventListener('resize', () => {
      updateCarousel();
    });

    // Initialize carousel
    updateCarousel();

// script.js
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  toggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});


 function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    }