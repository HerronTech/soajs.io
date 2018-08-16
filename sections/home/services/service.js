"use strict";
var homeApp = app.components;
homeApp.service('homePageSrv', ['$scope', 'ngDataApi', function ($scope, ngDataApi) {
	
	function customService($scope, options, callback){
		
		let apiOptions = {
			method: 'get',
			url: (options.url) ? options.url + options.routeName : apiConfiguration.domain + options.routeName,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		
		ngDataApi[apiOptions.method]($scope, apiOptions, callback);
	}
	
	return {
		"customService": customService
	}
}]);