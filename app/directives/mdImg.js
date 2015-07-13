app.directive('mdImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdimgval: '=',
			mdimgalt: '=',
			mdimgclass: '='
		}, 
		templateUrl: 'app/directives/mdImg.html' 
	}; 
});