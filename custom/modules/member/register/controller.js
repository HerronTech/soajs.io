"use strict";
var memberApp = app.components;
memberApp.controller('registerCtrl', ['$scope', function ($scope) {
	
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