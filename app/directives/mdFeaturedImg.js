(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdFeaturedImg', function() { 
		return { 
			restrict: 'E', 
			scope: { 
				mdfeaturedobj: '='
			}, 
			templateUrl: 'app/directives/mdFeaturedImg.html' 
		}; 
	});
}());