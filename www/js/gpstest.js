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

	msg: function (outStr) {
		document.getElementById('wout').innerHTML += (outStr + '<br><br>');
	},


	clear: function() {
		document.getElementById('wout').innerHTML = '';
	},

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
	doOnSuccess: function (idx, ts) {

		var onSuccess = function (position) {
			var outStr = 
				'Request #' + idx + ' @ ' + ts 	+ '<br>' +
				'Lat/Long: ' + position.coords.latitude + ' ' + position.coords.longitude + 
				' Accuracy: ' + position.coords.accuracy + 
				'  done @ ' + gps.getTS();

			if (idx === -1) {
				gps.lat = position.coords.latitude;
				gps.lon = position.coords.longitude;
				gps.msg('Set Point: ' + gps.lat + ' ' + gps.lon);
				document.getElementById('lat').innerHTML = gps.lat;
				document.getElementById('lon').innerHTML = gps.lon;
			} else {
		        outStr += gps.distToTarg(position.coords.latitude, position.coords.longitude);
				gps.msg(outStr);
			}
		};
		return onSuccess;
	},


	repeatSuccess: function(position) {
		var outStr = 
			'Pos Change' + ' @ ' + gps.getTS() 	+ '<br>' +
			'Lat/Long: ' + position.coords.latitude + ' ' + position.coords.longitude + 
			' Accuracy: ' + position.coords.accuracy + '<br>' +
            'Speed: '  + position.coords.speed +
            ' Timestamp: ' + position.timestamp;

        outStr += gps.distToTarg(position.coords.latitude, position.coords.longitude);
	
		gps.msg(outStr);
	},

// onError Callback receives a PositionError object
//
	onError: function(error) {
		var outStr = 'Error code: '    + error.code    + '<br>' +
			  'message: ' + error.message;
		gps.msg(outStr);
    },


	dist: function(lat1, lon1, lat2, lon2) {
		// haversine from https://www.movable-type.co.uk/scripts/latlong.html 
		var R = 6371e3; // metres
		var φ1 = lat1.toRadians();
		var φ2 = lat2.toRadians();
		var Δφ = (lat2-lat1).toRadians();
		var Δλ = (lon2-lon1).toRadians();

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return R * c;
	},

	distToTarg: function(lat1, lon1) {
		var dist;

		if ( !(gps.lat || gps.lon) ) {
			return '';		// no target
		}

		dist = gps.dist(lat1, lon1, gps.lat, gps.lon);
		return ' Dist: ' + dist.toString();
	},


	doBtnClick: function() {
	   navigator.geolocation.getCurrentPosition(gps.doOnSuccess(+gps.theCnt, gps.getTS()), gps.onError, 
									{ maximumAge: 2000, timeout: 10000, enableHighAccuracy: true });
		gps.theCnt += 1; 
	},

	watchID: null,

	togWatch: function() {
		if ( gps.watchID ) {
			gps.msg('EndWatch, ID was: ' + gps.watchID);
			navigator.geolocation.clearWatch(gps.watchID);
			gps.watchID = null;
		} else {
			gps.watchID = navigator.geolocation.watchPosition(gps.repeatSuccess, gps.onError, 
									{ maximumAge: 5000, timeout: 30000, enableHighAccuracy: true });
			gps.msg('StartWatch, ID is: '+ gps.watchID);
		}
	},

 	setPoint: function() {
	   navigator.geolocation.getCurrentPosition(gps.doOnSuccess(-1, gps.getTS()), gps.onError, 
									{ maximumAge: 2000, timeout: 10000, enableHighAccuracy: true });
	}

};

// Call on Android device ready event
function init() {
	document.getElementById('getLoc').onclick = gps.doBtnClick;
	document.getElementById('togWatch').onclick = gps.togWatch;
	document.getElementById('cls').onclick = gps.clear;
	document.getElementById('setPoint').onclick = gps.setPoint;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
