app.factory('youTubeResults', ['$http', function($http) {

	return {
		search: function(keywords) { 
			// videoCategoryId 10 is music across all regions, where allowed
			return $http.get('https://www.googleapis.com/youtube/v3/search', {
					params: {
						key: 'AIzaSyAn6voENIf-fwH-9OLQa6usiUkUBJCJ_-A',
						part: 'snippet',
						maxResults: '4',
						type: 'video',
						videoCategoryId: '10',
						fields: 'items/id/videoId,items/snippet/title,items/snippet/thumbnails/high',
						q: keywords
					}
				})
				.success(function(data) {
					return data;
				})
				.error(function(resp, status, header, config) {
					var respTime = new Date().getTime() - startTime;
					if(respTime >= config.timeout) {
						window.alert('Timeout error calling the youTube API service.\nThe service may be under maintenance.\nTry again later.');
					} else {
						window.alert('Unexpected error calling the youTube API service');
					}
				});
		}
	}
}]);