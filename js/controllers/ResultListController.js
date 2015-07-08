app.controller('ResultListController', ['$scope', '$location', 'sparqlQueries', 'dbpResults', function($scope, $location, sparqlQueries, dbpResults) {

	$scope.controllerData = { headerKey: 'Search Result List' };

	// Get the appropriate sparql query string
	// then execute it on dbpedia
	sparqlQueries.getData().success(function(data) {
		var sparqlQuery = sparqlQueries.getQueryStr(data, 'keywordSearchQuery');

		// Get the keywords entered by user
		var searchKeywords = dbpResults.getSearchKeywords();

		if (searchKeywords && searchKeywords.length > 0) {
			// Substitute in the search keywords.  
			// Note replacing spaces with underscores in search string for SPARQL bif:contains function.
			sparqlQuery = sparqlQuery.replace('--REPLACE_KEYWORDS--', searchKeywords.replace(/ /g,'_'));

			dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
				var dbpResultsGetMusicianDetails = data.results.bindings;
				var id = '';
				if (dbpResultsGetMusicianDetails.length === 1) {
					// There is only one result so just redirect to musician view 
					// for the wikiPageId in that one result.
					id = dbpResultsGetMusicianDetails[0].id.value;
					$location.path('/musician/' + id);
				} else {
					// There are no, or more than one, result(s) so show result list.
					$scope.dbpResults = data.results.bindings;
				}
			}); 		
		}
	}); 

}]);
