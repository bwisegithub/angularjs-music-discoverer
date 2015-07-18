(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdThumbImg', function() { 
	  return { 
			restrict: 'E', 
			scope: { 
				mdthumbobj: '='
			}, 
			templateUrl: 'app/directives/mdThumbImg.html' 
		}; 
	});
}());