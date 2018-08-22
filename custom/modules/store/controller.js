"use strict";
var storeApp = app.components;
storeApp.controller('storeCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "SOAJS Store",
		slogan: "Browse & Download Recipes and templates",
        image: "custom/modules/store/images/store.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);