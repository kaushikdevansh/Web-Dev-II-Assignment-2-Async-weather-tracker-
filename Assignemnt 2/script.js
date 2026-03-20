const API_KEY = "fae6b5d998199db1b71b7e2645f824ba";

const weatherBox = document.getElementById("weather");
const historyBox = document.getElementById("history");
const cityInput = document.getElementById("cityInput");

async function getWeather(city) {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
        alert("city not found");
        throw new Error("City not found");
    }
    return await res.json();
}

document.getElementById("searchBtn").onclick = () => {
    const city = cityInput.value.trim();
    if (city) {
        search(city);
    }
};

function renderWeather(d) {
    weatherBox.innerHTML = `
        <div class="weather-item"><label>City</label><span>${d.name}, ${d.sys.country}</span></div>
        <div class="weather-item"><label>Temperature</label><span>${d.main.temp} °C</span></div>
        <div class="weather-item"><label>Weather</label><span>${d.weather[0].main}</span></div>
        <div class="weather-item"><label>Humidity</label><span>${d.main.humidity}%</span></div>
        <div class="weather-item"><label>Wind Speed</label><span>${d.wind.speed} m/s</span></div>
    `;
}

function saveHistory(city) {
    let cities = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    if (!cities.includes(city)) {
        cities.unshift(city);
    }

    cities = cities.slice(0, 5);

    localStorage.setItem("weatherHistory", JSON.stringify(cities));
    showHistory();
}

function showHistory() {
    let cities = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyBox.innerHTML = "";

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;

        btn.onclick = () => {
            search(city);
        };

        historyBox.appendChild(btn);
    });
}

async function search(city) {
    weatherBox.innerHTML = "";
    try {
        const data = await getWeather(city);
        renderWeather(data);
        saveHistory(data.name);
    } catch (error) {
        weatherBox.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
}

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            search(city);
        }
    }
});

showHistory();