const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector('#cards');

async function getProphetData() {
    const response = await fetch(url); // request
    const data = await response.json(); // parse the JSON data
    console.table(data.prophets);
    displayProphets(data.prophets);
    //console.log(data); // temp output test of data response 
}

getProphetData();

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {

        let card = document.createElement('section');
        let fullName = document.createElement('h2'); // fill in the blank
        let portrait = document.createElement('img');

        // Build the h2 content out to show the prophet's full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        // 
        let dateBirth = document.createElement('p');
        dateBirth.textContent = `Date of Birth: ${prophet.birthdate}`;

        let placeBirth = document.createElement('p');
        placeBirth.textContent = `Place of Birth: ${prophet.birthplace}`;
        //

        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        // Append the section(card) with the created elements
        card.appendChild(fullName);
        card.appendChild(dateBirth);
        card.appendChild(placeBirth);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
}