"use strict";
var projectApp = app.components;

projectApp.controller('listProjects', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Member Area",
		slogan: "Login & Register",
        image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);

projectApp.controller('addProject', ['$scope', function ($scope) {

	let innerPage = {
		header: "Member Area",
		slogan: "Login & Register",
		image: "custom/modules/member/images/member.jpg"
	};

	$scope.updateParentScope('innerPage', innerPage);

	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);