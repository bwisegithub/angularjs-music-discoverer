app.directive('mdResultsPlaceholder', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdresplaceholder: '=' 
		}, 
		templateUrl: 'js/directives/mdResultsPlaceholder.html' 
	}; 
});