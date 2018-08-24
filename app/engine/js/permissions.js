"use strict";

/**
 * This function builds the access permissions of a module from permissionsObj
 */
function constructModulePermissions(scope, localStorage, access, permissionsObj, forceEnv) {
	function checkApiHasAccess(aclObject, serviceName, routePath, method, userGroups, callback) {
		var environments = Object.keys(aclObject);
		return validateAccess(environments, 0, callback);
		
		function validateAccess(environments, i, cb) {
			var envCode = environments[i].toLowerCase();
			
			if (!aclObject[envCode] || !aclObject[envCode][serviceName]) {
				i++;
				if (i === environments.length) {
					return cb(false);
				}
				else {
					validateAccess(environments, i, cb);
				}
			}
			else {
				var system = aclObject[envCode][serviceName];
				if (system) {
					var access = checkSystem(system);
					return cb(access);
				}
				else {
					return cb(false);
				}
			}
		}
		
		function checkSystem(system) {
			function getAclObj(aclObj) {
				if (aclObj && (aclObj.apis || aclObj.apisRegExp)) {
					return aclObj;
				}
				if (method) {
					if (aclObj[method] && typeof aclObj[method] === "object") {
						var newAclObj = {};
						if (aclObj.hasOwnProperty('access')) {
							newAclObj.access = aclObj.access;
						}
						if (aclObj[method].hasOwnProperty('apis')) {
							newAclObj.apis = aclObj[method].apis;
						}
						if (aclObj[method].hasOwnProperty('apisRegExp')) {
							newAclObj.apisRegExp = aclObj[method].apisRegExp;
						}
						if (aclObj[method].hasOwnProperty('apisPermission')) {
							newAclObj.apisPermission = aclObj[method].apisPermission;
						}
						else if (aclObj.hasOwnProperty('apisPermission')) {
							newAclObj.apisPermission = aclObj.apisPermission;
						}
						return newAclObj;
					}
					else {
						return aclObj;
					}
				}
				else {
					return aclObj;
				}
			}
			
			system = getAclObj(system);
			
			var api = (system && system.apis ? system.apis[routePath] : null);
			
			if (!api && system && system.apisRegExp && Object.keys(system.apisRegExp).length) {
				for (var jj = 0; jj < system.apisRegExp.length; jj++) {
					if (system.apisRegExp[jj].regExp && routePath.match(system.apisRegExp[jj].regExp)) {
						api = system.apisRegExp[jj];
						break;
					}
				}
			}
			if (Object.hasOwnProperty.call(system, 'access')) {
				if (Array.isArray(system.access)) {
					var checkAPI = false;
					if (userGroups) {
						for (var ii = 0; ii < userGroups.length; ii++) {
							if (system.access.indexOf(userGroups[ii]) !== -1) {
								checkAPI = true;
								break;
							}
						}
					}
					if (!checkAPI) {
						return false;
					}
				}
				return api_checkPermission(system, userGroups, api);
			}
			
			if (api || (system && system.apisPermission === 'restricted')) {
				return api_checkPermission(system, userGroups, api);
			}
			else {
				return true;
			}
		}
		
		function api_checkPermission(system, userGroups, api) {
			if ('restricted' === system.apisPermission) {
				if (!api) {
					return false;
				}
				return api_checkAccess(api.access, userGroups);
			}
			if (!api) {
				return true;
			}
			
			return api_checkAccess(api.access, userGroups);
		}
		
		function api_checkAccess(apiAccess, userGroups) {
			if (!apiAccess) {
				return true;
			}
			
			if (apiAccess instanceof Array) {
				if (!userGroups) {
					return false;
				}
				
				var found = false;
				for (var ii = 0; ii < userGroups.length; ii++) {
					if (apiAccess.indexOf(userGroups[ii]) !== -1) {
						found = true;
						break;
					}
				}
				return found;
			}
			else {
				return true;
			}
		}
	}
	
	function buildPermittedOperationEnv(serviceName, routePath, method, env, cb) {
		var user = localStorage.soajs_user;
		if (user) {
			var userGroups = user.groups;
			var acl = {};
			if (localStorage.acl_access) {
				acl[env.toLowerCase()] = localStorage.acl_access[env.toLowerCase()];
				
				checkApiHasAccess(acl, serviceName, routePath, method, userGroups, function (access) {
					return cb(access);
				});
			} else {
				return cb(false);
			}
		}
		else {
			return cb(false);
		}
	}
	
	for (var permission in permissionsObj) {
		if (Array.isArray(permissionsObj[permission])) {
			var env = 'dashboard';
			if (forceEnv) {
				env = forceEnv;
			}
			
			env = env.toLowerCase();
			buildPermittedOperationEnv(permissionsObj[permission][0], permissionsObj[permission][1], permissionsObj[permission][2], env, function (hasAccess) {
				access[permission] = hasAccess;
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
		else if (typeof(permissionsObj[permission]) === 'object') {
			access[permission] = {};
			constructModulePermissions(scope, localStorage, access[permission], permissionsObj[permission], forceEnv);
		}
	}
}