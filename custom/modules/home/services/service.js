"use strict";
var homeAppSrv = app.components;
homeAppSrv.service('homePageSrv', ['$http', function ($http) {
	
	let apiAddress = window.location.protocol + "//api.soajs.io:" + window.location.port;
	
	/**
	 * Load icons from json file and hook them to scope.
	 * @param $scope
	 */
	function getIcons($scope) {
		$http.get("custom/modules/home/icons.json").success(function (data) {
			$scope.icons = data;
		});
	}
	
	/**
	 * Method that handles contact sales form on submit event
	 * @param $scope
	 */
	function contactSalesForm($scope) {
		$scope.sales.alert = {'type': 'info', 'msg': "Your message is being sent, please wait ..."};
		let postData = angular.copy($scope.sales);
		delete postData.alert;
		$http({
			method: 'POST',
			url: apiAddress + '/io/sendMessage',
			headers: {'Content-Type': 'application/json'},
			data: postData,
		}).success(function (data, status, headers, config) {
			if (data && data.result) {
				$scope.sales = {
					name: '',
					email: '',
					phone: '',
					company: '',
					message: '',
					captcha: null,
					alerts: {}
				};
				$scope.sales.alert = {
					'type': 'success',
					'msg': "Thank you for contacting our sales team. We will get back to you shortly."
				};
			}
			else {
				$scope.sales.alert = {
					'type': 'danger',
					'msg': "Failed sending your message to the sales team, try again later."
				};
			}
		}).error(function (errData, status, headers, config) {
			$scope.sales.alert = {
				'type': 'danger',
				'msg': "Failed sending your message to the sales team, try again later."
			};
		});
	}
	
	/**
	 * Method that handles demo form on submit event
	 * @param $scope
	 */
	function demoForm($scope) {
		$scope.demo.alert = {'type': 'info', 'msg': "Your request is being sent, please wait ..."};
		let postData = angular.copy($scope.demo);
		delete postData.alert;
		$http({
			method: 'POST',
			url: apiAddress + '/io/sendRequest',
			headers: {'Content-Type': 'application/json'},
			data: postData,
		}).success(function (data, status, headers, config) {
			if (data && data.result) {
				$scope.demo = {
					name: '',
					email: '',
					phone: '',
					company: '',
					message: '',
					captcha: null,
					alert: {}
				};
				$scope.demo.alert = {
					'type': 'success',
					'msg': "Thank you for contacting our team regarding a demo. We will get back to you shortly."
				};
			}
			else {
				$scope.demo.alert = {
					'type': 'danger',
					'msg': "Failed sending your request to the team, try again later."
				};
			}
		}).error(function (errData, status, headers, config) {
			$scope.demo.alert = {'type': 'danger', 'msg': "Failed sending your request to the team, try again later."};
		});
	}
	
	/**
	 * Method that handles newsletter form on submit event
	 * @param $scope
	 */
	function subscribe($scope) {
		let postData = angular.copy($scope.newsletter);
		delete postData.alert;
		$http({
			method: 'POST',
			url: apiAddress + '/io/subscribe',
			headers: {'Content-Type': 'application/json'},
			data: postData,
		}).success(function (data, status, headers, config) {
			if (data && data.result) {
				$scope.newsletter = {
					name: '',
					email: '',
					captcha: null,
					alert: {}
				};
				$scope.newsletter.alert = {'type': 'success', 'msg': "Thank you for subscribing."};
			}
			else {
				$scope.newsletter.alert = {
					'type': 'danger',
					'msg': "Failed sending your subscription, try again later."
				};
			}
		}).error(function (errData, status, headers, config) {
			$scope.newsletter.alert = {'type': 'danger', 'msg': "Failed sending your subscription, try again later."};
		});
	}
	
	return {
		"getIcons": getIcons,
		"contactSalesForm": contactSalesForm,
		"demoForm": demoForm,
		"subscribe": subscribe
	}
}]);