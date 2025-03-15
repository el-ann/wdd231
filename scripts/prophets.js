const url = 'https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  console.table(data.prophets);
  displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {

    const card = document.createElement('section');
    const fullName = document.createElement('h2');
    const portrait = document.createElement('img');
    const birthInfo1 = document.createElement('p');
    const birthInfo2 = document.createElement('p');

    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');
    birthInfo1.textContent = `Date of Birth: ${prophet.birthdate}`
    birthInfo2.textContent = `Place of Birth: ${prophet.birthplace}`;

    card.appendChild(fullName);
    card.appendChild(birthInfo1);
    card.appendChild(birthInfo2);
    card.appendChild(portrait);

    cards.appendChild(card);
  });
};

getProphetData();