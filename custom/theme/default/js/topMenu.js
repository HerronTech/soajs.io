app.controller('topMenuCtrl', ['$scope', 'isUserLoggedIn', '$cookies', '$localStorage', function ($scope, isUserLoggedIn, $cookies, $localStorage) {
	
	$scope.$parent.$on('refreshWelcome', function (event, args) {
		$scope.updateMenu();
	});
	
	$scope.updateMenu = function () {
		navigation.forEach(function (one) {
			if (one.id === 'member-area') {
				if (isUserLoggedIn($scope)) {
					let user = $localStorage.soajs_user;
					one.children[0].label = user.firstName + " " + user.lastName;
					one.topMenu = true;
				} else {
					one.children[0].label = '';
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