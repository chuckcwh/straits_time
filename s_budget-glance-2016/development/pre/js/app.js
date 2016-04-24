var $ = require('jquery');
var jQuery = $;

var ScrollMagic = require('scrollmagic');
require("scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js");
// require("scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js");



// init controller
var controller = new ScrollMagic.Controller();

// create a scene
var scene_menu = new ScrollMagic.Scene({
        triggerElement: ".content-sub-menu-fixed",
        duration: getDuration, // the scene should last for a scroll distance of 100px
        triggerHook: "onLeave",
        // offset:-50
    })
    .setPin("#content-sub-menu-fixed", { pushFollowers: false }) // pins the element for the the scene's duration
    // .addIndicators()
    .addTo(controller);


var a_scenes_chapter = [];
$.each($('.chapter-division'), function(i) {
    var scene_subchapter = new ScrollMagic.Scene({
            triggerElement: this,
            duration: getDurationDiv
        })
        .setClassToggle($("#content-sub-menu-fixed figure").get(i), "active-sub-menu")
        // .addIndicators()
        .addTo(controller);

    if (i === 0) {
        $($("#content-sub-menu-fixed figure").get(i)).addClass("active-sub-menu");
        var text_chapter=$($("#content-sub-menu-fixed figure figcaption").get(i)).text().trim();
        $(".text-subtitle-mobile").html(text_chapter);
        scene_subchapter.on('leave', function(event) {
            if (event.state === 'BEFORE') {
                $($("#content-sub-menu-fixed figure").get(i)).addClass("active-sub-menu");
                var text_chapter=$($("#content-sub-menu-fixed figure figcaption").get(i)).text().trim();
                $(".text-subtitle-mobile").html(text_chapter);
            }
        });
    } else if (i === 5) {
        scene_subchapter.on('leave', function(event) {
            if (event.state === 'AFTER') {
                $($("#content-sub-menu-fixed figure").get(i)).addClass("active-sub-menu");
                var text_chapter=$($("#content-sub-menu-fixed figure figcaption").get(i)).text().trim();
                $(".text-subtitle-mobile").html(text_chapter);
            }
        });
    }

    scene_subchapter.on("progress",function(event){
        var number_chapter=$(this.triggerElement()).index();
        var text_chapter=$($("#content-sub-menu-fixed figure figcaption").get(number_chapter)).text().trim();
        $(".text-subtitle-mobile").html(text_chapter);
    });

    a_scenes_chapter.push(scene_subchapter);
});

controller.scrollTo(function(newScrollPos) {
    $("html, body").animate({ scrollTop: newScrollPos + ($(window).height() / 2) - $('#content-sub-menu-fixed').outerHeight() });
});

$('.content-sub-menu-fixed').on('click', 'figure', function(e) {
    e.preventDefault();
    var scene = a_scenes_chapter[$(this).index()];
    controller.scrollTo(scene);
});


function getDurationDiv() {
    var div_height = 0;

    if (this !== window) {
        div_height = $(this.triggerElement()).outerHeight();
    }
    return div_height;
}

function getDuration() {
    return $('.content-chapter-division').outerHeight() + $('#content-sub-menu-fixed').outerHeight();
}
