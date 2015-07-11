app.directive('mdThumbImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdthumbobj: '='
		}, 
		templateUrl: 'js/directives/mdThumbImg.html' 
	}; 
});