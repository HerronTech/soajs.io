"use strict";
var accountApp = app.components;

accountApp.controller('billingCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Member Area",
		slogan: "My Billing",
		image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);

accountApp.controller('changeSecurityCtrl', ['$scope', function ($scope) {

	let innerPage = {
		header: "Member Area",
		slogan: "My Billing",
		image: "custom/modules/member/images/member.jpg"
	};

	$scope.updateParentScope('innerPage', innerPage);

	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);

accountApp.controller('profileCtrl', ['$scope', '$timeout', '$uibModal', 'ngDataApi', '$cookies', '$localStorage', 'isUserLoggedIn',
	function ($scope, $timeout, $uibModal, ngDataApi, $cookies, $localStorage, isUserLoggedIn) {

		$scope.alerts = [];

		let innerPage = {
			header: "Member Area",
			slogan: "My Profile",
			image: "custom/modules/member/images/member.jpg"
		};

		$scope.updateParentScope('innerPage', innerPage);

		$scope.$on("$destroy", function () {
			$scope.removeFromParentScope('innerPage');
		});

		// var profileObj;
		var formConfig = {
			'form': {
				'name': 'editProfile',
				'entries': []
			},
			'timeout': $timeout,
			'name': 'editProfile',
			'label': 'Edit Profile',
			'entries': [
				{
					'name': 'firstName',
					'label': 'First Name',
					'type': 'text',
					'placeholder': "Enter First Name",
					'value': '',
					'tooltip': "Enter your first name",
					'required': true
				},
				{
					'name': 'lastName',
					'label': "Last Name",
					'type': 'text',
					'placeholder': "Enter LastName",
					'value': '',
					'tooltip': 'Enter your last name',
					'required': true
				},
				{
					'name': 'email',
					'label': "Email",
					'type': 'readonly',
					'placeholder': "Enter Email",
					'value': '',
					'tooltip': "Enter your email",
					'required': true
				},
				{
					'name': 'username',
					'label': "Username",
					'type': 'text',
					'placeholder': "Enter Username",
					'value': '',
					'tooltip': "Usernames are alphanumeric and support  _ & -  character only",
					'required': true
				},
				// {
				// 	'name': 'profile',
				// 	'label': translation.profile[LANG],
				// 	'type': 'jsoneditor',
				// 	'options': {
				// 		'mode': 'code',
				// 		'availableModes': [
				// 			{ 'v': 'code', 'l': 'Code View' },
				// 			{
				// 				'v': 'tree',
				// 				'l': 'Tree View'
				// 			},
				// 			{ 'v': 'form', 'l': 'Form View' }
				// 		]
				// 	},
				// 	'height': '300px',
				// 	"value": {},
				// 	'required': false,
				// 	'tooltip': translation.fillYourAdditionalProfileInformation[LANG],
				// 	'fieldMsg': 'This JSON Object can hold additional profile configuration i.e.: age, gender, nationality etc...'
				// }
			],
			'data': {},
			'actions': [
				{
					'type': 'submit',
					'label': 'Edit Profile',
					'btn': 'primary',
					'action': function (formData) {
						// if (formData.profile) {
						// 	profileObj = formData.profile;
						// }
						var postData = {
							// 'profile': profileObj,
							'username': formData.username,
							'firstName': formData.firstName,
							'lastName': formData.lastName
						};
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"routeName": "/urac/account/editProfile",
							"headers": {
								"key": apiConfiguration.key
							},
							"params": {
								"uId": $scope.uId
							},
							"data": postData
						}, function (error) {
							if (error) {
								$scope.form.displayAlert('danger', error.message);
							}
							else {
								$scope.form.displayAlert('success', 'Profile Updated Successfully');

								userCookie.firstName = formData.firstName;
								userCookie.username = formData.username;
								userCookie.lastName = formData.lastName;
								// userCookie.profile = profileObj;

								$localStorage.soajs_user = userCookie;
								$scope.$parent.$emit('refreshWelcome', {});
							}
						});
					}
				}
			]
		};

		$scope.getProfile = function (username) {
			let options = {
				"method": "get",
				"headers": {
					"key": apiConfiguration.key
				},
				"routeName": "/urac/account/getUser",
				"params": {
					"username": username
				}
			};
			getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
					closeAllAlerts($scope, $timeout);
				}
				else {
					$scope.uId = response._id;
					// var p = response.profile;
					formConfig.data = response;
					// formConfig.data.profile = p;
					buildForm($scope, null, formConfig);

					$scope.$parent.$emit('xferData', { 'memberData': response });
				}
			});
		};

		var userCookie = $localStorage.soajs_user;
		if (userCookie) {
			if ((typeof(userCookie) !== "undefined") && (typeof(userCookie) === "object")) {
				var uname = userCookie.username;
				// profileObj = $localStorage.soajs_user.profile;
				$scope.getProfile(uname);
			}
		}
	}]);