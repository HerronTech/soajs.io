"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$uibModal', 'homePageSrv', 'injectFiles', function ($scope, $uibModal, homePageSrv, injectFiles) {
	
	$scope.siteKey = sitekey;
	
	//declare contact sale
	$scope.sales = {
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
		captcha: null,
		alert: {}
	};
	$scope.openSalesForm = function(){
		let currentScope = $scope;
		$uibModal.open({
			animation: true,
			templateUrl: 'sales.tmpl',
			controller: ($scope, $uibModalInstance) => {
				$scope.siteKey = currentScope.siteKey;
				$scope.sales = angular.copy(currentScope.sales);
				
				$scope.contactSales = function(){
					homePageSrv.contactSalesForm($scope, $uibModalInstance);
				};
			},
		});
	};
	
	//declare demo
	$scope.demo = {
		name: '',
		email: '',
		phone: '',
		company: '',
		message: '',
		captcha: null,
		alert: {}
	};
	$scope.openDemoForm = function() {
		let currentScope = $scope;
		$uibModal.open({
			animation: true,
			templateUrl: 'demo.tmpl',
			controller: ($scope, $uibModalInstance) => {
				$scope.siteKey = currentScope.siteKey;
				$scope.demo = angular.copy(currentScope.demo);
				
				$scope.requestDemo = function(){
					homePageSrv.demoForm($scope, $uibModalInstance);
				};
			},
		});
	};
	
	//declare newsletter
	$scope.newsletter = {
		name: '',
		email: '',
		captcha: null,
		alert: {}
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
			slogan: "Any cloud - Any technology",
			image: "custom/modules/home/images/cloud.jpg"
		}
	];
	
	//upon start call parent method and send carousel entries to main scope.
	$scope.updateParentScope('header_carousel', header_carousel);
	
	//when leaving this module, trigger remove carousel entries from main scope.
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('header_carousel');
	});
	
	injectFiles.injectCss("custom/modules/home/home.css");
}]);