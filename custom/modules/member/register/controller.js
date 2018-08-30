"use strict";
var registerApp = app.components;
registerApp.controller('registerCtrl', ['$scope', '$timeout', 'ngDataApi', function ($scope, $timeout, ngDataApi) {
	
	$scope.openForm = true;
	$scope.confirm = {};

	$scope.siteKey = sitekey;
	
	$scope.alerts = [];
	$scope.contact = {
		firstName: '',
		lastName: '',
		email: '',
		captcha: null
	};

	$scope.closeAlert = function (index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.closeAllAlerts = function () {
		$timeout(function () {
			$scope.alerts = [];
		}, 10000);
	};

	$scope.setResponse = function (response) {
		$scope.contact.captcha = response;
	};
	$scope.setWidgetId = function (widgetId) {
		$scope.widgetId = widgetId;
	};
	$scope.cbExpiration = function () {
		vcRecaptchaService.reload($scope.widgetId);
		$scope.contact.captcha = null;
	};

	$scope.sendContact = function () {
		$scope.confirm = angular.copy($scope.contact);
		$scope.alerts.push({
			'type': 'warning',
			'msg': "Your message is being sent, please wait ..."
		});
		if ($scope.contact.captcha) {
			let options = {
				"method": "send",
				"routeName": "/projects/register",
				"data": {
					data: $scope.contact
				}
			};
			getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
				if (error) {
					let msg = "Sorry, wasn't able to send your message to the team. Try again later.";
					if (error.code === 406) {
						msg = "You have already registered with this info";
					}
					$scope.alerts.push({
						'type': 'danger',
						'msg': msg
					});
					$scope.closeAllAlerts();
				}
				else {
					$scope.contact = {
						firstName: '',
						lastName: '',
						email: '',
						captcha: null
					};

					$scope.openForm = false;
					$scope.closeAllAlerts();
				}
			});

		}
	}
	
	let innerPage = {
		header: "Member Area",
		slogan: "Register",
		image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);