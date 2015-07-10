app.directive('mdImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdimgval: '=',
			mdimgalt: '=',
			mdimgclass: '='
		}, 
		templateUrl: 'js/directives/mdImg.html' 
	}; 
});