// Function to get all selected school's DBN
// $(".schoolSelected").each( function(index, school){ console.log( school.id ); } );
var width = $(document).width() * 0.35,
	height = width,
	padding_height = 70,
	padding_width = 110,
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
					.range([padding_width,width+(padding_width/4)]);

	// Get y-axis scale (only accounting for numeric data like student math exam proficiency for now)
	var y_range = d3.extent(data, function(d, i) { if( !isNaN(d[yAxisLabel]) ) return parseInt(d[yAxisLabel]); });


	var y_scale;
	if( isNaN(y_range[0]) )
		y_scale = d3.scale.ordinal()
					.domain(data.map(function (d) { return d[yAxisLabel]; }))
					.rangeBands([0, height], 1);
	else
		y_scale = d3.scale.linear()
					.domain([y_range[1], 0])
					.range([padding_height,height]);

	// Create the axes and have their tick markers create a grid-like pattern
	var xAxis = d3.svg.axis().scale(x_scale).orient("bottom").tickSize(-height+padding_height/2);
	var yAxis = d3.svg.axis().scale(y_scale).orient("left").tickSize(-width+padding_width/2);

	// Append x-axis to scatterplot. 
	// Move axis to bottom of graph and rotate text slightly to fit values. Do not rotate 0
	plot.select(".x.axis")
		.attr("transform", "translate(0," + height + ")" )
		.transition()
			.duration(750)
		.call(xAxis)
        .selectAll("text")
            .attr("transform", function(d){ if(d) return "translate(0," + padding_height/4 + "), rotate(-65)"});

	plot.select(".y.axis")
		.attr("transform", "translate(" + padding_width + ",0)" )
		.transition()
			.duration(750)
		.call(yAxis);
	plot.select(".y.label")
		.text("Y-Axis: " + yAxisLabel)


	// Retrieve old points, if any
	var oldPlots = plot.selectAll("circle")
						.data(data, function(d){ return d["DBN"]; });

	// Update the values of existing points
	oldPlots.transition()
				.duration(750)
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return ( y_scale(d[yAxisLabel]) ) ? y_scale(d[yAxisLabel]) : -999;  },
				"r": function(d)  { return 3; }
			});

	// Append new points if needed
    oldPlots.enter()
	        .append("circle")
			.attr({
				"cx": function(d) { return x_scale(d["Budget Per Student"]); },
				"cy": function(d) { return ( y_scale(d[yAxisLabel]) ) ? y_scale(d[yAxisLabel]) : -999;  },
				"r": function(d)  { return 3; }
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
					.attr("width", width + padding_width)
					.attr("height", height + padding_height);

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
        	.attr("y", height + padding_height - 12)
        	.text("Budget Per Student");

	plot.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "center")
    	.attr("transform", "translate(" + (width + (padding_width/2) + 12) + ", " + padding_height/2 + ") rotate(90)")
    	.text("Y-Axis");

	return plot;
}