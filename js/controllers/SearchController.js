app.controller('SearchController', ['$scope', '$location', 'sparqlQueries', 'dbpResults', function($scope, $location, sparqlQueries, dbpResults) {

	$scope.controllerData = { headerKey: 'Musician Search' };

	$scope.search = function(paramSearchKeywords) {
		dbpResults.setSearchKeywords(paramSearchKeywords);
		$location.path('/resultlist');
	};

	$scope.random = function(randomnessType, dbpResource) {
		// 1) Get the various sparql query strings
		// 2) If applicable, get count for dataset so know what offset to use to simulate randomness
		// 3) Get a random wikiPageId for (all musicians) or (musicians in a given genre)

		// Get all sparql query strings
		sparqlQueries.getData().success(function(data) {

			var getCountSparqlQuery = '';
			var getIdSparqlQuery = '';

			switch(randomnessType) {
				case 'id':
					getCountSparqlQuery = sparqlQueries.getQueryStr(data, 'countForAllQuery');
					getIdSparqlQuery = sparqlQueries.getQueryStr(data, 'randomIdQuery');
					break;
				case 'genre':
					getCountSparqlQuery = sparqlQueries.getQueryStr(data, 'countForGenreQuery');
					getCountSparqlQuery = getCountSparqlQuery.replace('--REPLACE_GENRE_RESOURCE--', dbpResource);
					getIdSparqlQuery = sparqlQueries.getQueryStr(data, 'randomIdForGenreQuery');
					getIdSparqlQuery = getIdSparqlQuery.replace('--REPLACE_GENRE_RESOURCE--', dbpResource);
					break;
			}

			dbpResults.getDbpediaResults(getCountSparqlQuery).success(function(data) {
				var dbpResultsGetCnt = data.results.bindings;
				var cnt = 0;
				var randInt = 0;
				if (dbpResultsGetCnt.length === 1) {
					cnt = dbpResultsGetCnt[0].resourceCnt.value;
					randInt = Math.floor(Math.random() * cnt) + 1;

					if (randInt > 0) {
						// Substitute in the random offset which will result in a random record from
						// all the possible musicians.
						window.alert('using offset' + randInt);
						getIdSparqlQuery = getIdSparqlQuery.replace('--REPLACE_OFFSET--', randInt);

						dbpResults.getDbpediaResults(getIdSparqlQuery).success(function(data) {
							var dbpResultsGetId = data.results.bindings;
							var id = '';
							if (dbpResultsGetId.length === 1) {
								id = dbpResultsGetId[0].id.value;
							}
							// route to the musician with the wikiPageId chosen by dbpedia
							$location.path('/musician/' + id);
						}); 
					}
				}
			}); 	

		}); 

	};

}]);
