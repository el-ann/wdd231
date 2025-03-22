const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const myKey = "b77922d9a48b404ecc38aee8ca3fc5dc";
const myLat = "49.75"; 
const myLong = "6.64"; 

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&units=metric&appid=${myKey}`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data); 
            displayResults(data); 
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error('Error:', error); 
    }
}

function displayResults(data) {
    currentTemp.innerHTML = `${data.main.temp} °C`;

    const description = data.weather[0].description;
    captionDesc.textContent = description.charAt(0).toUpperCase() + description.slice(1);

    const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.setAttribute('src', iconSrc);
    weatherIcon.setAttribute('alt', description);

}

apiFetch();