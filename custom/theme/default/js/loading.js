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