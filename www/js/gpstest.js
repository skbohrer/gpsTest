'use strict';

var st = {
	noState: 0,
	approach: 1,
	near: 2,
	gone: 3,
	nearLimit: 40,
	goneLimit: 55
};


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
		{ stop: "Forest Hills", lat: 42.300749, lon: -71.114314 },


		{ stop: "Inb. Forest Hills", lat:42.300749, lon:-71.114314 },
		{ stop: "Inb. South St @ Spalding St", lat:42.303741, lon:-71.114635 },
		{ stop: "Inb. South St @ Child St", lat:42.306545, lon:-71.115144 },
		{ stop: "Inb. South St @ Sedgwick St", lat:42.308588, lon:-71.115487 },
		{ stop: "Inb. Centre St @ Seaverns Ave", lat:42.312198, lon:-71.114144 },
		{ stop: "Inb. Centre St @ Saint John St", lat:42.314197, lon:-71.114036 },
		{ stop: "Inb. Centre St @ Robinwood Ave", lat:42.316951, lon:-71.113368 },
		{ stop: "Inb. Centre St @ Roseway St", lat:42.318993, lon:-71.111932 },
		{ stop: "Inb. S Huntington Ave @ Perkins St", lat:42.321698, lon:-71.112025 },
		{ stop: "Inb. S Huntington Ave @ Bynner St", lat:42.32381, lon:-71.112191 },
		{ stop: "Inb. S Huntington Ave @ VA Hospital", lat:42.326594, lon:-71.111284 },
		{ stop: "Inb. S Huntington Ave @ Heath St", lat:42.328697, lon:-71.110671 },
		{ stop: "Inb. 100 S Huntington Ave", lat:42.329401, lon:-71.11093 },
		{ stop: "Inb. S Huntington Ave @ Huntington Ave", lat:42.33187, lon:-71.111965 },
		{ stop: "Inb. Huntington Ave @ Parker Hill Ave", lat:42.333092, lon:-71.109678 },
		{ stop: "Inb. Huntington Ave opp Fenwood Rd", lat:42.333704, lon:-71.105586 },
		{ stop: "Inb. Huntington Ave @ Wigglesworth St", lat:42.334833, lon:-71.102701 },
		{ stop: "Inb. Huntington Ave @ Longwood Ave", lat:42.335831, lon:-71.099868 },
		{ stop: "Inb. Huntington Ave @ Ruggles St", lat:42.337612, lon:-71.095267 },
		{ stop: "Inb. 360 Huntington Ave", lat:42.34016, lon:-71.088899 },
		{ stop: "Inb. Huntington Ave @ Gainsborough St", lat:42.341244, lon:-71.08651 },
		{ stop: "Inb. Belvidere St @ Huntington Ave", lat:42.345533, lon:-71.081932 },
		{ stop: "Inb. Back Bay", lat:42.347441, lon:-71.074592 }

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
				gps.setStopState(position.coords.latitude, position.coords.longitude);
			}
		};
		return onSuccess;
	},


	repeatSuccess: function(position) {
		var outStr = 
			'Pos Change' + ' @ ' + gps.getTS() 	+ 
			' -- Speed: '  + position.coords.speed + '<br>' +
			'Lat/Long: ' + position.coords.latitude + ' ' + position.coords.longitude + 
			' Accuracy: ' + position.coords.accuracy;
            
       	outStr += gps.distToTarg(position.coords.latitude, position.coords.longitude);
       	gps.lat = position.coords.latitude;
       	gps.lon = position.coords.longitude;
		gps.msg(outStr);
		gps.setStopState(gps.lat, gps.lon);
	},

// onError Callback receives a PositionError object
//
	onError: function(error) {
		var outStr = 'Error code: '    + error.code    + '<br>' +
			  'message: ' + error.message;
		gps.msg(outStr);
    },


	dist: function(lat1, lon1, lat2, lon2) {
		// haversine from https://rosettacode.org/wiki/Haversine_formula#C
		var dx, dy, dz, cosLat1, deg2rad = Math.PI/180, R = 6371000; // earth radius in metres
		
		lon1 -= lon2;
		lon1 *= deg2rad;
		lat1 *= deg2rad;
		lat2 *= deg2rad;

		dz = Math.sin(lat1) - Math.sin(lat2);
		cosLat1 = Math.cos(lat1);
		dx = Math.cos(lon1) * cosLat1 - Math.cos(lat2);
		dy = Math.sin(lon1) * cosLat1;

		return Math.round(Math.asin(Math.sqrt(dx*dx + dy*dy + dz*dz) / 2) * 2 * R);
	},

	distToTarg: function(lat1, lon1) {
		var dist;

		if ( !(gps.lat || gps.lon) ) {
			return '';		// no target
		}

		dist = gps.dist(lat1, lon1, gps.lat, gps.lon);
		return '<br>DeltaDist: ' + dist.toString();
	},


	doBtnClick: function() {
	   navigator.geolocation.getCurrentPosition(gps.doOnSuccess(+gps.theCnt, gps.getTS()), gps.onError, 
									{ maximumAge: 5000, timeout: 10000, enableHighAccuracy: true });
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
									{ maximumAge: 2000, timeout: 30000, enableHighAccuracy: true });
			gps.msg('StartWatch, ID is: '+ gps.watchID);
		}
	},

 	setPoint: function() {
	   navigator.geolocation.getCurrentPosition(gps.doOnSuccess(-1, gps.getTS()), gps.onError, 
									{ maximumAge: 5000, timeout: 10000, enableHighAccuracy: true });
	},

	getStopDist: function(obj, lat, lon) {
		return gps.dist(obj.lat, obj.lon, lat, lon);
	},

	curStop: null,
	state: st.noState,

	setStopState: function (curLat, curLon) {
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
		} else {
			return;
		}

		if ( minStop != gps.curStop ) {
			gps.curStop = minStop;
			gps.msg('* * Stop Changed * *');
			gps.state = st.approach;
		}
		if ( (gps.state === st.approach) && (minDist < st.nearLimit) ) {
			gps.state = st.near;
			gps.msg('* * Near Stop * *');
		}
		if ( (gps.state === st.near) && (minDist > st.goneLimit) ) {
			gps.state = st.gone;
			gps.msg('* * Left Stop * *');
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
