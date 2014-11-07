'use strict';

var gps = {
	theCnt: 0,


	getTS: function () {
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
	},

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
	doOnSuccess: function (idx, ts) {

		var onSuccess = function (position) {
			var outStr = 
				'Request #' + idx + ' @ ' + ts 	+ '<br>' +
				'Lat/Long: ' + position.coords.latitude + ' ' + position.coords.longitude + '<br>' +
				'Accuracy: ' + position.coords.accuracy + '<br>' +
				'done @ ' + gps.getTS() + '<br><br>';
		
			document.getElementById('wout').innerHTML += outStr;
		};
		return onSuccess;
	},

// onError Callback receives a PositionError object
//
	onError: function(error) {
		var outStr = 'Error code: '    + error.code    + '<br>' +
			  'message: ' + error.message + '<br><br>';
		document.getElementById('wout').innerHTML += outStr;
	},


	doBtnClick: function () {
	   navigator.geolocation.getCurrentPosition(gps.doOnSuccess(+gps.theCnt, gps.getTS()), gps.onError, 
									{ maximumAge: 1000, timeout: 5000, enableHighAccuracy: true });
		gps.theCnt += 1;
	}
};

// Call on Android device ready event
function init() {
  document.getElementById('getLoc').onclick = gps.doBtnClick;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
