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
var doOnSuccess = function (idx, ts) {

	var onSuccess = function (position) {
		var outStr = 
			'Request #' + idx + ' @ ' + ts 							+ '<br>' +
			'Lat/Long: ' + position.coords.latitude + ' ' + position.coords.longitude + '<br>' +
			'Accuracy: ' + position.coords.accuracy          + '<br>' +
			'done @ ' + getTS() + '<br><br>';
	
		document.getElementById('wout').innerHTML += outStr;
	};
	return onSuccess;
};

// onError Callback receives a PositionError object
//
function onError(error) {
    var outStr = 'Error code: '    + error.code    + '<br>' +
          'message: ' + error.message + '<br><br>';
	document.getElementById('wout').innerHTML += outStr;
}


function doBtnClick () {
   navigator.geolocation.getCurrentPosition(doOnSuccess(+theCnt, getTS()), onError, 
								{ maximumAge: 1000, timeout: 5000, enableHighAccuracy: true });
	theCnt += 1;
}

// Call on Android device ready event
function init() {
  document.getElementById('getLoc').onclick = doBtnClick;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
