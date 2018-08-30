app.controller('topMenuCtrl', ['$scope', 'isUserLoggedIn', function ($scope, isUserLoggedIn) {
	
	$scope.$parent.$on('refreshWelcome', function (event, args) {
		$scope.updateMenu();
	});
	
	$scope.updateMenu = function () {
		navigation.forEach(function (one) {
			if (one.id === 'member-area') {
				if (isUserLoggedIn($scope)) {
					one.topMenu = true;
				} else {
					one.topMenu = false;
				}
			}
			if (one.id === 'member-area-login') {
				if (isUserLoggedIn($scope)) {
					one.topMenu = false;
				} else {
					one.topMenu = true;
				}
			}
		});
	};
	
	$scope.updateMenu();
	
}]);