var $ = require('jquery');

var svg = function(options) {
    if (options) {
        if (options.tag !== undefined) {
            var tag = options.tag;
            var svg = $(tag).find('svg');
            var original_height_svg = svg[0].viewBox.baseVal.height;
            var original_width_svg = svg[0].viewBox.baseVal.width;
            get_size_svg(tag, original_width_svg, original_height_svg);

            $(window).on('resize', function() {
                var sttime = setTimeout(function() {
                    if (!is_mobile()) {
                        get_size_svg(tag, original_width_svg, original_height_svg);
                        clearTimeout(sttime);
                    }
                }, 300);
            });
            // Listen for orientation changes
            $(window).on("orientationchange", function() {
                if (is_mobile()) {
                    var sttime = setTimeout(function() {
                        get_size_svg(tag, original_width_svg, original_height_svg);
                        clearTimeout(sttime);
                    }, 300);
                }
            });
        }
    }
}

var get_size_svg = function(tag, original_width_svg, original_height_svg) {
    var content_svg = $(tag).width();
    var new_height = (content_svg * original_height_svg) / original_width_svg;
    $(tag).find('svg').height(new_height);
    $(tag).find('svg').width(content_svg);
}

var is_mobile = function() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
}

module.exports = svg;
