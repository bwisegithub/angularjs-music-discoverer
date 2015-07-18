/*global window*/
(function () {
	'use strict';

	angular.module('MusicDiscovererApp').controller('MusicianController', ['$scope', '$routeParams', 'sparqlQueries', 'dbpResults', 'youTubeResults', 
		function($scope, $routeParams, sparqlQueries, dbpResults, youTubeResults) {

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
									// filteredCopy - Remove the featured artist.
									//        Use in associated musicians carousel.
									//        (Tried using filter in expression for
									//        carousel, but tricky because of wanting
									//        to show two slides at a time in the
									//        carousel so needing direct access to 
									//        the object index and didn't know which
									//        one was filtered out.) 
									
									var orig = data.results.bindings;
									// Make *copy* of results:
									var filteredCopy = orig.slice(0);
									var indexToRemove = -1;
									
									var i;
									for (i=0; i<filteredCopy.length; i+=1) {
										// See if the featured artist is in the associated
										// array (most likely it is but in theory may not
										// be if more than 100 associates)
										if (filteredCopy[i].id.value === $routeParams.id) {
											indexToRemove = i;
										}
									}

									if (indexToRemove !== -1) {
										// Remove featured artist from filteredCopy
										filteredCopy.splice(indexToRemove, 1);
									}

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

		// To simulate bookmarks in angular
		$scope.scrollTo = function(selector) {
			window.scrollTo(0, $(selector)[0].offsetTop - 100);
		};

	}]);
}());
