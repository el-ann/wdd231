document.addEventListener("DOMContentLoaded", function () {
    // Footer updates
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = document.lastModified;

    // Navigation toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });

    // Fetch members
    getMembers();
});

const memberList = document.getElementById('member-list');
const toggleButton = document.getElementById('toggle-view');

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
        card.classList.add('business-card');
        card.innerHTML = `
            <h3>${member.name}</h3>
            <p>${member.additionalInfo}</p>
            <p>Email: <a href="mailto:${member.email || ''}">${member.email || 'N/A'}</a></p>
            <p>Phone: ${member.phone}</p>
            <p>URL: <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            <p>Membership Level: ${levelMap[member.membershipLevel] || 'Unknown'}</p>
        `;
        memberList.appendChild(card);
    });
    memberList.classList.add('grid-view');
    toggleButton.textContent = 'Toggle List View';
}

toggleButton.addEventListener('click', () => {
    if (memberList.classList.contains('grid-view')) {
        memberList.classList.remove('grid-view');
        memberList.classList.add('list-view');
        toggleButton.textContent = 'Toggle Grid View';
    } else {
        memberList.classList.remove('list-view');
        memberList.classList.add('grid-view');
        toggleButton.textContent = 'Toggle List View';
    }
});