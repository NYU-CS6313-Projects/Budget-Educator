var excludes = ['DBN', 'School Name', 'Street Address', 'City', 'State', 
	'Zip Code', 'Borough', 'Latitude', 'Longitude', 'Coordinates', 'Budget',
	'Budget Per Student'];
var schoolType = ['Elementary', 'Junior High-Intermediate-Middle', 'K-8', 
	'Secondary School', 'Early Childhood', 'High school', 'K-12 all grades' ];

var tabulate = function (data,columns) {
  var table = d3.select('#directory')
	var thead = table.append('thead')
	var tbody = table.append('tbody')
 
	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })
 
	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')
	  .attr('id', function (d) { return d['DBN']; } )
	  .on( 'click', function() {
		  $( this ).toggleClass( 'schoolSelected' );
		});

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

d3.csv("overview.csv", function( directory ) {
	var columns = [], yAxis = [], key;

  for ( key in directory[0] ) {
      if ( directory[0].hasOwnProperty(key)) {
      	if( key == 'DBN' || key == 'School Name' ) columns.push( key );
      	else if( $.inArray( key, excludes ) == -1 ) yAxis.push( key );
      }
  }

  for( var i = 0; i < yAxis.length; i++ ){
		$( "<li/>", {
  		html: "<a href='#'>" + yAxis[i] + "</a>",
		  click: function() {
		    // Function to change or reload scatterplot here
		    $( this ).toggleClass( 'dropdownSelected' );
		  }
		})
		  .appendTo( $("#y-axis") );
  }

  for( var i = 0; i < schoolType.length; i++ ){
  	$( "<li/>", {
  		html: "<a href='#'>" + schoolType[i] + "</a>",
		  click: function() {
		    // Function to filter by schools
		    $( this ).toggleClass( 'dropdownSelected' );
		  }
		})
		  .appendTo( $("#school-type") );
  }

  tabulate( directory, columns );
})
