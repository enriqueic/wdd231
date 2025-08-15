// Hamburger menu utility
export function setupHamburgerMenu(hamburgerId = "hamburger", navId = "main-nav") {
    const hamburger = document.getElementById(hamburgerId);
    const nav = document.getElementById(navId);

    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", !isExpanded);
            nav.classList.toggle("active");
        });
    }
}

// Footer date utility
export function setupFooterDate(yearId = "year", lastModId = "lastModified") {
    const yearSpan = document.getElementById(yearId);
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    const lastMod = document.getElementById(lastModId);
    if (lastMod) {
        lastMod.textContent = "Last Modified: " + document.lastModified;
    }
}

// Comments utility
export function setupComments(formId = 'comment-form', listId = 'comments-list') {
    const form = document.getElementById(formId);
    const commentsList = document.getElementById(listId);

    if (!form || !commentsList) return;

    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    renderComments();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('user').value.trim() || 'Anonymous';
        const comment = document.getElementById('comment').value.trim();
        if (!comment) return;

        const newComment = {
            user,
            comment,
            date: new Date().toLocaleString()
        };
        comments.unshift(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
        form.reset();
    });

    function renderComments() {
        commentsList.innerHTML = comments.map(c => `
            <div class="comment">
                <strong>${c.user}</strong> <span class="date">${c.date}</span>
                <p>${c.comment}</p>
            </div>
        `).join('');
    }
}


// DOM helpers
export const showElement = id => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.style.display = '';
};
export const hideElement = id => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.style.display = 'none';
};
export const renderList = (containerId, items, renderItem) => {
    const el = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (el) el.innerHTML = items.map(renderItem).join('');
};
export const setText = (id, text) => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.textContent = text;
};

// Spinner helpers
export const showSpinner = id => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.style.display = 'flex';
};
export const hideSpinner = id => {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.style.display = 'none';
};

// Storage helpers
export const getItem = (key, fallback = null) => {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
};
export const setItem = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const removeItem = key => localStorage.removeItem(key);
export const getFavorites = () => getItem('favorites', []);
export const setFavorites = favs => setItem('favorites', favs);
export const getProductHistory = () => getItem('productHistory', {});
export const setProductHistory = history => setItem('productHistory', history);

// API helpers
export const fetchJSON = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};
export const fetchWithCache = async (url, cacheKey, ttl = 300000) => {
    const now = Date.now();
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (now - timestamp < ttl) return data;
    }
    const data = await fetchJSON(url);
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: now }));
    return data;
};
