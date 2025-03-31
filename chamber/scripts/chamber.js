// Global variables accessible to all functions
const memberList = document.getElementById("member-list");
const spotlightList = document.getElementById("spotlight-list");
const currentTemp = document.querySelector("#current-temp");
const weatherIconContainer = document.querySelector("#weather-icon-container");
const captionDesc = document.querySelector("#weather-desc");
const forecastList = document.querySelector("#forecast-list");

document.addEventListener("DOMContentLoaded", () => {
    // Set footer dynamic content (all pages)
    const currentYear = document.getElementById("currentyear");
    const lastModified = document.getElementById("lastModified");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    if (lastModified) {
        lastModified.textContent = `Last Modified: ${document.lastModified}`;
    }

    // Navigation menu toggle for mobile (all pages)
    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".nav-menu");
    if (hamButton && navigation) {
        hamButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            hamButton.classList.toggle("open");
            hamButton.textContent = navigation.classList.contains("open") ? "✕" : "☰";
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

    // Discover page functionality
    const discoverGrid = document.getElementById("discover-grid");
    if (discoverGrid) {
        fetchDiscoverData();
    }
    const visitText = document.getElementById("visit-text");
    if (visitText) {
        displayVisitMessage();
    }

    // Toggle grid/list view for directory page
    const toggleButton = document.getElementById("toggle-view");
    if (toggleButton && memberList) {
        memberList.classList.add("grid-view"); // Ensure initial state
        toggleButton.textContent = "Toggle List View";
        toggleButton.setAttribute("aria-label", "Switch to list view");

        toggleButton.addEventListener("click", () => {
            memberList.classList.toggle("grid-view");
            memberList.classList.toggle("list-view");
            const isGridView = memberList.classList.contains("grid-view");
            toggleButton.textContent = isGridView ? "Toggle List View" : "Toggle Grid View";
            toggleButton.setAttribute(
                "aria-label",
                isGridView ? "Switch to list view" : "Switch to grid view"
            );
        });
    }

    // Set timestamp on join page
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Modal functionality
    const modalLinks = document.querySelectorAll(".modal-link");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close");

    modalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = link.getAttribute("href").substring(1);
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = "block";
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest(".modal");
            if (modal) modal.style.display = "none";
        });
    });

    window.addEventListener("click", (e) => {
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = "none";
        });
    });

    // Display form data on thank you page
    if (window.location.pathname.includes("thankyou.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById("display-firstname").textContent = urlParams.get("firstname") || "N/A";
        document.getElementById("display-lastname").textContent = urlParams.get("lastname") || "N/A";
        document.getElementById("display-email").textContent = urlParams.get("email") || "N/A";
        document.getElementById("display-phone").textContent = urlParams.get("phone") || "N/A";
        document.getElementById("display-businessname").textContent = urlParams.get("businessname") || "N/A";
        document.getElementById("display-timestamp").textContent = urlParams.get("timestamp") || "N/A";
    }
});

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
            memberList.innerHTML = "<p>Failed to load members. Please try again later.</p>";
        }
        if (spotlightList) {
            spotlightList.innerHTML = "<p>Failed to load spotlights. Please try again later.</p>";
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
        card.classList.add("member-card"); // Added class for styling
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="mailto:${member.email || ""}">${member.email || "N/A"}</a></p>
            <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            <p>Membership Level: ${levelMap[member.membershipLevel] || "Unknown"}</p>
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
    const eligibleMembers = members.filter(
        (member) => member.membershipLevel === 2 || member.membershipLevel === 3
    );
    const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(3, shuffled.length));
    selected.forEach((member) => {
        const card = document.createElement("div");
        card.classList.add("spotlight-card"); // Added class for styling
        card.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>
            <p>Membership Level: ${levelMap[member.membershipLevel] || "Unknown"}</p>
        `;
        spotlightList.appendChild(card);
    });
}

// Fetch and display discover data (discover.html)
async function fetchDiscoverData() {
    const grid = document.getElementById("discover-grid");
    if (!grid) return;
    try {
        const response = await fetch("data/discover.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const items = await response.json();
        grid.innerHTML = ""; // Clear any existing content
        items.slice(0, 8).forEach((item, index) => {
            const card = document.createElement("article");
            card.classList.add("discover-card");
            card.innerHTML = `
                <h2>${item.name}</h2>
                <figure>
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button>Learn More</button>
            `;
            card.style.gridArea = `card${index + 1}`;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching discover data:", error);
        grid.innerHTML = "<p>Failed to load discover items.</p>";
    }
}

// Display visit message using localStorage (discover.html)
function displayVisitMessage() {
    const visitText = document.getElementById("visit-text");
    if (!visitText) return;
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    if (!lastVisit) {
        visitText.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = now - parseInt(lastVisit);
        const daysSince = Math.floor(timeDiff / oneDay);
        if (daysSince < 1) {
            visitText.textContent = "Back so soon! Awesome!";
        } else {
            visitText.textContent = `You last visited ${daysSince} ${daysSince === 1 ? "day" : "days"} ago.`;
        }
    }
    localStorage.setItem("lastVisit", now);
}

// Weather API setup
const myKey = "6617ad94b410255f843d41506d52b0d5"; // Replace with a valid API key if this one is invalid
const myLat = "5.56"; // Accra, Ghana
const myLong = "-0.19";
const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

async function apiFetch() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) {
            throw new Error(`Current weather fetch failed: ${currentResponse.status} - ${currentResponse.statusText}`);
        }
        const currentData = await currentResponse.json();
        console.log("Current Weather Data:", currentData); // Debug: Log the API response
        displayCurrentWeather(currentData);

        // Fetch forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Forecast fetch failed: ${forecastResponse.status} - ${forecastResponse.statusText}`);
        }
        const forecastData = await forecastResponse.json();
        console.log("Forecast Data:", forecastData); // Debug: Log the API response
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather error:", error.message);
        if (currentTemp) currentTemp.textContent = "N/A";
        if (captionDesc) captionDesc.textContent = "Unable to load weather data. Please check your API key or internet connection.";
        if (weatherIconContainer) weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
        if (forecastList) forecastList.innerHTML = "<li>Unable to load forecast</li>";
    }
}

function displayCurrentWeather(data) {
    // Validate data before displaying
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        throw new Error("Invalid weather data received");
    }

    if (currentTemp) {
        currentTemp.innerHTML = `${Math.round(data.main.temp)} °C`;
    }
    if (captionDesc) {
        const desc = data.weather[0].description || "N/A";
        captionDesc.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
    }
    if (weatherIconContainer) {
        weatherIconContainer.innerHTML = "";
        const iconCode = data.weather[0].icon;
        if (iconCode) {
            const img = document.createElement("img");
            img.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            img.alt = data.weather[0].description || "Weather icon";
            img.onerror = () => {
                // Fallback if the icon fails to load
                weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
            };
            weatherIconContainer.appendChild(img);
        } else {
            weatherIconContainer.innerHTML = "<p>No icon available</p>";
        }
    }
}

function displayForecast(data) {
    if (!forecastList) return;
    if (!data || !data.list) {
        forecastList.innerHTML = "<li>Invalid forecast data</li>";
        return;
    }

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

    if (forecasts.length === 0) {
        forecastList.innerHTML = "<li>No forecast data available</li>";
        return;
    }

    forecasts.forEach(f => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${f.date.toLocaleDateString("en-US", { weekday: "long" })}: ${f.temp} °C
            <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="${f.desc}" style="width: 30px; vertical-align: middle;" onerror="this.remove();">
        `;
        forecastList.appendChild(li);
    });
}

// Call the weather fetch function
apiFetch();