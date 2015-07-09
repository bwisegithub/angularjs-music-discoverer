app.directive('mdFallbackSrc', function() { 
	return { 
		restrict: 'A',
		link: function postLink(scope, iElement, iAttrs) {
			iElement.bind('error', function() {
				// There was an error finding the img src
				if (iAttrs.mdFallbackSrc === 'none') {
					// Remove the image element entirely
					angular.element(this).remove();
				}
				else {
					// Use the iAttrs.mdFallbackSrc for the fallback img
					angular.element(this).attr('src', iAttrs.mdFallbackSrc);
				}
			});
		}
	}; 
});
