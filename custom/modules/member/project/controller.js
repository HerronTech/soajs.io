"use strict";
var projectApp = app.components;

projectApp.controller('listProjects', ['$scope', '$cookies', '$timeout', '$location', '$uibModal', 'isUserLoggedIn', 'ngDataApi', '$localStorage', 'injectFiles',
	function ($scope, $cookies, $timeout, $location, $uibModal, isUserLoggedIn, ngDataApi, $localStorage, injectFiles) {

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
			$location.path('/member/login');
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
			}, 30000);
		};

		$scope.checkPending = function () {
			let reqOptions = {
				"method": "get",
				"routeName": "/bridge/checkPendingProjects",
				"params": {}
			};
			invokeApi($scope, ngDataApi, reqOptions, function (error, data) {
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
							invokeApi($scope, ngDataApi, reqOptions, function (error, data) {
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
									closeAllAlerts($scope, $timeout);
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
				invokeApi($scope, ngDataApi, reqOptions, function (error, data) {
					overlayLoading.hide();
					if (error) {
						$scope.alerts.push({
							'type': 'danger',
							'msg': error.message
						});
						closeAllAlerts($scope, $timeout);
					}
					else {
						$scope.alerts.push({
							'type': 'success',
							'msg': "Project was deleted successfully."
						});
						closeAllAlerts($scope, $timeout);
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

			invokeApi($scope, ngDataApi, opts, function (error, response) {
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
					closeAllAlerts($scope, $timeout);
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
						label: 'Add Users to project: ' + project.name,
						msgs: {},
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

									invokeApi($scope, ngDataApi, opts, function (error) {
										if (error) {
											$scope.form.displayAlert('danger', error.message);
										}
										else {
											$scope.alerts.push({
												'type': 'success',
												'msg': "Users added to project."
											});
											closeAllAlerts($scope, $timeout);
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
			invokeApi($scope, ngDataApi, {
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
					closeAllAlerts($scope, $timeout);
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
								invokeApi($scope, ngDataApi, options, function (error, response) {
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

		// injectFiles.injectCss("custom/modules/member/projects.css");
	}]);

projectApp.controller('addProject', ['$scope', '$location', '$timeout', 'isUserLoggedIn', 'ngDataApi', 'injectFiles',
	function ($scope, $location, $timeout, isUserLoggedIn, ngDataApi, injectFiles) {
		
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
			slogan: "Login & Register",
			image: "custom/modules/member/images/member.jpg"
		};

		$scope.updateParentScope('innerPage', innerPage);

		$scope.$on("$destroy", function () {
			$scope.removeFromParentScope('innerPage');
		});

		if (!isUserLoggedIn($scope)) {
			// $scope.$parent.$emit("loadUserInterface", {});
			$location.path('/member/login')
		}

		$scope.hiddenTableBody = true;

		$scope.clusterSettings = {
			"SOA-l7": {
				"storageCapacity": "80 GB",
				"connectivity": "2000",
				"ram": "8 GB",
				"storageIOPs": "240"
			},
			"MC-l7": {
				"storageCapacity": "80 GB",
				"connectivity": "4000",
				"ram": "16 GB",
				"storageIOPs": "240"
			}
		};

		$scope.step = {
			"1": true,
			"2": false,
			"3": false,
			"4": false
		};

		$scope.data = {
			infraAws: false,
			infraGoogle: false,
			newCluster: false,
			existingCluster: true
		};

		$scope.project = {
			ht_package: "SOA-l7",
			name: "",
			description: "",
			infra: {},
			IPentries: [],
			resource: {
				deployCluster: false,
				driver: 'atlas',
				projectName: '',
				clusterName: '',
				api: {
					orgId: '',
					username: '',
					token: ''
				},
				credentials: {
					username: '',
					password: ''
				}
			}
		};

		$scope.alerts = [];
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.closeAllAlerts = function () {
			$timeout(function () {
				$scope.alerts = [];
			}, 20000);
		};

		$scope.goToStep = function (number, form) {
			if (form) {
				if (!form.$valid) {
					form.$submitted = true;
					return;
				}
			}
			$scope.step = {
				"1": false,
				"2": false,
				"3": false,
				"4": false
			};
			$scope.step[number] = true;
		};

		$scope.setInfra = function (infra) {
			$scope.data.infra = infra;
			if (infra === 'aws') {
				$scope.data.infraAws = true;
				$scope.data.infraGoogle = false;
				delete $scope.project.infra.google;
				if (!$scope.project.infra.aws) {
					$scope.project.infra.aws = {
						api: {
							"keyId": ""
						}
					};
				}
			}
			if (infra === 'google') {
				$scope.data.infraGoogle = true;
				$scope.data.infraAws = false;
				if (!$scope.project.infra.google) {
					$scope.project.infra.google = {
						api: {
							"project": "",
							"token": ""
						}
					};
				}
				delete $scope.project.infra.aws;
			}
		};

		$scope.skipInfra = function () {
			$scope.alerts = [];
			$scope.goToStep('3');
		};

		$scope.validateInfra = function () {
			$scope.alerts = [];
			var myToken;
			if ($scope.project.infra.google && $scope.project.infra.google.api) {
				if ($scope.project.infra.google.api.token) {
					try {
						myToken = JSON.parse($scope.project.infra.google.api.token);
						$scope.goToStep('3');
					}
					catch (e) {
						$scope.alerts.push({
							'type': 'danger',
							'msg': e.message
						});
					}
				}
			}
			else {
				$scope.goToStep('3');
			}
		};

		$scope.submitProject = function (form) {
			$scope.alerts = [];
			let successMsg = "Your project was created. It might take up to 10 minutes to be available in your active projects";
			form.$submitted = true;
			if (!form.$valid) {
				return;
			}
			$scope.alerts = [];
			var postedProject = angular.copy($scope.project);
			if ($scope.project.infra.google && $scope.project.infra.google.api) {
				if ($scope.project.infra.google.api.token) {
					if (typeof ($scope.project.infra.google.api.token) === 'string') {
						try {
							postedProject.infra.google.api.token = JSON.parse($scope.project.infra.google.api.token);
						}
						catch (e) {
							$scope.alerts.push({
								'type': 'danger',
								'msg': e.message
							});
						}
					}
				}
			}

			overlayLoading.show();
			invokeApi($scope, ngDataApi, {
				"method": "post",
				"routeName": "/projects/project",
				"data": {
					data: postedProject
				},
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
					$scope.alerts.push({
						'type': 'success',
						'msg': successMsg
					});
					$scope.goToStep('4');
					$timeout(function () {
						$scope.$parent.go("/members/projects");
					}, 6000);
				}
			});
		};

		$scope.setCluster = function (isNew) {
			if (isNew) {
				$scope.data.newCluster = true;
				$scope.data.existingCluster = false;
				$scope.project.resource.clusterConfig = {};
				// $scope.project.resource.deployCluster = true;
			} else {
				$scope.data.newCluster = false;
				$scope.data.existingCluster = true;
				// $scope.project.resource.deployCluster = false;
			}
		};

	}]);