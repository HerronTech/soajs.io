"use strict";
var storeApp = app.components;
storeApp.controller('storeCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "SOAJS Store",
		slogan: "Browse & Download Recipes and templates"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
}]);