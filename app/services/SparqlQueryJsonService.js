(function () {
	'use strict';

	angular.module('MusicDiscovererApp').factory('sparqlQueries', ['$http', function($http) {

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

				var i;
				for (i = 0; i< data.sparqlQueries.length; i+=1) {
					if (data.sparqlQueries[i].name === paramQueryName) {
						sparqlQuery = data.sparqlQueries[i].query.join(' ');
					}
				}
				return sparqlQuery;
			}
		};
	}]);
}());
