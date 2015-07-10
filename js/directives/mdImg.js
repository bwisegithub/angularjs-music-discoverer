app.directive('mdImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdimgval: '=',
			mdimgalt: '='
		}, 
		templateUrl: 'js/directives/mdImg.html' 
	}; 
});