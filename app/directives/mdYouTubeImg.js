(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdYouTubeImg', function() {
		return {
			restrict: 'E',
			scope: {
				mdyoutubeobj: '='
			},
			templateUrl: 'app/directives/mdYouTubeImg.html'
		};
	});
}());
