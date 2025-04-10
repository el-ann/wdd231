// script.js
import { fetchArtworks, displayArtworks, populateFilters } from './artworks.js';

// Global Variables
const selectors = {
    galleryList: document.getElementById("gallery-list"),
    blogList: document.getElementById("blog-list"),
    currentTemp: document.querySelector("#current-temp"),
    weatherIconContainer: document.querySelector("#weather-icon-container"),
    captionDesc: document.querySelector("#weather-desc"),
    artistModal: document.getElementById("artist-modal"),
    modalTitle: document.getElementById("modal-title"),
    modalBio: document.getElementById("modal-bio"),
    blogModal: document.getElementById("blog-modal"),
    blogModalTitle: document.getElementById("blog-modal-title"),
    blogModalDate: document.getElementById("blog-modal-date"),
    blogModalContent: document.getElementById("blog-modal-content"),
    artistFilter: document.getElementById("artist-filter"),
    locationFilter: document.getElementById("location-filter"),
    menu: document.querySelector("#menu"),
    navMenu: document.querySelector(".nav-menu"),
    slides: document.querySelectorAll(".slide"),
    prevSlide: document.querySelector(".prev-slide"),
    nextSlide: document.querySelector(".next-slide"),
    currentYear: document.getElementById("currentyear"),
    lastModified: document.getElementById("lastModified"),
    backToTop: document.getElementById("back-to-top"),
    featuredContent: document.getElementById("featured-content"),
    map: document.getElementById("map")
};
let allArtworks = [];
let currentSlide = 0;

document.addEventListener("DOMContentLoaded", () => {
    // Footer Year
    if (selectors.currentYear) selectors.currentYear.textContent = new Date().getFullYear();
    if (selectors.lastModified) selectors.lastModified.textContent = `Last Modified: ${document.lastModified}`;

    // Navigation Menu Toggle
    if (selectors.menu && selectors.navMenu) {
        selectors.menu.addEventListener("click", () => {
            selectors.navMenu.classList.toggle("open");
            selectors.menu.textContent = selectors.navMenu.classList.contains("open") ? "✕" : "☰";
            selectors.menu.setAttribute("aria-expanded", selectors.navMenu.classList.contains("open"));
        });
        selectors.menu.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectors.navMenu.classList.toggle("open");
                selectors.menu.textContent = selectors.navMenu.classList.contains("open") ? "✕" : "☰";
                selectors.menu.setAttribute("aria-expanded", selectors.navMenu.classList.contains("open"));
            }
        });
    }

    // Slideshow
    if (selectors.slides.length > 0) {
        const showSlide = (index) => {
            selectors.slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        };
        selectors.prevSlide?.addEventListener("click", () => {
            currentSlide = (currentSlide - 1 + selectors.slides.length) % selectors.slides.length;
            showSlide(currentSlide);
        });
        selectors.nextSlide?.addEventListener("click", () => {
            currentSlide = (currentSlide + 1) % selectors.slides.length;
            showSlide(currentSlide);
        });
        setInterval(() => {
            currentSlide = (currentSlide + 1) % selectors.slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Fetch Data
    initArtworks();
    fetchWeather();
    fetchBlogPosts();

    // Modal Close
    document.querySelectorAll(".close").forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            if (selectors.artistModal) selectors.artistModal.style.display = "none";
            if (selectors.blogModal) selectors.blogModal.style.display = "none";
        });
        closeButton.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (selectors.artistModal) selectors.artistModal.style.display = "none";
                if (selectors.blogModal) selectors.blogModal.style.display = "none";
            }
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === selectors.artistModal) selectors.artistModal.style.display = "none";
        if (e.target === selectors.blogModal) selectors.blogModal.style.display = "none";
    });

    // Form Submission Display
    if (window.location.pathname.includes("submit-thanks.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const displayName = document.getElementById("display-name");
        const displayEmail = document.getElementById("display-email");
        const displayDescription = document.getElementById("display-description");
        if (displayName) displayName.textContent = urlParams.get("name") || "N/A";
        if (displayEmail) displayEmail.textContent = urlParams.get("email") || "N/A";
        if (displayDescription) displayDescription.textContent = urlParams.get("description") || "N/A";
    }

    // localStorage
    localStorage.setItem("lastPage", window.location.pathname);

    // Back to Top Button
    if (selectors.backToTop) {
        window.addEventListener("scroll", () => {
            selectors.backToTop.style.display = window.scrollY > 300 ? "block" : "none";
        });
        selectors.backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Fade-in Elements
    document.querySelectorAll("section, .artwork-card, .blog-post").forEach((el, index) => {
        el.classList.add("fade-in");
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Initialize Artworks
async function initArtworks() {
    allArtworks = await fetchArtworks();
    if (allArtworks.length > 0) {
        populateFilters(allArtworks, selectors.artistFilter, selectors.locationFilter);
        displayArtworks(allArtworks, selectors.galleryList);
        displayMap(allArtworks);
        // Filter Event Listeners
        selectors.artistFilter?.addEventListener("change", filterArtworks);
        selectors.locationFilter?.addEventListener("change", filterArtworks);
    }
}

function filterArtworks() {
    const artist = selectors.artistFilter?.value || "all";
    const location = selectors.locationFilter?.value || "all";
    const filteredArtworks = allArtworks.filter(art => {
        const matchArtist = artist === "all" || art.artist === artist;
        const matchLocation = location === "all" || art.location === location;
        return matchArtist && matchLocation;
    });
    displayArtworks(filteredArtworks, selectors.galleryList);
}

// Fetch Weather
async function fetchWeather() {
    const myKey = "b77922d9a48b404ecc38aee8ca3fc5dc";
    const myLat = "5.56";
    const myLong = "-0.19";
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

    try {
        const response = await fetch(currentUrl);
        if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Weather error:", error);
        if (selectors.currentTemp) selectors.currentTemp.textContent = "N/A";
        if (selectors.captionDesc) selectors.captionDesc.textContent = "Unable to load weather data.";
        if (selectors.weatherIconContainer) selectors.weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
    }
}

function displayWeather(data) {
    if (selectors.currentTemp) {
        selectors.currentTemp.innerHTML = `${Math.round(data.main.temp) || "N/A"} °C`;
    }
    if (selectors.captionDesc) {
        const desc = data.weather?.[0]?.description || "N/A";
        selectors.captionDesc.textContent = `${desc.charAt(0).toUpperCase()}${desc.slice(1)}`;
    }
    if (selectors.weatherIconContainer) {
        selectors.weatherIconContainer.innerHTML = "";
        const iconCode = data.weather?.[0]?.icon;
        if (iconCode) {
            selectors.weatherIconContainer.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description || "Weather icon"}">
            `;
        } else {
            selectors.weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
        }
    }
}

// Fetch Blog Posts
async function fetchBlogPosts() {
    const blogPosts = [
        {
            title: "Street Art Festival 2025",
            date: "April 10, 2025",
            content: "Join us for the annual Street Art Festival in Accra! This year’s event will feature over 50 artists from across Ghana, showcasing their latest works in the heart of Osu. Expect live painting sessions, music, and cultural performances.",
            author: "Art Council"
        },
        {
            title: "Interview with Kofi Mensah",
            date: "April 5, 2025",
            content: "Kofi shares his journey as a street artist in Accra. From his early days painting in Jamestown to becoming a celebrated artist, Kofi discusses the challenges and inspirations behind his vibrant portraits.",
            author: "Aba Mensah"
        },
        {
            title: "New Mural Unveiled in Labadi",
            date: "April 1, 2025",
            content: "A new mural by Kwame Asante was unveiled in Labadi last week. Titled 'Cultural Echoes,' the piece blends traditional Ghanaian motifs with modern street art techniques, drawing crowds from across the city.",
            author: "Art Council"
        },
    ];
    if (blogPosts.length > 0) {
        displayFeaturedPost(blogPosts[0]);
        displayBlogPosts(blogPosts);
    }
}

function displayFeaturedPost(post) {
    if (!selectors.featuredContent) return;
    selectors.featuredContent.innerHTML = `
        <h3>${post.title}</h3>
        <p><em>${post.date}</em></p>
        <p><strong>By:</strong> ${post.author}</p>
        <p>${post.content.slice(0, 100)}...</p>
        <button class="read-more" data-index="0">Read More</button>
    `;
    selectors.featuredContent.querySelector(".read-more")?.addEventListener("click", () => {
        if (selectors.blogModalTitle && selectors.blogModalDate && selectors.blogModalContent) {
            selectors.blogModalTitle.textContent = post.title;
            selectors.blogModalDate.textContent = post.date;
            selectors.blogModalContent.textContent = post.content;
            selectors.blogModal.style.display = "block";
        }
    });
}

function displayBlogPosts(posts) {
    if (!selectors.blogList) return;
    selectors.blogList.innerHTML = "";
    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><em>${post.date}</em></p>
            <p><strong>By:</strong> ${post.author}</p>
            <p>${post.content.slice(0, 100)}...</p>
            <button class="read-more" data-index="${index}">Read More</button>
        `;
        selectors.blogList.appendChild(postElement);
    });

    selectors.blogList.querySelectorAll(".read-more").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const post = posts[index];
            if (selectors.blogModalTitle && selectors.blogModalDate && selectors.blogModalContent) {
                selectors.blogModalTitle.textContent = post.title;
                selectors.blogModalDate.textContent = post.date;
                selectors.blogModalContent.textContent = post.content;
                selectors.blogModal.style.display = "block";
            }
        });
    });
}

function displayMap(artworks) {
    if (!selectors.map) return;
    try {
        const map = L.map("map").setView([5.55, -0.19], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        artworks.forEach(artwork => {
            if (artwork.lat && artwork.lon) {
                L.marker([artwork.lat, artwork.lon])
                    .addTo(map)
                    .bindPopup(`<b>${artwork.title || "Untitled"}</b><br>by ${artwork.artist || "Unknown"}`);
            }
        });
    } catch (error) {
        console.error("Map error:", error);
        selectors.map.innerHTML = "<p>Unable to load map.</p>";
    }
}