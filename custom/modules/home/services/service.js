"use strict";
var homeAppSrv = app.components;
homeAppSrv.service('homePageSrv', ['ngDataApi', function (ngDataApi) {
	
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