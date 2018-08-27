"use strict";
var storeApp = app.components;
storeApp.controller('storeCtrl', ['$scope', '$http', '$cookies', 'injectFiles', 'storePageSrv', function ($scope, $http, $cookies, injectFiles, storePageSrv) {
	
	let innerPage = {
		header: "SOAJS Store",
		slogan: "Browse & Download Recipes and templates",
        image: "custom/modules/store/images/store.jpg"
	};
	
	let username = $cookies.get('soajs_username', { 'domain': interfaceDomain });
	$scope.isUserLoggedIn = (username && username !== '');
	
	$scope.store = {alert : [] };
	
	//hide and show the catalog entries based on the type passed as parameter
	$scope.hideCatalogEntries = function(type) {
		$scope.allCatalogs.forEach((oneCtlg) => {
			if(oneCtlg.type === type){
				oneCtlg.hide = !oneCtlg.hide;
			}
		});
	};
	
	/**
	 * method that fetches all the entries in the store catalog
	 */
	$scope.listAllCatalogs = function(){
		storePageSrv.listAllCatalogs($scope);
	};
	
	/**
	 * method that triggers downloading a single catalog entry
	 */
	$scope.download = function(entryId) {
		storePageSrv.download($scope, entryId);
	};
	
	//upon start inject a custom css file
	injectFiles.injectCss("/custom/modules/store/store.css");
	
	//upon start call parent method and update page headlines
	$scope.updateParentScope('innerPage', innerPage);
	
	//when leaving this module, trigger remove page headlines
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);