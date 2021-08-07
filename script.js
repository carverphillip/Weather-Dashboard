// These are global variables where the array will called cityArea
var ListofCities = [];
var cityname;

// local storage functions
stateCities();
initWeather();


// This function displays the city entered by the user along with a for loop that will continously look at the list and allow for the user to add more cities into the list
function stateCities(){
    $("#ListofCities").empty();
    $("#cityInput").val("");
    
    for (i=0; i<ListofCities.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", ListofCities[i]); //Will allow for the list of cities to populate after entered in by the user. 
        a.text(ListofCities[i]);
        $("#ListofCities").prepend(a);
    } 
}

// The function initListofCities will pull the list of city names from the local storage 
function initListofCities() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        ListofCities = storedCities;
    }
    
    stateCities();
    }

// This function pull the current city into local storage to display the current weather forecast on reload
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cityname = storedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
function storeAreaArray() {
    localStorage.setItem("cities", JSON.stringify(ListofCities));
    }

// This function saves the currently display city to local storage
function storePresentCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityname));
}
      

// Click event handler for city search button
$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (ListofCities.length >= 5){  
        ListofCities.shift();
        ListofCities.push(cityname);

    }else{
    ListofCities.push(cityname);
    }
    storePresentCity();
    storeAreaArray();
    stateCities();
    displayWeather();
    displayFiveDayForecast();
});

// Event handler for if the user hits enter after entering the city search term
$("#cityInput").keypress(function(e){
    if(e.which == 13){
        $("#citySearchBtn").click();
    }
})

// This function runs the Open Weather API AJAX call and displays the current city, weather, and 5 day forecast to the DOM
async function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);

        var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
        var getPresentCity = response.name;
        var date = new Date();
        var val=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        var getCurrentWeatherIcon = response.weather[0].icon;
        var displayPresentWeatherSymbol = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
        var currentCity = $("<h3 class = 'card-body'>").text(getPresentCity+" ("+val+")");
        currentCity.append(displayPresentWeatherSymbol);
        currentWeatherDiv.append(currentCityEl);
        var getTemp = response.main.temp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        var getHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
        var getLongitude = response.coord.lon;
        var getLatitude = response.coord.lat;
        
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat="+getLatitude+"&lon="+getLongitude;
        var uvResponse = await $.ajax({
            url: uvURL,
            method: "GET"
        })

        // getting UV Index info and setting color class according to value
        var getUVIndex = uvResponse.value;
        var uvNumber = $("<span>");
        if (getUVIndex > 0 && getUVIndex <= 2.99){
            uvNumber.addClass("low");
        }else if(getUVIndex >= 3 && getUVIndex <= 5.99){
            uvNumber.addClass("moderate");
        }else if(getUVIndex >= 6 && getUVIndex <= 7.99){
            uvNumber.addClass("high");
        }else if(getUVIndex >= 8 && getUVIndex <= 10.99){
            uvNumber.addClass("vhigh");
        }else{
            uvNumber.addClass("extreme");
        } 
        uvNumber.text(getUVIndex);
        var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
        uvNumber.appendTo(uvIndexEl);
        currentWeatherDiv.append(uvIndexEl);
        $("#weatherContainer").html(currentWeatherDiv);
}

// This function runs the AJAX call for the 5 day forecast and displays them to the DOM
async function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=d3b85d453bf90d469c82e650a0a3da26";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
      var forecastDiv = $("<div  id='fiveDayForecast'>");
      var forecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
      forecastDiv.append(forecastHeader);
      var cardDeck = $("<div  class='card-deck'>");
      forecastDiv.append(cardDeck);
      
      console.log(response);
      for (i=0; i<5;i++){
          var forecastCard = $("<div class='card mb-3 mt-3'>");
          var cardBody = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h5 class='card-title'>").text(val);
          
        cardBody.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        console.log(getCurrentWeatherIcon);
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        cardBody.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        cardBody.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
      }
      $("#forecastContainer").html(forecastDiv);
    }

// The function historyDisplayWeather is calling the other functions from throughout the code
function historyDisplayWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityname);
    
}

$(document).on("click", ".city", historyDisplayWeather);