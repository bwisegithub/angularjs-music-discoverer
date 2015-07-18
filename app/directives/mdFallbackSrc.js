(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdFallbackSrc', function() { 
		return { 
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.bind('error', function() {
					// There was an error finding the img src
					if (attrs.mdFallbackSrc === 'none') {
						// Keep for future reference:
						// Remove the image element entirely
						// angular.element(this).remove();

						// Remove the src attribute (as if the dbpedia thumbnail value never existed)
						angular.element(this).removeAttr('src');
					}
					else {
						// Use the attrs.mdFallbackSrc for the fallback img.
						// NOTE: Currently not availing of this in the app, but leaving in 
						// for possible future use.
						angular.element(this).attr('src', attrs.mdFallbackSrc);
					}
				});
			}
		}; 
	});
}());
