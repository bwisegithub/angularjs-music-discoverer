app.factory('dbpResults', ['$http', function($http) {

	var searchKeywords = '';

	return {
		getSearchKeywords: function() {
			return searchKeywords;
		},
		setSearchKeywords: function(paramSearchKeywords) {
			searchKeywords = paramSearchKeywords;
		},
		getDbpediaResults: function(sparqlQuery) { 

			var url = 'http://dbpedia.org/sparql/';
			var query_prefix = '?default-graph-uri=http%3A%2F%2Fdbpedia.org';
			query = '&query=' + encodeURIComponent(sparqlQuery);
			var query_suffix = '&format=application%2Fsparql-results%2Bjson&timeout=30000&debug=on';
			var queryUrl = url + query_prefix + query + query_suffix;

			return $http.jsonp(queryUrl + '&callback=JSON_CALLBACK')
				.success(function(data) {
					return data;
				})
				.error(function(err) {
					return err;
				}); 
		}
	};

}]);



