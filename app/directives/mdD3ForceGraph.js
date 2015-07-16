app.directive('mdD3ForceGraph', function() { 

	return { 
		restrict: 'E', 
		scope: { 
			mdassocobj: '='
		}, 
		templateUrl: 'app/directives/mdD3ForceGraph.html',
		link: function(scope, element, attrs) {

			/////////////
			// DATA SETUP
			/////////////
			// Each mdassocsobj looks something like this (pseudocode)
			// id    	label    	(other stuff)	assoc_subject_arr					assoc_object_arr
			// 13084	Gorillaz					100097:Damon Albarn|				33555123:Rocket Juice & the Moon|
			//										1340318:Mick Jones (The Clash)|		43007:Blur (band)
			//										167064:De La Soul
			// 100097	Damon Albarn				13082283:Jneiro Jarel|				13084:Gorillaz|2301138:Mali Music|
			//										194961:Noel Gallagher|				33555123:Rocket Juice & the Moon
			//										21222062:Brian Eno
			// Values in id col should be unique, but ids across cols are not.
			// assoc_subject_arr and/or assoc_object_arr may be empty.
			// Musician may link to or from other musician, so links may not be unique either.
			//
			// Approach: 
			// 1) Every id & label pair (in all cols) are stored in nonuniqueNodes.nodes.
			//    The group value is the id of the main node (row) that mentions the node
			//    E.g. in above example, every node in the first row is assigned group 13084
			//    for nonuniqueNodes.nodes[i].group.  (See #3 below.)
			// 2) Every link will be stored in assoc.nodes (Ok that they are not-unique.  
			//    The edge/line will be weighted heavier for each repeated link.)
			//      a) Since not doing "directed" graph, treating assoc_subject_arr and
			//         assoc_equally_arr, i.e. don't care if musician linked to or from
			//         other musician, just care that there was a link.
			// 3) nonuniqueNodes.nodes are then evaluated for uniqueness based on id
			//    and stored in assocs.nodes.
			//    This is done on a first come first serve basis with no sorting so 
			//    whatever nonuniqueNodes.nodes[i].group value was used when the node
			//    was stored in assocs.nodes is what will be used, even if subsequent
			//    nonuniqueNodes.nodes have a different group for the id.  E.g.
			//    in above example, 100097 (Damon Albarn) will be assigned to group
			//    13084 (Gorillaz) because that is the first row to mention him.
			//    (Group values are just used to color the node/circles on the graph
			//    to help visually separate the clusters a bit better.)

			// Assocs will hold the d3-friendly version of the musican associates
			var assocs = { 'nodes': [], 'links': [] };
			// Temp array to hold the non unique nodes found in the mdassocobj;
			// this will be evaluated and unique items placed in assocs.nodes later.
			var nonuniqueNodes = { 'nodes': [] };
			// Array to hold edges (linked to nodes by id value vs default node array index)
			var edges = [];
			// More temp vars
			var	assoc_subject_arr = [];
			var assoc_object_arr = [];
			var musicianId, idLabelSplit;
			var pushToAssocsNodes;
			var matchedNode;
			var sourceNode;
			var targetNode;

			for (var i=0; i<scope.mdassocobj.length; i++) {
				musicianId = scope.mdassocobj[i].id.value;
				assoc_subject_arr = scope.mdassocobj[i].assoc_subject_arr.value.split('|');
				assoc_object_arr = scope.mdassocobj[i].assoc_object_arr.value.split('|');

				// Push main main musician node for this row
				nonuniqueNodes.nodes.push({ 
					id: musicianId, 
					name: scope.mdassocobj[i].label.value, 
					group: musicianId 
				});

				// Process subject arr; push all its nodes and links
				processLinkedArr(assoc_subject_arr, musicianId);

				// Process object arr; push all its nodes and links
				processLinkedArr(assoc_object_arr, musicianId);
			}

			// Examine nonuniqueNodes.nodes and store unique ones in assocs.nodes
			nonuniqueNodes.nodes.forEach(function(n) {
				pushToAssocsNodes = false;
				if (assocs.nodes.length > 0) {
					// Is the id already in assocs.nodes?
					matchedNode = ($.grep(assocs.nodes, function(g){ return g.id == n.id; }))[0];
					if (!matchedNode) {
						// Not yet added to assocs.nodes, so add it
						pushToAssocsNodes = true;
					}
				} 
				else {
					// assocs.nodes is empty so ok to push very first nonuniqueNodes.nodes
					pushToAssocsNodes = true;
				}

				if (pushToAssocsNodes) {
					assocs.nodes.push({id: n.id, name: n.name, group: n.group});
				}
			});

			// The purpose of the following is to change the default behavior of linking by 
			// node array index to custom behavior (link by node 'id' value).
			assocs.links.forEach(function(n) { 
				sourceNode = ($.grep(assocs.nodes, function(g) { return g.id == n.source; } ))[0];
				targetNode = ($.grep(assocs.nodes, function(g) { return g.id == n.target; } ))[0];

				// Add the edge to the array
				edges.push({source: sourceNode, target: targetNode});
			});


			/////////////
			// DRAW FORCE GRAPH
			// Based on/modified from
			// http://bl.ocks.org/mbostock/1129492 (bounded-ness) and
			// http://bl.ocks.org/mbostock/3750558 (sticky-ness) examples, 
			// but with added labels, touchscreen support, hyperlinked nodes,
			// support for id-based edges vs index-based, and various other customizations.
			/////////////
			var selection = d3.select('#force-graph'); 
			var width = selection[0][0].clientWidth;
			var height = 525;
			var radius = 6;
			var color = d3.scale.category20();

			var force = d3.layout.force()
				.gravity(.05)
				.charge(-200)
				.linkDistance(50)
				.linkStrength(.75)
				.size([width, height]);

			var drag = force.drag()
				.on('dragstart', dragstart);

			var svg = selection.append('svg')
				.attr('width', width)
				.attr('height', height);

			var link = svg.selectAll('.link')
				.data(edges)
				.enter().append('line')
				.attr('class', 'link');

			var node = svg.append('g').selectAll('.node')
				.data(assocs.nodes)
				.enter().append('circle')
				.attr('class', 'node')
				.attr('r', radius - .75)
				.style('fill', function(d) { return color(d.group); })
				.style('stroke', function(d) { return d3.rgb(color(d.group)).darker(); })
				.on('dblclick', dblclick)
				.on('touchstart', dblTouch)
				.call(drag);

			force
				.nodes(assocs.nodes)
				.links(edges)
				.start();

			var text = svg.append('g').selectAll('.link')
				.data(force.nodes())
				.enter().append('text')
				.attr('x', 8)
				.attr('y', '.31em')
				.text(function(d) { return d.name; });

			force.on('tick', function() {
				text.attr('transform', transform);

				link.attr('x1', function(d) { return d.source.x; })
					.attr('y1', function(d) { return d.source.y; })
					.attr('x2', function(d) { return d.target.x; })
					.attr('y2', function(d) { return d.target.y; });

				node
					.attr('cx', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
					.attr('cy', function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
			});


			/////////////
			// HELPER FUNCTIONS
			/////////////
			function processLinkedArr(linkedArray, musicianId) {
				var idLabelSplit;
				for (var k=0; k<linkedArray.length; k++) {
					idLabelSplit = linkedArray[k].split(':');
					if (idLabelSplit.length === 2) {
						nonuniqueNodes.nodes.push({ 
							id: idLabelSplit[0], 
							name: idLabelSplit[1],
							group: musicianId
						});
						assocs.links.push({ 
							source: musicianId,
							target: idLabelSplit[0]
						});
					}
				}
			}

			function transform(d) {
				return 'translate(' + d.x + ',' + d.y + ')';
			}

			function dragstart(d) {
				// Drag to pin
				// d3.select(this).classed('fixed', d.fixed = true);

				// Drag to pin. drag (click) to release.
				// (Toggle fixed class on and off with drag)
				d3.select(this).classed('fixed', d.fixed = d3.select(this).classed('fixed') ? false : true);
			}

			function dblclick(d) {
				// Double click to release
				// d3.select(this).classed('fixed', d.fixed = false);

				// Double click to view musician details
				location.href = '#/musician/' + d.id;
			}

			// For tap vs click (mobile/desktop touchscreens)
			function dblTouch(d) {

				d3.selection.prototype.dblTap = function(callback) {
					var last = 0;
					return this.each(function() {
						d3.select(this).on('touchstart', function(e) {
							if ((d3.event.timeStamp - last) < 500) {
								return callback(e);
							}
							last = d3.event.timeStamp;
						});
					});
				}

				d3.select(this).dblTap(function() {
					// Double tap to release
					// d.fixed = false;

					// Double tab to view musician details
					location.href = '#/musician/' + d.id;
				});
			}
		}
	}; 
});


