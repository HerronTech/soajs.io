var overlayLoading = {
	show: function (cb) {
		var overlayHeight = jQuery(document).height();
		jQuery("#overlayLoading").css('height', overlayHeight + 'px').show();
		jQuery("#overlayLoading .bg").css('height', overlayHeight + 'px').show(100);
		jQuery("#overlayLoading .content").show();
		if (cb && typeof(cb) === 'function') {
			cb();
		}
	},
	hide: function (t, cb) {
		var fT = 200;
		if (t && typeof(t) === 'number') {
			fT = t;
		}
		jQuery("#overlayLoading .content").hide();
		jQuery("#overlayLoading").fadeOut(fT);
		if (cb && typeof(cb) === 'function') {
			cb();
		}
	}
};

var closeAlert = function ($scope, index) {
	if ($scope.alerts) {
		$scope.alerts.splice(index, 1);
	}
};
var closeAllAlerts = function (scope, $timeout) {
	$timeout(function () {
		scope.alerts = [];
		if (!scope.$$phase) {
			scope.$apply();
		}
	}, 10000);
};