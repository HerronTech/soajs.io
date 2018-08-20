"use strict";
var homeAppSrv = app.components;
homeAppSrv.service('homePageSrv', ['$http', function ($http) {
	
	function getIcons($scope){
		
		$http.get("custom/modules/home/icons.json").success(function(data) {
			$scope.icons = data;
		});
	}
	
	return {
		"getIcons": getIcons
	}
}]);