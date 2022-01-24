var mood;
var entries = [];
var apiKey = "de4084fe21aab085a9b43a06f4ecd035";
var date = moment().format("dddd, MMMM Do");

// function that displays date on page
var displayDate = function() {

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
  .addClass("alert-text")
  .text(alertText)

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
  // temp obj
  var entry = {};
  //load date into object
  entry.date = date;
  entry.text = text;
  entry.mood = mood;
  entry.weather = weather;
  // push into entries array
  entries.push(entry);

  localStorage.setItem("entries", JSON.stringify(entries));
  createEntry(date,text,mood,weather);

  
})

//  function that creates a record for that day's entry
var createEntry = function(date, text, mood, weather) {
  var entryDivEl = $("<div>")
  .addClass("entry-card")
  var buttonEl = $("<button>")
  .addClass("btn previous-entry hover:skew-y-6")
  .attr("type", "button");

  var anchorEl = $("<a>")
  .addClass("previous-link")
  .text(date);
  var textEl = $("<p>")
  .addClass("previous-date")
  .text(text);
  var moodEl = $("<p>")
  .addClass("previous-mood")
  .text(mood);
  var tempEl = $("<p>")
  .addClass("previous-temp")
  .text(weather);
  // append elements
  $(buttonEl).append(anchorEl);
  $(entryDivEl).append(buttonEl, textEl, moodEl, tempEl);
  $(".previous-date-container").append(entryDivEl)
}

// load entries from local storage then display on page
var loadEntries = function () {
  entries = JSON.parse(localStorage.getItem("entries"));

  if (!entries) {
    entries =[];
  }
  // loop over
  entries.forEach(function(entry) {
    createEntry(entry.date, entry.text, entry.mood, entry.weather)
  })

}


// call function on page load
displayDate();
$("#search-form").on("submit", formSubmitHandler);
loadEntries();
