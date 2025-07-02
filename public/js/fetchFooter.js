
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = data;
            
            // Execute scripts from the loaded footer
            const scripts = footerPlaceholder.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
            
            // Initialize footer functionality after loading
            initializeFooter();
            // Initialize back to top after footer is loaded
            initializeBackToTop();
        }
    })
    .catch(error => console.error('Error loading footer:', error));

// Function to initialize footer functionality
function initializeFooter() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Back to top functionality
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Show/hide back to top button
    const handleScroll = function() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
            } else {
                backToTop.style.opacity = '0.8';
            }
        }
    };

    // Remove existing scroll listener if any and add new one
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
}