app.directive('mdYouTubeImg', function() { 
	return { 
		restrict: 'E', 
		scope: { 
			mdyoutubeobj: '='
		}, 
		templateUrl: 'app/directives/mdYouTubeImg.html'
	}; 
});


