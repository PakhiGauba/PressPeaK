document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".category-widget");
  if (!section) return;

  const counters = section.querySelectorAll(".counter");
  let started = false;

  function animateCounter(el, endValue, duration = 1500) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * endValue);
      el.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = endValue;
      }
    }

    requestAnimationFrame(update);
  }

  function checkAndStartCounters() {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom >= 0;

    if (inView && !started) {
      started = true;
      counters.forEach(counter => {
        const rawValue = counter.textContent.replace(/[^\d]/g, '');
        const endValue = parseInt(rawValue);
        animateCounter(counter, endValue);
      });
      window.removeEventListener("scroll", checkAndStartCounters);
    }
  }

  // Ensure Owl Carousel is ready before checking visibility
  const owlContainer = section.querySelector(".owl-carousel");
  if (owlContainer && $(owlContainer).hasClass("owl-carousel")) {
    $(owlContainer).on("initialized.owl.carousel", function () {
      window.addEventListener("scroll", checkAndStartCounters);
      checkAndStartCounters(); // Initial check
    });
  } else {
    window.addEventListener("scroll", checkAndStartCounters);
    checkAndStartCounters();
  }
});
