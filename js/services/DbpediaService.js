app.factory('musicians', ['$http', function($http) {

	var url = "http://dbpedia.org/sparql/";
	var query = [
 		"select distinct ?Concept where {[] a ?Concept} ",
 		"LIMIT 100"
	].join(" ");

	var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";
	//queryUrl = 'https://s3.amazonaws.com/codecademy-content/courses/ltp4/emails-api/emails.json';
	window.alert(queryUrl);

	return $http.get(queryUrl)
		.success(function(data) {
			//window.alert(data);
		  return data;
		})
		.error(function(err) {
			window.alert(err);
		  return err;
		});
}]);


