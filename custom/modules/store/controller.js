"use strict";
var storeApp = app.components;
storeApp.controller('storeCtrl', ['$scope', function ($scope) {
	
	$scope.$parent.$parent.innerPage = {
		header: "SOAJS Store",
		slogan: "Browse & Download Recipes and templates"
	};
}]);