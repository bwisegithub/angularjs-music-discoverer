app.controller('SearchController', ['$scope', '$location', 'sparqlQueries', 'dbpResults', 
	function($scope, $location, sparqlQueries, dbpResults) {

	$scope.search = function(paramSearchKeywords) {
		$location.path('/resultlist/' + paramSearchKeywords);
	};

	$scope.random = function(randomnessType, dbpResource) {
		// 1) Get the various sparql query strings
		// 2) If applicable, get count for dataset so know what offset to use to simulate randomness
		// 3) Get a random wikiPageId for (all musicians) or (musicians in a given genre)

		// Get all sparql query strings
		sparqlQueries.getData().success(function(data) {

			var getCountSparqlQuery = '';
			var getIdSparqlQuery = '';
			var randInt = -1;

			if (randomnessType === 'id') {
				getIdSparqlQuery = sparqlQueries.getQueryStr(data, 'randomIdQuery');
				// Generate random number between 0 and 39999.
				// Using 39999 as upper for randomnesss because in July 2015 have observed
				// total possible musicians vary from 63-78K fluctuating wildly from 
				// day to day so keeping value what is hopefully well below lowest max.
				// Tried querying for total count to use as upper max of offset, but
				// significant lag involved with doing that; not worth querying server
				// just for this feature. 40K possibilites is plenty for our random 
				// sampling purposes.
				randInt = Math.floor(Math.random() * 39999);

				if (randInt > -1) {
					// Substitute in the random offset which will result in a random record from
					// all the possible musicians.
					getIdSparqlQuery = getIdSparqlQuery.replace('--REPLACE_OFFSET--', randInt);
					
					// This randomness query takes a few seconds to respond, so
					// set var so that cursor waiting indicator turns on for the ng-view div.
					$scope.waitingForResponse = true;
					dbpResults.getDbpediaResults(getIdSparqlQuery)
						.success(function(data) {
							$scope.waitingForResponse = false;
							var dbpResultsGetId = data.results.bindings;
							var id = '';
							if (dbpResultsGetId.length === 1) {
								id = dbpResultsGetId[0].id.value;
							}
							// route to the musician with the wikiPageId chosen by dbpedia
							$location.path('/musician/' + id);
						})
						.error(function(err) {
							$scope.waitingForResponse = false;
						}); 
				}
			} else if (randomnessType === 'genre') {
				getCountSparqlQuery = sparqlQueries.getQueryStr(data, 'countForGenreQuery');
				getCountSparqlQuery = getCountSparqlQuery.replace('--REPLACE_GENRE_RESOURCE--', dbpResource);
				getIdSparqlQuery = sparqlQueries.getQueryStr(data, 'randomIdForGenreQuery');
				getIdSparqlQuery = getIdSparqlQuery.replace('--REPLACE_GENRE_RESOURCE--', dbpResource);
				dbpResults.getDbpediaResults(getCountSparqlQuery).success(function(data) {
					var dbpResultsGetCnt = data.results.bindings;
					var cnt = 0;
					var randInt = -1;
					
					if (dbpResultsGetCnt.length === 1) {
						cnt = dbpResultsGetCnt[0].resourceCnt.value;
						// Generate random number between 0 and [count of musicians matching genre - 1].
						randInt = Math.floor(Math.random() * cnt);

						if (randInt > -1) {
							// Substitute in the random offset which will result in a random record from
							// all the possible musicians.
							getIdSparqlQuery = getIdSparqlQuery.replace('--REPLACE_OFFSET--', randInt);
							dbpResults.getDbpediaResults(getIdSparqlQuery).success(function(data) {
								var dbpResultsGetId = data.results.bindings;
								var id = '';
								if (dbpResultsGetId.length === 1) {
									id = dbpResultsGetId[0].id.value;
								}
								// route to the musician with the wikiPageId chosen by dbpedia
								$('body').css('cursor', 'default');
								$location.path('/musician/' + id);
							}); 
						}
					}
				}); 
			}
		}); 
	};
}]);
