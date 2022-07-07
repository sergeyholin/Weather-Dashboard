// Imperial units of measurements: api.openweathermap.org/data/3.0/onecall?lat=30.489772&lon=-99.771335&units=imperial [NOTE:&units=imperial]
// ======================================================
// Geocoding, input city name and the geocoding api will give you Lat and Lon: (http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key})
// ====================================================
// API Plan: need at least 3 APIs: 1)Current weather APi (one call); 2)5 day forcast API; 3) Ability to take string with a city name, convert it to Lat & Long and make a call that way (for one call)
// Do a dummy call for each 1st thing to console log the data i want.
// I will also need to store searched city info to local storage and populate that as a button; also will need to find weather icons later.

// Pseudocode:

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// ONE CALL API:
// http://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API key}

// Geocoding API (for Lat & Lon):
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// ===============================================================================================
var apiKey = '7b95122b784c566e2d331e6ea12c89d2'
// var apiKey2 = 'f517beb5dd7c96915a88f80b6509932d'
// Later userSearch will be the value from my search form. It will go something like this:[var userSearch = document.getElementById('#searchInput').value]
var userSearch = "Sacramento"
// decalrin global variables for all functions to see
var lat;
var lon;
var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`
var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

// Fetching geocode to get lat and lon
getLatLon();
function getLatLon(){
fetch(geoApiUrl)
.then(function(response){
  return response.json();
}).then(function(data){
  console.log(data);
  // grabbing Lat & Lon from Geocoding API and turning them into a variable i can use for One Call API
  console.log("lat",data[0].lat)
  console.log("lon",data[0].lon)
  // giving value to global variables
  lat = data[0].lat;
  lon = data[0].lon;
  
  // Fetching CurrentWeather Data using previosly gotten Lat & Lon
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
  .then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    // Picking data that i want
    console.log("name",data.name)
    console.log("temp",data.main.temp)
    console.log("windSpeed",data.wind.speed)
    console.log("humidity",data.main.humidity)
    console.log("dt",data.dt)
    console.log("icon",data.weather[0])

  //  Testing create and append my data

    var box = document.getElementById("box")
    var city = document.getElementById("w1")
    var temp = document.getElementById("w2")
    var windSpeed = document.getElementById("w3")
    var humidity = document.getElementById("w4")
    var dt = document.getElementById("w5")

    city.textContent = "City: " + data.name + "," + data.dt;
    temp.textContent = "Temp: " +  data.main.temp + " \u00B0 F";
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
    humidity.textContent = "Humidity: " + data.main.humidity + " %";
    // dt.textContent = "Date " + data.dt;

    // appendChild(city);
    // appendChild(temp);
    // appendChild(windSpeed);
    // appendChild(humidity);
    // appendChild(dt);

    box.setAttribute("style", "padding: 10px; border: 2px solid black;");
    
  })
}
)};
