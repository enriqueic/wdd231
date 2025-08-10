document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle
  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // Hamburger menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('nav-closed');
      nav.classList.toggle('nav-open');
    });
  }
});


// --------- WEATHER SECTION --------- //
const weatherNow = document.getElementById('weather-now');
const weatherForecast = document.getElementById('weather-forecast');

const lat = 32.5149;
const lon = -117.0382;
const apiKey = '692bd7103849f20085cd57cde936564f';

async function fetchWeather() {
  const urlNow = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  // Current
  try {
    const res = await fetch(urlNow);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();

    if (weatherNow) {
      weatherNow.innerHTML = `
        <div class="weather-row">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" width="48" height="48">
          <div>
            <strong>${Math.round(data.main.temp)}°C</strong><br>
            <span style="text-transform:capitalize">${data.weather[0].description}</span>
          </div>
        </div>
      `;
    }
  } catch (e) {
    if (weatherNow) {
      weatherNow.textContent = "Weather unavailable";
    }
    console.warn("Weather fetch error:", e);
  }

  // Forecast
  try {
    const res = await fetch(urlForecast);
    if (!res.ok) throw new Error('Forecast fetch failed');
    const data = await res.json();

    const days = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!days[day]) days[day] = [];
      days[day].push(item);
    });

    const dayKeys = Object.keys(days).slice(0, 3);
    if (weatherForecast) {
      weatherForecast.innerHTML = dayKeys.map((day, i) => {
        const temps = days[day].map(f => f.main.temp_max);
        const max = Math.round(Math.max(...temps));
        const min = Math.round(Math.min(...temps));
        return `<div><strong>${i === 0 ? 'Today' : day}:</strong> ${min}°C / ${max}°C</div>`;
      }).join('');
    }
  } catch (e) {
    if (weatherForecast) {
      weatherForecast.textContent = "Forecast unavailable";
    }
    console.warn("Forecast fetch error:", e);
  }
}
fetchWeather();


async function fetchSpotlights() {
  const url = 'data/members.json';
  const container = document.getElementById('highlight-cards');
  if (!container) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Member fetch failed');
    const data = await res.json();

    // Filter for Gold/Silver members
    const eligible = data.members.filter(m =>
      m.membership_level &&
      (m.membership_level.toLowerCase() === 'gold' || m.membership_level.toLowerCase() === 'silver')
    );

    // Shuffle and pick 3
    const shuffled = eligible.sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 3);

    container.innerHTML = chosen.map(member => `
      <div class="spotlight-card">
        <img src="${member.image}" alt="Logo of ${member.name}" width="120" height="120" loading="lazy">
        <h3>${member.name}</h3>
        <div>${member.address}</div>
        <div>${member.phone}</div>
        <a href="${member.website_url}" target="_blank">${member.website_url.replace(/^https?:\/\//, '')}</a>
        <div><strong>${member.membership_level} Member</strong></div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = "<p>Spotlights unavailable.</p>";
    console.warn("Spotlight fetch error:", e);
  }
}
fetchSpotlights();

const currentyear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

if (currentyear) {
  currentyear.innerHTML = `${today.getFullYear()}`;
}

let lastModification = new Date(document.lastModified);

const month = String(lastModification.getMonth() + 1).padStart(2, '0');
const day = String(lastModification.getDate()).padStart(2, '0');
const hours = String(lastModification.getHours()).padStart(2, '0');
const minutes = String(lastModification.getMinutes()).padStart(2, '0');
const seconds = String(lastModification.getSeconds()).padStart(2, '0');

if (lastModified) {
  lastModified.innerHTML = `Last modification: ${day}/${month}/${lastModification.getFullYear()} ${hours}:${minutes}:${seconds}`;
}