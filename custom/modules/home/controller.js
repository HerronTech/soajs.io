"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', 'homePageSrv', function ($scope, homePageSrv) {
	
	//for this page, fill the carousel
	$scope.$parent.$parent.header_carousel = [
		{
			id: 'main-image',
			header: "Putting applications on the cloud shouldn’t be an IT pain.",
			slogan: "Work on what matters. Get Microservices done.",
			image: ""
		}
	];
}]);