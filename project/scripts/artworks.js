// Global Variables
const galleryList = document.getElementById("gallery-list");
const blogList = document.getElementById("blog-list");
const currentTemp = document.querySelector("#current-temp");
const weatherIconContainer = document.querySelector("#weather-icon-container");
const captionDesc = document.querySelector("#weather-desc");
const artistModal = document.getElementById("artist-modal");
const modalTitle = document.getElementById("modal-title");
const modalBio = document.getElementById("modal-bio");
const blogModal = document.getElementById("blog-modal");
const blogModalTitle = document.getElementById("blog-modal-title");
const blogModalDate = document.getElementById("blog-modal-date");
const blogModalContent = document.getElementById("blog-modal-content");
const artistFilter = document.getElementById("artist-filter");
const locationFilter = document.getElementById("location-filter");
let allArtworks = [];

// DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
    // Footer Year
    const currentYear = document.getElementById("currentyear");
    const lastModified = document.getElementById("lastModified");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    if (lastModified) {
        lastModified.textContent = `Last Modified: ${document.lastModified}`;
    }

    // Navigation Menu Toggle
    const hamButton = document.querySelector("#menu");
    const navigation = document.querySelector(".nav-menu");
    if (hamButton && navigation) {
        hamButton.addEventListener("click", () => {
            navigation.classList.toggle("open");
            hamButton.textContent = navigation.classList.contains("open") ? "✕" : "☰";
            hamButton.setAttribute("aria-expanded", navigation.classList.contains("open"));
        });

        // Keyboard Accessibility for Menu
        hamButton.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigation.classList.toggle("open");
                hamButton.textContent = navigation.classList.contains("open") ? "✕" : "☰";
                hamButton.setAttribute("aria-expanded", navigation.classList.contains("open"));
            }
        });
    }

    // Slideshow
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev-slide");
    const nextButton = document.querySelector(".next-slide");
    let currentSlide = 0;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        };

        prevButton?.addEventListener("click", () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        nextButton?.addEventListener("click", () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        // Auto-slide every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // Fetch Data
    fetchArtworks();
    fetchWeather();
    fetchBlogPosts();

    // Modal Close
    document.querySelectorAll(".close").forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            artistModal.style.display = "none";
            blogModal.style.display = "none";
        });

        closeButton.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                artistModal.style.display = "none";
                blogModal.style.display = "none";
            }
        });
    });

    window.addEventListener("click", (e) => {
        if (e.target === artistModal) artistModal.style.display = "none";
        if (e.target === blogModal) blogModal.style.display = "none";
    });

    // Form Submission Display
    if (window.location.pathname.includes("submit-thanks.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById("display-name").textContent = urlParams.get("name") || "N/A";
        document.getElementById("display-email").textContent = urlParams.get("email") || "N/A";
        document.getElementById("display-description").textContent = urlParams.get("description") || "N/A";
    }

    // localStorage for Last Visited Page
    localStorage.setItem("lastPage", window.location.pathname);

    // Back to Top Button
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Fade-in Elements
    document.querySelectorAll("section, .artwork-card, .blog-post").forEach((el, index) => {
        el.classList.add("fade-in");
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Fetch Artworks
async function fetchArtworks() {
    try {
        const response = await fetch("data/artworks.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        allArtworks = await response.json();
        populateFilters(allArtworks);
        displayArtworks(allArtworks);
        displayMap(allArtworks);
    } catch (error) {
        console.error("Error fetching artworks:", error);
        if (galleryList) galleryList.innerHTML = "<p>Failed to load artworks.</p>";
    }
}

// Populate Filters
function populateFilters(artworks) {
    if (!artistFilter || !locationFilter) return;

    const artists = [...new Set(artworks.map(art => art.artist))];
    const locations = [...new Set(artworks.map(art => art.location))];

    artists.forEach(artist => {
        const option = document.createElement("option");
        option.value = artist;
        option.textContent = artist;
        artistFilter.appendChild(option);
    });

    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });

    artistFilter.addEventListener("change", filterArtworks);
    locationFilter.addEventListener("change", filterArtworks);
}

// Filter Artworks
function filterArtworks() {
    const artist = artistFilter.value;
    const location = locationFilter.value;

    const filteredArtworks = allArtworks.filter(art => {
        const matchArtist = artist === "all" || art.artist === artist;
        const matchLocation = location === "all" || art.location === location;
        return matchArtist && matchLocation;
    });

    displayArtworks(filteredArtworks);
}

// Display Artworks
function displayArtworks(artworks) {
    if (!galleryList) return;
    galleryList.innerHTML = "";
    artworks.forEach((artwork, index) => {
        const card = document.createElement("div");
        card.classList.add("artwork-card");
        card.innerHTML = `
            <h3>${artwork.title}</h3>
            <img src="${artwork.image}" alt="${artwork.title} by ${artwork.artist}" loading="lazy">
            <p>Artist: ${artwork.artist}</p>
            <p>Location: ${artwork.location}</p>
            <button class="view-artist" data-index="${index}">View Artist</button>
        `;
        galleryList.appendChild(card);
    });

    // Add Event Listeners for Modals
    document.querySelectorAll(".view-artist").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const artwork = artworks[index];
            modalTitle.textContent = artwork.artist;
            modalBio.textContent = artwork.bio;
            artistModal.style.display = "block";
        });
    });
}

// Display Map
function displayMap(artworks) {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = L.map("map").setView([5.55, -0.19], 13); // Center on Accra
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    artworks.forEach(artwork => {
        L.marker([artwork.lat, artwork.lon])
            .addTo(map)
            .bindPopup(`<b>${artwork.title}</b><br>by ${artwork.artist}`);
    });
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
        if (currentTemp) currentTemp.textContent = "N/A";
        if (captionDesc) captionDesc.textContent = "Unable to load weather data.";
        if (weatherIconContainer) weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
    }
}

function displayWeather(data) {
    if (currentTemp) currentTemp.innerHTML = `${Math.round(data.main.temp)} °C`;
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
                weatherIconContainer.innerHTML = "<p>Weather icon unavailable</p>";
            };
            weatherIconContainer.appendChild(img);
        }
    }
}

// Fetch Blog Posts
async function fetchBlogPosts() {
    const blogPosts = [
        {
            title: "Street Art Festival 2025",
            date: "April 10, 2025",
            content: "Join us for the annual Street Art Festival in Accra! This year’s event will feature over 50 artists from across Ghana, showcasing their latest works in the heart of Osu. Expect live painting sessions, music, and cultural performances."
        },
        {
            title: "Interview with Kofi Mensah",
            date: "April 5, 2025",
            content: "Kofi shares his journey as a street artist in Accra. From his early days painting in Jamestown to becoming a celebrated artist, Kofi discusses the challenges and inspirations behind his vibrant portraits."
        },
        {
            title: "New Mural Unveiled in Labadi",
            date: "April 1, 2025",
            content: "A new mural by Kwame Asante was unveiled in Labadi last week. Titled 'Cultural Echoes,' the piece blends traditional Ghanaian motifs with modern street art techniques, drawing crowds from across the city."
        }
    ];

    displayFeaturedPost(blogPosts[0]);
    displayBlogPosts(blogPosts);
}

function displayFeaturedPost(post) {
    const featuredContent = document.getElementById("featured-content");
    if (!featuredContent) return;
    featuredContent.innerHTML = `
        <h3>${post.title}</h3>
        <p><em>${post.date}</em></p>
        <p>${post.content.slice(0, 100)}...</p>
        <button class="read-more" data-index="0">Read More</button>
    `;
    document.querySelector(".read-more").addEventListener("click", () => {
        blogModalTitle.textContent = post.title;
        blogModalDate.textContent = post.date;
        blogModalContent.textContent = post.content;
        blogModal.style.display = "block";
    });
}

function displayBlogPosts(posts) {
    if (!blogList) return;
    blogList.innerHTML = "";
    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><em>${post.date}</em></p>
            <p>${post.content.slice(0, 100)}...</p>
            <button class="read-more" data-index="${index}">Read More</button>
        `;
        blogList.appendChild(postElement);
    });

    document.querySelectorAll(".read-more").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const post = posts[index];
            blogModalTitle.textContent = post.title;
            blogModalDate.textContent = post.date;
            blogModalContent.textContent = post.content;
            blogModal.style.display = "block";
        });
    });
}