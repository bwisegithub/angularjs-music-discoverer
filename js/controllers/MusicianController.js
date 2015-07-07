app.controller('MusicianController', ['$scope', '$routeParams', 'sparqlQueries', 'dbpResults', function($scope, $routeParams, sparqlQueries, dbpResults) {

	$scope.controllerData = { headerKey: 'Musician Details' };

	// Get the appropriate sparql query string
	// then execute it on dbpedia for the given routeParams id
	sparqlQueries.getData().success(function(data) {
		var sparqlQuery = sparqlQueries.getQueryStr(data, 'musicianDetailsQuery');

		if ($routeParams.id && $routeParams.id > 0) {
			// Substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
			sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);

			dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
				$scope.dbpResults = data.results.bindings;
			}); 
		}		

	}); 

}]);
