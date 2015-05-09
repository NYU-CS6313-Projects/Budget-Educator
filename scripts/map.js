var url = 'https://aartyparty.cartodb.com/api/v2/viz/2ab32f3e-ede5-11e4-a96e-0e43f3deba5a/viz.json';
var map;

cartodb.createVis('map', url)
	.done(function(vis, layers) {
		map = vis.getNativeMap();

		console.log(layers);

			// Add custom on-click functionality to map
			// cartodb.createLayer(map, url)
			// .addTo(map).on('done', function(layer) {	
				
			// 	var subLayerOptions = {
			// 		cartocss: "#overview{marker-fill: #fff;}"
			// 	}

			// 	var sublayer = layer.getSubLayer(0);
			// 	sublayer.set(subLayerOptions);
			    
			// 	sublayer.on('featureClick', function(e, latlng, pos, data) {
			// 		console.log(data);
			// 	});
		 //  	});

	});

