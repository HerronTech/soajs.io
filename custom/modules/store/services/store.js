"use strict";
var storeAppSrv = app.components;

storeAppSrv.service('storePageSrv', ['$http', '$location', '$cookies', '$uibModal', 'ngDataApi', function ($http, $location, $cookies, $uibModal, ngDataApi) {
	
	function openSaveAsDialog(filename, content, mediaType) {
		let blob = new Blob([content], { type: mediaType });
		let URL = window.URL || window.webkitURL;
		let objectUrl = URL.createObjectURL(blob);
		
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = objectUrl;
		a.download = filename;
		a.click();
	}
	
	function download(currentScope, entry) {
		let id = entry._id;
		if (!currentScope.isUserLoggedIn) {
			$uibModal.open({
				templateUrl: "loginPage.tmpl",
				animate: true,
				controller: function ($scope, $uibModalInstance) {
					$scope.go = function (path) {
						if (path) {
							$cookies.put("store_path", "/store", { 'domain': interfaceDomain });
							$location.path(path);
							$uibModalInstance.close();
						}
					};
					$scope.cancel = function () {
						$uibModalInstance.close();
					}
				}
			});
		}
		else {
			let options = {
				"method": "get",
				"routeName": "/store/download",
				"params": {
					"id": id
				},
				"responseType": 'arraybuffer',
			};
			currentScope.store.alert = {};
			overlayLoading.show();
			invokeApi(currentScope, ngDataApi, options, function (error, response) {
				overlayLoading.hide();
				if (error) {
					currentScope.store.alert = { 'type': 'danger', 'msg': error.message };
				} else {
					let zipFileName = entry.name;
					zipFileName = zipFileName.replace(/[^A-Z0-9]+/ig, "-");
					openSaveAsDialog("store_" + zipFileName + "-" + new Date().toISOString() + ".zip", response, "application/zip")
				}
			});
		}
	}
	
	function listAllCatalogs(currentScope) {
		let options = {
			"method": "get",
			"routeName": "/store/list",
			"params": {}
		};

		currentScope.store.alert = {};
		overlayLoading.show();
		invokeApi(currentScope, ngDataApi, options, function (error, response) {
			overlayLoading.hide();
			if (error) {
				currentScope.store.alert = { 'type': 'danger', 'msg': error.message };
			} else {
				renderCatalogEntries(currentScope, response)
			}
		});
	}
	
	function renderCatalogEntries(currentScope, response) {
		currentScope.allCatalogs = angular.copy(response);
		
		currentScope.allCatalogs = sortCatalogsByType(currentScope.allCatalogs);
		
		currentScope.noCdCatalogs = false;
		currentScope.noCiCatalogs = false;
		currentScope.noTempCatalogs = false;
		currentScope.noInfraCatalogs = false;
		
		currentScope.catalogs = {
			ci: [],
			cd: [],
			envTemplate: [],
			infra: []
		};
		
		currentScope.allCatalogs.forEach((oneCtlg) => {
			oneCtlg.expanded = false;
			oneCtlg.hide = false;
			
			if (oneCtlg.type === 'ci') {
				oneCtlg.smallIcon = "demo-icon icon-loop";
				currentScope.catalogs.ci.push(oneCtlg);
			}
			if (oneCtlg.type === 'cd') {
				oneCtlg.smallIcon = "demo-icon icon-file-code";
				currentScope.catalogs.cd.push(oneCtlg);
			}
			if (oneCtlg.type === 'template') {
				oneCtlg.smallIcon = "glyphicon glyphicon-globe";
				currentScope.catalogs.envTemplate.push(oneCtlg);
			}
			if (oneCtlg.type === 'infra') {
				oneCtlg.smallIcon = "demo-icon icon-layers";
				currentScope.catalogs.infra.push(oneCtlg);
			}
		});
		
		if (currentScope.catalogs.cd.length === 0) {
			currentScope.noCdCatalogs = true;
		}
		if (currentScope.catalogs.ci.length === 0) {
			currentScope.noCiCatalogs = true;
		}
		if (currentScope.catalogs.envTemplate.length === 0) {
			currentScope.noTempCatalogs = true;
		}
		if (currentScope.catalogs.infra.length === 0) {
			currentScope.noInfraCatalogs = true;
		}
	}
	
	function sortCatalogsByType(catalogEntries) {
		let types = ['infra', 'cd', 'template', 'ci'];
		
		let newArray = [];
		types.forEach((oneType) => {
			catalogEntries.forEach((oneCatalog) => {
				if (oneCatalog.type === oneType) {
					newArray.push(oneCatalog);
				}
			});
		});
		return newArray;
	}
	
	return {
		"download": download,
		"listAllCatalogs": listAllCatalogs
	}
}]);