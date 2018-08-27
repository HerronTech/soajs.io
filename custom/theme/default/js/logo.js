jQuery(window).scroll(function () {
	var scroll = jQuery(window).scrollTop();

	if (scroll >= 10) {//} && jQuery(window).width() > 767 ) {
		jQuery(".navbar").addClass("scrolling");
		jQuery("nav #logo").addClass('blueLogo');

	} else {
		jQuery(".navbar").removeClass("scrolling");
		jQuery("nav #logo").removeClass('blueLogo');
	}
});

app.controller('topMenuCtrl', ['$scope', 'isUserLoggedIn', function ($scope, isUserLoggedIn) {
	
	$scope.$parent.$on('refreshWelcome', function (event, args) {
		$scope.updateMenu();
	});
	
	$scope.updateMenu = function () {
		navigation.forEach(function (one) {
			if (one.id === 'member-area') {
				if (isUserLoggedIn) {
					one.topMenu = true;
				}
			}
			if (one.id === 'member-area-login') {
				if (isUserLoggedIn) {
					one.topMenu = false;
				}
			}
		});
	};

	$scope.updateMenu();

}]);