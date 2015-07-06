app.controller('ResultListController', ['$scope', 'musicians', function($scope, musicians) {
	$scope.controllerData = { headerKey: 'Search Result List' };
	/*$scope.musicians = [
		{
			id: 43007,
			resource: 'http://dbpedia.org/resource/Blur_(band)',
			label: 'Blur (band)'
		},
		{
			id: 80103,
			resource: 'http://dbpedia.org/resource/Coldplay',
			label: 'Coldplay'
		},
		{
			id: 247253,
			resource: 'http://dbpedia.org/resource/Anthrax_(UK_band)',
			label: 'Anthrax (UK band)'
		}
	];*/
	musicians.success(function(data) {
		$scope.musicians = data;
	});  
}]);
