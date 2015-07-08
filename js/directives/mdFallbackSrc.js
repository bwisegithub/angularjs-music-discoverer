app.directive('mdFallbackSrc', function() { 
	return { 
		restrict: 'A',
		link: function postLink(scope, iElement, iAttrs) {
		  	iElement.bind('error', function() {
				angular.element(this).attr("src", iAttrs.mdFallbackSrc);
			});
		}
	}; 
});
