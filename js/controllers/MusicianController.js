app.controller('MusicianController', ['$scope', '$routeParams', 'sparqlQueries', 'dbpResults', function($scope, $routeParams, sparqlQueries, dbpResults) {
	$scope.controllerData = { headerKey: 'Musician Details' };

	// Get the approrpriate sparql query string
	// then execute it on dbpedia for the given routeParams id
	sparqlQueries.getAll().success(function(data) {
		var sparqlQuery = 'QUERY NOT FOUND';

		for (var i = 0; i< data.sparqlQueries.length; i++) {
			if (data.sparqlQueries[i].name === "musicianDetailsQuery") {
				var sparqlQuery = data.sparqlQueries[i].query.join(' ');
			}
		}

		// substitute in the routeParams id (which is the dbpedia-owl:wikiPageID)
		sparqlQuery = sparqlQuery.replace('--REPLACE_ID--', $routeParams.id);

		dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
			$scope.dbpResults = data.results.bindings;
		}); 		

	}); 

}]);
