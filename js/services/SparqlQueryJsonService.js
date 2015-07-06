app.factory('sparqlQueries', ['$http', function($http) {

	return {
		getAll: function(param) { 
			return $http.get('json/sparql.json')
				.success(function(data) {
					return data;
				})
				.error(function(err) {
				  	return err;
				}); 
		}
	}

}]);


