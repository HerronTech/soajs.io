jQuery(window).scroll(function() {
    var scroll = jQuery(window).scrollTop();
    
    if (scroll >= 10 && jQuery(window).width() > 767 ) {
        jQuery(".navbar-wrapper").addClass("scrolling");
        jQuery("img.logo").attr("src", "config/images/soajsio-white.png");

    } else {
        jQuery(".navbar-wrapper").removeClass("scrolling");
        jQuery("img.logo").attr("src", "config/images/soajsio.png");
    }
});

