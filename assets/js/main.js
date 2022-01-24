var mood;
var entries = {};
var apiKey = "de4084fe21aab085a9b43a06f4ecd035";

// function that displays date on page
var displayDate = function() {
  var date = moment().format("dddd, MMMM Do YYYY, h:mm a");

  var dateEl = $("<p>")
  .addClass("date-el font-weight-bold")
  .text(date);

  $(".todays-date").append(dateEl)
};

// call weather api 
var formSubmitHandler = function(event) {
  // prevent page refresh after form submission
  event.preventDefault();
  // get value from input element
  var city = $("#searchterm").val().trim();

  if (city) {
    console.log(city)
    // reset display
    getCoordinates(city)
    $("#forecasts").text("");
    
  } else {
    errorMessage();
  }
};

var errorMessage = function() {
  var alertText = "City not found."

  var alertEl = $("<p>")
  addClass("alert-text")
  text(alertText)

  $("#search-form").append(alertEl);
}

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
      $("#searchterm").val('');
    }
  })
  .catch(function(error) {
    alert("Unable to connect to OpenWeather. Try again later.")
  })
}

// grab forecast information
var getForecast = function (latitude, longitude) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude +"&exclude=minutely,hourly,alerts,daily&units=imperial&appid=" + apiKey;

  // make a get request to apiUrl
  fetch(apiUrl)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        var forecast = data;
        displayTodaysForecast(forecast)
      })
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    alert("Unable to connect to Open Weather. Try Again later." + error)
  })
}

// function that displays the forecast 
var displayTodaysForecast = function(forecast) { 
  // check if api returned any forecast
  if (forecast.length === 0 ) {
    $("#today").text() = "No forecast found";
    return;
  }

  // weather variables
  var temp = forecast.current.temp;
  var description = forecast.current.weather[0].description;
  var iconCode = forecast.current.weather[0].icon;
  var iconSrc ="http://openweathermap.org/img/wn/" +iconCode+ ".png"


  // create elements
  var resultsContainerEl = $("<div>")
  .addClass("weather-container container-border");

  var tempEl = $("<h2>")
  .addClass("temperature")
  .text("Temp: " + temp);

  var iconContainerEl = $("<div>")
  .addClass("icon-container")

  var iconEl = $("<img>")
  .attr("src", iconSrc)

  var descriptionEl = $("<p>")
  .addClass("weather-description")
  .text(description)
  // append elements
  $("#weather-results").append(resultsContainerEl);
  $(resultsContainerEl).append(tempEl, iconContainerEl, descriptionEl)
  $(iconContainerEl).append(iconEl)
}

// add class that indicates which button has been selected
$("#entry-form").on("click", ".mood-button", function() {

  if ($(this).siblings("selected")) {
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected")
  }
});

// event handler that submits the form, captures the relevant data, and saves to local storage
$("#entry-form").on("submit", function(event) {
  event.preventDefault();

  // grab date 
  var date = $(".todays-date").text();
  console.log(date);
  // grab text entry
  var text = $("#editor").text();
  console.log(text)
  // grab mood with if function
  var mood = $(".selected").text();
  console.log(mood)

  var weather = $(".temperature").text();
  console.log(weather)
  // save to 
  // createEntry(date,text,mood,weather);
})

//  function that creates a record for that day's entry
var createEntry = function(date, text, mood, weather) {
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





// call function on page load
displayDate();
$("#search-form").on("submit", formSubmitHandler);
