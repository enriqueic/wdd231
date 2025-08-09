// Directory grid/list toggle
const gridBtn = document.getElementById('grid');
const listBtn = document.getElementById('list');
const cards = document.getElementById('cards');

gridBtn.addEventListener('click', () => {
  cards.classList.remove('list');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});
listBtn.addEventListener('click', () => {
  cards.classList.add('list');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});

// Fetch and display members
const membersUrl = "data/members.json";

function displayMembers(members) {
  cards.innerHTML = "";
  members.forEach(member => {
    const card = document.createElement("section");
    card.innerHTML = `
      <h3>${member.name}</h3>
      <img src="${member.image}" alt="${member.name}'s Logo" loading="lazy" width="100" height="100">
      <div>
        <p><b>ADDRESS:</b> ${member.address}</p>
        <p><b>PHONE:</b> ${member.phone}</p>
        <p><a href="${member.website_url}" target="_blank">${member.website_url.replace(/^https?:\/\//, '')}</a></p>
        <p>${member.membership_level} Membership</p>
      </div>
    `;
    cards.appendChild(card);
  });
}

async function getMemberData() {
  const response = await fetch(membersUrl);
  const data = await response.json();
  displayMembers(data.members);
}

getMemberData();