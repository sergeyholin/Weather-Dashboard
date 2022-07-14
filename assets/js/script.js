// ===============================================================================================
var apiKey = 'f517beb5dd7c96915a88f80b6509932d'
var lat;
var lon;
var userSearch;
var searchHistory = [];
var today = moment();
// Main get the weather function===================================================================
function getWeather(){
// This line of code gets user input, stores it in the array and creates and appends the button with the city name under search bar.
var userSearch = $("#search").val().trim()
if (!searchHistory.includes(userSearch)) {
  searchHistory.push(userSearch);
  var searchedCity = $(`<button class="btn btn-secondary btn-block" id="city-button">${userSearch}</button>`); 
  $("#center").append(searchedCity);
};
// Pushing searched city name into local storage array
localStorage.setItem("city", JSON.stringify(searchHistory));
console.log(searchHistory);
// This line of code clears input field, when one of the previosly searched cities button is pushed
$(document).on("click", "#city-button", function() {
  document.getElementById("search").value = "";
});
// This line of code puts the name of the city on the button, and if clicked, it populates the data on the page with the city assosiated with that button
$(document).on("click", "#city-button", function() {
  var listCity = $(this).text();
  console.log(listCity)
  var text = document.getElementById('search');
  text.value += listCity;
  getWeather();
});
// Getting Geolocation
fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`)
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
  // Picking data that i neeed
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
  var icon = document.getElementById("ww1")
  // Adding styling, icon & units of measurement to data
  city.textContent = "City: " + data.name + ", " + today.format("L") ;
  temp.textContent = "Temp: " +  data.main.temp + " \u00B0 F";
  windSpeed.textContent = "Wind Speed: " + data.wind.speed + " MPH";
  humidity.textContent = "Humidity: " + data.main.humidity + " %";
  icon.src = "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png";
  box.setAttribute("style", "padding: 10px; border: 2px solid black;");
  // Geting UV index and appending it to HTML---------------------------------------------------------
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
  .then(function(response){
  return response.json();
  }).then(function(data){
  // Getting and appending UV Data
  console.log(data);
  console.log("uvIndex",data.current.uvi)
  var uvi = document.getElementById("w5")
  uvi.textContent = "UV Index: ";
  var uvIndex = data.current.uvi
  var uviEl = $(`<span id="uvi-color" class="px-1 py-1 rounded">${uvIndex}</span>`);
  $("#w5").append(uviEl);
  // Setting color code on UVI
  if (uvIndex >= 0 && uvIndex <= 3) {
    $("#uvi-color").css("background-color", "green")
  } else if (uvIndex >= 3 && uvIndex <= 6) {
    $("#uvi-color").css("background-color", "yellow")
  } else if (uvIndex >= 6 && uvIndex <= 9) {
    $("#uvi-color").css("background-color", "orange")
  } else if (uvIndex >= 9) {
    $("#uvi-color").css("background-color", "red")
  };
  // Activating 5 day forecast function
  getFiveDayForecast();
  })
  })
  }
  )};
// Five Day Forecast Function=========================================================================
function getFiveDayForecast(){
  // Grabbing user input
  var userSearch = document.getElementById('search').value;
  console.log(userSearch);
  // Fetching Geolocation function API
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userSearch}&limit=5&appid=${apiKey}`)
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
  // Fetching 5 day forecast API
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
  .then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    // Card 1, grabbing the data that i need----------------------------------------------------------
    console.log("icon1",data.list[1].weather[0].icon)
    console.log("temp1",data.list[1].main.temp)
    console.log("wind1",data.list[1].wind.speed)
    console.log("humidity1",data.list[1].main.humidity)
    // Dynamically appending data to the HTML
    var h4 = document.getElementById("h4")
    var day1 = moment().add(1,'days');
    var box1 = document.getElementById("box-1")
    var date1 = document.getElementById("w1-1")
    var icon1 = document.getElementById("w2-1")
    var temp1 = document.getElementById("w3-1")
    var windSpeed1 = document.getElementById("w4-1")
    var humidity1 = document.getElementById("w5-1")
     // Adding styling, icon & units of measurement to data
    box1.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    h4.textContent = "5-Day Forecast:";
    date1.textContent = day1.format("L");
    temp1.textContent = "Temp: " + data.list[1].main.temp + " \u00B0 F";
    windSpeed1.textContent = "Wind: " + data.list[1].wind.speed + " MPH";
    humidity1.textContent = "Humidity: " + data.list[1].main.humidity + " %";
    icon1.src = "https://openweathermap.org/img/wn/"+data.list[1].weather[0].icon+"@2x.png";
    // Card 2, grabbing the data that i need----------------------------------------------------------
    console.log("icon2",data.list[9].weather[0].icon)
    console.log("temp2",data.list[9].main.temp)
    console.log("wind2",data.list[9].wind.speed)
    console.log("humidity2",data.list[9].main.humidity)
    // Dynamically appending data to the HTML
    var day2 = moment().add(2,'days');
    var box2 = document.getElementById("box-2")
    var date2 = document.getElementById("w1-2")
    var icon2 = document.getElementById("w2-2")
    var temp2 = document.getElementById("w3-2")
    var windSpeed2 = document.getElementById("w4-2")
    var humidity2 = document.getElementById("w5-2")
     // Adding styling, icon & units of measurement to data
    box2.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date2.textContent = day2.format("L");
    temp2.textContent = "Temp: " + data.list[9].main.temp + " \u00B0 F";
    windSpeed2.textContent = "Wind: " + data.list[9].wind.speed + " MPH";
    humidity2.textContent = "Humidity: " + data.list[9].main.humidity + " %";
    icon2.src = "https://openweathermap.org/img/wn/"+data.list[9].weather[0].icon+"@2x.png";
    // Card 3, grabbing the data that i need----------------------------------------------------------
    console.log("icon3",data.list[17].weather[0].icon)
    console.log("temp3",data.list[17].main.temp)
    console.log("wind3",data.list[17].wind.speed)
    console.log("humidity3",data.list[17].main.humidity)
    // Dynamically appending data to the HTML
    var day3 = moment().add(3,'days');
    var box3 = document.getElementById("box-3")
    var date3 = document.getElementById("w1-3")
    var icon3 = document.getElementById("w2-3")
    var temp3 = document.getElementById("w3-3")
    var windSpeed3 = document.getElementById("w4-3")
    var humidity3 = document.getElementById("w5-3")
     // Adding styling, icon & units of measurement to data
    box3.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date3.textContent = day3.format("L");
    temp3.textContent = "Temp: " + data.list[17].main.temp + " \u00B0 F";
    windSpeed3.textContent = "Wind: " + data.list[17].wind.speed + " MPH";
    humidity3.textContent = "Humidity: " + data.list[17].main.humidity + " %";
    icon3.src = "https://openweathermap.org/img/wn/"+data.list[17].weather[0].icon+"@2x.png";
    // Card 4, grabbing the data that i need----------------------------------------------------------
    console.log("icon4",data.list[25].weather[0].icon)
    console.log("temp4",data.list[25].main.temp)
    console.log("wind4",data.list[25].wind.speed)
    console.log("humidity4",data.list[25].main.humidity)
    // Dynamically appending data to the HTML
    var day4 = moment().add(4,'days');
    var box4 = document.getElementById("box-4")
    var date4 = document.getElementById("w1-4")
    var icon4 = document.getElementById("w2-4")
    var temp4 = document.getElementById("w3-4")
    var windSpeed4 = document.getElementById("w4-4")
    var humidity4 = document.getElementById("w5-4")
     // Adding styling, icon & units of measurement to data
    box4.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date4.textContent = day4.format("L");
    temp4.textContent = "Temp: " + data.list[25].main.temp + " \u00B0 F";
    windSpeed4.textContent = "Wind: " + data.list[25].wind.speed + " MPH";
    humidity4.textContent = "Humidity: " + data.list[25].main.humidity + " %";
    icon4.src = "https://openweathermap.org/img/wn/"+data.list[25].weather[0].icon+"@2x.png";
    // Card 5, grabbing the data that i need----------------------------------------------------------
    console.log("icon5",data.list[33].weather[0].icon)
    console.log("temp5",data.list[33].main.temp)
    console.log("wind5",data.list[33].wind.speed)
    console.log("humidity5",data.list[33].main.humidity)
    // Dynamically appending data to the HTML
    var day5 = moment().add(5,'days');
    var box5 = document.getElementById("box-5")
    var date5 = document.getElementById("w1-5")
    var icon5 = document.getElementById("w2-5")
    var temp5 = document.getElementById("w3-5")
    var windSpeed5 = document.getElementById("w4-5")
    var humidity5 = document.getElementById("w5-5")
     // Adding styling, icon & units of measurement to data
    box5.setAttribute("style", "color: white; background-color: grey; padding-left: 10px; padding-bottom: 1px;");
    date5.textContent = day5.format("L");
    temp5.textContent = "Temp: " + data.list[33].main.temp + " \u00B0 F";
    windSpeed5.textContent = "Wind: " + data.list[33].wind.speed + " MPH";
    humidity5.textContent = "Humidity: " + data.list[33].main.humidity + " %";
    icon5.src = "https://openweathermap.org/img/wn/"+data.list[33].weather[0].icon+"@2x.png";
  })
  })
};
// ===================================================================================================
