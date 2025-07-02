document.addEventListener("DOMContentLoaded", () => {
    function initCarousel(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const controlsContainer = container.nextElementSibling;
        if (!controlsContainer || !controlsContainer.classList.contains("carousel-controls")) return;

        const cards = container.querySelectorAll(".carousel-post-block");
        const prevBtn = controlsContainer.querySelector(".carousel-arrow.prev");
        const nextBtn = controlsContainer.querySelector(".carousel-arrow.next");
        const dotsContainer = controlsContainer.querySelector(".carousel-dots");

        let currentIndex = 0;
        let cardsPerView = 1;
        let totalPages = 0;
        let isAnimating = false;

        // Touch/swipe variables
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startScrollLeft = 0;

        function updateDotsAndButtons() {
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalPages - 1;
        }

        function scrollToIndex(index) {
            if (isAnimating) return;
            isAnimating = true;

            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const scrollLeft = (cardWidth + gap) * cardsPerView * index;

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth"
            });

            setTimeout(() => {
                isAnimating = false;
            }, 300);

            updateDotsAndButtons();
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalPages - 1));
            scrollToIndex(currentIndex);
        }

        function calculateLayout() {
            const cardWidth = cards[0].offsetWidth;
            const containerWidth = container.offsetWidth;
            cardsPerView = Math.max(1, Math.floor(containerWidth / (cardWidth + 20)));
            totalPages = Math.ceil(cards.length / cardsPerView);

            // Create dots
            dotsContainer.innerHTML = "";
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement("span");
                dot.className = "dot";
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }

            scrollToIndex(currentIndex);
        }

        // Touch/Mouse event handlers
        function getClientX(e) {
            return e.touches ? e.touches[0].clientX : e.clientX;
        }

        function handleStart(e) {
            if (isAnimating) return;

            isDragging = true;
            startX = getClientX(e);
            currentX = startX;
            startScrollLeft = container.scrollLeft;

            container.style.cursor = "grabbing";
            container.style.scrollBehavior = "auto";
        }

        function handleMove(e) {
            if (!isDragging) return;

            e.preventDefault();
            currentX = getClientX(e);
            const deltaX = currentX - startX;

            container.scrollLeft = startScrollLeft - deltaX;
        }

        function handleEnd(e) {
            if (!isDragging) return;

            isDragging = false;
            container.style.cursor = "grab";
            container.style.scrollBehavior = "smooth";

            const deltaX = currentX - startX;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0 && currentIndex > 0) {
                    // Swiped right, go to previous
                    goToSlide(currentIndex - 1);
                } else if (deltaX < 0 && currentIndex < totalPages - 1) {
                    // Swiped left, go to next
                    goToSlide(currentIndex + 1);
                } else {
                    // Snap back to current position
                    scrollToIndex(currentIndex);
                }
            } else {
                // Snap back to current position
                scrollToIndex(currentIndex);
            }
        }

        // Event listeners
        prevBtn.addEventListener("click", () => {
            goToSlide(currentIndex - 1);
        });

        nextBtn.addEventListener("click", () => {
            goToSlide(currentIndex + 1);
        });

        // Touch events
        container.addEventListener("touchstart", handleStart, { passive: false });
        container.addEventListener("touchmove", handleMove, { passive: false });
        container.addEventListener("touchend", handleEnd);

        // Mouse events
        container.addEventListener("mousedown", handleStart);
        container.addEventListener("mousemove", handleMove);
        container.addEventListener("mouseup", handleEnd);
        container.addEventListener("mouseleave", handleEnd);

        // Prevent context menu on long press
        container.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        // Scroll event for manual scrolling
        let scrollTimeout;
        container.addEventListener("scroll", () => {
            if (isAnimating || isDragging) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const cardWidth = cards[0].offsetWidth;
                const gap = 20;
                const scrollLeft = container.scrollLeft;
                const newIndex = Math.round(scrollLeft / ((cardWidth + gap) * cardsPerView));

                if (newIndex !== currentIndex) {
                    currentIndex = Math.min(newIndex, totalPages - 1);
                    updateDotsAndButtons();
                }
            }, 100);
        });

        // Initialize and handle resize
        calculateLayout();
        window.addEventListener("resize", calculateLayout);
    }

    // Initialize carousel
    initCarousel(".horizontal-carousel-container");
    initCarousel('.multilingual-carousel-container');
});
