
//stateRatings is a list of all the rated states in <state-2-letter-code-all-caps>:<rating-int-from-1-to-10> format
stateRatings = {};

//The list of the displayed colors from 1 to 10.
ratingColors = ["#585858", "#680000", "#B80000", "#FF0000", "#FF7400",
                "#FFB900", "#FFF300", "#A3D700", "#36A300", "#006C05"];

ratingFluff = ["Irredeemable", "Awful", "Bad", "Mediocre", "Average", "Fair", "Good", "Very Good", "Excellent", "Outstanding"];

//The currently selected rating.  
var selectedRating = 10;
var remainingUnratedStates = 50;

/**
 * Sets up the US map and any event handlers associated with it.
 */
function initMap() {
    createMap();
    setupMapClickEvent();
}

/**
 * Creates the US map in #map using the US map Jquery plugin:  https://github.com/NewSignature/us-map
 */
function createMap() {
    $('#map').usmap({
        stateStyles: {fill: 'white'},
        stateHoverStyles: {fill: 'white'},
        stateHoverAnimation: 50
    });
}

/**
 * Sets up the click event for the map.
 */
function setupMapClickEvent() {
    $('#map').on('usmapclick', function(event, data) {
        applyRatingToState(data.name.toUpperCase());
        updateStatesRatedCounter();
    });
}

/**
 * Called when a state is clicked on.  Stores the rating for that state, and updates the display.
 */
function applyRatingToState(stateId) {
    storeRatingForLater(stateId);
    updateStateFillColor(stateId);
}

/**
 * Stores the current ratings for the map, which will be sent to the server when the ratings are submitted.
 */
function storeRatingForLater(stateId) {
    if(stateId !== "DC") { //don't bother storing DC, you can barely see it.
        stateRatings[stateId] = selectedRating;
        console.log(JSON.stringify(stateRatings));
    }
}

/**
 * uses the currently selected rating to color this state using the ratingColors array.
 */
function updateStateFillColor(stateId) {
    var fillStyle = {};
    fillStyle[stateId] = {fill:ratingColors[selectedRating - 1]};
    // Using mutable options from https://github.com/NewSignature/us-map/pull/18
    $('#map').usmap('stateSpecificStyles', fillStyle);
}

function updateStatesRatedCounter() {
    remainingUnratedStates = 50 - Object.keys(stateRatings).length;
    $('#ratingCounter').html(remainingUnratedStates + " states remaining");
}

/**
 * creates the 10 rating buttons with onclick events.
 */
function initRatingButtons() {
    for(var i = 1; i <= 10; i++) {
        $('#ratingPickBox').append("<button id='ratingButton" + i + 
                "' style='background-color:" + ratingColors[i - 1] + 
                "' onclick='selectedRating = " + i + "' class='ratingButton'>" +
                i + " - " + ratingFluff[i - 1] + "</button>");
    }
}

function sendRatingsToServer() {
    $.ajax({
        type: 'POST',
        data: JSON.stringify(stateRatings),
        contentType: 'application/json',
        url: 'http://localhost:3000/api',						
        success: function(data) {
            console.log('successfully delivered the ratings to the server');
        }
    });
}

/**
 * Initialize the page
 */
$(document).ready(function() {
    initMap();
    initRatingButtons();
});

/**
 * Send the stateRatings JSON object to the server when submit is clicked
 */
$('#submitButton').click(function(e){
    e.preventDefault();
    if(remainingUnratedStates > 0) {
        if(!confirm("There are " + remainingUnratedStates + " states you left blank.  "
                +  "Submit anyways?")) {
            return;
        }
    }
    sendRatingsToServer();
});


