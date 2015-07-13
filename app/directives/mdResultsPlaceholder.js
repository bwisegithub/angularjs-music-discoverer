app.directive('mdResultsPlaceholder', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdresplaceholder: '=' 
		}, 
		templateUrl: 'app/directives/mdResultsPlaceholder.html' 
	}; 
});