var mood;
var entries = {};

// function that displays date on page
var displayDate = function() {
  var date = moment().format("dddd, MMMM Do YYYY, h:mm a");

  var dateEl = $("<p>")
  .addClass("date-el font-weight-bold")
  .text(date);

  $(".header").append(dateEl)
};

// add class that indicates which button has been selected
$("form").on("click", ".mood-button", function() {

  if ($(this).siblings("selected")) {
    $(this).siblings().removeClass("selected");
    $(this).addClass("selected")
  }
});


// event handler that submits the form and saves to local storage
$("form").on("submit", function(event) {
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