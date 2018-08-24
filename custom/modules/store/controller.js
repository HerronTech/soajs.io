"use strict";
var storeApp = app.components;
storeApp.controller('storeCtrl', ['$scope', '$http', 'injectFiles', function ($scope, $http, injectFiles) {
	
	let innerPage = {
		header: "SOAJS Store",
		slogan: "Browse & Download Recipes and templates",
        image: "custom/modules/store/images/store.jpg"
	};
	
	/**
	 * method that mocks the api call to retrieve list of available store entries
	 */
	
	function sortCatalogsByType(catalogEntries) {
		let types = ['infra','cd','template','ci'];
		
		let newArray  = [];
		types.forEach((oneType) => {
			catalogEntries.forEach((oneCatalog) => {
				if(oneCatalog.type === oneType) {
					newArray.push(oneCatalog);
				}
			});
		});
		return newArray;
	}
	
	$scope.hideCatalogEntries = function(type) {
		$scope.allCatalogs.forEach((oneCtlg) => {
			if(oneCtlg.type === type){
				oneCtlg.hide = !oneCtlg.hide;
			}
		});
	};
	
	$scope.listAllCatalogs = function(){
		$http.get("custom/modules/store/list.json").success(function (response) {
			
			$scope.allCatalogs = angular.copy(response);
			
			$scope.allCatalogs = sortCatalogsByType($scope.allCatalogs);
			
			$scope.noCdCatalogs = false;
			$scope.noCiCatalogs = false;
			$scope.noTempCatalogs = false;
			$scope.noInfraCatalogs = false;
			
			$scope.catalogs = {
				ci: [],
				cd: [],
				envTemplate: [],
				infra: []
			};
			
			response.forEach((oneCtlg) => {
				oneCtlg.expanded = false;
				oneCtlg.hide = false;
				
				if (oneCtlg.type === 'ci') {
					$scope.catalogs.ci.push(oneCtlg);
				}
				if (oneCtlg.type === 'cd') {
					$scope.catalogs.cd.push(oneCtlg);
				}
				if (oneCtlg.type === 'template') {
					$scope.catalogs.envTemplate.push(oneCtlg);
				}
				if (oneCtlg.type === 'infra') {
					$scope.catalogs.infra.push(oneCtlg);
				}
			});
			
			if ($scope.catalogs.cd.length === 0) {
				$scope.noCdCatalogs = true;
			}
			if ($scope.catalogs.ci.length === 0) {
				$scope.noCiCatalogs = true;
			}
			if ($scope.catalogs.envTemplate.length === 0) {
				$scope.noTempCatalogs = true;
			}
			if ($scope.catalogs.infra.length === 0) {
				$scope.noInfraCatalogs = true;
			}
		});
	};
	
	injectFiles.injectCss("/custom/modules/store/store.css");
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);