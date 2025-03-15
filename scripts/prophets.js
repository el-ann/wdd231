const url = 'https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json';
const cards = document.querySelector('#cards');

let allProphets = [];

const displayProphets = (prophets) => {
    cards.innerHTML = '';

    prophets.forEach((prophet, index) => {
        const card = document.createElement('section');

        const fullName = document.createElement('h2');
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        const birthDate = document.createElement('p');
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;

        const birthPlace = document.createElement('p');
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        const portrait = document.createElement('img');
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} – ${index + 1}th Latter-day President`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');

        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);
        cards.appendChild(card);
    });
};

const getProphetData = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        allProphets = data.prophets;
        displayProphets(allProphets);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const filterByBirthplace = (place) => {
    const filtered = allProphets.filter(prophet => prophet.birthplace.includes(place));
    displayProphets(filtered);
};

const filterByCondition = (condition) => {
    const filtered = allProphets.filter(condition);
    displayProphets(filtered);
};

document.getElementById('all').addEventListener('click', () => displayProphets(allProphets));

document.getElementById('utah').addEventListener('click', () => filterByBirthplace('Utah'));

document.getElementById('nonus').addEventListener('click', () => {
    const usStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    filterByCondition(prophet => !usStates.some(state => prophet.birthplace.includes(state)));
});

document.getElementById('old').addEventListener('click', () => {
    filterByCondition(prophet => {
        const birthYear = parseInt(prophet.birthdate.split('-')[0]);
        const deathYear = parseInt(prophet.death) || new Date().getFullYear();
        return (deathYear - birthYear) >= 95;
    });
});

document.getElementById('child').addEventListener('click', () => {
    filterByCondition(prophet => parseInt(prophet.numofchildren) >= 10);
});

document.getElementById('fifteen').addEventListener('click', () => {
    filterByCondition(prophet => parseInt(prophet.length) >= 15);
});

// Initial Fetch
getProphetData();
