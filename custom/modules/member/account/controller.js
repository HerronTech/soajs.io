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

accountApp.controller('changeSecurityCtrl', ['$scope', '$timeout', '$uibModal', '$localStorage', 'ngDataApi', function ($scope, $timeout, $uibModal, $localStorage, ngDataApi) {

	$scope.$parent.$on('xferData', function (event, args) {
		$scope.memberData = args.memberData;
	});
	
	$scope.closeAlert = function (index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.closeAllAlerts = function () {
		$timeout(function () {
			$scope.alerts = [];
		}, 30000);
	};

	$scope.changeEmail = function () {
		$scope.alerts = [];
		var config = changeEmailConfig.formConf;
		var options = {
			form: config,
			'timeout': $timeout,
			'name': 'changeEmail',
			'label': 'Change Email',
			'actions': [
				{
					'type': 'submit',
					'label': 'Change Email',
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'email': formData.email
						};
						overlayLoading.show();
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"headers": {
								"key": apiConfiguration.key
							},
							"routeName": "/urac/account/changeEmail",
							"params": { "uId": $scope.memberData._id },
							"data": postData
						}, function (error) {
							overlayLoading.hide();
							if (error) {
								$scope.form.displayAlert('danger', error.message);
							}
							else {
								$scope.alerts.push({
									'type': 'success',
									'msg': "A link will be sent to your new email address to validate the change."
								});
								$scope.modalInstance.close();
								$scope.form.formData = {};
							}
						});
					}
				},
				{
					'type': 'reset',
					'label': 'Cancel',
					'btn': 'danger',
					'action': function () {
						$scope.modalInstance.dismiss('cancel');
						$scope.form.formData = {};
					}
				}
			]
		};
		buildFormWithModal($scope, $uibModal, options);
	};

	$scope.changePassword = function () {
		$scope.alerts = [];
		var config = changePwConfig.formConf;
		var options = {
			form: config,
			'timeout': $timeout,
			'name': 'changePassword',
			'label': 'Change Password',
			'actions': [
				{
					'type': 'submit',
					'label': 'Change Password',
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'password': formData.password,
							'oldPassword': formData.oldPassword,
							'confirmation': formData.confirmPassword
						};
						if (formData.password !== formData.confirmPassword) {
							$scope.form.displayAlert('danger', "Your password and confirm password fields do not match!");
							return;
						}
						overlayLoading.show();
						getSendDataFromServer($scope, ngDataApi, {
							"method": "send",
							"headers": {
								"key": apiConfiguration.key
							},
							"routeName": "/urac/account/changePassword",
							"params": {
								"uId": $scope.memberData._id
							},
							"data": postData
						}, function (error) {
							overlayLoading.hide();
							if (error) {
								$scope.form.displayAlert('danger', error.message);
							}
							else {
								$scope.alerts.push({
									'type': 'success',
									'msg': "Password changed successfully."
								});
								$scope.closeAllAlerts();
								$scope.modalInstance.close();
								$scope.form.formData = {};
							}
						});
					}
				},
				{
					'type': 'reset',
					'label': "Cancel",
					'btn': 'danger',
					'action': function () {
						$scope.modalInstance.dismiss('cancel');
						$scope.form.formData = {};
					}
				}
			]
		};
		buildFormWithModal($scope, $uibModal, options);
	};

}]);

accountApp.controller('profileCtrl', ['$scope', '$timeout', '$uibModal', 'ngDataApi', '$cookies', '$localStorage', '$location', 'isUserLoggedIn',
	function ($scope, $timeout, $uibModal, ngDataApi, $cookies, $localStorage, $location, isUserLoggedIn) {

		if (!isUserLoggedIn($scope)) {
			$scope.$parent.$emit("refreshWelcome", {});
			$location.path('/member/login');
		}

		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 30000);
		};
		
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
				// 	'label': "Profile",
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
				// 	'tooltip': 'Fill Your Additional Profile Information',
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

accountApp.controller('orgChart', ['$scope', '$timeout', '$uibModal', 'ngDataApi', '$cookies', '$localStorage', '$location', 'isUserLoggedIn',
	function ($scope, $timeout, $uibModal, ngDataApi, $cookies, $localStorage, $location, isUserLoggedIn) {

		if (!isUserLoggedIn($scope)) {
			$scope.$parent.$emit("refreshWelcome", {});
			$location.path('/member/login');
		}

		$scope.alerts = [];
		
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
		
		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 30000);
		};

		let innerPage = {
			header: "Member Area",
			slogan: "My Organization",
			image: "custom/modules/member/images/member.jpg"
		};

		$scope.updateParentScope('innerPage', innerPage);

		$scope.$on("$destroy", function () {
			$scope.removeFromParentScope('innerPage');
		});
		
		var userCookie = $localStorage.soajs_user;
		$scope.userCookie = $localStorage.soajs_user;

		$scope.access = {};
		constructModulePermissions($scope, $localStorage, $scope.access, membersConfig.permissions);

		$scope.getProjects = function () {
			$scope.projects = {};
			$scope.projects.active = [];
			$scope.projects.names = [];
			overlayLoading.show();
			invokeApi($scope, ngDataApi, {
				"method": "get",
				"routeName": "/projects/projects/list",
				"params": {}
			}, function (error, data) {
				overlayLoading.hide();
				if (error) {
				}
				else {
					data.forEach(function (project) {
						$scope.projects.names.push(project.name);
						if (project.status === 'pending') {
							return;
						}
						$scope.projects.active.push(project);
					});
				}
			});
		};

		$scope.getProjects();
	}]);

accountApp.controller('membersCtrl', ['$scope', '$timeout', '$uibModal', 'ngDataApi', '$cookies', '$localStorage', 'membersHelper', 'isUserLoggedIn',
	function ($scope, $timeout, $uibModal, ngDataApi, $cookies, $localStorage, membersHelper, isUserLoggedIn) {

		$scope.members = angular.extend($scope);
		$scope.members.access = $scope.$parent.access;
		
		$scope.userCookie = $localStorage.soajs_user;
		$scope.alerts = [];

		$scope.$parent.$on('reloadMembers', function (event) {
			$scope.members.listMembers($scope.members);
		});
		
		$scope.members.listMembers = function () {
			membersHelper.listMembers($scope.members, membersConfig);
		};
		
		$scope.members.addMember = function () {
			membersHelper.addMember($scope.members, membersConfig);
		};
		
		$scope.members.editMember = function (data) {
			membersHelper.editMember($scope.members, membersConfig, data)
		};
		
		$scope.members.activateMembers = function () {
			membersHelper.activateMembers($scope.members);
		};
		
		$scope.members.deactivateMembers = function () {
			membersHelper.deactivateMembers($scope.members);
		};
		
		//call default method
		setTimeout(function () {
			if ($scope.members.access.adminUser.list) {
				$scope.members.listMembers();
			}
		}, 50);
	}]);

accountApp.controller('groupsCtrl', ['$scope', '$timeout', '$localStorage', 'groupsHelper', function ($scope, $timeout, $localStorage, groupsHelper) {
	$scope.key = apiConfiguration.key;
	$scope.groups = angular.extend($scope);
	$scope.groups.access = $scope.$parent.access;
	
	$scope.alerts = [];
	
	$scope.userCookie = $localStorage.soajs_user;

	$scope.groups.listGroups = function () {
		groupsHelper.listGroups($scope.groups, groupsConfig);
	};
	
	$scope.groups.addGroup = function () {
		groupsHelper.addGroup($scope.groups, groupsConfig);
	};
	
	$scope.groups.editGroup = function (data) {
		groupsHelper.editGroup($scope.groups, groupsConfig, data);
	};
	
	$scope.groups.deleteGroups = function () {
		groupsHelper.deleteGroups($scope.groups);
	};
	
	$scope.groups.delete1Group = function (data) {
		groupsHelper.delete1Group($scope.groups, data);
	};
	
	$scope.groups.assignUsers = function (data) {
		groupsHelper.assignUsers($scope.groups, groupsConfig, data, function () {
			$scope.groups.$parent.$emit("reloadMembers", {});
		});
	};
	
	setTimeout(function () {
		if ($scope.groups.access.adminGroup.list) {
			$scope.groups.listGroups();
		}
	}, 200);
	
}]);
