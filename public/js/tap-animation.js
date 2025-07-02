/**
 * Tap Animation Script
 * Creates a ripple effect animation on tap/touch for mobile and tablet devices
 * 
 * Usage: Include this script in your HTML pages with:
 * <script src="path/to/tap-animation.js"></script>
 * 
 * The script will automatically initialize when the page loads.
 */

(function() {
    'use strict';

    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Only initialize on touch devices
    if (!isTouchDevice) return;

    // CSS styles for the ripple effect
    const styles = `
        .tap-ripple {
            position: fixed;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 9999;
        }

        .tap-ripple.dark {
            background: rgba(0, 0, 0, 0.3);
        }

        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }

        /* Alternative pulse animation */
        .tap-pulse {
            position: fixed;
            border-radius: 50%;
            background: rgba(74, 144, 226, 0.3);
            border: 2px solid rgba(74, 144, 226, 0.6);
            transform: scale(0);
            animation: pulse-animation 0.5s ease-out;
            pointer-events: none;
            z-index: 9999;
        }

        @keyframes pulse-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;

    // Configuration options
    const config = {
        animationType: 'ripple', // 'ripple' or 'pulse'
        size: 20, // Base size in pixels
        darkMode: false, // Use dark ripple on light backgrounds
        excludeElements: ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'], // Elements to exclude
        duration: 600 // Animation duration in milliseconds
    };

    // Initialize the script
    function init() {
        // Inject CSS styles
        injectStyles();
        
        // Add touch event listeners
        addEventListeners();
        
        console.log('Tap animation initialized for touch devices');
    }

    // Inject CSS styles into the document
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Add event listeners for touch events
    function addEventListeners() {
        // Use touchstart for immediate response
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        
        // Optional: also handle touchend for different effect
        // document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Handle touch start event
    function handleTouchStart(e) {
        // Check if we should exclude this element
        if (shouldExcludeElement(e.target)) return;
        
        // Get touch coordinates
        const touch = e.touches[0];
        if (!touch) return;
        
        // Create and animate ripple
        createRipple(touch.clientX, touch.clientY);
    }

    // Check if element should be excluded from animation
    function shouldExcludeElement(element) {
        // Check if element or its parents are in exclude list
        let current = element;
        while (current && current !== document) {
            if (config.excludeElements.includes(current.tagName)) {
                return true;
            }
            // Check for data attribute to exclude
            if (current.hasAttribute && current.hasAttribute('data-no-tap-animation')) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // Create ripple animation
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        
        // Set up ripple element
        if (config.animationType === 'pulse') {
            ripple.className = 'tap-pulse';
        } else {
            ripple.className = config.darkMode ? 'tap-ripple dark' : 'tap-ripple';
        }
        
        // Position the ripple
        const size = config.size;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top = (y - size / 2) + 'px';
        
        // Add to document
        document.body.appendChild(ripple);
        
        // Remove after animation completes
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, config.duration);
    }

    // Public API for customization
    window.TapAnimation = {
        // Configure the animation
        configure: function(options) {
            Object.assign(config, options);
        },
        
        // Manually trigger animation at specific coordinates
        trigger: function(x, y) {
            createRipple(x, y);
        },
        
        // Enable/disable the animation
        enabled: true,
        
        // Toggle dark mode
        setDarkMode: function(isDark) {
            config.darkMode = isDark;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// Example usage and customization:
/*

// Basic usage - just include the script, it works automatically

// Customize the animation:
TapAnimation.configure({
    animationType: 'pulse',
    size: 30,
    darkMode: true,
    duration: 800
});

// Exclude specific elements by adding data attribute:
<div data-no-tap-animation>No animation here</div>

// Manually trigger animation:
TapAnimation.trigger(100, 200); // x, y coordinates

// Toggle dark mode based on your site's theme:
TapAnimation.setDarkMode(document.body.classList.contains('dark-theme'));

*/