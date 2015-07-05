app.controller('SearchController', ['$scope', '$location', function($scope, $location) {
	$scope.controllerData = { headerKey: 'Musician Search' };
	$scope.search = function(searchTerm) {
		// do the actual searching
    	$location.path('/resultlist');
  	};
	$scope.random = function() {
		// do the actual random searching
	  	$location.path('/musician/' + '123');
	};
}]);
