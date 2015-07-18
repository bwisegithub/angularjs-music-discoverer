(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdResultsPlaceholder', function() { 
	  return { 
			restrict: 'E', 
			scope: { 
				mdresplaceholder: '=' 
			}, 
			templateUrl: 'app/directives/mdResultsPlaceholder.html' 
		}; 
	});
}());