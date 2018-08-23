"use strict";
var disclaimerApp = app.components;
disclaimerApp.controller('disclaimerCtrl', ['$scope', function ($scope) {
	
	let innerPage = {
		header: "Legal Disclaimer",
		slogan: "Effective date: August 23, 2018",
        image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);
var termsApp = app.components;
termsApp.controller('privacyCtrl', ['$scope', function ($scope) {

    let innerPage = {
        header: "Privacy Policy",
        slogan: "Effective date: August 23, 2018",
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
        slogan: "Effective date: August 23, 2018",
		image: "custom/modules/member/images/member.jpg"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});
}]);