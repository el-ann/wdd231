document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

    const hamButton = document.querySelector('#menu');
    const navigation = document.querySelector('.nav-menu');
    hamButton.addEventListener('click', () => {
        navigation.classList.toggle('open');
        hamButton.classList.toggle('open');
    });

    getMembers();
});

const memberList = document.getElementById('member-list');
const toggleButton = document.getElementById('toggle-view');

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        memberList.innerHTML = '<p>Failed to load members. Please try again later.</p>';
    }
}

function displayMembers(members) {
    memberList.innerHTML = '';
    const levelMap = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
    members.forEach(member => {
        const card = document.createElement('div');
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="mailto:${member.email || ''}">${member.email || 'N/A'}</a></p>
            <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            <p>Membership Level: ${levelMap[member.membershipLevel] || 'Unknown'}</p>
            <p>${member.additionalInfo || ''}</p>
        `;
        memberList.appendChild(card);
    });
}

toggleButton.addEventListener('click', () => {
    memberList.classList.toggle('grid-view');
    memberList.classList.toggle('list-view');
    toggleButton.textContent = memberList.classList.contains('grid-view') ? 'Toggle List View' : 'Toggle Grid View';
});