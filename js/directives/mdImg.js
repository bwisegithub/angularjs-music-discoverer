app.directive('mdImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdimgval: '=' 
		}, 
		templateUrl: 'js/directives/mdImg.html' 
	}; 
});