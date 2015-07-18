(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdImg', function() { 
	  return { 
			restrict: 'E', 
			scope: { 
				mdimgval: '=',
				mdimgalt: '=',
				mdimgclass: '='
			}, 
			templateUrl: 'app/directives/mdImg.html' 
		}; 
	});
}());