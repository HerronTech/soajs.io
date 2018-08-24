"use strict";
var loginApp = app.components;

var loginConfig = {
	formConf: {
		'name': 'login',
		'label': "Login",
		'msgs': {
			'footer': ''
		},
		'entries': [
			{
				'name': 'username',
				'label': 'Username',
				'hideLabel': true,
				'type': 'text',
				'placeholder': 'Enter Username',
				'value': '',
				'tooltip': "Usernames are alphanumeric and support  _ & -  character only",
				'required': true
			},
			{
				'name': 'password',
				'label': "Password",
				'hideLabel': true,
				'type': 'password',
				'placeholder': "Enter Password",
				'value': '',
				'fieldMsg': '<a href="/members/forgetPw"> Forgot your password? </a>',
				'tooltip': "Passwords are alphanumeric and support _ character only",
				'required': true
			}
		]
	}
};

loginApp.controller('loginPageCtrl', ['$scope', '$cookies', function ($scope, $cookies) {
	
	let innerPage = {
		header: "Member Area",
		slogan: "Login & Register",
		image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
	
	var formConfig = loginConfig.formConf;
	formConfig.actions = [
		{
			'type': 'reset',
			'label': 'Register',
			'btn': 'warning',
			'action': function (formData) {
				$scope.$parent.go("/members/register");
			}
		},
		{
			'type': 'submit',
			'label': 'Login',
			'btn': 'primary',
			'action': function (formData) {
				
				$scope.alerts = [];
				var postData = {
					'username': formData.username,
					'password': formData.password,
					'grant_type': "password"
				};
				var authValue;
				
				function loginOauth() {
					var options1 = {
						"token": false,
						"method": "get",
						"routeName": "/oauth/authorization"
					};
					getSendDataFromServer($scope, ngDataApi, options1, function (error, response) {
						if (error) {
							overlayLoading.hide();
							$scope.alerts.push({
								'type': 'danger',
								'msg': error.message
							});
						}
						else {
							authValue = response.data;
							
							var options2 = {
								"method": "post",
								"routeName": "/oauth/token",
								"data": postData,
								"headers": {
									'accept': '*/*',
									"Authorization": authValue
								}
							};
							getSendDataFromServer($scope, ngDataApi, options2, function (error, response) {
								if (error) {
									overlayLoading.hide();
									$scope.alerts.push({
										'type': 'danger',
										'msg': error.message
									});
									$scope.closeAllAlerts();
								}
								else {
									if (Object.hasOwnProperty.call(response, "access_token")) {
										$cookies.put('access_token', response.access_token, { 'domain': interfaceDomain });
										$cookies.put('refresh_token', response.refresh_token, { 'domain': interfaceDomain });
									}
									uracLogin();
								}
							});
							
						}
					});
				}
				
				overlayLoading.show();
				loginOauth();
				var myUser;
				
				function uracLogin() {
					var options = {
						"method": "get",
						"routeName": "/urac/account/getUser",
						"params": {
							'username': formData.username
						}
					};
					getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
						if (error) {
							overlayLoading.hide();
							ngDataApi.logoutUser($scope);
							$scope.alerts.push({
								'type': 'danger',
								'msg': error.message
							});
							$scope.closeAllAlerts();
						}
						else {
							myUser = response;
							//get dashboard keys
							getKeys();
						}
					});
				}
				
				function getKeys() {
					getSendDataFromServer($scope, ngDataApi, {
						"method": "get",
						"routeName": "/key/permission/get",
						"params": { "main": false }
					}, function (error, response) {
						if (error) {
							overlayLoading.hide();
							ngDataApi.logoutUser($scope);
							$scope.alerts.push({
								'type': 'danger',
								'msg': error.message
							});
							$scope.closeAllAlerts();
						}
						else {
							myUser.locked = response.locked || false;
							$localStorage.soajs_user = myUser;
							$cookies.put("soajs_username", myUser.username, { 'domain': interfaceDomain });
							$cookies.put("ht_dashboard_key", response.extKey, { 'domain': interfaceDomain });
							getPermissions();
						}
					});
				}
				
				function getPermissions() {
					getSendDataFromServer($scope, ngDataApi, {
						"method": "get",
						"routeName": "/key/permission/get"
					}, function (error, response) {
						overlayLoading.hide();
						if (error) {
							$localStorage.soajs_user = null;
							ngDataApi.logoutUser($scope);
							$scope.alerts.push({
								'type': 'danger',
								'msg': error.message
							});
							$scope.closeAllAlerts();
						}
						else {
							$localStorage.acl_access = response.acl;
							$scope.$parent.go("/members/projects");
							$scope.$parent.$emit("loadUserInterface", {});
						}
					});
				}
				
			}
		}
	];
	
	buildForm($scope, null, formConfig);
	
}]);