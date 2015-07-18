/*global window*/
(function () {
	'use strict';
	angular.module('MusicDiscovererApp').factory('dbpResults', dbpResults);
	dbpResults.$inject = ['$http'];
	function dbpResults($http) {
		return {
			getDbpediaResults: function(sparqlQuery) { 

				var timeoutInt = 30000;
				var startTime = new Date().getTime();

				if (sparqlQuery != 'QUERY NOT FOUND') {
					var url = 'http://dbpedia.org/sparql/';
					var query_prefix = '?default-graph-uri=http%3A%2F%2Fdbpedia.org';
					var query = '&query=' + encodeURIComponent(sparqlQuery);
					var query_suffix = '&format=application%2Fsparql-results%2Bjson&timeout=' + timeoutInt + '&debug=on';
					var queryUrl = url + query_prefix + query + query_suffix;

					return $http.jsonp(queryUrl + '&callback=JSON_CALLBACK', {timeout: timeoutInt})
						.success(function(data) {
							return data;
					})
					.error(function(resp, status, header, config) {
						var respTime = new Date().getTime() - startTime;
						if(respTime >= config.timeout) {
							window.alert('Timeout error calling the dbpedia.org/sparql service.\nThe service may be under maintenance.\nTry again later.');
						} else {
							window.alert('Unexpected error calling the dbpedia.org/sparql service');
						}
					});
				}
			}
		};
	}
}());
