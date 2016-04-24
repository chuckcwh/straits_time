if(typeof(ScrollMagic)!=="undefined"){
    st_animation_controller = new ScrollMagic.Controller();    
}

var fbAppId = 748050775275737;
// Additional JS functions here
window.fbAsyncInit = function() {
    FB.init({
        appId: fbAppId, // App ID
        status: true, // check login status
        cookie: true, // enable cookies to allow the
        // server to access the session
        xfbml: true, // parse page for xfbml or html5
        // social plugins like login button below
        version: 'v2.0', // Specify an API version
    });

    // Put additional init code here
};

// Load the SDK Asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));





var width_screen = $(window).width();
var height_screen = $(window).height();
/*start set values to footer*/
var height_footer = $("footer.st-content-footer").outerHeight();
$("body").css("margin", "0 0 " + height_footer + "px");
/*end set values to footer*/

/*start set height or width hero-video*/
full_screen_video();
full_screen_video2();
/*end set height or width hero-video*/

if ($(".st-slider-pro").length > 0) {
    $(".st-slider-pro").sliderPro({
        width: '100%',
        // height:468,
        arrows: true,
        buttons: true,
        waitForLayers: true,
        thumbnailPointer: false,
        autoplay: false,
        autoScaleLayers: false,
        aspectRatio: 2.03,
        fullScreen: true,
        breakpoints: {
            768: {
                arrows: false,
                buttons: false,
                width: '90%',
                aspectRatio: 2.03,
                visibleSize: '100%',
                forceSize: 'fullWidth',
                fullScreen: true
            }
        }
    });
    update_position_buttons_gallery();
}

if ($(".st-button-menu-mobile").length > 0) {
    $(".st-button-menu-mobile").on("click", function() {
        $(".modal-menu-mobile").toggleClass('st_dialogIsOpen');
        $(".st-content-menu-fixed").toggleClass('st_dialogIsOpen');
        eventCloseMenu($(".modal-menu-mobile").hasClass('st_dialogIsOpen'));
    });
}

if ($(".modal-menu-mobile").length > 0) {
    var elem = document.querySelector('.modal-menu-mobile');
    elem.addEventListener('touchstart', function(event) {
        startY = event.touches[0].pageY;
        startTopScroll = elem.scrollTop;
        if (startTopScroll <= 0)
            elem.scrollTop = 1;
        if (startTopScroll + elem.offsetHeight >= elem.scrollHeight)
            elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
    }, false);
}

if ($(".st-social-desktop").length > 0) {
    $(".st-social-desktop img:nth(0),.st-social-mobile img:nth(0)").on("click", function(e) {
        // code share facebook
        e.preventDefault();
        var image = 'http://graphics.straitstimes.com/STI/STIMEDIA/facebook_images/migrant/migrant.png';
        var name = "These migrants left their homes to save their lives";
        var description = "This special report by The Straits Times Foreign Desk traces the treacherous paths migrants are forced to take. It also takes an in-depth look at destination countries that grapple with the influx at their borders. http://str.sg/ZjKa";
        var url = "http://str.sg/ZjKa";

        share_face_book(image, name, description, url);
        return false;
    });
    $(".st-social-desktop img:nth(1),.st-social-mobile img:nth(1)").on("click", function(e) {
        // code share twitter
        e.preventDefault();
        var text = "Meet the %23Rohingya & %23Syrian migrants who left their homes to save their lives";
        var via = 'STcom';
        var url = 'http://str.sg/ZjKR';

        share_twitter(text, via, url);
        return false;
    });
}

var a_st_scene_menu=[];
if ($(".chapter-division").length > 0 && typeof(ScrollMagic)!=="undefined") {
    $(".chapter-division").each(function() {
        var copy_this = this;
        var st_scene_menu = new ScrollMagic.Scene({
                triggerElement: copy_this,
                offset: 0,
                duration: $(copy_this).outerHeight()
            })
            // .setTween(this.move_group())
            // .update(true)
            // .addIndicators()
            .addTo(st_animation_controller)
            .on('enter leave', function(e) {
                var index_content = $(copy_this).index();
                if (e.type === 'enter' && e.scrollDirection === 'FORWARD') {
                    paint_scroll_menu_enter(index_content);
                } else if (e.type === 'enter' && e.scrollDirection === 'REVERSE') {
                    paint_scroll_menu_enter(index_content);
                } else if (e.type === 'leave' && e.scrollDirection === 'REVERSE') {
                    if (index_content !== 1) paint_scroll_menu_exit(index_content);
                } else if (e.type === 'leave' && e.scrollDirection === 'FORWARD') {
                    if (index_content !== 2) paint_scroll_menu_exit(index_content);
                }
            });
        a_st_scene_menu.push({
            point:copy_this,
            scene:st_scene_menu
        });
    });

    function paint_scroll_menu_enter(index) {
        $('.st_option_menu_desktop').eq(index - 1).addClass('current');
        $('.detail-menu-mobile').eq(index - 1).find('.title-menu-mobile').addClass('selected-menu');
    }

    function paint_scroll_menu_exit(index) {
        $('.st_option_menu_desktop').eq(index - 1).removeClass('current');
        $('.detail-menu-mobile').eq(index - 1).find('.title-menu-mobile').removeClass('selected-menu');
    }
}


// Listen for orientation changes
window.addEventListener("orientationchange", function() {
    update_parameters();
}, false);


var settime;
$(window).on("resize", function() {
    if (!is_mobile()) {
        if (settime) clearTimeout(settime);
        settime = setTimeout(function() {
            update_parameters();
            clearTimeout(settime);
        }, 100);
    }
});


var a_scenes;
$(window).on("load", function() {
    update_position_buttons_gallery();
    a_scenes = st_lazy_load_images();
});


function share_face_book(image, name, description, url) {
    FB.ui({
        method: 'feed',
        link: url === undefined ? window.location.href : url,
        caption: 'www.straitstimes.com',
        picture: image,
        name: name,
        description: description
    });
}

function share_twitter(text, via, url) {
    window.open('http://twitter.com/share?text=' + text + '&via=' + via + '&url=' + url, 'twitter', "_blank");
}

function eventCloseMenu(event) {
    if (event) {
        $(".st_menu_mobile").css('right', '10px');

        d3.select(".first_line").transition().duration(500).attr("x1", 12.8).attr("y1", 12.2).attr("x2", 23.5).attr("y2", 22.8);
        d3.select(".menu_mobile_line_center").transition().duration(500).attr('opacity', 0).attr("x2", 0);
        d3.select(".second_line").transition().duration(500).attr("x1", 12.9).attr("y1", 22.9).attr("x2", 23.4).attr("y2", 12.1);
        $('.st_content_menu_fixed').hide().slideDown('500').addClass('fixed_menu_mobile');
        $('body').css({
            'overflow': 'hidden',
            'position': 'relative'
        });
    } else {
        $(".st-menu-mobile").css('right', '0');
        d3.select(".first_line").transition().duration(500).attr("x1", 10.5).attr("y1", 13.2).attr("x2", 26.1).attr("y2", 13.2);
        d3.select(".menu_mobile_line_center").transition().duration(500).attr('opacity', 1).attr("x2", 26.1);
        d3.select(".second_line").transition().duration(500).attr("x1", 10.5).attr("y1", 21.9).attr("x2", 26.1).attr("y2", 21.9);
        $('.st_content_menu_fixed').slideUp('500', function() {
            $(this).show().removeClass('fixed_menu_mobile');
        });
        $('body').removeAttr('style');
        $("body").css("margin", "0 0 " + height_footer + "px");
    }
}

function st_lazy_load_images(a_scenes) {

    var $images_load = $(".st-lazy-load");
    if ($images_load.length > 0) {
        if (a_scenes === undefined) {
            a_scenes = [];
            // init controller
            $images_load.each(function(i) {
                var offset = $(this).height();
                // build tween
                var tween = TweenMax.fromTo(this, 0.5, {
                    opacity: 0.1,
                }, {
                    opacity: 1,
                    ease: Quad.easeInOut,
                    delay: 0.1
                });
                var scene = new ScrollMagic.Scene({
                        triggerElement: this,
                        offset: (-$(window).height() / 2) + (offset / 2),
                        reverse: false,
                    })
                    .setTween(tween)
                    .update(true)
                    // .addIndicators()
                    .addTo(st_animation_controller);
                a_scenes.push({
                    obj: this,
                    scene: scene
                });
            });



        } else {
            $.each(a_scenes, function() {
                var tween = TweenMax.fromTo(this.obj, 0.5, {
                    opacity: 0.1,
                }, {
                    opacity: 1,
                    ease: Quad.easeInOut,
                    delay: 0.1
                });
                var offset = $(this.obj).height();
                this.scene.offset((-$(window).height() / 2) + (offset / 2)).setTween(tween).update(true);
            });
        }
    }
    return a_scenes;
}

click_menu_scroll();

function click_menu_scroll() {
    if ($('.st_option_menu_desktop').length > 0) {
        $('.st_option_menu_desktop').on('click', function(e) {
            e.preventDefault();
            scroll_bodypage($('.chapter-division').eq($(this.parentNode).index()));
        });
    }
    if ($('.title-menu-mobile').length > 0) {
        $('.title-menu-mobile').on('click', function(e) {
            e.preventDefault();
            $(".modal-menu-mobile").toggleClass('st_dialogIsOpen');
            $(".st-content-menu-fixed").toggleClass('st_dialogIsOpen');
            eventCloseMenu($(".modal-menu-mobile").hasClass('st_dialogIsOpen'));
            scroll_bodypage($('.chapter-division').eq($(this).parent().index()));
        });
    }
}

function scroll_bodypage(j_etiq) {
    $('body, html').animate({
        scrollTop: j_etiq.offset().top - 50
    }, 500);
}




function update_parameters() {
    width_screen = $(window).width();
    height_screen = $(window).height();
    var height_footer = $("footer.st-content-footer").outerHeight();
    $("body").css("margin", "0 0 " + height_footer + "px");
    full_screen_video();
    full_screen_video2();
    update_position_buttons_gallery();
    st_lazy_load_images(a_scenes);

    if(a_st_scene_menu.length>0){
        a_st_scene_menu.forEach(function(d){
            d.scene.duration($(d.point).outerHeight());
        });
    }
}

function is_mobile() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
}

function update_position_buttons_gallery() {
    if ($(".st-slider-pro").length > 0) {
        d3.selectAll(".st-slider-pro .sp-buttons").each(function() {
            var height_div = $(this.parentNode).find(".sp-slides-container").height();
            $(this).css('top', height_div - 38 + 'px');
        });
    }
}

function full_screen_video() {
    if ($(".st-header-hero-video").length > 0) {
        var video_original_width = 1027;
        var video_original_height = 577.688;
        var ratio_video = video_original_width / video_original_height;

        var menu_height = $(".st-content-menu-fixed").height();
        var slider_height = 0;
        var width_content_section = $(".st-header-hero-video").width();
        var height_content_section = height_screen - menu_height - slider_height;
        $(".st-header-hero-video").height(height_content_section);
        var new_ratio_video = width_content_section / height_content_section;
        if (ratio_video > new_ratio_video) {
            $(".st-header-hero-video video").css({
                width: '',
                height: '100%'
            });
        } else {
            $(".st-header-hero-video video").css({
                width: '100%',
                height: ''
            });
        }
        var video_width = $(".st-header-hero-video video").width();
        if (video_width > width_content_section) {
            $(".st-header-hero-video").scrollLeft((video_width - width_content_section) / 2);
        }
        var video_height = $(".st-header-hero-video video").height();
        if (video_height > height_content_section) {
            $(".st-header-hero-video").scrollTop((video_height - height_content_section) / 2);
        }
        if (is_mobile()) {
            $(".st-header-hero-video video").hide();
            $(".st-header-hero-video").addClass('hero-cover-gif');
        }
    }
}

function full_screen_video2() {
    if ($(".st-header-hero-video2").length > 0) {
        var video_original_width = 842.656;
        var video_original_height = 474;
        var ratio_video = video_original_width / video_original_height;

        var menu_height = $(".st-content-menu-fixed").height();
        var width_content_section = $(".st-header-hero-video2").width();
        var height_content_section = height_screen - menu_height;
        $(".st-header-hero-video2").height(height_content_section);
        var new_ratio_video = width_content_section / height_content_section;
        if (ratio_video > new_ratio_video) {
            $(".st-header-hero-video2 video").css({
                width: '',
                height: '100%'
            });
            $(".st-header-hero-video2").removeAttr('style');
        } else {
            $(".st-header-hero-video2 video").css({
                width: '100%',
                height: ''
            });
        }
        var video_width = $(".st-header-hero-video2 video").width();
        if (video_width > width_content_section) {
            $(".st-header-hero-video2").scrollLeft((video_width - width_content_section) / 2);
        }
        var video_height = $(".st-header-hero-video2 video").height();
        if (video_height > height_content_section) {
            $(".st-header-hero-video2").scrollTop((video_height - height_content_section) / 2);
        }
    }
}
function format_number(number) {
    Math.floor(number);
    var val_return = 0;
    var format_number_int = d3.format(",d"),
        format_number_decimal = d3.format(",.2f");
    var prom = number % 1;
    if (prom === 0) {
        val_return = format_number_int(number);
    } else {
        if (format_number_decimal(prom) % 1 === 0) {
            val_return = format_number_int(Math.floor(number) + 1);
        } else {
            val_return = format_number_decimal(number);
        }
    }
    return val_return;
}

function cloneToDoc(node, doc) {
    if (!doc) doc = document;
    var clone = doc.createElementNS(node.namespaceURI, node.nodeName);
    for (var i = 0, len = node.attributes.length; i < len; ++i) {
        var a = node.attributes[i];
        if (/^xmlns\b/.test(a.nodeName)) continue; // IE can't create these        
        clone.setAttributeNS(a.namespaceURI, a.nodeName, a.nodeValue);
    }
    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
        var c = node.childNodes[i];
        clone.insertBefore(
            c.nodeType == 1 ? cloneToDoc(c, doc) : doc.createTextNode(c.nodeValue),
            null
        )
    }
    return clone;
}