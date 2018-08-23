"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', 'homePageSrv', function ($scope, homePageSrv) {
	
	$scope.siteKey = sitekey;
	
	//declare contact sale
	$scope.sales = {
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
		captcha: null,
		alerts: []
	};
	$scope.contactSales = function(){
		homePageSrv.contactSalesForm($scope);
	};
	
	//declare demo
	$scope.demo = {
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
		captcha: null,
		alerts: []
	};
	$scope.requestDemo = function(){
		homePageSrv.demoForm($scope);
	};
	
	//declare contact sale
	$scope.newsletter = {
		name: '',
		email: '',
		captcha: null,
		alerts: []
	};
	
	/**
	 * Method that handles newsletter form on submit event
	 */
	$scope.subscribe = function(){
		homePageSrv.subscribe($scope);
	};
	
	//use service to load all the icons from icons.json to the scope of this controller
	homePageSrv.getIcons($scope);
	
	//for this page, fill the carousel
	let header_carousel = [
		{
			id: 'main-image',
			header: "Putting applications on the cloud shouldn’t be an IT pain.",
			slogan: "Work on what matters. Get Microservices done.",
			image: "custom/modules/home/images/cloud.jpg"
		}
	];
	
	//upon start call parent method and send carousel entries to main scope.
	$scope.updateParentScope('header_carousel', header_carousel);
	
	//when leaving this module, trigger remove carousel entries from main scope.
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('header_carousel');
	});
}]);