app.controller('ResultListController', ['$scope', 'sparqlQueries', 'dbpResults', function($scope, sparqlQueries, dbpResults) {

	$scope.controllerData = { headerKey: 'Search Result List' };

	// Get the appropriate sparql query string
	// then execute it on dbpedia
	sparqlQueries.getData().success(function(data) {
		var sparqlQuery = sparqlQueries.getQueryStr(data, 'keywordSearchQuery');

		// get the keywords entered by user
		var searchKeywords = dbpResults.getSearchKeywords();

		if (searchKeywords && searchKeywords.length > 0) {
			// Substitute in the search keywords.  
			// Note replacing spaces with underscores in search string for SPARQL bif:contains function.
			sparqlQuery = sparqlQuery.replace('--REPLACE_KEYWORDS--', searchKeywords.replace(' ','_'));

			dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
				$scope.dbpResults = data.results.bindings;
			}); 		
		}
	}); 

}]);
