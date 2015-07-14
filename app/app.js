var app = angular.module('MusicDiscovererApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) { 
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
