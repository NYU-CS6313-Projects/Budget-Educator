var url = 'https://aartyparty.cartodb.com/api/v2/viz/4f151fbe-f672-11e4-aa85-0e8dde98a187/viz.json';
var map;
var sublayerWithSpecificSchools;
var mapLayerWithAllSchools;
var arrSelectedSchools = new Array();
var arrSchoolTypes = new Array();
var isFirstTime = true;
var isFilteredByDropdown = false;
var isFilteredByTable = false;

cartodb.createVis('map', url)
	.done(function(vis, layers) {
		map = vis.getNativeMap();
		mapLayerWithAllSchools = layers[1].getSubLayer(0);

		cartodb.createLayer(map, url)		
			.addTo(map).on('done', function(layer) {	      					
				var subLayerOptions = {					
					cartocss: "#overview{marker-line-color: #fff; marker-width: 6; marker-fill-opacity: 1;}#overview_1[school_category='Early Childhood']{marker-fill: #A6CEE3;}#overview_1[school_category='Elementary']{marker-fill: #1F78B4;}#overview_1[school_category='High School']{marker-fill: #B2DF8A;}#overview_1[school_category='Intermediate']{marker-fill: #33A02C;}#overview_1[school_category='K-12']{marker-fill: #FB9A99;}#overview_1[school_category='K-8']{marker-fill: #E31A1C;}#overview_1[school_category='Secondary School']{marker-fill: #FDBF6F;}"		
				}		
		 		 
				sublayerWithSpecificSchools = layer.getSubLayer(0);
				sublayerWithSpecificSchools.set(subLayerOptions);

				hideSpecificSchoolsLayer();
			});		
	});

var updateMap = function(filterBy){

	if(filterBy === 'dropdown'){		
		mapLayerWithAllSchools.setSQL("SELECT * FROM overview_1 WHERE school_category IN (" + arrSchoolTypes + ")");
		if(isFilteredByTable){
			sublayerWithSpecificSchools.setSQL("SELECT * FROM overview_1 WHERE dbn IN (" + arrSelectedSchools + ") AND school_category IN (" + arrSchoolTypes + ")");
		}	
	}
	else if(filterBy === 'reset'){
		mapLayerWithAllSchools.setSQL("SELECT * FROM overview_1"); 
		if(isFilteredByTable){
			sublayerWithSpecificSchools.setSQL("SELECT * FROM overview_1 WHERE dbn IN (" + arrSelectedSchools + ")");
		}		
	}

}

var updateSpecificSchoolsLayer = function(){
	sublayerWithSpecificSchools.setSQL("SELECT * FROM overview_1 WHERE dbn IN (" + arrSelectedSchools + ")");	
	sublayerWithSpecificSchools.show();			
}

var hideSpecificSchoolsLayer = function(){
	sublayerWithSpecificSchools.hide();
}

var updateSelectedSchoolsFromLasso = function(schools){
	arrSelectedSchools = new Array();

	schools.forEach(function(currVal){
		arrSelectedSchools.push("'" + currVal + "'");
	});

	if(arrSelectedSchools.length != 0){
		isFilteredByTable = true;
		updateSpecificSchoolsLayer();
	}
	else{
		isFilteredByTable = false;
		hideSpecificSchoolsLayer();
	}
}

var updateSelectedSchoolsFromTable = function(){
	arrSelectedSchools = new Array();
	
	$(".schoolSelected").each(function(){
		arrSelectedSchools.push("'" + $(this)[0].id + "'");
	});

	if(arrSelectedSchools.length != 0){
		isFilteredByTable = true;
		updateSpecificSchoolsLayer();
	}
	else{
		isFilteredByTable = false;
		hideSpecificSchoolsLayer();
	}
	
}

var updateSchoolTypeFromDropdown = function(schoolType){
	if(!isFirstTime){
		arrSchoolTypes = new Array();
				
		schoolType.forEach(function(currVal){
			arrSchoolTypes.push("'" + currVal + "'");
		});		
		
		if(arrSchoolTypes.length != 0){
			isFilteredByDropdown = true;
			updateMap('dropdown');
		}
		else{
			isFilteredByDropdown = false;
			updateMap('reset');		
		}
		
	}
	isFirstTime = false;
}

$( "#reset" ).click(function() {	
	hideSpecificSchoolsLayer();
});