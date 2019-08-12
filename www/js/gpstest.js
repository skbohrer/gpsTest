'use strict';

var gps = {
	theCnt: 0,

	stops: [	
		{ stop: "Back Bay", lat: 42.347441, lon: -71.074592 },
		{ stop: "Huntington Ave @ Belvidere St", lat: 42.345344, lon: -71.082045 },
		{ stop: "Huntington Ave @ Gainsborough St", lat: 42.341443, lon: -71.086788 },
		{ stop: "Huntington Ave @ Opera Pl", lat: 42.340553, lon: -71.088908 },
		{ stop: "Huntington Ave @ Forsyth Way", lat: 42.339219, lon: -71.092168 },
		{ stop: "Huntington Ave @ Louis Prang St", lat: 42.337836, lon: -71.095698 },
		{ stop: "Huntington Ave @ Evans Way", lat: 42.336885, lon: -71.098086 },
		{ stop: "Huntington Ave @ Longwood Ave", lat: 42.336046, lon: -71.100251 },
		{ stop: "677 Huntington Ave", lat: 42.335111, lon: -71.102717 },
		{ stop: "Huntington Ave @ Fenwood Rd", lat: 42.333739, lon: -71.105717 },
		{ stop: "835 Huntington Ave opp Parker Hill Ave", lat: 42.33328, lon: -71.109273 },
		{ stop: "S Huntington Ave @ Huntington Ave", lat: 42.331803, lon: -71.112061 },
		{ stop: "105 S Huntington Ave", lat: 42.329368, lon: -71.111046 },
		{ stop: "S Huntington Ave opp VA Hospital", lat: 42.326625, lon: -71.111437 },
		{ stop: "S Huntington Ave @ Bynner St", lat: 42.323986, lon: -71.112327 },
		{ stop: "S Huntington Ave @ Perkins St", lat: 42.32172, lon: -71.112195 },
		{ stop: "S Huntington Ave @ Moraine St", lat: 42.319618, lon: -71.111729 },
		{ stop: "Centre St @ Lochstead Ave", lat: 42.317365, lon: -71.113229 },
		{ stop: "Centre St @ Myrtle St", lat: 42.313306, lon: -71.11416 },
		{ stop: "Centre St @ Burroughs St", lat: 42.311466, lon: -71.1145 },
		{ stop: "775 Centre St", lat: 42.309949, lon: -71.115345 },
		{ stop: "South St @ Bardwell St", lat: 42.308378, lon: -71.115619 },
		{ stop: "South St @ Jamaica St", lat: 42.306131, lon: -71.115091 },
		{ stop: "South St @ St Rose St", lat: 42.304396, lon: -71.114769 },
		{ stop: "Forest Hills", lat: 42.300749, lon: -71.114314 }
	], 

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
		var radLat1, radLat2, deltaradLat, deltaradLon, a, c, R = 6371e3; // metres

		function toRad(deg) {
			return Math.PI * deg / 180;
		}
		
		radLat1 = toRad(lat1);
		radLat2 = toRad(lat2);
		deltaradLat = toRad(lat2-lat1);
		deltaradLon = toRad(lon2-lon1);

		a = Math.sin(deltaradLat/2) * Math.sin(deltaradLat/2) +
		        Math.cos(radLat1) * Math.cos(radLat2) *
		        Math.sin(deltaradLon/2) * Math.sin(deltaradLon/2);

		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

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
	},

	getStopDist: function(obj, lat, lon) {
		return gps.dist(obj.lat, obj.lon, lat, lon);
	},

	minStopDist: function (curLat, curLon) {
		var i, curDist, minDist, minStop = null;

		for (i = 0; i < gps.stops.length; i += 1) {
			curDist = gps.getStopDist(gps.stops[i], curLat, curLon);
			if (( !minStop ) || curDist < minDist) {
				minDist = curDist;
				minStop = gps.stops[i];
			}
		}
		if ( minStop ) {
			gps.msg('Closest stop: ' + minStop.stop + ' Dist:' + minDist);
		}
	}
};

// Call on Android device ready event
function init() {
	document.getElementById('getLoc').onclick = gps.doBtnClick;
	document.getElementById('togWatch').onclick = gps.togWatch;
	document.getElementById('cls').onclick = gps.clear;
	document.getElementById('setPoint').onclick = gps.setPoint;
	gps.msg('Init Complete');
}

// Wait for device API libraries to load
document.addEventListener("deviceready", init, false);
