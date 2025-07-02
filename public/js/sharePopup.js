// const currentShareUrl = window.location.href;
// const currentShareTitle = document.title;

// function showSharePopup() {
//   const overlay = document.getElementById("shareOverlay");
//   const input = document.getElementById("shareUrlInput");

//   if (overlay) overlay.style.display = "flex";
//   if (input) input.value = currentShareUrl;

//   if (overlay) {
//     overlay.onclick = function (e) {
//       if (e.target === overlay) closeSharePopup();
//     };
//   }
// }

// function closeSharePopup() {
//   const overlay = document.getElementById("shareOverlay");
//   if (overlay) overlay.style.display = "none";
// }

// function copyShareLink() {
//   const input = document.getElementById("shareUrlInput");
//   const copyButton = document.querySelector(".copy-button");

//   if (input && copyButton) {
//     input.select();
//     document.execCommand("copy");

//     const originalText = copyButton.textContent;
//     copyButton.textContent = "Copied!";

//     setTimeout(() => {
//       copyButton.textContent = originalText;
//     }, 2000);
//   }
// }

// function shareFacebook() {
//   window.open(
//     `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`,
//     "_blank"
//   );
// }

// function shareTwitter() {
//   window.open(
//     `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentShareTitle)}&url=${encodeURIComponent(currentShareUrl)}`,
//     "_blank"
//   );
// }

// function shareLinkedIn() {
//   window.open(
//     `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`,
//     "_blank"
//   );
// }

// function shareWhatsapp() {
//   window.open(
//     `https://api.whatsapp.com/send?text=${encodeURIComponent(currentShareTitle + " " + currentShareUrl)}`,
//     "_blank"
//   );
// }

// function shareInstagram() {
//   // Instagram doesn't have direct URL sharing, so we copy the link
//   copyShareLink();
//   alert('Link copied! You can now paste it in your Instagram post or story.');
// }

// function shareTelegram() {
//   window.open(
//     `https://telegram.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`,
//     "_blank"
//   );
// }


// Global variables to store share data
let currentShareUrl = window.location.href;
let currentShareTitle = document.title;

// Function to set custom share data for specific articles
function setShareData(url, title) {
    currentShareUrl = url;
    currentShareTitle = title;
}

// Function to show share popup with updated data
function showSharePopup(customUrl = null, customTitle = null) {
    // Update share data if custom values are provided
    if (customUrl) currentShareUrl = customUrl;
    if (customTitle) currentShareTitle = customTitle;
    
    const overlay = document.getElementById("shareOverlay");
    const input = document.getElementById("shareUrlInput");
    
    if (overlay) overlay.style.display = "flex";
    if (input) input.value = currentShareUrl;
    
    if (overlay) {
        overlay.onclick = function(e) {
            if (e.target === overlay) closeSharePopup();
        }
    }
}

function closeSharePopup() {
    const overlay = document.getElementById("shareOverlay");
    if (overlay) overlay.style.display = "none";
}

function copyShareLink() {
    const input = document.getElementById("shareUrlInput");
    const copyButton = document.querySelector(".copy-button");
    
    if (input && copyButton) {
        input.select();
        input.setSelectionRange(0, 99999); // For mobile devices
        
        // Try modern clipboard API first, fallback to execCommand
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(input.value).then(() => {
                showCopyFeedback(copyButton);
            }).catch(() => {
                // Fallback to execCommand
                document.execCommand("copy");
                showCopyFeedback(copyButton);
            });
        } else {
            // Fallback for older browsers
            document.execCommand("copy");
            showCopyFeedback(copyButton);
        }
    }
}

function showCopyFeedback(copyButton) {
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied!";
    copyButton.style.backgroundColor = "#28a745";
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.backgroundColor = "";
    }, 2000);
}

function shareFacebook() {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes");
}

function shareTwitter() {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentShareTitle)}&url=${encodeURIComponent(currentShareUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes");
}

function shareLinkedIn() {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=500,scrollbars=yes,resizable=yes");
}

function shareWhatsapp() {
    const text = `${currentShareTitle} ${currentShareUrl}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
}

function shareInstagram() {
    copyShareLink();
    alert(`Link copied to clipboard!\n\nURL: ${currentShareUrl}\n\nYou can now paste this link in your Instagram post, story, or bio.`);
}

function shareTelegram() {
    const shareUrl = `https://telegram.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`;
    window.open(shareUrl, "_blank", "width=600,height=400,scrollbars=yes,resizable=yes");
}

// Utility function to get article data from DOM elements
function getArticleShareData(articleElement) {
    let url = currentShareUrl;
    let title = currentShareTitle;
    
    // Try to get URL from data attributes first
    if (articleElement.dataset.shareUrl) {
        url = articleElement.dataset.shareUrl;
    } else {
        // Look for links in the article - prioritize title links
        const titleLink = articleElement.querySelector('.axil-post-title a[href], h1 a[href], h2 a[href], h3 a[href], h4 a[href]');
        if (titleLink && titleLink.href && !titleLink.href.includes('#')) {
            url = titleLink.href;
        } else {
            // Fallback to any link in the article
            const anyLink = articleElement.querySelector('a[href]:not([href="#"]):not([href*="javascript"]):not([onclick])');
            if (anyLink && anyLink.href) {
                url = anyLink.href;
            }
        }
    }
    
    // Try to get title from data attributes or heading elements
    if (articleElement.dataset.shareTitle) {
        title = articleElement.dataset.shareTitle;
    } else {
        // Look for title in various elements
        const titleElement = articleElement.querySelector('.axil-post-title, .axil-post-title a, h1, h2, h3, h4, .title, .headline');
        if (titleElement) {
            title = titleElement.textContent.trim();
        }
    }
    
    return { url, title };
}

// Function to handle article-specific sharing
function shareArticle(articleElement) {
    const { url, title } = getArticleShareData(articleElement);
    showSharePopup(url, title);
}

// Event delegation for dynamic article share buttons
document.addEventListener('click', function(e) {
    // Check if the clicked element is a share button or inside a share button
    if (e.target.matches('.share-button, .share-button *, [onclick*="showSharePopup"], [onclick*="showSharePopup"] *')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Find the closest share button element
        const shareButton = e.target.closest('a[onclick*="showSharePopup"], .share-button') || e.target;
        
        // Find the article container
        const articleElement = shareButton.closest('.post-block, .media, article, .article, .post, .blog-post');
        
        if (articleElement) {
            shareArticle(articleElement);
        } else {
            showSharePopup();
        }
    }
});

// Initialize with current page data
document.addEventListener('DOMContentLoaded', function() {
    currentShareUrl = window.location.href;
    currentShareTitle = document.title;
});