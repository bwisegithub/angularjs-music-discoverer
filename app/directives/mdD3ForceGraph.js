app.directive('mdD3ForceGraph', function() { 

	return { 
		restrict: 'E', 
		scope: { 
			mdassocobj: '='
		}, 
		templateUrl: 'app/directives/mdD3ForceGraph.html',
		link: function(scope, element, attrs) {

			var test = scope.mdassocobj;
			//window.alert('test ' + test);
			test = test.slice(5);
			var test2 = test[0].id.value;
			//window.alert('test2' + test2);

			// assocs will hold the d3-friendly version of the musican associates
			var assocs = {nodes:[], links:[]};
			for (var i=0; i<scope.mdassocobj.length; i++) {

			}

// Helper function, iterates over nodes looking for id. If found, returns its child array, otherwise adds a new
// node object and child array and returns it.
/*function addNode(nodes, id, name, groupId) {
	// Look for name in nodes
	for (var i=0, iLen=nodes.length; i<iLen; i++) {
		// If find name, return its child array
		if (nodes[i].name == name) {
		return nodes[i].nodes;        
		}
	}
	// If didn't find name, add a new object and 
	// return its child array
	nodes.push({'name': name, 'nodes':[]});
	return nodes[nodes.length - 1].nodes;
	}
}*/

/*		var assocs =	{
  "nodes":[
	{"name":"Myriel","group":1},
	{"name":"Napoleon","group":1},
	{"name":"Mlle.Baptistine","group":1},
	 ],
  "links":[
	{"source":1,"target":0,"value":1},
	{"source":2,"target":0,"value":8}
	]
}*/

		var assocs =	{
  "nodes":[
	{"id": "123", "name":"Myriel", "group":"123"},
	{"id": "456", "name":"Napoleon", "group":"123"},
	{"id": "789", "name":"Mlle.Baptistine", "group":"456"},
	 ],
  "links":[
	{"source":"456","target":"123"},
	{"source":"789","target":"123"}
	]
}

var edges = [];

assocs.links.forEach(function(e) { 
    // Get the source and target nodes
    var sourceNode = assocs.nodes.filter(function(n) { return n.id === e.source; })[0],
        targetNode = assocs.nodes.filter(function(n) { return n.id === e.target; })[0];

    // Add the edge to the array
    edges.push({source: sourceNode, target: targetNode});
});

/*var force = d3.layout.force()
    .nodes(data.nodes)
    .links(edges)
    // the rest of your code here
    .start();*/
							//	var filteredCopy = orig.slice(0);

/*
var links = [
  {source: "Microsoft", target: "Amazon", type: "licensing"},
  {source: "Microsoft", target: "HTC", type: "licensing"},
  {source: "Samsung", target: "Apple", type: "suit"},
  {source: "Motorola", target: "Apple", type: "suit"},
  {source: "Nokia", target: "Apple", type: "resolved"},
  {source: "HTC", target: "Apple", type: "suit"},
  {source: "Kodak", target: "Apple", type: "suit"},
  {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});*/

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


//			d3.json("app/json/lesmis.json", function(error, graph) {
//			  	if (error) throw error;

			var link = svg.selectAll(".link")
//					.data(graph.links)
//.data(assocs.links)
.data(edges)
				.enter().append("line")
				.attr("class", "link");

			//var node = svg.selectAll(".node")
			var node = svg.append("g").selectAll(".node")
//					.data(graph.nodes)
.data(assocs.nodes)
				.enter().append("circle")
				.attr("class", "node")
				.attr("r", radius - .75)
				.style("fill", function(d) { return color(d.group); })
				.style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
				.on("dblclick", dblclick)
				.call(drag);

			force
//					.nodes(graph.nodes)
//					.links(graph.links)
.nodes(assocs.nodes)
//.links(assocs.links)
.links(edges)
				.start();

			var text = svg.append("g").selectAll(".link")
				.data(force.nodes())
				.enter().append("text")
				.attr("x", 8)
				.attr("y", ".31em")
				.text(function(d) { return d.name; });

			force.on("tick", function() {
				text.attr("transform", transform);

				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node
					.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
					.attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
			});
//			});

			function transform(d) {
				return "translate(" + d.x + "," + d.y + ")";
			}

			function dblclick(d) {
				d3.select(this).classed("fixed", d.fixed = false);
			}

			function dragstart(d) {
				d3.select(this).classed("fixed", d.fixed = true);
			}

		}
	}; 
});


