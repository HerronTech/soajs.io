"use strict";
var productApp = app.components;
productApp.controller('productCtrl', ['$scope', 'injectFiles', function ($scope, injectFiles) {
	
	let innerPage = {
		header: "Microservices Management Platform",
		slogan: "Complete & Adaptable",
        image: "custom/modules/product/images/product.png"
	};
	
	$scope.updateParentScope('innerPage', innerPage);
	
	$scope.$on("$destroy", function () {
		$scope.removeFromParentScope('innerPage');
	});

    injectFiles.injectCss("custom/modules/product/home.css");
}]);
