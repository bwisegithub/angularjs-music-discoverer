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
					// Use the iAttrs.mdFallbackSrc for the fallback img.
					// NOTE: Currently not availing of this in the app, but leaving in 
					// for possible future use.
					angular.element(this).attr('src', iAttrs.mdFallbackSrc);
				}
			});
		}
	}; 
});
