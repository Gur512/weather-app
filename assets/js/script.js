'use strict';

import * as utils from "./utils.js";

const cityName = utils.select('.city');
const temp = utils.select('.temp');
const humidity = utils.select('.humidity');
const wind = utils.select('.wind');
const serachBox = utils.select('.search input');
const searchBtn = utils.select('.search button');
const weatherIcon = utils.select('.weather-icon');
const weather = utils.select('.weather');
const error = utils.select('.error');
const titleText = utils.select('.title');
const nextDayIcon = utils.selectAll('.next-day-icon');
const nextDayCondition = utils.selectAll('.next-day-condition');
const nextDayTemp = utils.selectAll('.next-day-temp');
const nextDayDates = utils.selectAll('.next-day-date');
serachBox.value = "";


const apiKey = "3c7cd185f37c4056814ca5f548e68bc0";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const weatherIcons = {
  "Clouds": "./assets/imgs/clouds.png",
  "Clear": "./assets/imgs/clear.png",
  "Rain": "./assets/imgs/rain.png",
  "Drizzle": "./assets/imgs/drizzle.png",
  "Mist": "./assets/imgs/mist.png",
  "Snow": "./assets/imgs/snow.png",
};

async function checkWeather(city) { 
  const response = await fetch(apiURL + city + `&appid=${apiKey}`);

  if(response.status == 404){
    error.style.display = "block";
    weather.style.display = "none";
  } else {
    let data = await response.json();

    cityName.innerText = data.name;
    temp.innerText = Math.round(data.main.temp) + "°C";
    humidity.innerText = data.main.humidity + "%";
    wind.innerText = data.wind.speed + "km/h";
  
    weatherIcon.src = weatherIcons[data.weather[0].main] || "./assets/imgs/default.png"; 

    error.style.display = "none";
    weather.style.display = "block";

    checkNextDayForecast(city);
  
  }
}

async function checkNextDayForecast(city) {
  try {
    const response = await fetch(forecastURL + city + `&appid=${apiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      const nextDays = data.list.filter((_, index) => index % 8 === 0); 

      
      const threeDays = nextDays.slice(0, 3); 

   
      threeDays.forEach((nextDay, index) => {
        if (nextDayCondition[index] && nextDayTemp[index] && nextDayIcon[index] && nextDayDates[index]) {
          nextDayCondition[index].innerText = nextDay.weather[0].main;
          nextDayTemp[index].innerText = Math.round(nextDay.main.temp) + "°C";
          nextDayIcon[index].src = weatherIcons[nextDay.weather[0].main] || "./assets/imgs/default.png";
          
          
          const today = new Date();
          const nextDayDate = new Date(today);
          nextDayDate.setDate(today.getDate() + index);  
          const options = { month: 'short', day: 'numeric' };
          nextDayDates[index].innerText = nextDayDate.toLocaleDateString('en-US', options);
        }
      });
    } else {
      console.error('Error fetching forecast data:', response.status);
    }
  } catch (err) {
    console.error('Error fetching forecast data:', err);
  }
}


utils.listen('click', searchBtn, () => {
  checkWeather(serachBox.value);
  titleText.style.display = 'none';
});

utils.listen('load', window, () => {
  serachBox.focus();
});
