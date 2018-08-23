"use strict";
var homeAppSrv = app.components;
homeAppSrv.service('homePageSrv', ['$http', function ($http) {
	
	let apiAddress = apiConfiguration.domain;
	
	/**
	 * Load icons from json file and hook them to scope.
	 * @param $scope
	 */
	function getIcons($scope){
		$http.get("custom/modules/home/icons.json").success(function(data) {
			$scope.icons = data;
		});
	}
	
	/**
	 * Method that handles contact sales form on submit event
	 * @param $scope
	 */
	function contactSalesForm($scope) {
		$scope.sales.alerts = [];
		$scope.sales.alerts.push({ 'type': 'info', 'msg': "Your message is being sent, please wait ..." });
		let postData = angular.copy($scope.sales);
		delete postData.alerts;
		$http({
			method: 'POST',
			url: apiAddress + '/sendMessage',
			headers: { 'Content-Type': 'application/json' },
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
					alerts: []
				};
				$scope.sales.alerts.push({ 'type': 'success', 'msg': "Thank you for contacting our sales team. We will get back to you shortly." });
			}
			else {
				$scope.sales.alerts.push({ 'type': 'danger', 'msg': "Failed sending your message to the sales team, try again later." });
			}
		}).error(function (errData, status, headers, config) {
			$scope.sales.alerts.push({ 'type': 'danger', 'msg': "Failed sending your message to the sales team, try again later." });
		});
	}
	
	/**
	 * Method that handles demo form on submit event
	 * @param $scope
	 */
	function demoForm($scope) {
		$scope.demo.alerts = [];
		$scope.demo.alerts.push({ 'type': 'info', 'msg': "Your request is being sent, please wait ..." });
		let postData = angular.copy($scope.demo);
		delete postData.alerts;
		$http({
			method: 'POST',
			url: apiAddress + '/sendRequest',
			headers: { 'Content-Type': 'application/json' },
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
					alerts: []
				};
				$scope.demo.alerts.push({ 'type': 'success', 'msg': "Thank you for contacting our team regarding a demo. We will get back to you shortly." });
			}
			else {
				$scope.demo.alerts.push({ 'type': 'danger', 'msg': "Failed sending your request to the team, try again later." });
			}
		}).error(function (errData, status, headers, config) {
			$scope.demo.alerts.push({ 'type': 'danger', 'msg': "Failed sending your request to the team, try again later." });
		});
	}
	
	/**
	 * Method that handles demo form on submit event
	 * @param $scope
	 */
	function subscribe($scope) {
		$scope.newsletter.alerts = [];
		let postData = angular.copy($scope.newsletter);
		delete postData.alerts;
		$http({
			method: 'POST',
			url: apiAddress + '/sendMessage',
			headers: { 'Content-Type': 'application/json' },
			data: postData,
		}).success(function (data, status, headers, config) {
			if (data && data.result) {
				$scope.newsletter = {
					name: '',
					email: '',
					captcha: null,
					alerts: []
				};
				$scope.newsletter.alerts.push({ 'type': 'success', 'msg': "Thank you for subscribing." });
			}
			else {
				$scope.newsletter.alerts.push({ 'type': 'danger', 'msg': "Failed sending your subscription, try again later." });
			}
		}).error(function (errData, status, headers, config) {
			$scope.newsletter.alerts.push({ 'type': 'danger', 'msg': "Failed sending your subscription, try again later." });
		});
	}
	
	return {
		"getIcons": getIcons,
		"contactSalesForm": contactSalesForm,
		"demoForm": demoForm,
		"subscribe": subscribe
	}
}]);