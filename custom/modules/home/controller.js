"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', 'homePageSrv', function ($scope, homePageSrv) {
	
	$scope.pageInfo = {
		title: "Home Page",
		subTitle: "Sub Title",
		slogan: "Home Page has a description"
	};
	
	$scope.doSomethig = function(){
		homePageSrv.customService($scope, {}, (error, response) => {
		
		});
	}
}]);