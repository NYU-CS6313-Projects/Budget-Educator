// Function to get all selected school's DBN
// $(".schoolSelected").each( function(index, school){ console.log( school.id ); } );
var width = $(document).width() * 0.35,
	height = $(document).height() * 0.75,
	padding = 40,
	data;

// Save tableData to a variable so it doesn't need to be constantly passed through parameters
var cacheData = function( tableData ){ data = tableData; }

// Repopulate the scatterplot based on some yAxisLabel
var populatePlot = function( plot, yAxisLabel ){
	console.log( yAxisLabel );

	// Get x-axis (budget per student) scale
	var x_range = d3.extent(data, function (d, i) { return parseInt(d["Budget Per Student"]); });
	var x_scale = d3.scale.linear()
					.domain([0, x_range[1]])
					.range([padding,width]);

	// Get y-axis scale (only accounting for numeric data like student math exam proficiency for now)
	var y_range = d3.extent(data, function(d, i) { if( !isNaN(d[yAxisLabel]) ) return parseInt(d[yAxisLabel]); });
	var y_scale = d3.scale.linear()
					.domain([y_range[1], 0])
					.range([padding,height]);

	// Create the axes and have their tick markers create a grid-like pattern
	var xAxis = d3.svg.axis().scale(x_scale).orient("bottom").tickSize(-height+padding/2);
	var yAxis = d3.svg.axis().scale(y_scale).orient("left").tickSize(-width+padding/2);

	// Append x-axis to scatterplot. 
	// Move axis to bottom of graph and rotate text slightly to fit values. Do not rotate 0
	plot.select(".x.axis")
		.attr("transform", "translate(0," + height + ")" )
		.transition()
			.duration(750)
		.call(xAxis)
        .selectAll("text")
            .attr("transform", function(d){ if(d) return "translate(0," + padding/2 + "), rotate(-65)"});

	plot.select(".y.axis")
		.attr("transform", "translate(" + padding + ",0)" )
		.transition()
			.duration(750)
		.call(yAxis);

	// Retrieve old points, if any
	var oldPlots = plot.selectAll("circle")
						.data(data, function(d){ return d["DBN"]; });

	// Update the values of existing points
	oldPlots.transition()
				.duration(750)
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return( isNaN(d[yAxisLabel]) ) ? 0 : y_scale(d[yAxisLabel]);  },
				"r": function(d)  { return( isNaN(d[yAxisLabel]) ) ? 0 : 5; }
			});

	// Append new points if needed
    oldPlots.enter()
	        .append("circle")
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return( isNaN(d[yAxisLabel]) ) ? 0 : y_scale(d[yAxisLabel]);  },
				"r": function(d)  { return( isNaN(d[yAxisLabel]) ) ? 0 : 5; }
			})
				.style('opacity', 0)
			.transition()
				.duration(750)
				.style('opacity', 0.3)

	// Remove points that no longer apply
	oldPlots.exit()
			.transition()
				.duration(750)
				.style('opacity', 0)
			.remove();
}

var loadScatterPlot = function(){

	var plot = d3.select("#scatterplot")
					.append("svg")
					.attr("width", width + padding)
					.attr("height", height + padding);

	// "Border" off the scatterplot
	plot.append("rect").attr({
		"width": width - padding/2,
		"height": height - padding/2,
		"fill": "none",
		"stroke": "lightgray",
		"transform": "translate(" + padding + " " + padding/2 + ")"
	});

	var xAxis = d3.svg.axis().orient("bottom");
	var yAxis = d3.svg.axis().orient("left");

	plot.append("g").attr("class", "x axis").call(xAxis);
	plot.append("g").attr("class", "y axis").call(yAxis);

	return plot;
}