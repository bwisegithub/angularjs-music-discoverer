app.controller('ResultListController', ['$scope', 'sparqlQueries', 'dbpResults', function($scope, sparqlQueries, dbpResults) {
	$scope.controllerData = { headerKey: 'Search Result List' };

	// Get the approrpriate sparql query string
	// then execute it on dbpedia.
	sparqlQueries.getAll().success(function(data) {
		var sparqlQuery = 'QUERY NOT FOUND';

		for (var i = 0; i< data.sparqlQueries.length; i++) {
			if (data.sparqlQueries[i].name === "keywordSearchQuery") {
				var sparqlQuery = data.sparqlQueries[i].query.join(' ');
			}
		}

		dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
			$scope.dbpResults = data.results.bindings;
		}); 		

	}); 

}]);
