var url = 'https://aartyparty.cartodb.com/api/v2/viz/2ab32f3e-ede5-11e4-a96e-0e43f3deba5a/viz.json';

cartodb.createVis('map', url)
	.done(function(vis, layers) {
		var map = vis.getNativeMap();
	});