// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
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




// var userSearch = document.getElementById('#search').value
// console.log(userSearch)
// var userSearch = "Sacramento"
// decalrin global variables for all functions to see
var lat;
var lon;
var userSearch;
var c;
// var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`
// var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
// var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

var today = moment();

// Fetching geocode to get lat and lon

function getCurrentWeather(){

var userSearch = document.getElementById('search').value;
console.log("input",userSearch);
// button.value = text
var button = document.createElement("button");
var p = document.createElement ("p")
var body = document.getElementById("center")
body.appendChild(button);
button.textContent = userSearch;
localStorage.setItem("cities", JSON.stringify(userSearch));
button.setAttribute("class", "btn btn-primary btn-lg btn-block");
// button.setAttribute("value", "userSearch");
button.setAttribute("id", "last-city");
button.setAttribute("onclick","test();");
// button.setAttribute("onclick", "getCurrentWeather();");

body.appendChild(p)


fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`)
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
    console.log("icon",data.weather[0].icon)
    // Dynamically appending data to the HTML
    var box = document.getElementById("box")
    var city = document.getElementById("w1")
    var temp = document.getElementById("w2")
    var windSpeed = document.getElementById("w3")
    var humidity = document.getElementById("w4")
    var uvi = document.getElementById("w5")
    var icon = document.getElementById("ww1")

    city.textContent = "City: " + data.name + ", " + today.format("L") ;
    temp.textContent = "Temp: " +  data.main.temp + " \u00B0 F";
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
    humidity.textContent = "Humidity: " + data.main.humidity + " %";
    icon.src = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";

    box.setAttribute("style", "padding: 10px; border: 2px solid black;");
    // Geting UV index and appending it to HTML
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    }).then(function(data){
      console.log(data);
      console.log("uvIndex",data.current.uvi)

      uvi.textContent = "UV Index: " + data.current.uvi;
      // uvi.setAttribute("style", "background-color: green;");
      getFiveDayForecast();

    })
    
    })
}
)};
// 5 day forecast
// getFiveDayForecast();

function getFiveDayForecast(){
  var userSearch = document.getElementById('search').value;
  console.log(userSearch);
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`)
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

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)

  .then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    // Card 1
    console.log("icon1",data.list[3].weather[0].icon)
    console.log("temp1",data.list[3].main.temp)
    console.log("wind1",data.list[3].wind.speed)
    console.log("humidity1",data.list[3].main.humidity)

    var h4 = document.getElementById("h4")
    var day1 = moment().add(1,'days');
    var box1 = document.getElementById("box-1")
    var date1 = document.getElementById("w1-1")
    var icon1 = document.getElementById("w2-1")
    var temp1 = document.getElementById("w3-1")
    var windSpeed1 = document.getElementById("w4-1")
    var humidity1 = document.getElementById("w5-1")

    box1.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    h4.textContent = "5-Day Forecast:";
    date1.textContent = day1.format("L");
    temp1.textContent = "Temp: " + data.list[3].main.temp + " \u00B0 F";
    windSpeed1.textContent = "Wind: " + data.list[3].wind.speed + " MPH";
    humidity1.textContent = "Humidity: " + data.list[3].main.humidity + " %";
    icon1.src = "http://openweathermap.org/img/wn/"+data.list[3].weather[0].icon+"@2x.png";
    // Card 2
    console.log("icon2",data.list[11].weather[0].icon)
    console.log("temp2",data.list[11].main.temp)
    console.log("wind2",data.list[11].wind.speed)
    console.log("humidity2",data.list[11].main.humidity)

    var day2 = moment().add(2,'days');
    var box2 = document.getElementById("box-2")
    var date2 = document.getElementById("w1-2")
    var icon2 = document.getElementById("w2-2")
    var temp2 = document.getElementById("w3-2")
    var windSpeed2 = document.getElementById("w4-2")
    var humidity2 = document.getElementById("w5-2")

    box2.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date2.textContent = day2.format("L");
    temp2.textContent = "Temp: " + data.list[11].main.temp + " \u00B0 F";
    windSpeed2.textContent = "Wind: " + data.list[11].wind.speed + " MPH";
    humidity2.textContent = "Humidity: " + data.list[11].main.humidity + " %";
    icon2.src = "http://openweathermap.org/img/wn/"+data.list[11].weather[0].icon+"@2x.png";
    // Card 3
    console.log("icon3",data.list[19].weather[0].icon)
    console.log("temp3",data.list[19].main.temp)
    console.log("wind3",data.list[19].wind.speed)
    console.log("humidity3",data.list[19].main.humidity)

    var day3 = moment().add(3,'days');
    var box3 = document.getElementById("box-3")
    var date3 = document.getElementById("w1-3")
    var icon3 = document.getElementById("w2-3")
    var temp3 = document.getElementById("w3-3")
    var windSpeed3 = document.getElementById("w4-3")
    var humidity3 = document.getElementById("w5-3")

    box3.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date3.textContent = day3.format("L");
    temp3.textContent = "Temp: " + data.list[19].main.temp + " \u00B0 F";
    windSpeed3.textContent = "Wind: " + data.list[19].wind.speed + " MPH";
    humidity3.textContent = "Humidity: " + data.list[19].main.humidity + " %";
    icon3.src = "http://openweathermap.org/img/wn/"+data.list[19].weather[0].icon+"@2x.png";
    // Card 4
    console.log("icon4",data.list[27].weather[0].icon)
    console.log("temp4",data.list[27].main.temp)
    console.log("wind4",data.list[27].wind.speed)
    console.log("humidity4",data.list[27].main.humidity)

    var day4 = moment().add(4,'days');
    var box4 = document.getElementById("box-4")
    var date4 = document.getElementById("w1-4")
    var icon4 = document.getElementById("w2-4")
    var temp4 = document.getElementById("w3-4")
    var windSpeed4 = document.getElementById("w4-4")
    var humidity4 = document.getElementById("w5-4")

    box4.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date4.textContent = day4.format("L");
    temp4.textContent = "Temp: " + data.list[27].main.temp + " \u00B0 F";
    windSpeed4.textContent = "Wind: " + data.list[27].wind.speed + " MPH";
    humidity4.textContent = "Humidity: " + data.list[27].main.humidity + " %";
    icon4.src = "http://openweathermap.org/img/wn/"+data.list[27].weather[0].icon+"@2x.png";
    // Card 5
    console.log("icon5",data.list[35].weather[0].icon)
    console.log("temp5",data.list[35].main.temp)
    console.log("wind5",data.list[35].wind.speed)
    console.log("humidity5",data.list[35].main.humidity)

    var day5 = moment().add(5,'days');
    var box5 = document.getElementById("box-5")
    var date5 = document.getElementById("w1-5")
    var icon5 = document.getElementById("w2-5")
    var temp5 = document.getElementById("w3-5")
    var windSpeed5 = document.getElementById("w4-5")
    var humidity5 = document.getElementById("w5-5")

    box5.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date5.textContent = day5.format("L");
    temp5.textContent = "Temp: " + data.list[35].main.temp + " \u00B0 F";
    windSpeed5.textContent = "Wind: " + data.list[35].wind.speed + " MPH";
    humidity5.textContent = "Humidity: " + data.list[35].main.humidity + " %";
    icon5.src = "http://openweathermap.org/img/wn/"+data.list[35].weather[0].icon+"@2x.png";
  })
  })
}

function test () {
var grabButton = document.getElementById('last-city')
var search = document.getElementById('search')
console.log("TEST BUTTON NAME",$(grabButton).text())
userSearch = $(grabButton).text()
};

// Local storage function-------------------
// Function to store input in local storage.
// function userInput () {
//   var input = document.getElementById('#search').value;
//   localStorage.setItem("input", input);
//   renderLastInput();
// };
// // Function to render input from local storage.
// function renderLastInput() {
//   var event1 = document.querySelector("#event1");
//   var input = localStorage.getItem("input");
//   event1.textContent = input;
// };
// // ------------------------------------
// var userSearch = document.getElementById('search').value;
// console.log(userSearch);
// localStorage.setItem("", userSearch);
