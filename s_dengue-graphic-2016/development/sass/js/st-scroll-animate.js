var st_animation_controller = new ScrollMagic.Controller();
var st_a_scenes = [];

(function() {
    var stg = function(params) {
        return new st_animation_group(params);
    }

    var st_animation_group = function(params) {
        var selector = document.querySelectorAll(params);
        var delay = 0,
            duration,
            offset = 0,
            start;

        var triggerElement;

        var enter_up, enter_down, exit_up, exit_down;

        var st_animation_timeline = new TimelineMax();
        var o_attr_events = {};
        this.length = selector.length;

        this.execute = function() {
            var triggerElement = (this.content() === undefined) ? $('body') : $(this.content());
            var en_up = this.enter_up();
            var en_down = this.enter_down();
            var ex_up = this.exit_up();
            var ex_down = this.exit_down();

            var st_scene = new ScrollMagic.Scene({
                    triggerElement: triggerElement[0],
                    offset: this.start() + this.offset(),
                    duration: this.duration()
                })
                .setTween(this.move_group())
                // .update(true)
                // .addIndicators()
                .addTo(st_animation_controller)
                .on('enter leave', function(e) {
                    if (e.type === 'enter' && e.scrollDirection === 'FORWARD') {
                        if (typeof(enter_up) === 'function') enter_up();
                    } else if (e.type === 'enter' && e.scrollDirection === 'REVERSE') {
                        if (typeof(en_down) === 'function') en_down();
                    } else if (e.type === 'leave' && e.scrollDirection === 'REVERSE') {
                        if (typeof(ex_up) === 'function') ex_up();
                    } else if (e.type === 'leave' && e.scrollDirection === 'FORWARD') {
                        if (typeof(ex_down) === 'function') ex_down();
                    }
                });

            o_attr_events = {};
            return this;
        }

        this.findParentNode = function(parentName, childObj) {
            while (childObj && childObj.parentNode) {
                childObj = childObj.parentNode;
                if (childObj.tagName && childObj.tagName.toLowerCase() === parentName) {
                    return childObj;
                }
            }
            return null;
        }

        this.move_group = function() {
            var len = this.length;
            var duration_move = 0;
            var point_to_start = 0;
            // console.log(o_attr_events);
            while (len--) {
                var elem = selector[len];
                st_animation_timeline.to(elem, this.duration(), {
                    ease: Power0.easeNone,
                    attr: o_attr_events[len]
                }, this.delay());
            }
            return st_animation_timeline;
        }
        this.content = function(value) {
            if (!arguments.length) return triggerElement;
            triggerElement = value;
            return this;
        }
        this.start = function(value) {
            if (!arguments.length) {
                var less_start = 999999999999999;
                if (start === undefined) {
                    var len = this.length;
                    while (len--) {
                        var elem = selector[len];
                        var getbox = elem.getBBox();
                        start = getbox.y;
                        if (start < less_start) {
                            may_start = start;
                        }
                    }
                    start = may_start;
                }
                return start;
            }
            start = value;
            return this;
        }
        this.attr = function(nameNS, value) {
            var len = this.length;
            var value_copy = value;
            while (len--) {
                value = value_copy;
                var elem = selector[len];
                var attr_value = elem.getAttribute(nameNS);
                if (nameNS === 'transform') {
                    var a_transform = d3.transform(d3.select(elem).attr('transform'));
                    var na_transform = d3.transform(value);

                    na_transform.rotate = na_transform.rotate + a_transform.rotate;
                    na_transform.skew = na_transform.skew + a_transform.skew;
                    na_transform.translate[0] = na_transform.translate[0] + a_transform.translate[0];
                    na_transform.translate[1] = na_transform.translate[1] + a_transform.translate[1];

                    value = na_transform;
                    elem.setAttribute(nameNS, a_transform);
                }

                if (arguments.length === 2) {
                    if (o_attr_events[len] === undefined) o_attr_events[len] = {};
                    o_attr_events[len][nameNS] = value;
                }
            }

            return this;
        }

        this.delay = function(value) {
            if (!arguments.length) return delay;
            delay = value;
            return this;
        }
        this.duration = function(value) {
            if (!arguments.length) {
                var duration_move = 0;
                if (duration === undefined) {
                    var len = this.length;
                    while (len--) {
                        var elem = selector[len];
                        var getbox = elem.getBBox();
                        duration = getbox.height;
                        // console.log(duration);
                        if (duration > duration_move) {
                            duration_move = duration;
                        }
                    }
                    duration = duration_move;
                }
                return duration;
            }
            duration = value;
            return this;
        }
        this.offset = function(value) {
            if (!arguments.length) return offset;
            offset = value;
            return this;
        }
        this.enter_up = function(callback) {
            if (!arguments.length) {
                if (enter_up !== undefined && typeof(enter_up) === 'function') {
                    return enter_up;
                }
            } else if (typeof(callback) === 'function') {
                enter_up = callback;
            }
            return this;
        }
        this.enter_down = function(callback) {
            if (!arguments.length) {
                if (enter_down !== undefined && typeof(enter_down) === 'function') {
                    return enter_down;
                }
            } else if (typeof(callback) === 'function') {
                enter_down = callback;
            }
            return this;
        }
        this.exit_up = function(callback) {
            if (!arguments.length) {
                if (exit_up !== undefined && typeof(exit_up) === 'function') {
                    return exit_up;
                }
            } else if (typeof(callback) === 'function') {
                exit_up = callback;
            }
            return this;
        }
        this.exit_down = function(callback) {
            if (!arguments.length) {
                if (exit_down !== undefined && typeof(exit_down) === 'function') {
                    return exit_down;
                }
            } else if (typeof(callback) === 'function') {
                exit_down = callback;
            }
            return this;
        }

        return this;
    }

    i_st_animation = st_animation_group.prototype;
    i_st_animation.update_parameters = function() {

    };
    i_st_animation.is_mobile = function() {
        return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
    }

    var settime_parameters;
    window.addEventListener("resize", function() {
        if (!i_st_animation.is_mobile()) {
            if (settime_parameters) clearTimeout(settime_parameters);
            settime_parameters = setTimeout(function() {
                i_st_animation.update_parameters();
                clearTimeout(settime_parameters);
            }, 300);
        }
    }, false);

    window.addEventListener("orientationchange", function() {
        i_st_animation.update_parameters();
    }, false);

    if (!window.stg) {
        window.stg = stg;
    }

})();
