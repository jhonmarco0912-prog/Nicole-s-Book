// --- DATA STORE (Simulated Letter Content) ---
const lettersData = {
    1: {
        title: "When You First Receive This",
        date: "December 14, 2025",
        excerpt: "Hello baby! Happy Birthday! I hope you like your gift. It's not that good but I ...",
        icon: '&#x1F381;',
        class: 'card-pink',
        style: '',
        body: `Hello my love! Happy Birthday! I hope you like your gift. It's not that good but I put all my heart into picking it out for you.
\nI remember last year's birthday, we were laughing about the cake disaster. It's these small, silly moments that I treasure the most. Please take a moment today to just relax and know how deeply you are loved.
\nThis letter is meant to be read only on the day you receive it, so put it away now and let's make some new memories!
\nForever and always,
Your Nicole.`,
    },
    2: {
        title: "On a Rainy Day",
        date: "November 5, 2025",
        excerpt: "It's a cozy day today, and I hope you're snuggled up somewhere warm. Remember that time we...",
        icon: '&#x2601;&#xfe0f;',
        class: '',
        style: 'color: #4682b4; background-color: #e6f0fa;',
        body: `It's a cozy day today, and I hope you're snuggled up somewhere warm. It's absolutely pouring outside right now—the perfect background music for a nap or a good movie.
\nDo you remember that time we got absolutely soaked walking home from the park? We thought we were going to catch a cold, but we just ended up laughing the whole way. That's what I think of when it rains now.
\nIf you're feeling down, just remember that the sun always comes out after the storm. Go make some tea, put on your comfiest socks, and let the rain wash away any worries.`,
    },
    3: {
        title: "When You Need Motivation",
        date: "October 20, 2025",
        excerpt: "You are stronger than you think. This challenge is just a stepping stone. Read this when...",
        icon: '&#x2B50;',
        class: '',
        style: 'color: #daa520; background-color: #fcf8e3;',
        body: `You are stronger than you think. This challenge is just a stepping stone, not a wall. Read this when you are feeling the weight of the world on your shoulders.
\nI see how hard you work, and I know how much you care. Effort never goes unnoticed. I am incredibly proud of your persistence and your spirit.
\nTake a deep breath. Focus on the next small step. Not the summit, just the next step. I'm right here cheering you on. Go get 'em!`,
    }
};


// --- ELEMENT SELECTION ---
const startPage = document.getElementById('start-page');
const lettersPage = document.getElementById('letters-page');
const searchOverlay = document.getElementById('search-overlay');
const readingPage = document.getElementById('reading-page');
const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-to-letters');
const letterCards = document.querySelectorAll('.letter-card');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Search elements
const searchTrigger = document.getElementById('search-trigger');
const searchInput = document.getElementById('search-input-actual');
const cancelSearchButton = document.getElementById('cancel-search');
const searchResultsContainer = document.getElementById('search-results-container');


// --- HELPER FUNCTION: Card Renderer (for Search Results) ---
function renderCardHTML(id, data) {
    // Generate the HTML for a letter card based on data
    return `
        <div class="letter-card ${data.class}" data-id="${id}" data-title="${data.title}" data-date="${data.date}">
            <div class="card-header">
                <i class="card-icon" style="${data.style};">${data.icon}</i>
                <div class="card-title-group">
                    <span class="card-number" style="${data.style.split(';')[0] ? `color: ${data.style.split(';')[0].split(': ')[1]}` : ''};">#${id}</span>
                    <div class="card-title">${data.title}</div>
                </div>
            </div>
            <div class="card-excerpt">${data.excerpt}</div>
        </div>
    `;
}

// --- PAGE TRANSITION LOGIC ---

// A. Start Page -> Letters Page
startButton.addEventListener('click', function() {
    this.style.transform = 'scale(0.9)';
    this.style.opacity = '0';
    setTimeout(() => {
        startPage.classList.add('hidden');
        lettersPage.classList.add('active');
        lettersPage.classList.remove('slide-right');
    }, 300); 
});

// B. Letters Index -> Search Overlay (Triggered by tapping the search bar)
searchTrigger.addEventListener('click', function() {
    searchOverlay.classList.add('active');
    setTimeout(() => {
        searchInput.focus();
        // Run initial search to show all letters (by searching for an empty string)
        runSearch(''); 
    }, 500); 
});

// C. Search Overlay -> Letters Index (Cancel Button)
cancelSearchButton.addEventListener('click', function() {
    searchOverlay.classList.remove('active');
    searchInput.value = ''; // Clear search input
    searchInput.blur(); // Remove focus
});


// D. Letter Card Click Handler (Must be delegated for dynamically added search results)
function handleLetterClick(e) {
    let card = e.target.closest('.letter-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    const title = card.getAttribute('data-title');
    const date = card.getAttribute('data-date');
    const bodyText = lettersData[id].body;

    // 1. Inject content
    document.getElementById('letter-title').textContent = title;
    document.getElementById('letter-date').textContent = date;
    document.getElementById('letter-body').textContent = bodyText;

    // 2. Animate the transition
    lettersPage.classList.remove('active');
    searchOverlay.classList.remove('active'); 
    
    // Animate transition (Index/Search -> Reading)
    lettersPage.classList.remove('active-from-right');
    lettersPage.classList.remove('slide-right');
    lettersPage.classList.add('slide-left');
    readingPage.classList.add('active');
    readingPage.classList.remove('slide-right');
}

// Attach click listener to both pages containing cards
lettersPage.addEventListener('click', handleLetterClick);
searchOverlay.addEventListener('click', handleLetterClick);


// E. Reading Page -> Letters Page (Back)
backButton.addEventListener('click', function() {
    lettersPage.classList.remove('slide-left');
    lettersPage.classList.add('active-from-right');
    readingPage.classList.remove('active');
    readingPage.classList.add('slide-right');
});


// --- SEARCH FUNCTION LOGIC ---

function runSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    let resultsHTML = '';
    let matchesFound = 0;

    // Iterate through the structured data store
    for (const id in lettersData) {
        const data = lettersData[id];
        
        // --- Search scope limited to Title and Excerpt (summary) ---
        const searchableText = `${data.title} ${data.excerpt}`.toLowerCase();
        
        if (searchableText.includes(term)) {
            resultsHTML += renderCardHTML(id, data);
            matchesFound++;
        }
    }
    
    // Display results or a message
    if (matchesFound > 0) {
        searchResultsContainer.innerHTML = resultsHTML;
    } else if (term.length > 0) {
        searchResultsContainer.innerHTML = `<p class="search-tip">No letters found matching titles or excerpts for "${searchTerm}".</p>`;
    } else {
        // Show initial hint text if the search term is empty
        searchResultsContainer.innerHTML = `<p class="search-tip">Start typing to search titles or content summaries.</p>`;
    }
}

// Event listener for input changes in the search bar (inside the overlay)
searchInput.addEventListener('input', function(e) {
    runSearch(e.target.value);
});


// --- DARK MODE LOGIC ---
const updateTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '&#9790;'; // Moon Icon
    } else {
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '&#9728;'; // Sun Icon
    }
};

updateTheme();

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    updateTheme();
});
        
