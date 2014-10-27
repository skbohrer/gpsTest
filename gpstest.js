'use strict';


// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


function doBtnClick () {
   navigator.geolocation.getCurrentPosition(onSuccess, onError, 
								{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
}

// Call on Android device ready event
function init() {
  document.getElementById('getLoc').onclick = doBtnClick;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
