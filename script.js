// --- DATA STORE (Simulated Letter Content) ---
const lettersData = {
    1: {
        body: `Hello my love! Happy Birthday! I hope you like your gift. It's not that good but I put all my heart into picking it out for you.
\nI remember last year's birthday, we were laughing about the cake disaster. It's these small, silly moments that I treasure the most. Please take a moment today to just relax and know how deeply you are loved.
\nThis letter is meant to be read only on the day you receive it, so put it away now and let's make some new memories!
\nForever and always,
Your Nicole.`,
    },
    2: {
        body: `It's a cozy day today, and I hope you're snuggled up somewhere warm. It's absolutely pouring outside right now—the perfect background music for a nap or a good movie.
\nDo you remember that time we got absolutely soaked walking home from the park? We thought we were going to catch a cold, but we just ended up laughing the whole way. That's what I think of when it rains now.
\nIf you're feeling down, just remember that the sun always comes out after the storm. Go make some tea, put on your comfiest socks, and let the rain wash away any worries.`,
    },
    3: {
        body: `You are stronger than you think. This challenge is just a stepping stone, not a wall. Read this when you are feeling the weight of the world on your shoulders.
\nI see how hard you work, and I know how much you care. Effort never goes unnoticed. I am incredibly proud of your persistence and your spirit.
\nTake a deep breath. Focus on the next small step. Not the summit, just the next step. I'm right here cheering you on. Go get 'em!`,
    }
};


// --- ELEMENT SELECTION ---
const startPage = document.getElementById('start-page');
const lettersPage = document.getElementById('letters-page');
const readingPage = document.getElementById('reading-page');
const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-to-letters');
const letterCards = document.querySelectorAll('.letter-card');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const searchInput = document.querySelector('.search-input');


// --- PAGE TRANSITION LOGIC ---

// A. Start Page -> Letters Page
startButton.addEventListener('click', function() {
    this.style.transform = 'scale(0.9)';
    this.style.opacity = '0';
    
    setTimeout(() => {
        startPage.classList.add('hidden');
        lettersPage.classList.add('active');
    }, 300); 
});

// B. Letters Page -> Reading Page (Forward)
letterCards.forEach(card => {
    card.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const date = this.getAttribute('data-date');
        const bodyText = lettersData[id].body;

        // 1. Inject content into the reading page
        document.getElementById('letter-title').textContent = title;
        document.getElementById('letter-date').textContent = date;
        document.getElementById('letter-body').textContent = bodyText;

        // 2. Animate the transition
        lettersPage.classList.remove('active'); 
        lettersPage.classList.remove('slide-right'); 
        lettersPage.classList.add('slide-left');
        readingPage.classList.add('active');
        readingPage.classList.remove('slide-right');
    });
});

// C. Reading Page -> Letters Page (Back)
backButton.addEventListener('click', function() {
    // 1. Animate the reverse transition
    lettersPage.classList.remove('slide-left');
    lettersPage.classList.add('active');
    readingPage.classList.remove('active');
    readingPage.classList.add('slide-right');
});


// --- SEARCH FUNCTION LOGIC ---

// Event listener for input changes in the search bar
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    letterCards.forEach(card => {
        const id = card.getAttribute('data-id');
        const title = card.getAttribute('data-title').toLowerCase();
        const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
        // Look up the full body content from the data store
        const fullBody = lettersData[id].body.toLowerCase(); 

        // Check if the search term exists in the title, excerpt, or full body content
        const matches = title.includes(searchTerm) || 
                        excerpt.includes(searchTerm) ||
                        fullBody.includes(searchTerm);

        // Toggle visibility based on the match result
        if (matches) {
            // Restore visibility: Must use 'flex' to match the CSS default
            card.style.display = 'flex'; 
        } else {
            // Hide the card
            card.style.display = 'none';
        }
    });
});


// --- DARK MODE LOGIC ---

// Load theme preference from local storage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '&#9790;'; // Moon Icon
} else {
    themeToggle.innerHTML = '&#9728;'; // Sun Icon
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update local storage and icon
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '&#9790;'; // Moon Icon
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '&#9728;'; // Sun Icon
    }
});
                            
