// Function to get all selected school's DBN
// $(".schoolSelected").each( function(index, school){ console.log( school.id ); } );
var padding_height = 70,
		padding_width = 110,
		columnwidth = ( $('#scatterplot').width() - padding_width ),
		documentHeight = ($(document).height() - 51 - (2 * padding_height));

var width = columnwidth,
		height = documentHeight,
		data,
		filtered;

var colorMap = {
	'Early Childhood': '#A6CEE3',
	'Elementary': '#1F78B4',
	'High School': '#B2DF8A',
	'Intermediate': '#33A02C',
	'K-12': '#FB9A99',
	'K-8': '#E31A1C',
	'Secondary School': '#FDBF6F'
}

d3.selection.prototype.moveToFront = function(){
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

// Save tableData to a variable so it doesn't need to be constantly passed through parameters
var cacheData = function( tableData ){ data = tableData; }

var fetchFilteredData = function(){ return filtered; }

// Repopulate the scatterplot based on some yAxisLabel
var populatePlot = function( table, plot, yAxisLabel, schoolType ){	
	updateSchoolTypeFromDropdown(schoolType);
	filtered = data.filter(function(d) { 

		// Remove nulls and empty strings
		if( (d[yAxisLabel]) && (d[yAxisLabel].replace(/ /g,'') != "") ){
			if( schoolType.length > 0  )
				return ($.inArray(d["School Category"], schoolType) > -1);
			else
				return true;
		}
		else{
			return false;
		}
	});

	filtered = filtered.sort( function(a,b) {
		return d3.ascending(a[yAxisLabel].toLowerCase(), b[yAxisLabel].toLowerCase());
	});


	// Get x-axis (budget per student) scale
	var x_range = d3.extent(filtered, function (d, i) { return parseFloat(d["Budget Per Student"]); });
	var x_scale = d3.scale.linear()
					.domain([0, x_range[1]])
					.range([padding_width,width+(padding_width/2)])
					.nice();

	// Get y-axis scale 
	var y_range = d3.extent(filtered, function(d, i) { 
		if( !isNaN(d[yAxisLabel]) ){ 
			return Math.ceil(parseFloat(d[yAxisLabel]));
		}
	});


	var y_scale;
	if( isNaN(parseFloat(y_range[0])) ){
		y_scale = d3.scale.ordinal()
					.domain(filtered.map(function (d) { return d[yAxisLabel]; } ))
					.rangeBands([0, height], 1);
	}
	else{
		y_scale = d3.scale.linear()
					.domain([y_range[1], 0])
					.range([padding_height,height])
					.nice();
	}

	// Create the axes and have their tick markers create a grid-like pattern
	var xAxis = d3.svg.axis().scale(x_scale).orient("bottom").tickSize(-height+padding_height/2);
	var yAxis = d3.svg.axis().scale(y_scale).orient("left").tickSize(-width+padding_width/2);

	// Append x-axis to scatterplot. 
	// Move axis to bottom of graph and rotate text slightly to fit values. Do not rotate 0
	plot.select(".x.axis")
		.attr("transform", "translate(0," + height + ")" )
		.transition()
			.duration(filtered.length + 750)
		.call(xAxis)
        .selectAll("text")
            .attr("transform", function(d){ if(d) return "translate(0," + padding_height/4 + "), rotate(-65)"})

	plot.select(".y.axis")
		.attr("transform", "translate(" + padding_width + ",0)" )
		.transition()
			.duration(filtered.length + 750)
		.call(yAxis);
	plot.select(".y.label")
		.text("Y-Axis: " + yAxisLabel);

	// Track what points were selected before updating the graph
    var selection = [];
    table.selectAll(".schoolSelected").each(function(d,i){
    	selection.push( d["DBN"] );
    });

	// Retrieve old points, if any
	var oldPlots = plot.selectAll("circle")
						.data(filtered);

	// Update the values of existing points
	oldPlots.transition()
				.duration(filtered.length + 750)
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return y_scale(d[yAxisLabel]);  },
				"r": function(d)  { return ( d[yAxisLabel] ) ? 3 : 0; }
			})
			.style('fill', function(d){ return colorMap[d['School Category']]; })
			.style('stroke-width', 0 )
			.style('stroke', function(d){ return d3.rgb(colorMap[d['School Category']]).brighter(1.5); });

	// Append new points if needed
    oldPlots.enter()
	        .append("circle")
	        	.attr('cy', 0)
	        	.attr('r', 0)
        		.style('opacity', 0)
			.transition()
				.duration(filtered.length + 750)
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return y_scale(d[yAxisLabel]);  },
				"r": function(d)  { return ( d[yAxisLabel] ) ? 3 : 0; }
			})
			.style('fill', function(d){ return colorMap[d['School Category']]; })
			.style('stroke-width', 0 )
			.style('stroke', function(d){ return d3.rgb(colorMap[d['School Category']]).brighter(1.5); })
			.style('opacity', 0.3)

	// Remove points that no longer apply
	oldPlots.exit()
			.transition()
				.duration(filtered.length)
			.attr("r", 0)
			.remove();

	// Reset the table, has to be here due to asynchronous D3
	var shownSchools = [];
	filtered.forEach( function(d,i){
		shownSchools.push( d["DBN"] );
    	$( "#" + d["DBN"] + " .data" )
    		.html( "<i>(" + yAxisLabel + ": " + ((d[yAxisLabel].trim() !== "" ) ? d[yAxisLabel] : "N/A") + ")</i>" );
	});
	limitSchoolCategory(shownSchools);

	// Update the highlights
    highlight(selection, table); 
    applyLasso( plot );
    sortBySelection(true, yAxisLabel);
}

var loadScatterPlot = function(){

	var plot = d3.select("#scatterplot")
					.append("svg")
					.attr("width", width + padding_width)
					.attr("height", height + padding_height)
					.style("cursor", "crosshair");

	// "Border" off the scatterplot
	plot.append("rect").attr({
		"width": width - padding_width/2,
		"height": height - padding_height/2,
		"fill": "none",
		"stroke": "lightgray",
		"transform": "translate(" + padding_width + " " + padding_height/2 + ")"
	});

	var xAxis = d3.svg.axis().orient("bottom");
	var yAxis = d3.svg.axis().orient("left");

	plot.append("g").attr("class", "x axis").call(xAxis);
	plot.append("g").attr("class", "y axis").call(yAxis);

    plot.append("text")
        	.attr("class", "x label")
        	.attr("text-anchor", "center")
        	.attr("x", (width+padding_width/2)/2)
        	.attr("y", height + padding_height - 15)
        	.text("Budget Per Student");

	plot.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "center")
    	.attr("transform", "translate(" + (width + (padding_width/2) + 12) + ", " + padding_height/2 + ") rotate(90)")
    	.text("Y-Axis");


	return plot;
}

// Based off of URL:
// jsfiddle.net/pPMqQ/34/
var applyLasso = function( plot ){
	var table = $("table")[0].rows;
	var dataPoints = plot.selectAll("circle").data(filtered);

	var coords = [];
	var line = d3.svg.line();
	var drag = d3.behavior.drag()

					// Begin drag event
					.on("dragstart", function(){
						coords = [];
						svg = d3.select(this);

						// Clear previous selections and lines
						d3.selectAll("svg path").remove();
						svg.select(".selection").remove();

						// Append selection line
						svg.append("path")
							.attr("class", "selection");
					})

					// During drag event
					.on("drag", function(){

						// Track mouse
						coords.push(d3.mouse(this));
						svg = d3.select(this);

						// Update selection line to mouse's path
						svg.select(".selection")
							.attr({
								d: line(coords)
							});

						// Find out which points were inside the draw path
						

						var selected = [];

						// If shift clicked, get old selection to "union" with
						if( d3.event.sourceEvent.shiftKey ){
							d3.selectAll('.highlighted').each(function(d,i){
								selected.push(d['DBN']);
							});
						}

						svg.selectAll("circle").each(function(d, i) {
							var point = [d3.select(this).attr("cx"), d3.select(this).attr("cy")];
							if( pointInPoly(point, coords) ){
								selected.push(d["DBN"]);
							}
						});

						highlight(selected, table);
						updateSelectedSchoolsFromLasso(selected);

						if( table.length > 0 ){
							// Update list of schools based on selected
							selected.forEach( function( selectedDBN ){
								table[selectedDBN].setAttribute("class", "schoolSelected" );
							});
						}

						// From table.js
						sortBySelection(true);
					})

					// Remove the path after the drag ends
					.on("dragend", function(){
						var svg = d3.select(this);

						// Remove all paths if user just clicks 
						if( coords.length === 0 ){
							d3.selectAll("svg path").remove();
							unhighlight(table);
							hideSpecificSchoolsLayer();
							sortBySelection(false);
							return;
						}

						// Clear the drag trace from the plot
						d3.selectAll("svg path").remove();
					});

	plot.call(drag);
}

var pointInPoly = function(point, vs){
	var xi,xj,i,intersect,
		x = point[0],
		y = point[1],
		inside = false;

	for( var i = 0, j = vs.length-1; i < vs.length; j = i++ ){
		xi = vs[i][0],
		yi = vs[i][1],
		xj = vs[j][0],
		yj = vs[j][1],
		intersect = ((yi > y) != (yj  > y)) &&
					(x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if( intersect ) inside = !inside;
	}
	return inside;
}

var unhighlight = function(table){
	d3.selectAll("circle").classed("highlighted", false);
	if( table.length > 0 ){
		// Update list of schools based on selected
		for( var i = 0; i < table.length; ++i ){
			if( table[i].className == "schoolSelected" )
				table[i].className = "";
		}
	}
}

var highlight = function(schools, table){
	unhighlight(table);
	d3.selectAll("circle").data(filtered).filter(function(d,i){
		return schools.indexOf(d["DBN"]) > -1;
	}).classed("highlighted", true);

}



