// Data
const lettersData = {
    1: {
        title: "When You First Receive This",
        date: "December 14, 2025",
        excerpt: "Hello baby! Happy Birthday! I hope you like your gift...",
        icon: '&#x1F381;', class: 'card-pink', style: '',
        body: `Hello my love! Happy Birthday!\n\nI hope you like your gift. It's not that good but I put all my heart into picking it out for you.\n\nForever and always,\nYour Nicole.`
    },
    2: {
        title: "On a Rainy Day",
        date: "November 5, 2025",
        excerpt: "It's a cozy day today, and I hope you're snuggled up...",
        icon: '&#x2601;&#xfe0f;', class: '', style: 'color: #4682b4; background-color: #e6f0fa;',
        body: `It's a cozy day today. Do you remember that time we got soaked? Go make some tea and relax.`
    },
    3: {
        title: "When You Need Motivation",
        date: "October 20, 2025",
        excerpt: "You are stronger than you think. This challenge is just a...",
        icon: '&#x2B50;', class: '', style: 'color: #daa520; background-color: #fcf8e3;',
        body: `You are stronger than you think. This challenge is just a stepping stone. I'm right here cheering you on.`
    }
};

// Elements
const startPage = document.getElementById('start-page');
const lettersPage = document.getElementById('letters-page');
const searchOverlay = document.getElementById('search-overlay');
const readingPage = document.getElementById('reading-page');
const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-to-letters');
const searchTrigger = document.getElementById('search-trigger');
const searchInput = document.getElementById('search-input-actual');
const cancelSearchButton = document.getElementById('cancel-search');
const searchResultsContainer = document.getElementById('search-results-container');
const themeToggle = document.getElementById('theme-toggle');

// Helper: Render Card
function renderCardHTML(id, data) {
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

// 1. Start -> Index
startButton.addEventListener('click', function() {
    this.style.transform = 'scale(0.9)';
    this.style.opacity = '0';
    setTimeout(() => {
        startPage.classList.add('hidden');
        lettersPage.classList.add('active');
    }, 300); 
});

// 2. Index -> Search Overlay
searchTrigger.addEventListener('click', function() {
    // Reveal element first, then animate
    searchOverlay.style.display = 'flex';
    // Small delay to allow browser to render 'flex' before adding 'active' class for transition
    setTimeout(() => {
        searchOverlay.classList.add('active');
        searchInput.focus();
        runSearch('');
    }, 10);
});

// 3. Close Search Overlay
cancelSearchButton.addEventListener('click', function() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchInput.blur();
    // Wait for animation to finish before hiding
    setTimeout(() => {
        searchOverlay.style.display = 'none';
    }, 500);
});

// 4. Click Card (Index or Search) -> Reading
function handleLetterClick(e) {
    let card = e.target.closest('.letter-card');
    if (!card) return;

    const id = card.getAttribute('data-id');
    const data = lettersData[id];

    document.getElementById('letter-title').textContent = data.title;
    document.getElementById('letter-date').textContent = data.date;
    document.getElementById('letter-body').textContent = data.body;

    // Transition
    lettersPage.classList.remove('active');
    
    // If coming from search, hide it properly
    if(searchOverlay.style.display !== 'none') {
        searchOverlay.classList.remove('active');
        setTimeout(() => { searchOverlay.style.display = 'none'; }, 500);
    }

    lettersPage.classList.add('slide-left');
    readingPage.classList.add('active');
    readingPage.classList.remove('slide-right');
}

lettersPage.addEventListener('click', handleLetterClick);
searchOverlay.addEventListener('click', handleLetterClick);

// 5. Reading -> Index
backButton.addEventListener('click', function() {
    lettersPage.classList.remove('slide-left');
    lettersPage.classList.add('active');
    readingPage.classList.remove('active');
    readingPage.classList.add('slide-right');
});

// Search Logic
function runSearch(term) {
    term = term.toLowerCase().trim();
    let resultsHTML = '';
    let matches = 0;

    for (const id in lettersData) {
        const data = lettersData[id];
        if ((data.title + ' ' + data.excerpt).toLowerCase().includes(term)) {
            resultsHTML += renderCardHTML(id, data);
            matches++;
        }
    }
    searchResultsContainer.innerHTML = matches > 0 ? resultsHTML : `<p class="search-tip">No matches found.</p>`;
    if(term === '' && matches > 0) searchResultsContainer.innerHTML = `<p class="search-tip">Type to search...</p>`;
}
searchInput.addEventListener('input', (e) => runSearch(e.target.value));

// Theme Logic
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
