// This array holds the column names of those we are excluding from Y-Axis
var excludes = ['DBN', 'School Name', 'Street Address', 'City', 'State', 
	'Zip Code', 'Borough', 'Latitude', 'Longitude', 'Coordinates', 'Budget',
	'Budget Per Student', 'Number of Students Tested for ELA', 
	'Number of Students Scoring Level 1 in ELA', 'Still Enrolled - n',
	'Number of Students Scoring Level 2 in ELA', 'Dropped Out - n',
	'Number of Students Scoring Level 3 in ELA', 'Advanced Regents - n',
	'Number of Students Scoring Level 4 in ELA', 'Regents without Advanced - n',
	'Number of Students Tested for Math', 'Number of Regents in Cohort',
	'Number of Students Scoring Level 1 in Math', 
	'Number of Students Scoring Level 2 in Math', 
	'Number of Students Scoring Level 3 in Math',
	'Number of Students Scoring Level 4 in Math',
	'Number of Graduation Students in Cohort'];

// This array holds the distinct school types from the list of schools
// Currently implemented this way instead of adding each distinct school type as
// one iterates through the data mainly to save on 1000+ checks
var schoolCategory = ['Elementary', 'Intermediate', 'K-8', 
	'Secondary School', 'Early Childhood', 'High School', 'K-12' ];

// Function to create the table given the data and the column names --- tabulate
var tabulate = function (data, columns) {
  var table = d3.select('#directory')
	var thead = table.append('thead')
	var tbody = table.append('tbody')
 
 	// Adds the column headers
	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })
 
 	// Adds the individual rows
	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')
	  .attr('id', function (d) { return d['DBN']; } )
	  .on( 'click', function() {
	  	// If you click on the row, it adds or removes the .schoolSelected class
		  $( this ).toggleClass( 'schoolSelected' );
		});

	// Adds the individual cells per row
	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td')
      .text(function (d) { return d.value })
 
  return table;
}

var appendToDropdown = function( ddID, ddArr, callFunction ){
  for( var i = 0; i < ddArr.length; i++ ){
    $( "<li/>", {
      html: "<a href='#'>" + ddArr[i] + "</a>",
      click: callFunction
    })
      .appendTo( $(ddID) );
  }
}

var loadInterface = function( directory ){
	var columns = [], yAxis = [], key;

	// Gets all the names of the (first) object's (school's) attributes and
	// allocates them into either y-Axis array or column array (for sidebar)
	for ( key in directory[0] ) {
	  if ( directory[0].hasOwnProperty(key)) {
	    if( key == 'School Name' ) columns.push( key );
	    else if( $.inArray( key, excludes ) == -1 ) yAxis.push( key );
	  }
	}
	// Add elements required for dropdown for y-axis, only one may be selcted
	appendToDropdown( "#y-axis", yAxis, function() {
	    $( "#y-axis li" ).removeClass( 'dropdownSelected' );
	    $( this ).addClass( 'dropdownSelected' );
	    $( "#y-axis-label" ).text( "Y-Axis: " + $( "#y-axis > .dropdownSelected > a" ).text() );
	  } );

	// Add elements required for dropdown for school type, many may be selected
	appendToDropdown( "#school-category", schoolCategory, function() {
	    $( this ).toggleClass( 'dropdownSelected' );

	    var selection = [];
	    $( "#school-category > .dropdownSelected > a" ).each(function( index ) {
			  if( selection.length < 2 ) selection.push( $(this).text() );
			});

			$("#school-category-label").text( "School Category: " + selection.join( ", ") 
				+ ( ( $( "#school-category > .dropdownSelected > a" ).size() > 2 ) ? ", ..." : "" ) );
	  } );

	// Select the first entry in the y-axis dropdown 
	$( "#y-axis li:first-child" ).addClass( 'dropdownSelected' );

	// Return the table obj that contains all the school data
  	return tabulate( directory, columns );

}

var sortBySelection = function( bySelection ){
	var table = $("table");
	if( bySelection ){
		table.prepend( table.find( 'tr.' + "schoolSelected"));
	}
	else{
		var tableBody = d3.select("tbody");
		tableBody.selectAll("tr").sort( function(a, b){
			return d3.ascending(a["School Name"].toLowerCase(), b["School Name"].toLowerCase());
		});
	}
}

var limitSchoolCategory = function( showingSchoolsByDBN ){
	$( "#directory tr" ).each(function( index ) {
		// it will be displayed
		if( showingSchoolsByDBN.indexOf( $( this ).attr( 'id' ) ) > -1) $(this).show();
		else $(this).hide();
  });
}

var showAllTableEntries = function(){
	$( "#directory tr" ).each(function( index ) {
		$(this).show();
	});
}
