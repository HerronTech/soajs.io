"use strict";
var projectApp = app.components;

projectApp.controller('listProjects', ['$scope', '$cookies', '$http', '$timeout', '$uibModal', 'isUserLoggedIn', 'ngDataApi', '$localStorage', 'injectFiles',
	function ($scope, $cookies, $http, $timeout, $uibModal, isUserLoggedIn, ngDataApi, $localStorage, injectFiles) {

		let innerPage = {
			header: "Member Area",
			slogan: "Login & Register",
			image: "custom/modules/member/images/member.jpg"
		};

		$scope.updateParentScope('innerPage', innerPage);

		$scope.$on("$destroy", function () {
			$scope.removeFromParentScope('innerPage');
		});

		$scope.projects = {};
		$scope.projects.active = [];
		$scope.projects.pending = [];
		if (!isUserLoggedIn($scope)) {
			// $scope.$parent.$emit("loadUserInterface", {});
			// $scope.$parent.go("/members/login");
		}

		$scope.access = {
			members: {}
		};
		constructModulePermissions($scope, $localStorage, $scope.access.members, membersConfig.permissions);

		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 20000);
		};

		$scope.checkPending = function () {
			let reqOptions = {
				"method": "get",
				"routeName": "/bridge/checkPendingProjects",
				"params": {}
			};
			getSendDataFromServer($scope, ngDataApi, reqOptions, function (error, data) {
				overlayLoading.hide();
				$timeout(function () {
					$scope.getList();
				}, 2000);
			});
		};

		$scope.openProject = function (project) {
			overlayLoading.show();
			$cookies.put('soajs_project', project.name, { 'domain': interfaceDomain });
			$cookies.remove('soajs_dashboard_key', { 'domain': interfaceDomain });
			$cookies.remove("soajs_dashboard_login", { 'domain': interfaceDomain });
			var path = cloudUri + '#/dashboard';
			$timeout(function () {
				overlayLoading.hide();
				window.open(path, '_blank');
			}, 500);
		};

		$scope.editProject = function (project) {
			overlayLoading.show();
			$cookies.put('soajs_project', project.name, { 'domain': interfaceDomain });
			$cookies.remove('soajs_dashboard_key', { 'domain': interfaceDomain });
			$cookies.remove("soajs_dashboard_login", { 'domain': interfaceDomain });
			var path = cloudUri + '#/project/settings';
			$timeout(function () {
				overlayLoading.hide();
				window.open(path, '_blank');
			}, 500);
		};

		$scope.deleteProject = function (project, pending) {
			var formConf = {
				'name': '',
				'label': '',
				'entries': [
					{
						type: 'html',
						value: 'By clicking <b>"Confirm Delete"</b> you will be permanently deleting this project.</br>',
					}
				]
			};

			var modalOptions = {
				form: formConf,
				'timeout': $timeout,
				'name': 'confirm',
				'label': "Confirm Project Delete",
				'msgs': {
					"footer": "This move is irreversible! Are you sure you want to proceed?"
				},
				'actions': [
					{
						'type': 'submit',
						'label': 'Confirm Delete',
						'btn': 'primary',
						'action': function (formData) {
							overlayLoading.show();

							let reqOptions = {
								"method": "delete",
								"routeName": "/projects/project",
								"params": {
									"pending": (project.status === 'pending'),
									"soajs_project": project.name,
									"removeResource": false
								}
							};
							getSendDataFromServer($scope, ngDataApi, reqOptions, function (error, data) {
								overlayLoading.hide();
								if (error) {
									$scope.form.displayAlert('danger', error.message);
								}
								else {
									$scope.modalInstance.close();
									$scope.form.formData = {};
									$scope.alerts.push({
										'type': 'success',
										'msg': "Project was deleted successfully."
									});
									$scope.closeAllAlerts();
									$scope.getList();
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

			if (pending) {
				overlayLoading.show();

				let reqOptions = {
					"method": "delete",
					"routeName": "/projects/project",
					"params": {
						"pending": (project.status === 'pending'),
						"soajs_project": project.name
					}
				};
				getSendDataFromServer($scope, ngDataApi, reqOptions, function (error, data) {
					overlayLoading.hide();
					if (error) {
						$scope.alerts.push({
							'type': 'danger',
							'msg': error.message
						});
						$scope.closeAllAlerts();
					}
					else {
						$scope.alerts.push({
							'type': 'success',
							'msg': "Project was deleted successfully."
						});
						$scope.closeAllAlerts();
						$scope.getList();
					}
				});
			}
			else {
				buildFormWithModal($scope, $uibModal, modalOptions);
			}

		};

		$scope.manageUsers = function (project) {
			$scope.userCookie = $localStorage.soajs_user;
			var groupsConfig = {
				users: {
					'name': '',
					'label': '',
					'msgs': {},
					'actions': {},
					'entries': [
						{
							'name': 'users',
							'label': 'Users',
							'type': 'checkbox',
							'placeholder': '',
							'value': [],
							'tooltip': 'Assign Users',
							'required': true
						}
					]
				}
			};

			var userCookie = $scope.userCookie;
			var tenantId = userCookie.tenant.id;
			var opts = {
				"method": "get",
				"headers": {
					"key": apiConfiguration.key
				},
				"routeName": "/urac/admin/listUsers",
				"params": {
					'tId': tenantId
				}
			};

			getSendDataFromServer($scope, ngDataApi, opts, function (error, response) {
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
					$scope.closeAllAlerts();
				}
				else {
					var value = [];
					var sel = false;
					for (var x = 0; x < response.length; x++) {
						sel = ((response[x].groups) && response[x].groups.indexOf(project.name) > -1);
						value.push({
							'v': response[x].username,
							'l': response[x].firstName + ' ' + response[x].lastName + ' (' + response[x].username + ')',
							'selected': sel
						});
					}

					var config = angular.copy(groupsConfig.users);
					config.entries[0].value = value;

					var options = {
						timeout: $timeout,
						form: config,
						name: 'addGroup',
						label: 'Add Users to project' + ': ' + project.name,
						'msgs': {},
						actions: [
							{
								'type': 'submit',
								'label': 'Assign Users',
								'btn': 'primary',
								'action': function (formData) {
									var postData = {
										'groupCode': project.name,
										'users': formData.users
									};
									var opts = {
										"method": "post",
										"routeName": "/urac/admin/group/addUsers",
										"params": {
											'tId': tenantId
										},
										"headers": {
											"key": apiConfiguration.key
										},
										"data": postData
									};

									getSendDataFromServer($scope, ngDataApi, opts, function (error) {
										if (error) {
											$scope.alerts.push({
												'type': 'danger',
												'msg': error.message
											});
											$scope.closeAllAlerts();
										}
										else {
											$scope.alerts.push({
												'type': 'success',
												'msg': "Users added to project."
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
				}
			});
		};

		$scope.getList = function () {
			$scope.projects.active = [];
			$scope.projects.pending = [];
			overlayLoading.show();
			getSendDataFromServer($scope, ngDataApi, {
				"method": "get",
				"routeName": "/projects/projects/list",
				"params": {}
			}, function (error, data) {
				overlayLoading.hide();
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
					$scope.closeAllAlerts();
				}
				else {
					let projectCount = 0;
					data.forEach(function (project) {
						project.collpased = projectCount > 0;
						projectCount++;

						if (project.status === 'pending') {
							$scope.projects.pending.push(project);
							return;
						}
						$scope.projects.active.push(project);

						project.mainResource = {};
						project.resources.forEach(function (resource) {
							if (resource.main) {
								project.mainResource = resource;
								let options = {
									"method": "send",
									"routeName": "/bridge/executeDriver",
									"params": {
										soajs_project: project.name
									},
									"data": {
										type: "resources",
										driver: 'atlas',
										command: "getCluster",
										project: project.name,
										options: {
											clusterName: project.resources[0].api.clusterName
										}
									}
								};
								getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
									if (error) {
										console.log(error);
									} else {
										project.mainResource.providerSettings = response.providerSettings;
									}
								});
							}
						});

						let i = 0;
						if (project.infra) {
							for (let oneInfra in project.infra) {
								if (!project.infra[oneInfra].deployment || project.infra[oneInfra].deployment.length === 0) {
									delete project.infra[oneInfra];
								}
								else {
									project.infra[oneInfra].hide = (i > 0);
									i++;
								}
							}
							project.infras = Object.keys(project.infra);
						}
					});
				}
			});
		};

		$scope.getList();

		// injectFiles.injectCss("sections/saas/projects.css");
	}]);

projectApp.controller('addProject', ['$scope', function ($scope) {

	let innerPage = {
		header: "Member Area",
		slogan: "Login & Register",
		image: "custom/modules/member/images/member.jpg"
	};

	$scope.updateParentScope('innerPage', innerPage);

	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);