"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', 'homePageSrv', function ($scope, homePageSrv) {
	
	//for this page, fill the carousel
	let header_carousel = [
		{
			id: 'main-image',
			header: "Putting applications on the cloud shouldn’t be an IT pain.",
			slogan: "Work on what matters. Get Microservices done.",
			image: "custom/modules/home/images/img-1.jpg"
		}
	];
	
	$scope.updateParentScope('header_carousel', header_carousel);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('header_carousel');
	});
	
	
	homePageSrv.getIcons($scope);
	
}]);