document.addEventListener('DOMContentLoaded', () => {
  const visitMsg = document.getElementById('visit-message');
  const lastVisit = localStorage.getItem('discoverLastVisit');
  const now = Date.now();
  let message = "Welcome! Let us know if you have any questions.";
  if (lastVisit) {
    const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      message = "Back so soon! Awesome!";
    } else if (days === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${days} days ago.`;
    }
  }
  if (visitMsg) visitMsg.textContent = message;
  localStorage.setItem('discoverLastVisit', now);

  fetch('data/places.json')
    .then(res => res.json())
    .then(items => {
      const grid = document.getElementById('discoverGrid');
      if (!grid) return;
      items.forEach(item => {
        const card = document.createElement('section');
        card.className = 'discover-card';
        card.innerHTML = `
          <figure>
            <img src="${item.image}" alt="${item.title}" width="300" height="300" loading="lazy">
          </figure>
          <div class="card-content">
            <h2>${item.title}</h2>
            <address>${item.address}</address>
            <p>${item.description}</p>
            <a href="${item.link}" class="learn-more" target="_blank" rel="noopener">Learn more</a>
          </div>
        `;
        grid.appendChild(card);
      });
    });
});