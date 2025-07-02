const articles = [
    {url: 'ai-for-creative-industries.html', heading: 'What Does AI Mean For Creative Industries?', image: 'public/images/article/ai-for-creative-industries.webp'},
    {url: 'balancing-acts.html', heading: 'Balancing Acts: A Nigerian Entrepreneur\'s Journey Through Beauty, Service And Business.', image: 'public/images/article/balancing-act1.webp'},
    {url: 'future-of-nigeria-business.html', heading: 'The Future Of Nigeria Business: Adaptive Sales Strategies For The Food Industry.', image: 'public/images/article/future-of-nigeria-business1.webp'},
    {url: 'incels-signs-and-dog-whistles.html', heading: 'Incels, Sigma And Dogwhistles: A Look Into How Right-Wing Fringe Culture Has Mixed with Mainstream Media', image: 'public/images/article/incels-signs-and-dog-whistles1.webp'},
    {url: 'producing-in-zed.html', heading: 'Erick The Artistic Polymath', image: 'public/images/article/producing-in-zed1.webp'},
    {url: 'rediscovering-your-queer-self.html', heading: 'On Rediscovering Your Queer Self After Graduating From University', image: 'public/images/article/riot.webp'},
    {url: 'sinners.html', heading: 'Is Ryan Coogler\'s Sinners The Catalyst For A New Era Of Hollywood?', image: 'public/images/article/sinners2.webp'},
    {url: 'the-next-frontier-in-fintech.html', heading: 'The Next Frontier In Fintech: How AI Can Unlock Financial Empowerment For Neurodiverse Investors', image: 'public/images/article/frontier1.webp'},
    {url: 'the-politics-of-performance.html', heading: 'The Politics Of Performance', image: 'public/images/article/the-politics-of-performance1.webp'},
    {url: 'the-test-of-legacy-parties.html', heading: 'The Test Of The \'Legacy\' Parties: The Reform UK Electoral Threat.', image: 'public/images/article/the-test-of-legacy-parties1.webp'},
    {url: 'todays-hip-hop-music.html', heading: 'Today\'s Hip Hop Music', image: 'public/images/article/todays-hip-hop-music1.webp'},
    {url: 'unspoken-heroes-of-the-battlefield.html', heading: 'Unspoken Heroes Of The Battlefield: The Refugees Displaced During Wars', image: 'public/images/article/unspoken-heros1.webp'},
    {url: 'warfare-goes-viral.html', heading: 'Warfare Goes Viral: Social Media\'s Growing Role In Conflict And Youth Identity', image: 'public/images/article/warfare-goes-viral1.webp'},
    {url: 'womens-football.html', heading: 'Women\'s Football: An Interview With Vera Cohen', image: 'public/images/article/womens-football2.webp'}
];

function getRandomArticles(excludeUrl = null, count = 2) {
    let availableArticles = articles;
    if (excludeUrl) {
        availableArticles = articles.filter(article => article.url !== excludeUrl);
    }
    
    if (availableArticles.length < count) {
        return availableArticles;
    }
    
    const selectedArticles = [];
    const availableCopy = [...availableArticles];
    
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableCopy.length);
        selectedArticles.push(availableCopy[randomIndex]);
        availableCopy.splice(randomIndex, 1);
    }
    
    return selectedArticles;
}

function populateRelatedArticles(excludeCurrentArticle = null) {
    const randomArticles = getRandomArticles(excludeCurrentArticle, 2);
    const postNavElements = document.querySelectorAll('.post-navigation');
    
    if (postNavElements.length >= 2 && randomArticles.length >= 2) {
        // First navigation element
        const firstNav = postNavElements[0];
        const firstNavContent = firstNav.querySelector('.post-nav-content');
        const firstLink = firstNav.querySelector('.prev-post');
        const firstHeading = firstNav.querySelector('h3 a');
        
        if (firstNavContent && firstLink && firstHeading) {
            // Add CSS class and set background image
            firstNavContent.classList.add('article-nav-card');
            firstNavContent.style.backgroundImage = `url('${randomArticles[0].image}')`;
            
            // Set content
            firstLink.href = randomArticles[0].url;
            firstHeading.href = randomArticles[0].url;
            firstHeading.textContent = randomArticles[0].heading;
            firstHeading.classList.add('article-nav-heading');
        }
        
        // Second navigation element
        const secondNav = postNavElements[1];
        const secondNavContent = secondNav.querySelector('.post-nav-content');
        const secondLink = secondNav.querySelector('.next-post');
        const secondHeading = secondNav.querySelector('h3 a');
        
        if (secondNavContent && secondLink && secondHeading) {
            // Add CSS class and set background image
            secondNavContent.classList.add('article-nav-card');
            secondNavContent.style.backgroundImage = `url('${randomArticles[1].image}')`;
            
            // Set content
            secondLink.href = randomArticles[1].url;
            secondHeading.href = randomArticles[1].url;
            secondHeading.textContent = randomArticles[1].heading;
            secondHeading.classList.add('article-nav-heading');
        }
    }
}

function getCurrentPageFilename() {
    return window.location.pathname.split('/').pop();
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentPageFilename();
    populateRelatedArticles(currentPage);
});

function refreshRecommendations() {
    const currentPage = getCurrentPageFilename();
    populateRelatedArticles(currentPage);
}
