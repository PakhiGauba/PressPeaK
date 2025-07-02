window.addEventListener('DOMContentLoaded', () => {
    fetch('cta.html')
        .then(response => response.text())
        .then(data => {
            const ctaPlaceholder = document.getElementById('cta-placeholder');
            ctaPlaceholder.innerHTML = data;

            // Re-run scripts inside the loaded HTML (if any)
            const scripts = ctaPlaceholder.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            });
        })
        .catch(error => console.error('Error loading CTA section:', error));
});