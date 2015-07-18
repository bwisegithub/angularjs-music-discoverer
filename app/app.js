(function () {
	'use strict';

	angular.module('MusicDiscovererApp', ['ngRoute', 'ui.bootstrap']);

	angular.module('MusicDiscovererApp').config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'SearchController',
				templateUrl: 'app/views/search.html'
			})
			.when('/resultlist/:searchKeywords', {
				controller: 'ResultListController',
				templateUrl: 'app/views/result_list.html'
			})
			.when('/musician/:id', {
				controller: 'MusicianController',
				templateUrl: 'app/views/musician.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
}());
