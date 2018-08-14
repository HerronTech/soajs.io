jQuery(window).scroll(function() {
    var scroll = jQuery(window).scrollTop();


    if (scroll >= 10 && jQuery(window).width() > 767 ) {
        jQuery(".topbar").addClass("scrolling");
        jQuery("img.logo").attr("src", "images/logo1.png");

    } else {
        jQuery(".topbar").removeClass("scrolling");
        jQuery("img.logo").attr("src", "images/logo2.png");
    }
});

