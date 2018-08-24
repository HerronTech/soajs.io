"use strict";
var storeAppSrv = app.components;

storeAppSrv.service('storePageSrv', ['$http', '$location', '$cookies', function ($http, $location, $cookies) {
	
	$scope.download = function (id) {
		
		if(!$scope.isUserLoggedIn){
			$modal.open({
				templateUrl: "loginPage.tmpl",
				size: 'lg',
				backdrop: true,
				keyboard: true,
				controller: function ($scope, $modalInstance) {
					$scope.go = function (path) {
						if (path) {
							$cookies.put("store_path", "/store", {'domain': interfaceDomain});
							$location.path(path);
							$modalInstance.close();
						}
					};
					$scope.cancel = function () {
						$modalInstance.close();
					}
				}
			});
		}
		else{
			let options = {
				"method": "get",
				"routeName": "/store/download",
				"params": {
					"id": id
				},
				"responseType": 'arraybuffer',
			};
			$scope.alerts = [];
			overlayLoading.show();
			getSendDataFromServer($scope, ngDataApi, options, function (error, response) {
				overlayLoading.hide();
				if (error) {
					$scope.alerts.push({
						'type': 'danger',
						'msg': error.message
					});
				} else {
					openSaveAsDialog("store_" + new Date().toISOString() + ".zip", response, "application/zip")
				}
			});
		}
	};
	
	return {
		"getIcons": getIcons,
		"contactSalesForm": contactSalesForm,
		"demoForm": demoForm,
		"subscribe": subscribe
	}
}]);