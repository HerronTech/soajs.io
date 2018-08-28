"use strict";
var groupsService = app.components;

groupsService.service('groupsHelper', ['ngDataApi', '$timeout', '$uibModal', function (ngDataApi, $timeout, $uibModal) {
	
	function listGroups(currentScope, groupsConfig) {
		var userCookie = currentScope.$parent.userCookie;
		var tenantId = userCookie.tenant.id;
		
		if (currentScope.access.adminGroup.list) {
			var opts = {
				"method": "get",
				"routeName": "/urac/admin/group/list",
				"headers": {
					"key": apiConfiguration.key
				},
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
					printGroups(currentScope, groupsConfig, response);
				}
			});
		}
	}
	
	function printGroups(currentScope, groupsConfig, response) {
		var options = {
			grid: groupsConfig.grid,
			data: response,
			defaultSortField: 'code',
			left: [],
			top: []
		};
		if (currentScope.access.adminGroup.addUsers) {
			options.left.push({
				'label': "Link Users to Group",
				'icon': 'link',
				'handler': 'assignUsers'
			});
		}
		
		if (currentScope.access.adminGroup.edit) {
			options.left.push({
				'label': 'Edit',
				'icon': 'pencil',
				'handler': 'editGroup'
			});
		}
		if (currentScope.access.adminGroup.delete) {
			options.top.push({
				'label': "Delete",
				'msg': "Are you sure you want to delete the selected group(s)?",
				'handler': 'deleteGroups'
			});
			
			options.left.push({
				'label': 'Delete',
				'icon': 'remove',
				'msg': "Are you sure you want to delete this group?",
				'handler': 'delete1Group'
			});
		}
		
		buildGrid(currentScope, options);
	}
	
	function addGroup(currentScope, groupsConfig) {
		var userCookie = currentScope.$parent.userCookie;
		var config = angular.copy(groupsConfig.form);
		var tenantId = userCookie.tenant.id;
		var tenantCode = userCookie.tenant.code;
		
		var options = {
			timeout: $timeout,
			form: config,
			name: 'addGroup',
			label: "Add New Group",
			actions: [
				{
					'type': 'submit',
					'label': "Add Group",
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'name': formData.name,
							'code': formData.code,
							'description': formData.description,
							'tId': tenantId,
							'tCode': tenantCode
						};
						var opts = {
							"method": "post",
							"routeName": "/urac/admin/group/add",
							"headers": {
								"key": apiConfiguration.key
							},
							"data": postData
						};
						
						getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
							if (error) {
								currentScope.form.displayAlert('danger', error.message);
							}
							else {
								currentScope.$parent.alerts.push({
									'type': 'success',
									'msg': "Group Added Successfully"
								});
								currentScope.$parent.closeAllAlerts();
								currentScope.modalInstance.close();
								currentScope.form.formData = {};
								currentScope.listGroups();
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
		
	}
	
	function editGroup(currentScope, groupsConfig, data) {
		var config = angular.copy(groupsConfig.form);
		config.entries[0].type = 'readonly';
		delete data.tenant;
		var options = {
			timeout: $timeout,
			form: config,
			'name': 'editGroup',
			'label': "Edit Group",
			'data': data,
			'actions': [
				{
					'type': 'submit',
					'label': "Edit Group",
					'btn': 'primary',
					'action': function (formData) {
						var postData = {
							'name': formData.name,
							'description': formData.description
						};
						var opts = {
							"method": "post",
							"routeName": "/urac/admin/group/edit",
							"headers": {
								"key": apiConfiguration.key
							},
							"params": { "gId": data['_id'] },
							"data": postData
						};
						
						getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
							if (error) {
								currentScope.form.displayAlert('danger', error.message);
							}
							else {
								currentScope.$parent.alerts.push({
									'type': 'success',
									'msg': "Group Updated Successfully"
								});
								currentScope.$parent.closeAllAlerts();
								currentScope.modalInstance.close();
								currentScope.form.formData = {};
								currentScope.listGroups();
							}
						});
					}
				},
				{
					'type': 'reset',
					'label': "Cancel",
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
	
	function deleteGroups(currentScope) {
		var config = {
			"method": "delete",
			'routeName': "/urac/admin/group/delete",
			"headers": {
				"key": apiConfiguration.key
			},
			"params": {
				'gId': '%id%'
			},
			'msg': {
				'error': "One or more of the selected Groups(s) status was not deleted",
				'success': "Selected Groups(s) has been deleted"
			}
		};
		
		multiRecordUpdate(ngDataApi, currentScope, config, function () {
			currentScope.listGroups();
		});
	}
	
	function delete1Group(currentScope, data) {
		var userCookie = currentScope.$parent.userCookie;
		var tenantId = userCookie.tenant.id;
		var opts = {
			"method": "delete",
			"routeName": "/urac/admin/group/delete",
			"headers": {
				"key": apiConfiguration.key
			},
			"params": {
				"gId": data._id,
				'tId': tenantId
			}
		};
		
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
			if (error) {
				currentScope.$parent.alerts.push({
					'type': 'danger',
					'msg': error.message
				});
			}
			else {
				currentScope.$parent.alerts.push({
					'type': 'success',
					'msg': "Selected group has been removed"
				});
				currentScope.listGroups();
			}
			closeAllAlerts(currentScope.$parent, $timeout);
		});
	}
	
	function assignUsers(currentScope, groupsConfig, data, callback) {
		var userCookie = currentScope.$parent.userCookie;
		var tenantId = userCookie.tenant.id;
		
		var opts = {
			"method": "get",
			"routeName": "/urac/admin/listUsers",
			"headers": {
				"key": apiConfiguration.key
			},
			"params": {
				'tId': tenantId
			}
		};
		
		getSendDataFromServer(currentScope, ngDataApi, opts, function (error, response) {
			if (error) {
				currentScope.$parent.alerts.push({
					'type': 'danger',
					'msg': error.message
				});
				closeAllAlerts(currentScope.$parent, $timeout);
			}
			else {
				var value = [];
				var sel = false;
				for (var x = 0; x < response.length; x++) {
					sel = ((response[x].groups) && response[x].groups.indexOf(data.code) > -1);
					value.push({
						'v': response[x].username,
						'l': response[x].username + '(' + response[x].firstName + ' ' + response[x].lastName + ')',
						'selected': sel
					});
				}
				
				var config = angular.copy(groupsConfig.users);
				config.entries[0].value = value;
				
				var options = {
					timeout: $timeout,
					form: config,
					name: 'addGroup',
					label: 'Add Users to' + ': ' + data.name,
					'msgs': {},
					actions: [
						{
							'type': 'submit',
							'label': "Add Users",
							'btn': 'primary',
							'action': function (formData) {
								var postData = {
									'groupCode': data.code,
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
								
								getSendDataFromServer(currentScope, ngDataApi, opts, function (error) {
									if (error) {
										currentScope.form.displayAlert('danger', error.message);
									}
									else {
										currentScope.$parent.alerts.push({
											'type': 'success',
											'msg': "Users added to groups."
										});
										currentScope.$parent.closeAllAlerts();
										currentScope.modalInstance.close();
										currentScope.form.formData = {};
										currentScope.listGroups();
										callback();
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
			}
		});
	}
	
	return {
		'listGroups': listGroups,
		'printGroups': printGroups,
		'addGroup': addGroup,
		'editGroup': editGroup,
		'deleteGroups': deleteGroups,
		'delete1Group': delete1Group,
		'assignUsers': assignUsers
	}
}]);