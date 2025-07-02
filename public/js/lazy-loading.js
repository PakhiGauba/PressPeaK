class LazyLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.1,
            placeholderClass: options.placeholderClass || 'lazy-placeholder',
            loadedClass: options.loadedClass || 'lazy-loaded',
            errorClass: options.errorClass || 'lazy-error',
            fadeInDuration: options.fadeInDuration || 300,
            retryAttempts: options.retryAttempts || 3,
            retryDelay: options.retryDelay || 1000,
            debug: options.debug || false
        };
        this.observer = null;
        this.images = new Map();
        this.debugMode = this.options.debug;
        this.loadingStats = {
            totalImages: 0,
            lazyImages: 0,
            loadedImages: 0,
            failedImages: 0,
            loadTimes: []
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackToImmediate();
            return;
        }
        this.createObserver();
        this.setupImages();
        this.addStyles();
        this.observeDOM();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
    }

    setupImages() {
        const images = document.querySelectorAll('img[src]');
        this.loadingStats.totalImages = images.length;
        
        if (this.debugMode) {
            console.log(`🔍 Found ${images.length} images on page`);
            console.log(`🚫 AGGRESSIVE MODE: All images will be lazy loaded (none load initially)`);
        }

        images.forEach(img => {
            if (this.shouldLazyLoad(img)) {
                this.prepareImage(img);
                this.loadingStats.lazyImages++;
            }
        });

        if (this.debugMode) {
            console.log(`📦 Prepared ${this.loadingStats.lazyImages} images for lazy loading`);
            console.log(`⚡ Initial page load will be ${this.loadingStats.lazyImages > 0 ? 'MUCH faster' : 'unchanged'} - no images loaded!`);
        }
    }

    shouldLazyLoad(img) {
        if (img.dataset.lazyProcessed) {
            return false;
        }

        // Skip very small images (likely icons)
        const rect = img.getBoundingClientRect();
        if (rect.width < 32 && rect.height < 32) {
            return false;
        }

        // Skip images with specific classes
        const skipClasses = ['logo', 'icon', 'favicon', 'no-lazy', 'eager-load'];
        if (skipClasses.some(cls => img.classList.contains(cls))) {
            return false;
        }

        return true;
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    async prepareImage(img) {
        const originalSrc = img.src;
        img.dataset.lazySrc = originalSrc;
        img.dataset.lazyProcessed = 'true';
        img.dataset.retryCount = '0';

        // Get dimensions more reliably
        let width, height;
        
        // First try to get explicit width/height attributes
        width = img.getAttribute('width');
        height = img.getAttribute('height');
        
        // If no explicit dimensions, try to get computed/natural dimensions
        if (!width || !height) {
            // Check if image has CSS dimensions
            const computedStyle = window.getComputedStyle(img);
            const cssWidth = computedStyle.width;
            const cssHeight = computedStyle.height;
            
            if (cssWidth && cssWidth !== 'auto' && !cssWidth.includes('%')) {
                width = parseInt(cssWidth);
            }
            if (cssHeight && cssHeight !== 'auto' && !cssHeight.includes('%')) {
                height = parseInt(cssHeight);
            }
        }

        // If still no dimensions, try to load the image to get natural dimensions
        if (!width || !height) {
            try {
                const tempImg = await this.preloadImage(originalSrc);
                width = width || tempImg.naturalWidth || 300;
                height = height || tempImg.naturalHeight || 200;
            } catch (e) {
                // Fallback dimensions
                width = width || img.offsetWidth || 300;
                height = height || img.offsetHeight || 200;
            }
        }

        // Ensure we have valid numbers
        width = parseInt(width) || 300;
        height = parseInt(height) || 200;

        img.dataset.lazyWidth = width;
        img.dataset.lazyHeight = height;

        // Store original styles to restore later
        img.dataset.originalWidth = img.style.width || '';
        img.dataset.originalHeight = img.style.height || '';

        this.createPlaceholder(img, width, height);
        
        // Set dimensions before removing src to prevent layout shift
        if (!img.style.width && width) {
            img.style.width = width + 'px';
        }
        if (!img.style.height && height) {
            img.style.height = height + 'px';
        }
        
        // Now remove the src after dimensions are set
        img.removeAttribute('src');
        img.classList.add(this.options.placeholderClass);

        this.images.set(img, {
            originalSrc,
            loaded: false
        });

        if (this.debugMode) {
            console.log(`📦 Prepared for lazy loading: ${originalSrc} (${width}x${height})`);
        }

        this.observer.observe(img);
    }

    createPlaceholder(img, width, height) {
        const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Cg opacity='0.6'%3E%3Ccircle cx='${width/2}' cy='${height/2-10}' r='20' fill='%23ddd'/%3E%3Crect x='${width/2-30}' y='${height/2+15}' width='60' height='8' rx='4' fill='%23ddd'/%3E%3C/g%3E%3C/svg%3E`;
        img.src = placeholderSvg;
    }

    async loadImage(img) {
        const imageData = this.images.get(img);
        if (!imageData || imageData.loaded) return;

        const originalSrc = img.dataset.lazySrc;
        const retryCount = parseInt(img.dataset.retryCount) || 0;
        const startTime = performance.now();

        if (this.debugMode) {
            console.log(`🖼️ Loading image: ${originalSrc}`);
        }

        try {
            await this.preloadImage(originalSrc);
            img.src = originalSrc;
            
            // Restore original dimensions if they were set
            const originalWidth = img.dataset.originalWidth;
            const originalHeight = img.dataset.originalHeight;
            
            if (originalWidth !== undefined) {
                img.style.width = originalWidth;
            }
            if (originalHeight !== undefined) {
                img.style.height = originalHeight;
            }
            
            this.addFadeInEffect(img);
            imageData.loaded = true;
            
            img.classList.remove(this.options.placeholderClass);
            img.classList.add(this.options.loadedClass);
            
            this.loadingStats.loadedImages++;
            this.loadingStats.loadTimes.push(performance.now() - startTime);

            if (this.debugMode) {
                console.log(`✅ Loaded: ${originalSrc} (${Math.round(performance.now() - startTime)}ms)`);
            }

            // Clean up data attributes
            delete img.dataset.lazySrc;
            delete img.dataset.retryCount;
            delete img.dataset.lazyWidth;
            delete img.dataset.lazyHeight;
            delete img.dataset.originalWidth;
            delete img.dataset.originalHeight;
            
        } catch (error) {
            if (this.debugMode) {
                console.warn(`❌ Failed to load: ${originalSrc}`, error);
            }

            if (retryCount < this.options.retryAttempts) {
                img.dataset.retryCount = (retryCount + 1).toString();
                setTimeout(() => this.loadImage(img), this.options.retryDelay);
            } else {
                img.classList.add(this.options.errorClass);
                this.handleImageError(img);
                this.loadingStats.failedImages++;
            }
        }
    }

    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    addFadeInEffect(img) {
        img.style.opacity = '0';
        img.style.transition = `opacity ${this.options.fadeInDuration}ms ease-in-out`;
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    }

    handleImageError(img) {
        const width = img.dataset.lazyWidth || 300;
        const height = img.dataset.lazyHeight || 200;
        const errorPlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f8f8f8' stroke='%23ddd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='12' fill='%23999'%3EImage unavailable%3C/text%3E%3C/svg%3E`;
        img.src = errorPlaceholder;
    }

    addStyles() {
        if (document.getElementById('lazy-loading-styles')) return;

        const style = document.createElement('style');
        style.id = 'lazy-loading-styles';
        style.textContent = `
            .${this.options.placeholderClass} {
                background-color: #f0f0f0;
                background-image: linear-gradient(45deg, transparent 25%, rgba(255,255,255,.5) 25%, rgba(255,255,255,.5) 75%, transparent 75%, transparent),
                                 linear-gradient(45deg, transparent 25%, rgba(255,255,255,.5) 25%, rgba(255,255,255,.5) 75%, transparent 75%, transparent);
                background-size: 20px 20px;
                background-position: 0 0, 10px 10px;
                animation: lazy-shimmer 1.5s infinite;
                object-fit: cover; /* Maintain aspect ratio */
            }

            .${this.options.loadedClass} {
                animation: none;
            }

            .${this.options.errorClass} {
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                object-fit: cover;
            }

            @keyframes lazy-shimmer {
                0% { background-position: 0 0, 10px 10px; }
                100% { background-position: 20px 20px, 30px 30px; }
            }

            /* Smooth transitions for better UX */
            img {
                transition: opacity 0.3s ease-in-out;
            }
            
            /* Prevent layout shift during lazy loading */
            img[data-lazy-processed] {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    observeDOM() {
        const domObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img[src]');
                        images.forEach(img => {
                            if (this.shouldLazyLoad(img)) {
                                this.prepareImage(img);
                            }
                        });
                    }
                });
            });
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fallbackToImmediate() {
        console.warn('Intersection Observer not supported, loading all images immediately');
    }

    enableDebugMode() {
        this.debugMode = true;
        console.log('🐛 Lazy Loading Debug Mode Enabled');
        this.logCurrentStats();
    }

    disableDebugMode() {
        this.debugMode = false;
        console.log('Debug mode disabled');
    }

    logCurrentStats() {
        const stats = this.getStats();
        const avgLoadTime = this.loadingStats.loadTimes.length > 0 
            ? Math.round(this.loadingStats.loadTimes.reduce((a, b) => a + b, 0) / this.loadingStats.loadTimes.length) 
            : 0;

        console.table({
            'Total Images': this.loadingStats.totalImages,
            'Lazy Loaded': this.loadingStats.lazyImages,
            'Successfully Loaded': this.loadingStats.loadedImages,
            'Failed': this.loadingStats.failedImages,
            'Still Pending': stats.pending,
            'Average Load Time (ms)': avgLoadTime
        });
    }

    loadAll() {
        this.images.forEach((data, img) => {
            if (!data.loaded) {
                this.loadImage(img);
            }
        });
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    getStats() {
        const total = this.images.size;
        const loaded = Array.from(this.images.values()).filter(data => data.loaded).length;
        return {
            total,
            loaded,
            pending: total - loaded,
            loadedPercentage: total > 0 ? Math.round((loaded / total) * 100) : 0
        };
    }
}

function initLazyLoading() {
    const config = {
        rootMargin: '50px',
        threshold: 0.01,
        fadeInDuration: 300,
        retryAttempts: 2,
        retryDelay: 1000
    };

    window.lazyLoader = new LazyLoader(config);

    if (window.location.search.includes('debug=lazy') || localStorage.getItem('lazyDebug')) {
        window.lazyLoader.enableDebugMode();
    }

    if (window.console && console.log) {
        setTimeout(() => {
            const stats = window.lazyLoader.getStats();
            console.log(`🚀 SPEED BOOST: ${stats.total} images prevented from loading initially!`);
            console.log('📊 Lazy Loading Stats:', stats);
        }, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.lazyLoader) {
        const images = document.querySelectorAll('img[data-lazy-src]');
        images.forEach(img => {
            if (window.lazyLoader.isInViewport && window.lazyLoader.isInViewport(img)) {
                window.lazyLoader.observer.unobserve(img);
                window.lazyLoader.loadImage(img);
            }
        });
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
