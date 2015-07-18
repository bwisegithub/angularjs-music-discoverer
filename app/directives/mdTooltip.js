(function () {
	'use strict';

	angular.module('MusicDiscovererApp').directive('mdTooltip', function(){
		return {
			restrict: 'A',
			link: function(scope, element){
				$(element).hover(function(){
					// on mouseenter
					$(element).tooltip('show');
				}, function(){
					// on mouseleave
					$(element).tooltip('hide');
				});
			}
		};
	});
}());