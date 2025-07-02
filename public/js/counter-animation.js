// Counter Animation Script
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counter animation when section is visible
function initCounterAnimation() {
    const counterSection = document.querySelector('.category-widget');
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    counter.textContent = '0';
                    animateCounter(counter, target, 2000);
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the section is visible
    });

    if (counterSection) {
        observer.observe(counterSection);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCounterAnimation);

// Also initialize if script is loaded after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounterAnimation);
} else {
    initCounterAnimation();
}