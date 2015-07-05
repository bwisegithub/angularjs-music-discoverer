app.controller('MusicianController', ['$scope', function($scope) {
	$scope.controllerData = { headerKey: 'Musician Details' };
	$scope.musician = {
		id: 43007,
		resource: 'http://dbpedia.org/resource/Blur_(band)',
		label: 'Blur (band)'
	};
}]);