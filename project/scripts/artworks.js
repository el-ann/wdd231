// artworks.js
export async function fetchArtworks() {
    try {
        const response = await fetch("data/artworks.json");
        if (!response.ok) throw new Error(`Failed to fetch artworks: ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid or empty artwork data");
        return data;
    } catch (error) {
        console.error("Error fetching artworks:", error);
        const galleryList = document.getElementById("gallery-list");
        if (galleryList) galleryList.innerHTML = "<p>Unable to load artworks. Please try again later.</p>";
        return [];
    }
}

export function displayArtworks(artworks, galleryList) {
    if (!galleryList) {
        console.warn("Gallery list element not found");
        return;
    }
    galleryList.innerHTML = "";
    artworks.forEach((artwork, index) => {
        const card = document.createElement("div");
        card.classList.add("artwork-card");
        card.innerHTML = `
            <h3>${artwork.title || "Untitled"}</h3>
            <img src="${artwork.image || "images/placeholder.jpg"}" alt="${artwork.title || "Artwork"} by ${artwork.artist || "Unknown"}" loading="lazy">
            <p><strong>Artist:</strong> ${artwork.artist || "Unknown"}</p>
            <p><strong>Location:</strong> ${artwork.location || "N/A"}</p>
            <p><strong>Year:</strong> ${artwork.year || "Unknown"}</p>
            <button class="view-artist" data-index="${index}">View Artist</button>
        `;
        galleryList.appendChild(card);
    });

    // Attach modal event listeners
    document.querySelectorAll(".view-artist").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const artwork = artworks[index];
            const modalTitle = document.getElementById("modal-title");
            const modalBio = document.getElementById("modal-bio");
            const artistModal = document.getElementById("artist-modal");
            if (modalTitle && modalBio && artistModal) {
                modalTitle.textContent = artwork.artist || "Unknown Artist";
                modalBio.textContent = artwork.bio || "No biography available.";
                artistModal.style.display = "block";
            }
        });
    });
}

export function populateFilters(artworks, artistFilter, locationFilter) {
    if (!artistFilter || !locationFilter) {
        console.warn("Filter elements not found:", {
            artistFilter: artistFilter,
            locationFilter: locationFilter
        });
        return;
    }
    const artists = [...new Set(artworks.map(art => art.artist).filter(Boolean))];
    const locations = [...new Set(artworks.map(art => art.location).filter(Boolean))];

    artistFilter.innerHTML = '<option value="all">All Artists</option>';
    artists.forEach(artist => {
        artistFilter.innerHTML += `<option value="${artist}">${artist}</option>`;
    });

    locationFilter.innerHTML = '<option value="all">All Locations</option>';
    locations.forEach(location => {
        locationFilter.innerHTML += `<option value="${location}">${location}</option>`;
    });
}