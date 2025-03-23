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

// Select elements for weather (used in both pages)
const currentTemp = document.querySelector("#current-temp");
const weatherIconContainer = document.querySelector("#weather-icon-container");
const captionDesc = document.querySelector("figcaption");
const forecastList = document.querySelector("#forecast-list");

// OpenWeatherMap API settings
const myKey = "de62efe665b5c2309b3af4e71f9399bd";
const myLat = "5.56"; // Accra, Ghana
const myLong = "-0.19";

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

// Fetch weather data
async function apiFetch() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) {
            throw Error(await currentResponse.text());
        }
        const currentData = await currentResponse.json();
        console.log("Current Weather:", currentData);
        displayCurrentWeather(currentData);

        // Fetch forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw Error(await forecastResponse.text());
        }
        const forecastData = await forecastResponse.json();
        console.log("Forecast:", forecastData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather:", error);
        if (currentTemp) {
            currentTemp.textContent = "N/A";
        }
        if (captionDesc) {
            captionDesc.textContent = "Unable to load weather data";
        }
        if (forecastList) {
            forecastList.innerHTML = "<li>Unable to load forecast</li>";
        }
    }
}

// Display current weather (aligned with test file)
function displayCurrentWeather(data) {
    if (currentTemp) {
        currentTemp.innerHTML = `${data.main.temp} °C`;
    }
    if (captionDesc) {
        const description = data.weather[0].description;
        captionDesc.textContent =
            description.charAt(0).toUpperCase() + description.slice(1);
    }
    if (weatherIconContainer) {
        // Create the img element dynamically
        const weatherIcon = document.createElement("img");
        weatherIcon.id = "weather-icon";
        const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.setAttribute("src", iconSrc);
        weatherIcon.setAttribute("alt", description);
        weatherIconContainer.appendChild(weatherIcon);
    }
}

// Display 3-day forecast
function displayForecast(data) {
    if (!forecastList) return;
    forecastList.innerHTML = "";
    const dailyForecasts = [];
    const today = new Date();
    let currentDay = today.getDate();
    let daysAdded = 0;

    // Filter forecast to get one entry per day (at 12:00 PM) for the next 3 days
    for (const entry of data.list) {
        const entryDate = new Date(entry.dt * 1000);
        const entryDay = entryDate.getDate();
        const entryHour = entryDate.getHours();

        if (entryHour === 12 && entryDay !== currentDay && daysAdded < 3) {
            dailyForecasts.push({
                date: entryDate,
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
                desc: entry.weather[0].description,
            });
            currentDay = entryDay;
            daysAdded++;
        }
    }

    // Display the forecast
    dailyForecasts.forEach((forecast) => {
        const li = document.createElement("li");
        const dayName = forecast.date.toLocaleDateString("en-US", {
            weekday: "long",
        });
        li.innerHTML = `
            ${dayName}: ${forecast.temp} °C
            <img src="https://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.desc}" style="width: 30px; vertical-align: middle;">
        `;
        forecastList.appendChild(li);
    });

    // Fallback if not enough forecast data
    if (dailyForecasts.length < 3) {
        const li = document.createElement("li");
        li.textContent = "Not enough forecast data available";
        forecastList.appendChild(li);
    }
}

// Call the weather fetch function
apiFetch();