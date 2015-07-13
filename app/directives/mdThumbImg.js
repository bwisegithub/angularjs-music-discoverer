app.directive('mdThumbImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdthumbobj: '='
		}, 
		templateUrl: 'app/directives/mdThumbImg.html' 
	}; 
});