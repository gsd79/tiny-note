var mood;
var entries = {};

// function that displays date on page
var displayDate = function() {
  var date = moment().format("dddd, MMMM Do YYYY");

  var dateEl = $("<p>")
  .addClass("date-el font-weight-bold")
  .text(date);

  $(".todays-date").append(dateEl)
};

// add class that indicates which button has been selected
$("#entry-form").on("click", ".mood-button", function() {

  if ($(this).siblings("selected")) {
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected")
  }
});


// event handler that submits the form and saves to local storage
$("#entry-form").on("submit", function(event) {
  event.preventDefault();

  // grab date 
  var date = $(".header").children(".date-el").text();
  console.log(date);
  // grab text entry
  var text = $(this).children("#editor").text();
  console.log(text)
  // grab mood with if function
  var mood = $(".selected").text();
  console.log(mood)
  // save to 
  createEntry(date,text,mood);
})

// TODO: function that creates a record for that day's entry
var createEntry = function(date, text, mood) {
  var cardEl = $("<div>")
  .addClass("card mr-2 mb-2 w-50")

  var cardBodyEl = $("<div>")
  .addClass("card-body")

  var cardTitleEl = $("<p>")
  .addClass("card-title font-weight-bold")
  .text(date)

  var cardTextEl = $("<p>")
  .addClass("card-text")
  .text(text)

  var moodButtonEl = $("<button>")
  .addClass(`${mood} mood-button btn btn-light border`)
  .attr("type", "button")
  .text(mood);

  // append elements
  $("#load-area").append(cardEl);
  $(cardEl).append(cardBodyEl);
  $(cardBodyEl).append(cardTitleEl, cardTextEl, moodButtonEl);
  
  
}
// TODO: function that saves this record to local storage. place that within the createEntry function.



// TODO: function that loads the information from local storage and displays it on the page.

//TODO: concept: load information from local storage. display the date propeerty as a clickable link in sidebar. on click, display a modal that shows the record of the previous entry


// call function on page load
displayDate();

//weather api

// global variables
let latitude;
let longitude;
let counter = 1;
var apiKey = "de4084fe21aab085a9b43a06f4ecd035";
let date = moment();
let dateDisplay = moment().format("MM/D/YYYY");

$("document").ready(function() {
  loadSearchHistory();
});

var formSubmitHandler = function(event) {
  // prevent page refresh after form submission
  event.preventDefault();
  // get value from input element
  var city = $("#searchterm").val().trim();

  if (city) {
    getCoordinates(city);
    // reset display
    $("#forecasts").text("");
    
  } else {
    alert("Please enter a city!")
  }

};
// grab location coordinates
var getCoordinates = function(city) {
  // format the open weather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
  
  // make a get request to apiUrl
  fetch(apiUrl)
  .then(function(response) {
    // if response was successful
    if (response.ok) {
      response.json().then(function(data) {
        latitude = data.coord.lat;
        longitude = data.coord.lon;

        getForecast(latitude, longitude)
      });
    } else {
      alert("Error: " + response.statusText);
      $("#searchterm").val('');
    }
  })
  .catch(function(error) {
    alert("Unable to connect to OpenWeather. Try again later.")
  })
}

// grab forecast information
var getForecast = function (latitude, longitude) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +"&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

  // make a get request to apiUrl
  fetch(apiUrl)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        var forecast = data;
        displayTodaysForecast(forecast);
        displayFiveDayForecast(forecast);
      })
    } else {
      alert("Error: " + response.statusText);
      $("#searchterm").text('');
    }
  })
  .catch(function(error) {
    alert("Unable to connect to Open Weather. Try Again later." + error)
  })
}

// function that displays the current day's forecast 
var displayTodaysForecast = function(forecast) { 
  // check if api returned any forecast
  if (forecast.length === 0 ) {
    $("#today").text() = "No forecast found";
    return;
  }

  // create container 
  var todayContainerEl = $("<article>")
    .attr("id", "today")
    .addClass("today p-2 thick-border")


  // create header element
  var cityName = $("#searchterm").val();
  var headerEl = $("<h2>")
    .addClass("font-weight-bold city-name-header text-capitalize blue-text")
    .text(cityName)
  // create date element
  var dateEl = $("<span>")
    .addClass("font-weight-bold date-header ml-2 mr-2")
    .text(dateDisplay);

  var icon = forecast.current.weather[0].icon;
  var iconSrc = "http://openweathermap.org/img/w/" + icon + ".png"; 

  var iconContainer = $("<div>")
    .addClass("lg-img-container d-inline-block")

  var iconEl = $("<img>")
    .addClass("img-size")
    .attr("src", iconSrc)

  // create temperature element
  var temperature = forecast.current.temp;
  var tempEl = $("<p>")
    .addClass("temperature")
    .text("Temp: " + temperature + "° F");


  // create humidity p element
  var humidity = forecast.current.humidity;
  var humidityEl = $("<p>")
    .addClass("humidity")
    .text("Humidity: " + humidity + "%");

  // create wind speed p element
  var windSpeed = forecast.current.wind_speed;
  var windSpeedEl = $("<p>")
    .addClass("wind-speed")
    .text("Wind: " + windSpeed + " MPH");

  // create uv index span elements
  var uvIndexLabel = $("<span>")
    .text("UV Index: ");

  var uvIndex = forecast.current.uvi;

  if (uvIndex <= 2) {
    // if uv index is favorable, change the span background to green
    var uvIndexEl = $("<span>")
      .addClass("uv-index p-1 rounded favorable")
      .text(uvIndex);
  } else if (uvIndex >= 3 && uvIndex <= 7) {
    // if uv index is moderate, change the span background to yellow
    var uvIndexEl = $("<span>")
      .addClass("uv-index p-1 rounded moderate")
      .text(uvIndex);
  } else if (uvIndex >= 8) {
    // if uv index is severe, change the span background to red
    var uvIndexEl = $("<span>")
      .addClass("uv-index p-1 rounded severe")
      .text(uvIndex);
  }

  // append elements

  $(dateEl).append(iconContainer)
  $(iconContainer).append(iconEl);
  $("#forecasts").append(todayContainerEl);
  $(headerEl).append(dateEl)
  $(todayContainerEl).append(headerEl, tempEl, humidityEl, windSpeedEl, uvIndexLabel, uvIndexEl);
};

// function that displays the five-day forecast 
var displayFiveDayForecast = function(forecast) {
  // create container
  var forecastContainerEl = $("<article>")
    .attr("id", "five-day")
    .addClass("five-day-container row d-flex justify-content-around mb-3 mt-3");

  var forecastHeaderEl = $("<h3>")
    .addClass("font-weight-bold w-100 ml-3 blue-text")
    .text("5-Day Forecast");

  $(forecastContainerEl).append(forecastHeaderEl)

  // for loop that creates elements for the upcoming five day forecast
  for (var i = 0; i < 5; i++) {
    // increment the date on each loop
    forecastDate = moment(date).add(counter, 'days');
    forecastDateDisplay = moment(forecastDate).format("MM/D/YYYY");
    counter++;
    // set variables for card information
    var temp = forecast.daily[i].temp.day;
    var wind = forecast.daily[i].wind_speed;
    var humidity = forecast.daily[i].humidity;
    var icon = forecast.daily[i].weather[0].icon;
    var iconSrc = "http://openweathermap.org/img/w/" + icon + ".png";

    // create the card for each day
    var dayCard = $("<div>")
      .addClass("card text-left p-2 mr-3 small-gradient")


    var dateEl = $("<p>")
      .addClass("forecast-date font-weight-bold text-light")
      .text(forecastDateDisplay);


    var iconEl = $("<div>")
      .attr("id", "icon-container")

    var imgEl = $("<img>")
      .attr("id", "icon")
      .attr("src", iconSrc)
    
    var tempEl = $("<p>")
      .addClass("forecast-temp text-light")
      .text("Temp: " + temp + "° F")

    var windEl = $("<p>")
      .addClass("forecast-wind text-light")
      .text("Wind: " + wind + " MPH");

    var humidityEl = $("<p>")
      .addClass("forecast-humidity text-light")
      .text("Humidity: " + humidity + "%")

    //append to the card
    $(iconEl).append(imgEl);
    $(dayCard).append(dateEl,iconEl, tempEl, windEl, humidityEl);
    // append to the container
    $(forecastContainerEl).append(dayCard)
  }
  counter = 1;
  // append elements
  $("#forecasts").append(forecastContainerEl);
};

// function that creates search history button elements
var createSearchHistoryButton = function (event) {
  // create button
  var searchKeyword = $(".search-keyword").val();
  var historyButton = $("<button>")
    .attr("type", "submit")
    .addClass("history-button btn btn-secondary mb-1 text-capitalize light-grey")
    .attr("id", `${searchKeyword}`)
    .text(searchKeyword);

  // append to the search History
  $("#search-history").append(historyButton);
  saveHistory();
}

// save to localStorage
var saveHistory = function () {
  let searchHistory = $("#search-history").children();
  for (j = 1; j < searchHistory.length; j++) {
    var keyword = searchHistory[j].textContent;
    localStorage.setItem(`Previous Search #${[j]}`, keyword);
  }
}

// function to handle resubmission
var buttonClickHandler = function () {
  // remove text from searchbox
  $("#searchterm").val('');
  // replace with button text
  var newSearch = $(this).text();
  $("#searchterm").val(newSearch);
  formSubmitHandler(event);
  
}


//

// event handlers
$("#search-form").on("submit", formSubmitHandler);

$("#search-form").on("submit", createSearchHistoryButton);

$("#search-history").on("click", "button", buttonClickHandler);
