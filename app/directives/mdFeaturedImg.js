app.directive('mdFeaturedImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdfeaturedobj: '='
		}, 
		templateUrl: 'app/directives/mdFeaturedImg.html' 
	}; 
});