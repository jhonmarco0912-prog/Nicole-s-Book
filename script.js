const letters = [
    { id: 1, title: "Open When It's Your Birthday", icon: "🎂", content: "Happy Birthday my love!\n\nI built this digital book because paper fades, but code (and my love) lasts forever. I hope today brings you as much joy as you bring into my life every single day." },
    { id: 2, title: "Open When You Feel Alone", icon: "🌧️", content: "You are never truly alone. Close your eyes and feel my hand in yours. I am cheering for you, always. This heavy feeling will pass, just like the rain." },
    { id: 3, title: "Our First Date Memory", icon: "🥂", content: "Do you remember how nervous I was? I couldn't stop smiling. That night changed my life. Thank you for taking a chance on me." },
    { id: 4, title: "Why You Are Beautiful", icon: "✨", content: "It's not just your face (though that is perfect). It's your mind, your kindness, and the way you try your best even when things are hard. You are art." },
    { id: 5, title: "A Promise to You", icon: "💍", content: "I promise to listen. I promise to support your dreams. I promise to love you, even when we are old and gray. You are my forever." },
    { id: 6, title: "Just Because", icon: "💌", content: "I don't need a reason to tell you I love you. So... I love you. Very much. Go drink some water and smile for me!" },
    { id: 7, title: "Late Night Thoughts", icon: "🌙", content: "The world is quiet, but my mind is loud with thoughts of you. I can't wait to build our future together." }
];

const app = {
    isDark: false,
    
    init() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') this.toggleTheme(true);
        this.renderList(letters);
    },

    start() {
        const landing = document.getElementById('landing-page');
        const main = document.getElementById('main-app');
        
        landing.classList.add('fade-out');
        setTimeout(() => {
            landing.classList.add('hidden');
            main.classList.remove('hidden');
            this.animateList();
        }, 500);
    },

    toggleTheme(forceDark = null) {
        this.isDark = forceDark !== null ? forceDark : !this.isDark;
        document.body.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        document.getElementById('theme-icon').innerText = this.isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },

    handleSearch(query) {
        const q = query.toLowerCase();
        const filtered = letters.filter(l => 
            l.title.toLowerCase().includes(q) || l.content.toLowerCase().includes(q)
        );
        this.renderList(filtered, q);
    },

    renderList(data, query = "") {
        const container = document.getElementById('letters-list');
        const noRes = document.getElementById('no-results');
        container.innerHTML = '';

        if (data.length === 0) {
            noRes.classList.remove('hidden');
            return;
        }
        noRes.classList.add('hidden');

        data.forEach((l, index) => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.animationDelay = `${index * 0.05}s`; // Stagger effect
            div.onclick = () => this.openReader(l);
            
            // Highlighting
            const hl = (text) => query ? text.replace(new RegExp(`(${query})`, 'gi'), '<span class="highlight">$1</span>') : text;

            div.innerHTML = `
                <div class="card-icon">${l.icon}</div>
                <div class="card-text">
                    <div class="card-title">${hl(l.title)}</div>
                    <div class="card-preview">${hl(l.content)}</div>
                </div>
            `;
            container.appendChild(div);
        });
        
        // Re-trigger animation if searching
        if(query) this.animateList();
    },

    animateList() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight; /* trigger reflow */
            card.style.animation = 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        });
    },

    openReader(letter) {
        document.getElementById('r-icon').innerText = letter.icon;
        document.getElementById('r-title').innerText = letter.title;
        document.getElementById('r-body').innerText = letter.content;
        document.getElementById('reader-view').classList.add('active');
    },

    closeReader() {
        document.getElementById('reader-view').classList.remove('active');
    }
};

window.onload = () => app.init();
