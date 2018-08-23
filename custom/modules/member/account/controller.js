"use strict";
var accountApp = app.components;

accountApp.controller('billingCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Member Area",
		slogan: "My Billing",
        image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);

accountApp.controller('profileCtrl', ['$scope', function ($scope) {

	let innerPage = {
		header: "Member Area",
		slogan: "My Profile",
		image: "custom/modules/member/images/member.jpg"
	};

	$scope.updateParentScope('innerPage', innerPage);

	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);