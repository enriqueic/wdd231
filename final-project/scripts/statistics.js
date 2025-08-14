const newsApiKey = '58e1953737d541fe9f8ce2c53f1c011e';
const newsUrl = `https://corsproxy.io/?https://newsapi.org/v2/everything?q=shrinkflation&sortBy=publishedAt&language=en&pageSize=5&apiKey=${newsApiKey}`;

async function fetchShrinkflationNews() {
    const newsArea = document.getElementById('news-area');
    try {
        const response = await fetch(newsUrl);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
            newsArea.innerHTML = `
                <ul>
                    ${data.articles.map(article => `
                        <li>
                            <a href="${article.url}" target="_blank" rel="noopener">
                                ${article.title}
                            </a>
                            <br>
                            <small>${new Date(article.publishedAt).toLocaleDateString()} – ${article.source.name}</small>
                        </li>
                    `).join('')}
                </ul>`;
        } else {
            newsArea.textContent = "No recent news found.";
        }
    } catch (error) {
        newsArea.textContent = "Error loading news.";
        console.error('Error fetching news:', error);
    }
}

async function fetchShrinkflationReddit() {
    const socialArea = document.getElementById('social-area');
    try {
        const redditUrl = 'https://corsproxy.io/?https://www.reddit.com/r/shrinkflation/top.json?limit=5';
        const response = await fetch(redditUrl);
        const data = await response.json();

        if (data.data && data.data.children.length > 0) {
            socialArea.innerHTML = `
                <ul>
                    ${data.data.children.map(post => `
                        <li>
                            <a href="https://reddit.com${post.data.permalink}" target="_blank" rel="noopener">
                                ${post.data.title}
                            </a>
                            <br>
                            <small>u/${post.data.author} – 
                                ${new Date(post.data.created_utc * 1000).toLocaleDateString()}
                            </small>
                        </li>
                    `).join('')}
                </ul>`;
        } else {
            socialArea.textContent = "No recent posts found.";
        }
    } catch (error) {
        socialArea.textContent = "Error loading social media posts.";
        console.error('Error fetching Reddit posts:', error);
    }
}

async function loadWorldBankStats(countryCode) {
    const output = document.getElementById('official-stats-area');
    output.innerHTML = `<p>Loading data for ${countryCode}...</p>`;

    try {
        const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/FP.CPI.TOTL.ZG?format=json`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data[1] || !data[1].length) {
            output.innerHTML = `<p>No inflation data found for ${countryCode}.</p>`;
            return;
        }

        const latest = data[1].find(e => e.value !== null);
        const lastFive = data[1].filter(e => e.value !== null).slice(0, 5);

        const avg5yrs = (lastFive.reduce((sum, e) => sum + e.value, 0) / lastFive.length).toFixed(2);
        const highYear = lastFive.reduce((max, e) => e.value > max.value ? e : max, lastFive[0]);
        const lowYear = lastFive.reduce((min, e) => e.value < min.value ? e : min, lastFive[0]);

        output.innerHTML = `
            <ul>
                <li><strong>Latest Inflation Rate:</strong> ${latest.value.toFixed(2)}%</li>
                <li><strong>Year:</strong> ${latest.date}</li>
                <li><strong>Average (last 5 years):</strong> ${avg5yrs}%</li>
                <li><strong>Highest (last 5 years):</strong> ${highYear.value.toFixed(2)}% (${highYear.date})</li>
                <li><strong>Lowest (last 5 years):</strong> ${lowYear.value.toFixed(2)}% (${lowYear.date})</li>
            </ul>
            <small>
                Source: <a href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" 
                          target="_blank" rel="noopener">World Bank</a>
            </small>
        `;
    } catch (err) {
        output.innerHTML = `<p>Error fetching data.</p>`;
        console.error(err);
    }
}

const countries = [
    { code: 'US', name: 'United States' },
    { code: 'MX', name: 'Mexico' },
    { code: 'JP', name: 'Japan' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'CA', name: 'Canada' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'AU', name: 'Australia' },
    { code: 'BR', name: 'Brazil' }
];

function populateCountrySelect() {
    const select = document.getElementById('country-select');
    countries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.code;
        opt.textContent = c.name;
        select.appendChild(opt);
    });
}

// --- Modal data ---
const modalData = {
    worldBank: {
        title: "About the World Bank", body: ` <p>The World Bank is an international financial institution that provides loans, grants, and expertise to developing countries.
    It collects, analyzes, and shares economic data from nearly every nation, which is used by policymakers, researchers, and the public.</p>
    <p>Can we trust it? The World Bank's data is gathered in cooperation with national statistical authorities and follows internationally recognized standards.
    However, like all data sources, it can have reporting delays or methodological differences. It’s smart to compare it with other reputable sources too.</p> ` },
    inflation: {
        title: "About Inflation", body: ` <p>Inflation is the rate at which the general level of prices for goods and services rises, which reduces the purchasing power of money over time. 
        It is measured by indicators like the Consumer Price Index (CPI), and it’s a key economic signal watched by governments, businesses, and consumers.</p>
        <p>Is it good or bad? Moderate inflation, around 2%, is generally considered normal, even positive, for an economy, as it decreases the cost of borrowing, encouraging spending and investment.
        Very high inflation (like Argentina) or deflation (like some Asian countries) can hinder economic growth. Inflation can sometimes spiral to over 1000% (Venezuela, Zimbabwe), known as hyperinflation, which is devastating.</p> ` }
};

// --- Create modal HTML ---
function createModal(id, title, body) {
    return `
        <div id="${id}" class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-title" style="display:none;">
            <div class="modal-content">
                <button class="close" data-close="${id}" aria-label="Close">&times;</button>
                <h3 id="${id}-title">${title}</h3>
                ${body}
            </div>
        </div>
    `;
}

// --- Inject modals into page ---
function injectModals() {
    const container = document.getElementById('modal-container');
    container.innerHTML =
        createModal('modal-world-bank', modalData.worldBank.title, modalData.worldBank.body) +
        createModal('modal-inflation', modalData.inflation.title, modalData.inflation.body);
}

function setupModalEvents() {
    document.getElementById('about-world-bank-btn')
        .addEventListener('click', () => openModal('modal-world-bank'));
    document.getElementById('about-inflation-btn')
        .addEventListener('click', () => openModal('modal-inflation'));

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close')) {
            closeModal(e.target.getAttribute('data-close'));
        }
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
    });
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    populateCountrySelect();

    const btn = document.getElementById('load-btn');
    const select = document.getElementById('country-select');

    btn.addEventListener('click', () => {
        loadWorldBankStats(select.value);
    });

    loadWorldBankStats(countries[0].code);
    fetchShrinkflationReddit();
    fetchShrinkflationNews();
    injectModals();
    setupModalEvents();
});