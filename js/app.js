var app = angular.module('MusicDiscovererApp', ['ngRoute']);

app.config(function ($sceDelegateProvider) {

	$sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',

  ]); 
});

app.config(function ($routeProvider) { 
 	$routeProvider 
		.when('/', { 
	  		controller: 'SearchController', 
	  		templateUrl: 'views/search.html' 
		}) 
		.when('/resultlist', { 
	  		controller: 'ResultListController', 
	  		templateUrl: 'views/result_list.html' 
		}) 
		.when('/musician/:id', { 
	  		controller: 'MusicianController', 
	  		templateUrl: 'views/musician.html' 
		})
		.otherwise({ 
      		redirectTo: '/' 
    	}); 
});