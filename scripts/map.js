var map;

function initialize() {
	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(40.7, -74)
	};
	map = new google.maps.Map(document.getElementById('map-container'),
		mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);