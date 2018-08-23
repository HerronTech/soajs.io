jQuery(window).scroll(function() {
    var scroll = jQuery(window).scrollTop();
    
    if (scroll >= 10){//} && jQuery(window).width() > 767 ) {
        jQuery(".navbar").addClass("scrolling");
        jQuery("nav #logo").addClass('blueLogo');

    } else {
        jQuery(".navbar").removeClass("scrolling");
	    jQuery("nav #logo").removeClass('blueLogo');
    }
});

