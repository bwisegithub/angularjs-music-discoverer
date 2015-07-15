app.directive('mdD3Timeline', function() { 

	return { 
		restrict: 'E', 
		scope: { 
		}, 
		templateUrl: 'app/directives/mdD3Timeline.html',
		link: function(scope, element, attrs) {

var selection = d3.select("#timeline-chart"); 
width = selection[0][0].clientWidth;

			var customTimeFormat = d3.time.format.multi([
				[".%L", function(d) { return d.getMilliseconds(); }],
				[":%S", function(d) { return d.getSeconds(); }],
				["%I:%M", function(d) { return d.getMinutes(); }],
				["%I %p", function(d) { return d.getHours(); }],
				["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
				["%b %d", function(d) { return d.getDate() != 1; }],
				["%B", function(d) { return d.getMonth(); }],
				["%Y", function() { return true; }]
			]);

			var margin = {top: 14, right: 14, bottom: 28, left: 14};
//			var width = 960 - margin.left - margin.right;
			var height = 100 - margin.top - margin.bottom;

			var x = d3.time.scale()
				.domain([new Date(2012, 0, 1), new Date(2013, 0, 1)])
				.range([0, width]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.tickFormat(customTimeFormat);


			var svg = selection.append("svg")
			//var svg = d3.select("body").append("svg")
	//			.attr("width", width + margin.left + margin.right)
				.attr("width", width)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

		}
	}; 

});


