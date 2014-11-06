'use strict';

var theCnt = 0;


function getTS() {
	var d = new Date();
	
	function twoDgt(n) {
		var retval; 	
		if ( n < 10 ) {
			retval = "0" + n.toString();
		}
		else {
			retval = n.toString();
		}
		return retval;
	}
	
	return twoDgt(d.getHours()) + ":" + twoDgt(d.getMinutes()) + ":" + twoDgt(d.getSeconds());
}

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function (position, idx, ts) {
    var outStr = 
		  'Request #' + idx + ' @ ' + ts 							+ '<br>' +
		  'Latitude: '          + position.coords.latitude          + '<br>' +
          'Longitude: '         + position.coords.longitude         + '<br>' +
          'Altitude: '          + position.coords.altitude          + '<br>' +
          'Accuracy: '          + position.coords.accuracy          + '<br>' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br>' +
          'Heading: '           + position.coords.heading           + '<br>' +
          'Speed: '             + position.coords.speed             + '<br>' +
          'Timestamp: '         + position.timestamp                + '<br>' +
		  'done @ ' + getTS() + '<br><br>';
	
	document.getElementById('wout').innerHTML += outStr;
};

// onError Callback receives a PositionError object
//
function onError(error) {
    var outStr = 'Error code: '    + error.code    + '<br>' +
          'message: ' + error.message + '<br><br>';
	document.getElementById('wout').innerHTML += outStr;
}


function doBtnClick () {
   navigator.geolocation.getCurrentPosition(function(position) {onSuccess(position, +theCnt, getTS());}, onError, 
								{ maximumAge: 1000, timeout: 5000, enableHighAccuracy: true });
	theCnt += 1;
}

// Call on Android device ready event
function init() {
  document.getElementById('getLoc').onclick = doBtnClick;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
