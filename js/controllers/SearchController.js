app.controller('SearchController', ['$scope', '$location', 'sparqlQueries', 'dbpResults', function($scope, $location, sparqlQueries, dbpResults) {

	$scope.controllerData = { headerKey: 'Musician Search' };

	$scope.search = function(paramSearchKeywords) {
		dbpResults.setSearchKeywords(paramSearchKeywords);
		$location.path('/resultlist');
	};

	$scope.random = function(randomnessType, dbpResource) {

		// Get the appropriate sparql query string
		// then execute it on dbpedia for a random offset i.e. get a random musician
		// or random musician for given genre, depending on which feature invoked
		// this function.
		sparqlQueries.getData().success(function(data) {

			var sparqlQuery = '';
			var randInt = 0;

			switch(randomnessType) {
				case 'id':
					sparqlQuery = sparqlQueries.getQueryStr(data, "randomIdQuery");
					// Using 60000 as upper for randomnesss because on 7/6/15 there were 
					// 63968 possibile musicians in dbpedia and don't want to exceed 
					// that or else there will be no results (and the number actually 
					// goes down sometimes so don't want to use that exact number).  Could query 
					// dbpedia for count and then use that to set upper limit of the random,
					// but don't want to query server just for this feature; 60K 
					// possibilites is plenty for our purposes.
					randInt = Math.floor(Math.random() * 60000) + 1;
					break;
				case 'genre':
					sparqlQuery = sparqlQueries.getQueryStr(data, "randomIdForGenreQuery");
					randInt = 1;
					sparqlQuery = sparqlQuery.replace('--REPLACE_GENRE_RESOURCE--', dbpResource);
					break;
			}

			if (randInt && randInt > 0) {
				// Substitute in the random offset which will result in a random record from
				// all the possible musicians.
				sparqlQuery = sparqlQuery.replace('--REPLACE_OFFSET--', randInt);

				dbpResults.getDbpediaResults(sparqlQuery).success(function(data) {
					var dbpResults = data.results.bindings;
					var id = '';
					if (dbpResults.length === 1) {
						id = dbpResults[0].id.value;
					}
					// route to the musician with the wikiPageId chosen by dbpedia
					$location.path('/musician/' + id);
				}); 
			}		

		}); 

	};

}]);
