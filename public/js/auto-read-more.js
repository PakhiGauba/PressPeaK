
function initializeAutoReadMore() {
    // Find all article preview elements
    const articlePreviews = document.querySelectorAll('.media-body p.mid');
    
    articlePreviews.forEach(paragraph => {
        // Skip if already processed
        if (paragraph.dataset.autoReadMoreProcessed) {
            return;
        }
        
        // Store original content first time only
        if (!paragraph.dataset.originalContent) {
            const textWithoutReadMore = paragraph.innerHTML.replace(/<a[^>]*class="orange"[^>]*>.*?<\/a>/gi, '').trim();
            paragraph.dataset.originalContent = textWithoutReadMore;
        }
        
        const originalContent = paragraph.dataset.originalContent;
        const textContent = paragraph.textContent || paragraph.innerText;
        
        // Get the link URL from the closest article block
        const articleBlock = paragraph.closest('.media.post-block');
        const articleLink = articleBlock ? articleBlock.querySelector('a[href$=".html"]') : null;
        const linkUrl = articleLink ? articleLink.getAttribute('href') : '#';
        
        // Reset paragraph content to original
        paragraph.innerHTML = originalContent;
        
        // Force layout recalculation
        paragraph.offsetHeight;
        
        // Get computed styles
        const styles = getComputedStyle(paragraph);
        const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;
        const fontSize = parseFloat(styles.fontSize);
        
        // Calculate target height for 2 lines with some tolerance
        const targetHeight = lineHeight * 2;
        
        // Check if current content fits in 2 lines
        const currentHeight = paragraph.scrollHeight;
        
        if (currentHeight <= targetHeight + 5) { // 5px tolerance
            paragraph.dataset.autoReadMoreProcessed = 'true';
            return; // Content already fits in 2 lines
        }
        
        // Create a testing container with exact same styling
        const testContainer = document.createElement('div');
        testContainer.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            visibility: hidden;
            width: ${paragraph.offsetWidth}px;
            font-family: ${styles.fontFamily};
            font-size: ${styles.fontSize};
            font-weight: ${styles.fontWeight};
            line-height: ${styles.lineHeight};
            letter-spacing: ${styles.letterSpacing};
            word-spacing: ${styles.wordSpacing};
            text-align: ${styles.textAlign};
            text-transform: ${styles.textTransform};
            padding: ${styles.padding};
            margin: 0;
            border: ${styles.border};
            box-sizing: ${styles.boxSizing};
            word-wrap: break-word;
            overflow-wrap: break-word;
        `;
        
        document.body.appendChild(testContainer);
        
        // Get plain text content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Binary search for optimal length
        let left = 0;
        let right = plainText.length;
        let bestFit = 0;
        let iterations = 0;
        const maxIterations = 50; // Prevent infinite loops
        
        while (left <= right && iterations < maxIterations) {
            iterations++;
            const mid = Math.floor((left + right) / 2);
            let testText = plainText.substring(0, mid);
            
            // Test with "...Read More" appended to see if it fits
            testContainer.innerHTML = testText + ' ...Read More';
            const testHeight = testContainer.scrollHeight;
            
            if (testHeight <= targetHeight + 5) {
                bestFit = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        // Clean up test container
        document.body.removeChild(testContainer);
        
        if (bestFit === 0) {
            paragraph.dataset.autoReadMoreProcessed = 'true';
            return; // Couldn't fit any text
        }
        
        // Get the text that fits
        let truncatedText = plainText.substring(0, bestFit);
        
        // Try to break at word boundary
        const words = truncatedText.split(' ');
        if (words.length > 1) {
            // Remove the last word if it seems cut off
            const lastWord = words[words.length - 1];
            const secondLastWord = words[words.length - 2] || '';
            
            // If last word is very short or seems incomplete, remove it
            if (lastWord.length < 3 || !lastWord.match(/[.!?]$/)) {
                words.pop();
                truncatedText = words.join(' ');
            }
        }
        
        // Clean up trailing punctuation and spaces
        truncatedText = truncatedText.replace(/[,;:\s]+$/, '').replace(/\.$/, '');
        
        // Create final content with Read More link
        const readMoreHtml = ` <a href="${linkUrl}" class="orange">...Read More</a>`;
        paragraph.innerHTML = truncatedText + readMoreHtml;
        
        // Mark as processed
        paragraph.dataset.autoReadMoreProcessed = 'true';
    });
}

// Function to reset and re-process all paragraphs
function resetAndReprocess() {
    const processedParagraphs = document.querySelectorAll('[data-auto-read-more-processed]');
    processedParagraphs.forEach(p => {
        delete p.dataset.autoReadMoreProcessed;
    });
    
    // Small delay to ensure layout is stable
    setTimeout(() => {
        initializeAutoReadMore();
    }, 50);
}

// Debounced resize handler
let resizeTimer;
function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resetAndReprocess();
    }, 150);
}

// Initialize when DOM is ready
function initialize() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeAutoReadMore, 100);
        });
    } else {
        setTimeout(initializeAutoReadMore, 100);
    }
}

// Handle window resize
window.addEventListener('resize', handleResize);

// Handle orientation change for mobile devices
window.addEventListener('orientationchange', () => {
    setTimeout(resetAndReprocess, 300);
});

// Initialize
initialize();

// Expose global functions for manual control
window.refreshReadMore = function() {
    resetAndReprocess();
};

window.initAutoReadMore = function() {
    setTimeout(initializeAutoReadMore, 100);
};

// Auto-refresh when images load (in case they affect layout)
window.addEventListener('load', () => {
    setTimeout(resetAndReprocess, 200);
});

// Handle font loading completion
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        setTimeout(resetAndReprocess, 100);
    });
}