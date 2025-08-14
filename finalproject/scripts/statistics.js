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
                            <small>u/${post.data.author} – ${new Date(post.data.created_utc * 1000).toLocaleDateString()}</small>
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

async function loadOfficialStats() {
    const statsArea = document.getElementById('official-stats-area');
    try {
        const blsApiKey = 'c0e11b8ce20295288f8ca758f282c722d7c44b9649e2257990f00d8e934d6c55';
        const url = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
        const payload = {
            seriesid: ['CUUR0000SA0'],
            registrationkey: blsApiKey,
            latest: true
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('BLS API error');
        const data = await response.json();
        if (
            !data ||
            !data.Results ||
            !data.Results.series ||
            !data.Results.series[0] ||
            !data.Results.series[0].data ||
            !data.Results.series[0].data[0]
        ) {
            statsArea.innerHTML = `<p>No data.</p>`;
            return;
        }

        const cpi = data.Results.series[0].data[0];
        statsArea.innerHTML = `
            <ul>
                <li>US Consumer Price Index (CPI): <strong>${cpi.value}</strong></li>
                <li>Period: <strong>${cpi.periodName} ${cpi.year}</strong></li>
            </ul>
            <small>Source: <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener">U.S. Bureau of Labor Statistics</a></small>
        `;
    } catch (error) {
        statsArea.innerHTML = `
            <p>Unable to load official inflation statistics.</p>
        `;
        console.error('Error fetching BLS inflation stats:', error);
    }
}

// --- Initialize All Sections ---
document.addEventListener('DOMContentLoaded', () => {
    fetchShrinkflationNews();
    fetchShrinkflationReddit();
    loadOfficialStats();
});