/* --- DATA STORE --- */
const letters = [
    {
        id: 1,
        title: "When You First Receive This",
        icon: "🎁",
        content: "Hello baby! Happy Birthday! I hope you like this digital gift. It's not much, but I built it from scratch just for you. Every pixel here represents how much I care about you. \n\nI wanted you to have a safe place to keep these memories."
    },
    {
        id: 2,
        title: "For When You Feel Sad",
        icon: "🌧️",
        content: "If you are reading this, it means the world feels a bit heavy today. Remember that storms don't last forever. \n\nI am always here for you, holding your hand through the rain. Take a deep breath, close your eyes, and know that you are loved unconditionally."
    },
    {
        id: 3,
        title: "Our First Anniversary",
        icon: "🥂",
        content: "Can you believe it's been a year? Time flies when I'm with you. \n\nI remember the first time we met, I was so nervous. Now, you are my home. Thank you for the best year of my life. Here is to many, many more."
    },
    {
        id: 4,
        title: "Why I Love You",
        icon: "❤️",
        content: "I love the way you laugh. I love how you care for others. I love your determination. \n\nBut mostly, I love you simply because you are you. You don't have to change a thing."
    },
    {
        id: 5,
        title: "A Random Tuesday",
        icon: "☕",
        content: "Just a quick note to say I hope you're having a great day at work/school. Drink some water, stretch, and don't stress too much! \n\nCan't wait to see you later."
    },
    {
        id: 6,
        title: "Midnight Thoughts",
        icon: "🌙",
        content: "It is late, and I can't sleep because I'm thinking about our future. I see us traveling, building a home, and growing old together. \n\nYou are my dream come true."
    }
];

/* --- APP LOGIC --- */
const app = {
    state: {
        isDark: false,
        query: ''
    },
    
    elements: {
        landing: document.getElementById('landing-page'),
        main: document.getElementById('main-app'),
        list: document.getElementById('letters-list'),
        reader: document.getElementById('reader-view'),
        rTitle: document.getElementById('r-title'),
        rBody: document.getElementById('r-body'),
        rIcon: document.getElementById('r-icon'),
        themeIcon: document.getElementById('theme-icon'),
        noResults: document.getElementById('no-results')
    },

    init() {
        // Load Theme from LocalStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.setTheme(true);
        }
        
        // Initial Render
        this.renderList(letters);
    },

    start() {
        this.elements.landing.style.opacity = '0';
        this.elements.landing.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            this.elements.landing.classList.add('hidden');
            this.elements.main.classList.remove('hidden');
            // Trigger reflow/animation
            this.elements.main.style.opacity = 0;
            requestAnimationFrame(() => {
                this.elements.main.style.transition = 'opacity 0.5s';
                this.elements.main.style.opacity = 1;
            });
        }, 500);
    },

    toggleTheme() {
        const newMode = !this.state.isDark;
        this.setTheme(newMode);
    },

    setTheme(isDark) {
        this.state.isDark = isDark;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        this.elements.themeIcon.innerText = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    /* --- SEARCH ENGINE --- */
    handleSearch(query) {
        this.state.query = query.toLowerCase();
        
        if (this.state.query === '') {
            this.renderList(letters);
            return;
        }

        const filtered = letters.filter(letter => {
            return letter.title.toLowerCase().includes(this.state.query) || 
                   letter.content.toLowerCase().includes(this.state.query);
        });

        this.renderList(filtered, this.state.query);
    },

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    },

    renderList(data, query = null) {
        this.elements.list.innerHTML = '';

        if (data.length === 0) {
            this.elements.noResults.classList.remove('hidden');
        } else {
            this.elements.noResults.classList.add('hidden');
            
            data.forEach(letter => {
                const card = document.createElement('div');
                card.className = 'letter-card';
                card.onclick = () => this.openReader(letter);

                // Highlight logic for Preview
                const titleHtml = query ? this.highlightText(letter.title, query) : letter.title;
                const previewText = letter.content.substring(0, 100) + '...';
                const previewHtml = query ? this.highlightText(previewText, query) : previewText;

                card.innerHTML = `
                    <span class="letter-icon">${letter.icon}</span>
                    <div class="letter-title">${titleHtml}</div>
                    <div class="letter-preview">${previewHtml}</div>
                `;
                this.elements.list.appendChild(card);
            });
        }
    },

    /* --- READER LOGIC --- */
    openReader(letter) {
        this.elements.rIcon.innerText = letter.icon;
        this.elements.rTitle.innerText = letter.title;
        this.elements.rBody.innerText = letter.content;
        
        this.elements.reader.classList.add('active');
    },

    closeReader() {
        this.elements.reader.classList.remove('active');
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => app.init());
                
