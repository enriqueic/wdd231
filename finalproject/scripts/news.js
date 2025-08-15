const newsApiKey = '58e1953737d541fe9f8ce2c53f1c011e';
const newsUrl = `https://corsproxy.io/?https://newsapi.org/v2/everything?q=shrinkflation&sortBy=publishedAt&language=en&pageSize=5&apiKey=${newsApiKey}`;

export async function fetchShrinkflationNews() {
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

export async function fetchShrinkflationReddit() {
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

export async function loadWorldBankStats(countryCode) {
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

export const countries = [
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

export function populateCountrySelect() {
    const select = document.getElementById('country-select');
    countries.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.code;
        opt.textContent = c.name;
        select.appendChild(opt);
    });
}