var url = 'https://aartyparty.cartodb.com/api/v2/viz/2ab32f3e-ede5-11e4-a96e-0e43f3deba5a/viz.json';
var map;
var mapLayerWithAllSchools;
var arrSelectedSchools = new Array();

cartodb.createVis('map', url)
	.done(function(vis, layers) {
		map = vis.getNativeMap();
		mapLayerWithAllSchools = layers[1].getSubLayer(0);	
	});

var updateMap = function(){

	// console.log("SELECT * FROM overview WHERE dbn IN (" + arrSelectedSchools + ")");

	mapLayerWithAllSchools.setSQL("SELECT * FROM overview WHERE dbn IN (" + arrSelectedSchools + ")"); 
}

var updateSelectedSchoolsFromTable = function(){
	arrSelectedSchools = new Array();
	$(".schoolSelected").each(function(){
		arrSelectedSchools.push("'" + $(this)[0].id + "'");
	});
	updateMap();
}