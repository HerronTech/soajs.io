"use strict";
var disclaimerApp = app.components;
disclaimerApp.controller('disclaimerCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Disclaimer",
		slogan: "xxx",
        image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);

var termsApp = app.components;
termsApp.controller('termsCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Terms & Conditions",
		slogan: "xxx",
		image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);