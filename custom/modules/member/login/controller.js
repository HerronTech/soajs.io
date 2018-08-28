"use strict";
var loginApp = app.components;

loginApp.controller('logoutCtrl', ['$scope', '$location', '$cookies', 'ngDataApi', function ($scope, $location, $cookies, ngDataApi) {
	
	$scope.start = function () {
		function clearData() {
			ngDataApi.logout();
			$scope.$parent.$emit('refreshWelcome', {});
			$location.path('/member/login');
		}
		
		function logout() {
			overlayLoading.show();
			
			getSendDataFromServer($scope, ngDataApi, {
				"method": "delete",
				"routeName": "/oauth/refreshToken/" + $cookies.get("refresh_token", { 'domain': interfaceDomain }),
				"headers": {
					"key": apiConfiguration.key
				}
			}, function (error, response) {
				
				getSendDataFromServer($scope, ngDataApi, {
					"method": "delete",
					"routeName": "/oauth/accessToken/" + $cookies.get("access_token", { 'domain': interfaceDomain }),
					"headers": {
						"key": apiConfiguration.key
					}
				}, function (error, response) {
					overlayLoading.hide();
					clearData();
				});
			});
		}
		
		logout();
	};
	
	$scope.start();
}]);

loginApp.controller('loginPageCtrl', ['$scope', '$cookies', '$timeout', '$localStorage', 'ngDataApi', '$location', 'isUserLoggedIn',
	function ($scope, $cookies, $timeout, $localStorage, ngDataApi, $location, isUserLoggedIn) {
		
		let loginConfig = {
			name: 'loginForm',
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
						'fieldMsg': '<a href="/forgetPassword"> Forgot your password? </a>',
						'tooltip': "Passwords are alphanumeric and support _ character only",
						'required': true
					}
				]
			}
		};
		
		if (isUserLoggedIn($scope)) {
			$location.path('/member/profile');
		}
		
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
		formConfig.timeout = $timeout;
		formConfig.actions = [
			{
				'type': 'reset',
				'label': 'Register',
				'btn': 'warning',
				'action': function () {
					$location.path('/member/join');
				}
			},
			{
				'type': 'submit',
				'label': 'Login',
				'btn': 'primary',
				'action': function (formData) {
					
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
								$scope.form.displayAlert('danger', error.message);
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
										$scope.form.displayAlert('danger', error.message);
									}
									else {
										if (Object.hasOwnProperty.call(response, "access_token")) {
											$cookies.put('access_token', response.access_token, { 'domain': interfaceDomain });
											$cookies.put('refresh_token', response.refresh_token, { 'domain': interfaceDomain });
											uracLogin();
										}
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
								ngDataApi.logout($scope);
								$scope.form.displayAlert('danger', error.message);
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
							"params": {
								"main": false
							}
						}, function (error, response) {
							if (error) {
								overlayLoading.hide();
								ngDataApi.logout($scope);
								$scope.form.displayAlert('danger', error.message);
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
								ngDataApi.logout($scope);
								$scope.form.displayAlert('danger', error.message);
							}
							else {
								$localStorage.acl_access = response.acl;
								$scope.$parent.$emit('refreshWelcome', {});
								
								var redirectUrl = $location.search().redirectUrl;
								if (redirectUrl) {
									$location.path(redirectUrl).search('redirectUrl', null);
								} else {
									$location.path('/member/projects');
								}
							}
						});
					}
					
				}
			}
		];
		
		buildForm($scope, null, formConfig);
		
	}]);

loginApp.controller('forgotPwCtrl', ['$scope', '$cookies', '$timeout', 'ngDataApi', '$location', 'isUserLoggedIn',
	function ($scope, $cookies, $timeout, ngDataApi, $location, isUserLoggedIn) {
		
		if (isUserLoggedIn($scope)) {
			$location.path('/member/profile');
		}
		
		let innerPage = {
			header: "Member Area",
			slogan: "Login & Register",
			image: "custom/modules/member/images/member.jpg"
		};
		
		$scope.updateParentScope('innerPage', innerPage);
		
		$scope.$on("$destroy", function () {
			$scope.removeFromParentScope('innerPage');
		});
		
		var formConfig = forgetPwConfig.formConf;
		formConfig.timeout = $timeout;
		formConfig.actions = [
			{
				'type': 'submit',
				'label': 'Submit',
				'btn': 'primary',
				'action': function (formData) {
					
					var postData = {
						'username': formData.username
					};
					overlayLoading.show();
					
					var options1 = {
						"method": "get",
						"routeName": "/urac/forgotPassword",
						"params": postData
					};
					getSendDataFromServer($scope, ngDataApi, options1, function (error, response) {
						overlayLoading.hide();
						if (error) {
							$scope.form.displayAlert('danger', error.message);
						}
						else {
							$scope.form.displayAlert('success', "A reset link has been sent to your email address.");
							$timeout(function () {
								$location.path('/member/login');
							}, 8000);
						}
					});
				}
			}
		];
		
		buildForm($scope, null, formConfig);
		
	}]);

loginApp.controller('resetPwCtrl', ['$scope', 'ngDataApi', '$routeParams', '$timeout', '$location', '$route',
	function ($scope, ngDataApi, $routeParams, $timeout, $location, $route) {
		
		var formConfig = resetPwConfig.formConf;
		formConfig.timeout = $timeout;
		formConfig.actions = [
			{
				'type': 'submit',
				'label': 'Submit',
				'btn': 'primary',
				'action': function (formData) {
					var postData = {
						'password': formData.password,
						'confirmation': formData.confirmPassword
					};
					if (formData.password !== formData.confirmPassword) {
						$scope.form.displayAlert('danger', "Password And Confirm Fields Do Not Match!");
						return;
					}
					getSendDataFromServer($scope, ngDataApi, {
						"method": "send",
						"routeName": "/urac/resetPassword",
						"headers": {
							"key": apiConfiguration.key
						},
						"params": {
							"token": $routeParams.token
						},
						"data": postData
					}, function (error) {
						if (error) {
							$scope.form.displayAlert('danger', error.message);
						}
						else {
							$scope.form.displayAlert('success', "Your password was reset.");
							$timeout(function () {
								$location.path('/member/login');
							}, 6000);
						}
					});
				}
			}
		];
		
		buildForm($scope, null, formConfig);
		
	}]);

loginApp.controller('validateCtrl', ['$scope', 'ngDataApi', '$route', 'isUserLoggedIn', '$location', '$timeout',
	function ($scope, ngDataApi, $route, isUserLoggedIn, $location, $timeout) {
		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 30000);
		};
		
		$scope.validateChangeEmail = function () {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/changeEmail/validate",
				"headers": {
					"key": apiConfiguration.key
				},
				"params": {
					"token": $route.current.params.token
				}
			}, function (error) {
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
				}
				else {
					$scope.alerts.push({
						'type': 'success',
						'msg': "Your Email was Changed Successfully"
					});
					setTimeout(function () {
						$location.path('/member/profile');
					}, 5000);
				}
			});
		};
		
		$scope.validateJoin = function () {
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/urac/join/validate",
				"headers": {
					"key": apiConfiguration.key
				},
				"params": {
					"token": $route.current.params.token
				}
			}, function (error, response) {
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
				}
				else {
					$scope.alerts.push({
						'type': 'success',
						'msg': "Your Email was Validated Successfully. You can login now"
					});
					setTimeout(function () {
						$location.path('/member/login');
					}, 5000);
				}
			});
		};
		
		if ($route.current.originalPath === '/members/joinValidate') {
			$scope.validateJoin();
		}
		else if ($route.current.originalPath === '/members/validateEmail') {
			$scope.validateChangeEmail();
		}
		
	}]);

loginApp.controller('setPasswordCtrl', ['$scope', 'ngDataApi', '$routeParams', 'isUserLoggedIn', '$timeout', '$location',
	function ($scope, ngDataApi, $routeParams, isUserLoggedIn, $timeout, $location) {
		
		$scope.hideForm = false;
		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
		
		var formConfig = setPasswordConfig.formConf;
		formConfig.timeout = $timeout;
		formConfig.actions = [
			{
				'type': 'submit',
				'label': "Submit",
				'btn': 'primary',
				'action': function (formData) {
					var postData = {
						'password': formData.password,
						'confirmation': formData.confirmPassword
					};
					if (formData.password !== formData.confirmPassword) {
						$scope.form.displayAlert('danger', "Password And Confirm Fields Do Not Match!");
						return;
					}
					getSendDataFromServer($scope, ngDataApi, {
						"method": "send",
						"routeName": "/urac/resetPassword",
						"headers": {
							"key": apiConfiguration.key
						},
						"params": {
							"token": $routeParams.token
						},
						"data": postData
					}, function (error) {
						if (error) {
							$scope.form.displayAlert('danger', error.message);
						}
						else {
							$scope.alerts.push({
								'type': 'success',
								'msg': "Password Set Successfully"
							});
							$scope.hideForm = true;
							$timeout(function () {
								$location.path('/member/login');
							}, 5000);
						}
					});
				}
			}
		];
		
		buildForm($scope, null, formConfig);
	}]);