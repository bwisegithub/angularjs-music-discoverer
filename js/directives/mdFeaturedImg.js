app.directive('mdFeaturedImg', function() { 
  return { 
		restrict: 'E', 
		scope: { 
			mdfeaturedobj: '='
		}, 
		templateUrl: 'js/directives/mdFeaturedImg.html' 
	}; 
});