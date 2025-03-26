document.addEventListener("DOMContentLoaded", () => {
    // Set footer dynamic content
    const currentYear = document.getElementById("currentyear");
    const lastModified = document.getElementById("lastModified");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    if (lastModified) {
        lastModified.textContent = `Last Modified: ${document.lastModified}`;
    }

    // Navigation menu toggle for mobile
    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".nav-menu");
    if (hamButton && navigation) {
        hamButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            hamButton.classList.toggle("open");
            hamButton.setAttribute(
                "aria-expanded",
                navigation.classList.contains("open")
            );
        });
    }

    // Fetch members for directory and spotlights
    getMembers();

    // Fetch weather data
    apiFetch();
});

// Select elements for member directory (directory.html)
const memberList = document.getElementById("member-list");
const toggleButton = document.getElementById("toggle-view");

// Select elements for spotlights (index.html)
const spotlightList = document.getElementById("spotlight-list");

// Fetch members from JSON
async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw Error(`HTTP error! Status: ${response.status}`);
        }
        const members = await response.json();
        // Display all members for directory page
        if (memberList) {
            displayMembers(members);
        }
        // Display spotlights for home page
        if (spotlightList) {
            displaySpotlights(members);
        }
    } catch (error) {
        console.error("Error fetching members:", error);
        if (memberList) {
            memberList.innerHTML =
                "<p>Failed to load members. Please try again later.</p>";
        }
        if (spotlightList) {
            spotlightList.innerHTML =
                "<p>Failed to load spotlights. Please try again later.</p>";
        }
    }
}

// Display all members for directory page
function displayMembers(members) {
    if (!memberList) return;
    memberList.innerHTML = "";
    const levelMap = { 1: "Member", 2: "Silver", 3: "Gold" };
    members.forEach((member) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="mailto:${member.email || ""}">${
            member.email || "N/A"
        }</a></p>
            <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${
            member.website
        }</a></p>
            <p>Membership Level: ${
                levelMap[member.membershipLevel] || "Unknown"
            }</p>
            <p>${member.additionalInfo || ""}</p>
        `;
        memberList.appendChild(card);
    });
}

// Display 2-3 random gold or silver members for spotlights on home page
function displaySpotlights(members) {
    if (!spotlightList) return;
    spotlightList.innerHTML = "";
    const levelMap = { 1: "Member", 2: "Silver", 3: "Gold" };
    // Filter for gold (3) and silver (2) members
    const eligibleMembers = members.filter(
        (member) => member.membershipLevel === 2 || member.membershipLevel === 3
    );
    // Randomly select 2-3 members
    const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));
    // Display selected members
    selected.forEach((member) => {
        const card = document.createElement("div");
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${
            member.website
        }</a></p>
            <p>Membership Level: ${
                levelMap[member.membershipLevel] || "Unknown"
            }</p>
        `;
        spotlightList.appendChild(card);
    });
}

// Toggle grid/list view for directory page
if (toggleButton && memberList) {
    toggleButton.addEventListener("click", () => {
        memberList.classList.toggle("grid-view");
        memberList.classList.toggle("list-view");
        toggleButton.textContent = memberList.classList.contains("grid-view")
            ? "Toggle List View"
            : "Toggle Grid View";
    });
}

// Weather
const currentTemp = document.querySelector("#current-temp");
const weatherIconContainer = document.querySelector("#weather-icon-container");
const captionDesc = document.querySelector("#weather-desc");
const forecastList = document.querySelector("#forecast-list");

const myKey = "6617ad94b410255f843d41506d52b0d5"; // Move to server-side in production
const myLat = "5.56";
const myLong = "-0.19";
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

async function apiFetch() {
    try {
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) throw new Error("Current weather fetch failed");
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error("Forecast fetch failed");
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather error:", error.message);
        if (currentTemp) currentTemp.textContent = "N/A";
        if (captionDesc) captionDesc.textContent = "Unable to load weather";
        if (forecastList) forecastList.innerHTML = "<li>Unable to load forecast</li>";
    }
}

function displayCurrentWeather(data) {
    if (currentTemp) currentTemp.innerHTML = `${Math.round(data.main.temp)} °C`;
    if (captionDesc) {
        const desc = data.weather[0].description;
        captionDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
    }
    if (weatherIconContainer) {
        weatherIconContainer.innerHTML = "";
        const img = document.createElement("img");
        img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        img.alt = data.weather[0].description;
        weatherIconContainer.appendChild(img);
    }
}

function displayForecast(data) {
    if (!forecastList) return;
    forecastList.innerHTML = "";
    const today = new Date().getDate();
    const seenDays = new Set([today]);
    const forecasts = [];

    for (const entry of data.list) {
        const entryDate = new Date(entry.dt * 1000);
        const entryDay = entryDate.getDate();
        if (!seenDays.has(entryDay) && forecasts.length < 3) {
            forecasts.push({
                date: entryDate,
                temp: Math.round(entry.main.temp),
                icon: entry.weather[0].icon,
                desc: entry.weather[0].description
            });
            seenDays.add(entryDay);
        }
        if (forecasts.length === 3) break;
    }

    forecasts.forEach(f => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${f.date.toLocaleDateString("en-US", { weekday: "long" })}: ${f.temp} °C
            <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="${f.desc}" style="width: 30px; vertical-align: middle;">
        `;
        forecastList.appendChild(li);
    });
}

// Call the weather fetch function
apiFetch();