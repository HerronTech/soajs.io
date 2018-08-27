"use strict";
var membersService = app.components;

membersService.service('membersHelper', ['ngDataApi', '$timeout', '$uibModal', function (ngDataApi, $timeout, $uibModal) {
	
	function listMembers(currentScope, moduleConfig) {
		var userCookie = currentScope.$parent.userCookie;
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
		overlayLoading.show();
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error, response) {
			overlayLoading.hide();
			if (error) {
				currentScope.$parent.alerts.push({
					'type': 'danger',
					'msg': error.message
				});
				closeAllAlerts(currentScope.$parent, $timeout);
			}
			else {
				printMembers(currentScope, moduleConfig, response);
			}
		});
	}
	
	function printMembers(currentScope, moduleConfig, response) {
		// for (var x = 0; x < response.length; x++) {
		// 	let groups = [];
		// 	let projects = [];
		// 	response[x].grpsArr = '';
		// 	for (var j = 0; j < response[x].groups.length; j++) {
		// 		if (currentScope.projects.names.indexOf(response[x].groups[j]) !== -1) {
		// 			projects.push(response[x].groups[j]);
		// 		} else {
		// 			groups.push(response[x].groups[j]);
		// 		}
		// 	}
		//
		// 	if (projects) {
		// 		response[x].projectsArr = projects.join(', ');
		// 	}
		// 	if (groups) {
		// 		response[x].grpsArr = groups.join(', ');
		// 	}
		// }
		//
		var options = {
			grid: moduleConfig.grid,
			data: response,
			defaultSortField: 'username',
			left: [],
			top: []
		};
		
		if (currentScope.access.adminUser.editUser) {
			options.left.push({
				'label': 'Edit',
				'icon': 'pencil',
				'handler': 'editMember'
			});
		}
		if (currentScope.access.adminUser.changeStatusAccess) {
			options.top = [
				{
					'label': 'Activate',
					'msg': 'Are you sure you want to activate the selected member(s)?',
					'handler': 'activateMembers'
				},
				{
					'label': 'Deactivate',
					'msg': 'Are you sure you want to deactivate the selected member(s)?',
					'handler': 'deactivateMembers'
				}
			];
		}
		buildGrid(currentScope, options);
	}
	
	function addMember(currentScope, moduleConfig) {
		var userCookie = currentScope.$parent.userCookie;
		var config = angular.copy(moduleConfig.form);
		var tenantId = userCookie.tenant.id;
		var tenantCode = userCookie.tenant.code;
		overlayLoading.show();
		var opts = {
			"method": "get",
			"headers": {
				"key": apiConfiguration.key
			},
			"routeName": "/urac/admin/group/list",
			"params": {
				'tId': tenantId
			}
		};
		
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error, response) {
			overlayLoading.hide();
			if (!error) {
				var grps = [], projects = [];
				for (var x = 0; x < response.length; x++) {
					let obj = {
						'v': response[x].code,
						'l': response[x].name,
						'selected': false
					};
					if (currentScope.projects.names.indexOf(response[x].code) !== -1) {
						projects.push(obj);
						obj.l = response[x].code;
					} else {
						grps.push(obj);
					}
				}
				config.entries.push({
					'name': 'groups',
					'label': 'Groups',
					'type': 'checkbox',
					'value': grps
				});
				if (projects && projects.length) {
					config.entries.push({
						'name': 'projects',
						'label': 'Projects',
						'type': 'checkbox',
						'value': projects
					});
				}
			}
			var options = {
				timeout: $timeout,
				form: config,
				name: 'addMember',
				label: 'Add New Member',
				actions: [
					{
						'type': 'submit',
						'label': 'Add Member',
						'btn': 'primary',
						'action': function (formData) {
							let groups = formData.groups;
							if (formData.projects && formData.projects.length) {
								groups = groups.concat(formData.projects);
							}
							var postData = {
								'username': formData.username,
								'firstName': formData.firstName,
								'lastName': formData.lastName,
								'email': formData.email,
								'groups': groups,
								'tId': tenantId,
								'tCode': tenantCode
							};
							overlayLoading.show();
							var opts = {
								"method": "post",
								"headers": {
									"key": apiConfiguration.key
								},
								"routeName": "/urac/admin/addUser",
								"data": postData
							};
							
							getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
								overlayLoading.hide();
								if (error) {
									currentScope.form.displayAlert('danger', error.message);
								}
								else {
									currentScope.$parent.alerts.push({
										'type': 'success',
										'msg': 'Member Added Successfully'
									});
									currentScope.$parent.closeAllAlerts();
									closeAllAlerts(currentScope.$parent, $timeout);
									currentScope.modalInstance.close();
									currentScope.form.formData = {};
									currentScope.listMembers();
								}
							});
						}
					},
					{
						'type': 'reset',
						'label': 'Cancel',
						'btn': 'danger',
						'action': function () {
							currentScope.modalInstance.dismiss('cancel');
							currentScope.form.formData = {};
						}
					}
				]
			};
			buildFormWithModal(currentScope, $uibModal, options);
		});
		
	}
	
	function editMember(currentScope, moduleConfig, data) {
		var userCookie = currentScope.$parent.userCookie;
		var config = angular.copy(moduleConfig.form);
		var tenantId = userCookie.tenant.id;
		var opts = {
			"method": "get",
			"headers": {
				"key": apiConfiguration.key
			},
			"routeName": "/urac/admin/group/list",
			"params": {
				'tId': tenantId
			}
		};
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error, response) {
			if (error) {
				currentScope.alerts.push({
					'type': 'danger',
					'msg': error.message
				});
				closeAllAlerts(currentScope, $timeout);
			}
			else {
				var grps = [];
				var projects = [];
				var datagroups = [];
				if (data.groups) {
					datagroups = data.groups;
				}
				var sel = false;
				for (var x = 0; x < response.length; x++) {
					sel = datagroups.indexOf(response[x].code) > -1;
					let obj = {
						'v': response[x].code,
						'l': response[x].name,
						'selected': sel
					};
					if (currentScope.projects.names.indexOf(response[x].code) !== -1) {
						projects.push(obj);
						obj.l = response[x].code;
					} else {
						grps.push(obj);
					}
				}
				config.entries.push({
					'name': 'groups',
					'label': 'Groups',
					'type': 'checkbox',
					'value': grps,
					'tooltip': 'Assign Groups'
				});
				if (projects && projects.length) {
					config.entries.push({
						'name': 'projects',
						'label': 'Projects',
						'type': 'checkbox',
						'value': projects
					});
				}
				config.entries.push({
					'name': 'status',
					'label': 'Status',
					'type': 'radio',
					'value': [
						{ 'v': 'pendingNew' }, { 'v': 'active' }, { 'v': 'inactive' }
					]
				});
				
				var options = {
					timeout: $timeout,
					form: config,
					'name': 'editMember',
					'label': 'Edit Member',
					'data': data,
					'actions': [
						{
							'type': 'submit',
							'label': 'Edit Member',
							'btn': 'primary',
							'action': function (formData) {
								let groups = formData.groups;
								if (formData.projects && formData.projects.length) {
									groups = groups.concat(formData.projects);
								}
								var postData = {
									'username': formData.username,
									'firstName': formData.firstName,
									'lastName': formData.lastName,
									'email': formData.email,
									'groups': groups,
									'tId': tenantId,
									'status': (Array.isArray(formData.status)) ? formData.status.join(",") : formData.status
								};
								var opts = {
									"method": "post",
									"headers": {
										"key": apiConfiguration.key
									},
									"routeName": "/urac/admin/editUser",
									"params": { "uId": data['_id'] },
									"data": postData
								};
								
								getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
									if (error) {
										currentScope.form.displayAlert('danger', error.message);
									}
									else {
										currentScope.$parent.alerts.push({
											'type': 'success',
											'msg': 'Member Updated Successfully'
										});
										closeAllAlerts(currentScope.$parent, $timeout);
										currentScope.modalInstance.close();
										currentScope.form.formData = {};
										currentScope.listMembers();
									}
								});
							}
						},
						{
							'type': 'reset',
							'label': translation.cancel[LANG],
							'btn': 'danger',
							'action': function () {
								currentScope.modalInstance.dismiss('cancel');
								currentScope.form.formData = {};
							}
						}
					]
				};
				buildFormWithModal(currentScope, $uibModal, options);
			}
		});
	}
	
	function activateMembers(currentScope) {
		overlayLoading.show();
		var config = {
			"headers": {
				"key": apiConfiguration.key
			},
			'method': 'get',
			'routeName': "/urac/admin/changeUserStatus",
			"params": {
				'uId': '%id%', 'status': 'active'
			},
			'msg': {
				'error': 'One or more of the selected Member(s) status was not updated',
				'success': 'Selected Member(s) has been activated'
			}
		};
		
		multiRecordUpdate(ngDataApi, currentScope, config, function () {
			overlayLoading.hide();
			currentScope.listMembers();
		});
	}
	
	function deactivateMembers(currentScope) {
		overlayLoading.show();
		var config = {
			"headers": {
				"key": apiConfiguration.key
			},
			'method': 'get',
			'routeName': "/urac/admin/changeUserStatus",
			"params": { 'uId': '%id%', 'status': 'inactive' },
			'msg': {
				'error': 'One or more of the selected Member(s) status was not updated',
				'success': 'Selected Member(s) has been deactivated'
			}
		};
		
		multiRecordUpdate(ngDataApi, currentScope, config, function () {
			overlayLoading.hide();
			currentScope.listMembers();
		});
	}
	
	return {
		'listMembers': listMembers,
		'printMembers': printMembers,
		'addMember': addMember,
		'editMember': editMember,
		'activateMembers': activateMembers,
		'deactivateMembers': deactivateMembers
	};
}]);