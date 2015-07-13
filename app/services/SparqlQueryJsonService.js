app.factory('sparqlQueries', ['$http', function($http) {

	return {
		getData: function() { 
			return $http.get('app/json/sparql.json')
				.success(function(data) {
					return data;
				})
				.error(function(err) {
				  	return err;
				}); 
		},
		getQueryStr: function(data, paramQueryName) {
			var sparqlQuery = 'QUERY NOT FOUND';
			for (var i = 0; i< data.sparqlQueries.length; i++) {
				if (data.sparqlQueries[i].name === paramQueryName) {
					var sparqlQuery = data.sparqlQueries[i].query.join(' ');
				}
			}
			return sparqlQuery;
		}
	}

}]);


