/*global window*/
(function () {
	'use strict';
	angular.module('MusicDiscovererApp').controller('MusicianController', MusicianController);
	MusicianController.$inject = ['$scope', '$routeParams', '$location', '$anchorScroll', 'sparqlQueries', 'dbpResults', 'youTubeResults'];
	function MusicianController($scope, $routeParams, $location, $anchorScroll, sparqlQueries, dbpResults, youTubeResults) {
		// Get the sparql query string for the musician
		// then execute it on dbpedia for the given routeParams id
		sparqlQueries.getData().success(function(data) {
			var sparqlQuery = sparqlQueries.getQueryStr(data, 'musicianDetailsQuery');

			// Validate URL input before proceeding
			if (/^[0-9]*$/.test($routeParams.id)) {
				if ($routeParams.id > 0) {
					// For use by nav bar
					$scope.routeParamsId = $routeParams.id;

					// Substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
					sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);

					// Get the main musician info
					dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
						$scope.dbpResultsMusician = data.results.bindings;

						if ($scope.dbpResultsMusician.length > 0) {
							// Musician found
							var musicianResource = $scope.dbpResultsMusician[0].resource.value;
							var musicianLabel = $scope.dbpResultsMusician[0].resource_label.value;

							// Get the sparql query string for the musicians associates
							// then execute it on dbpedia for the given musician
							sparqlQueries.getData().success(function(data) {
								sparqlQuery = sparqlQueries.getQueryStr(data, 'musicianAssociatedQuery');

								// Substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
								sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);
								sparqlQuery = sparqlQuery.replace(/--REPLACE_RESOURCE--/g, musicianResource);

								// Get the associated musician info
								dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
									// Make two copy of the results
									// orig - As is. Will use this in d3.js diagrams.
									//        Includes the featured artist.
									// filteredCopy - Remove the featured artist and any dups.
									//        Use in associated musicians carousel.
									//        (Tried using filter in expression for
									//        carousel, but tricky because of wanting
									//        to show two slides at a time in the
									//        carousel so needing direct access to 
									//        the object index and didn't know which
									//        one was filtered out.) 
									
									var orig = data.results.bindings;

									// Filter associate results to
									// 1) Get unique id rows (see for 527989/Andy_Williams to see ex of repeated 
									//    assocs but distinct rows some where id has thumbnail and some doesnt.
									//    Added ORDER BY DESC(?thumbnail) to musicianAssociatedQuery to help ensure 
									//    ones w/thumbnails are not the dups removed.)
									//    ** TODO: This is a hacky way of dealing w/the problem; need to revise the 
									//    SPARQL to pull back rows as expected **
									// 2) Remove featured artist
									// 3) Shed the assoc arrays which are not needed for the thumbnail carousel

									var filteredCopy = [];
									var matchedEntry;
									var pushToFiltered = false;

									// Examine orig and store unique entries in filteredCopy
									orig.forEach(function(n) {
										pushToFiltered = false;
										if (filteredCopy.length > 0) {
											// Is the id already in filteredCopy?
											matchedEntry = ($.grep(filteredCopy, function(g){ return g.id.value == n.id.value; }))[0];
											if (!matchedEntry) {
												// Not yet added to filteredCopy, so add it
												pushToFiltered = true;
											}
										} 
										else {
											// filteredCopy is empty so ok to push very first orig
											pushToFiltered = true;
										}

										if (pushToFiltered) {
											// Don't push featured artist if it was found (most likely it will be,
											// but in theory may not exceeded LIMIT set in sparql query
											if (n.id.value !== $routeParams.id) {
												filteredCopy.push({id: n.id, label: n.label, thumbnail: n.thumbnail});
											}
										}
									});

									$scope.dbpResultsAssociatesInclFeatured = orig;
									$scope.dbpResultsAssociates = filteredCopy;
								}); 
							}); 

							// Get the youTube results for the featured musician.
							// Note the nesting level; just depends on featured 
							// musician being found so the label is known but not on
							// associated info.
							youTubeResults.search(musicianLabel)
								.success(function(data) {
									$scope.youTubeVideos = data.items;
								});
						}
					}); 
				}
			}		
		}); 

		$scope.scrollTo = function(anchorHash) {
			var old = $location.hash();
			$location.hash(anchorHash);
			$anchorScroll();
			//reset to old to keep any additional routing logic from kicking in
			$location.hash(old);
		};

	}
}());
