
var remove = function( id, removingClass ){
  $( id ).each(function( index ) {
      $( this ).removeClass( removingClass );
    });
}

// Imports the CSV, fills in the Y-Axis listing and school listing in table
d3.csv("overview.csv", function( directory ) {
  var categories = [];

  // Initialize the interface and save the table for faster lookup
  var table = loadInterface( directory );

  // Store the directory into a var in scatterplot.js to prevent having to pass data around more than once
  cacheData( directory );

  // Load up and populate the scatterplot
  var initialY = $('#y-axis li.dropdownSelected a')[0].text;
  var plot = loadScatterPlot();
  populatePlot( table, plot, initialY, categories );
  sortBySelection(false);

  // Configure the y-axis dropdown to update the scatterplot on click
  $('#y-axis li a').on('click', function(e){
    populatePlot( table, plot, $(this)[0].text, categories );
    sortBySelection(true, $(this)[0].text);
  });

  // Configure the school category dropdown to update the scatterplot 
  $('#school-category').on('click', function(e){
    var ylabel = $("#y-axis .dropdownSelected a")[0].text;

    // Update the scatterplot based on what school categories to focus on
    categories = [];
    $("#school-category .dropdownSelected a").each(function(index, category){
      categories.push(category.text);
    })

    populatePlot( table, plot, ylabel, categories );

  });

  // Configure each school selection to update the scatterplot on click
  $('#directory').on('click', function(e){
    var selection = [];
    $(".schoolSelected").each( function(index, school){ 
      selection.push( school.id ); 
    });
    highlight(selection, table);
    sortBySelection(true);
  });

  $( "#reset" ).on('click', function() {

    $("#y-axis-label").text( "Y-Axis: " );
    $("#school-category-label").text( "School Category: " );
    remove( "#y-axis li", 'dropdownSelected' );
    remove( "#school-category li", 'dropdownSelected' );
    remove( ".schoolSelected", 'schoolSelected' );

    // Default y-axis selection to the first item
    $( "#y-axis li:first-child" ).addClass( 'dropdownSelected' );
    categories = [];

    highlight( [], table);
    showAllTableEntries();
    sortBySelection( false );
    populatePlot( table, plot, 'Total Enrollment', categories );
  });
});