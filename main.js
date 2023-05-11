
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const locationIcon = document.getElementById("locDot");
const cityInput = document.querySelector('.search-box input');

let latitude;
let longitude;
let locStatus = false;


locationIcon.addEventListener('click', () => {
    container.style.height = "105px";
    if(locStatus)
    {
        locStatus = false;
        locationIcon.style.color = "red";
        cityInput.setAttribute('placeholder', "Enter the location");
        cityInput.disabled = false;
        cityInput.value = "";
    }
    else{
    navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        locStatus = true;
        locationIcon.style.color = "green";
        cityInput.setAttribute('placeholder', "Location Identified!");
        cityInput.disabled = true;
        cityInput.value = "";
    }, () => {
        console.log("Error");
        locStatus = false;
    });
}});

function fetchWeather (link) {
    
    fetch(link)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            const condition = json.weather[0].main;

            console.log(json);

            const imgNames = {
                'Clear': "sun.svg",
                'Rain': "rainy.svg",
                'Snow': "snowy.svg",
                'Clouds': "cloudy.svg",
                'Haze': "mist.png"
            };

            image.src = `images/${imgNames[condition]}`;

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
            cityInput.value = json.name;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

        });

}

search.addEventListener('click', () => {

    const APIKey = '299d336705271f1cad16d43a1066ec1d';
    let url;
    const city = cityInput.value;
    if(locStatus === true)
    {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`;
        fetchWeather(url);
    }
    else if (city === ''){
        alert("Please enter your location!")
        return;
    }
    else
    {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
        fetchWeather(url);
    }

});
