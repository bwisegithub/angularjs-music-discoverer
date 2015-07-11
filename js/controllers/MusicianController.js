app.controller('MusicianController', ['$scope', '$routeParams', 'sparqlQueries', 'dbpResults', 
	function($scope, $routeParams, sparqlQueries, dbpResults) {

	// Get the sparql query string for the musician
	// then execute it on dbpedia for the given routeParams id
	sparqlQueries.getData().success(function(data) {
		var sparqlQuery = sparqlQueries.getQueryStr(data, 'musicianDetailsQuery');

		if ($routeParams.id && $routeParams.id > 0) {
			// Substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
			sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);

			// Get the main musician info
			dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
				$scope.dbpResultsMusician = data.results.bindings;

				if ($scope.dbpResultsMusician.length > 0) {
					// Musician found
					var musicianResource = $scope.dbpResultsMusician[0].resource.value;

					// Get the sparql query string for the musicians associates
					// then execute it on dbpedia for the given musician
					sparqlQueries.getData().success(function(data) {
					var sparqlQuery = sparqlQueries.getQueryStr(data, 'musicianAssociatedQuery');

						if ($routeParams.id && $routeParams.id > 0) {
							// Substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
							sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);
							sparqlQuery = sparqlQuery.replace(/--REPLACE_RESOURCE--/g, musicianResource);

							// Get the associated musician info
							dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
								$scope.dbpResultsAssociates = data.results.bindings;
							}); 
						}
					}); 
				}
			}); 
		}		
	}); 

	$scope.isNotFeaturedMusician = function(associate) {
		return !(associate.id.value === $routeParams.id);
	};
	
	$scope.imgNotFound = function(image) {
	    image.onerror = '';
	    image.src = '/images/imageNotFound.gif';
	    return true;
	}

}]);
