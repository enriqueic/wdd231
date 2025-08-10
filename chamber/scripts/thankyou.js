
const params = new URLSearchParams(window.location.search);

const firstName = params.get('first');
const lastName = params.get('last');
const title = params.get('title');
const phone = params.get('phone');
const email = params.get('email');
const orgName = params.get('organization');
const orgDesc = params.get('description');
const membership = params.get('level');
const timeStamp = params.get('timestamp');


const results = document.querySelector("#results");
const today = new Date();

let brP = document.createElement('br');

let messageP = document.createElement('p');
messageP.textContent = `We will review you information`;

let firstNameP = document.createElement('p');
firstNameP.textContent = `First Name: ${firstName}`;

let lastNameP = document.createElement('p');
lastNameP.textContent = `Last Name: ${lastName}`;

let titleP = document.createElement('p');
titleP.textContent = `Title: ${title}`;

let phoneP = document.createElement('p');
phoneP.textContent = `Phone: ${phone}`;

let emailP = document.createElement('p');
emailP.textContent = `Email: ${email}`;

let orgNameP = document.createElement('p');
orgNameP.textContent = `Organization's name: ${orgName}`;

let orgDescP = document.createElement('p');
orgDescP.textContent = `Organization's description: ${orgDesc}`;

let timestampP = document.createElement('p');
timestampP.textContent = `Timestamp: ${timeStamp}`;

let membershipP = document.createElement('p');
membershipP.textContent = `Membership: ${membership}`;


results.appendChild(brP);
results.appendChild(messageP);
results.appendChild(firstNameP);
results.appendChild(lastNameP);
//results.appendChild(titleP);
results.appendChild(phoneP);
results.appendChild(emailP);
results.appendChild(orgNameP);
//results.appendChild(orgDescP);
results.appendChild(timestampP);
//results.appendChild(membershipP);

//results.appendChild(dateP);