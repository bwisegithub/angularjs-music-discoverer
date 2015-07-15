app.directive('mdD3ForceGraph', function() { 

	return { 
		restrict: 'E', 
		scope: { 
		}, 
		templateUrl: 'app/directives/mdD3ForceGraph.html',
		link: function(scope, element, attrs) {

			var selection = d3.select("#force-graph"); 
			var width = selection[0][0].clientWidth;
			var height = 500;
			var radius = 6;
			var color = d3.scale.category20();

			var force = d3.layout.force()
				.gravity(.05)
				.charge(-240)
				.linkDistance(50)
				.size([width, height]);

			var drag = force.drag()
				.on("dragstart", dragstart);

			var svg = selection.append("svg")
				.attr("width", width)
				.attr("height", height);

			d3.json("app/json/lesmis.json", function(error, graph) {
			  	if (error) throw error;

				var link = svg.selectAll(".link")
					.data(graph.links)
					.enter().append("line")
					.attr("class", "link");

				var node = svg.selectAll(".node")
					.data(graph.nodes)
					.enter().append("circle")
					.attr("class", "node")
					.attr("r", radius - .75)
					.style("fill", function(d) { return color(d.group); })
					.style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
					.on("dblclick", dblclick)
					.call(drag);

				force
					.nodes(graph.nodes)
					.links(graph.links)
					.start();

				node.append("title")
					.text(function(d) { return d.name; });

				force.on("tick", function() {
					
					link.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });

					node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
						.attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

				});
			});

			function dblclick(d) {
				d3.select(this).classed("fixed", d.fixed = false);
			}

			function dragstart(d) {
				d3.select(this).classed("fixed", d.fixed = true);
			}

		}
	}; 
});


